from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
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


def run_specialized_agent(query: str, agent_name: str, history=None):
    if history is None:
        history = []

    retriever = SupabaseRetriever(agent_name=agent_name)
    docs = retriever._get_relevant_documents(query)
    context = "\n\n".join(doc.page_content for doc in docs) if docs else "No relevant information found."

    messages = [
        SystemMessage(content=f"""You are a helpful e-commerce AI assistant. Answer the customer's question using only the context provided below.
IMPORTANT: If the user has asked to respond in a specific language at any point in the conversation, always use that language for ALL responses.
If the context does not contain the answer, honestly say you don't have that information.

Context:
{context}""")
    ]

    for msg in list(history)[-6:]:
        role = msg.role if hasattr(msg, 'role') else msg.get('role', 'user')
        content = msg.content if hasattr(msg, 'content') else msg.get('content', '')
        if role == 'user':
            messages.append(HumanMessage(content=content))
        else:
            messages.append(AIMessage(content=content))

    messages.append(HumanMessage(content=query))
    result = llm.invoke(messages)
    return result.content
