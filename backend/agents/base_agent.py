from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic import hub
from backend.core.config import settings
from backend.core.supabase_client import supabase
from typing import List

embeddings = OpenAIEmbeddings(model=settings.EMBEDDING_MODEL)
llm = ChatOpenAI(model_name=settings.MAIN_LLM_MODEL, temperature=0)


class SupabaseRetriever(BaseRetriever):
    agent_name: str
    k: int = 3

    def _get_relevant_documents(self, query: str, **kwargs) -> List[Document]:
        query_embedding = embeddings.embed_query(query)
        response = supabase.rpc("match_documents", {
            "query_embedding": query_embedding,
            "match_count": self.k,
            "match_threshold": 0.0,
            "filter": {"agent": self.agent_name}
        }).execute()

        docs = []
        for row in response.data:
            docs.append(Document(
                page_content=row["content"],
                metadata=row.get("metadata", {})
            ))
        return docs


def run_specialized_agent(query, agent_name):
    """Bendras variklis visiems agentams naudojant centralizuotus resursus."""
    retriever = SupabaseRetriever(agent_name=agent_name)
    prompt = hub.pull("langchain-ai/retrieval-qa-chat")
    combine_docs_chain = create_stuff_documents_chain(llm, prompt)
    retrieval_chain = create_retrieval_chain(retriever, combine_docs_chain)
    result = retrieval_chain.invoke({"input": query})
    return result["answer"]
