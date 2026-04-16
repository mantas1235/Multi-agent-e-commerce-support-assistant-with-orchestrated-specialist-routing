import os
from dotenv import load_dotenv
from supabase.client import create_client
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic import hub

load_dotenv(override=True)

# Inicializuojame bendrus resursus vieną kartą
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

def run_specialized_agent(query, agent_name):
    """
    Bendras variklis visiems agentams.
    agent_name - turi sutapti su metadata lauku DB (pvz. 'product_agent')
    """
    vector_store = SupabaseVectorStore(
        client=supabase,
        embedding=embeddings,
        table_name="documents",
        query_name="match_documents"
    )

    retriever = vector_store.as_retriever(
        search_kwargs={'filter': {'agent': agent_name}, 'k': 3}
    )
    
    prompt = hub.pull("langchain-ai/retrieval-qa-chat")
    
    combine_docs_chain = create_stuff_documents_chain(llm, prompt)
    retrieval_chain = create_retrieval_chain(retriever, combine_docs_chain)
    
    result = retrieval_chain.invoke({"input": query})
    return result["answer"]