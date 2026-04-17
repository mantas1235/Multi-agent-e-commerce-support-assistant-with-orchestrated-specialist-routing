from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from backend.core.config import settings
from backend.core.supabase_client import supabase
from typing import List
from langchain_core.tools import tool

@tool
def calculate_discount(price: float, discount_percent: float) -> str:
    """Apskaičiuoja galutinę prekės kainą su pritaikyta nuolaida. Naudok šį įrankį, kai vartotojas klausia apie kainą su nuolaida."""
    final_price = price * (1 - discount_percent / 100)
    return f"Galutinė kaina su {discount_percent}% nuolaida yra {final_price:.2f} EUR."

@tool
def register_customer_request(request_details: str) -> str:
    """Užregistruoja vartotojo pageidavimą, kai jis paprašo informuoti apie prekę ar palieka žinutę. 
    SVARBU: Niekada neklausk vartotojo el. pašto, sistema jį jau žino iš prisijungimo sesijos."""
    return request_details

# Sukuriame įrankių sąrašą
tools = [calculate_discount, register_customer_request]

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
            "match_threshold": 0.4,
            "filter": {"agent": self.agent_name}
        }).execute()

        docs = []
        for row in response.data:
            docs.append(Document(
                page_content=row["content"],
                metadata=row.get("metadata", {})
            ))
        return docs

# VIENA, SUJUNGTA FUNKCIJA
def run_specialized_agent(query: str, agent_name: str, user_email: str, history=None):
    if history is None:
        history = []

    retriever = SupabaseRetriever(agent_name=agent_name)
    docs = retriever._get_relevant_documents(query)
    context = "\n\n".join(doc.page_content for doc in docs) if docs else "No relevant information found."

    messages = [
        SystemMessage(content=f"""You are a professional e-commerce assistant.
        
        STRICT RULES:
        1. Answer ONLY using the provided context. If it's not there, say you don't know.
        2. LANGUAGE PERSISTENCE: Check the chat history. If the user previously asked to speak in a specific language (e.g., English), you MUST respond in THAT language, regardless of the language of the current question. 
        3. Do NOT ever say "I can only speak Lithuanian". You are multilingual.

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
    print(f"DEBUG: Siunčiamų žinučių kiekis: {len(messages)}")
    
    # Pririšame įrankius ir gauname rezultatą
    llm_with_tools = llm.bind_tools(tools)
    result = llm_with_tools.invoke(messages)

    # 1. Tikriname, ar AI nusprendė panaudoti įrankį
    if result.tool_calls:
        tool_call = result.tool_calls[0]
        tool_name = tool_call['name']
        tool_args = tool_call['args']
        
        print(f"DEBUG: AI išsirinko įrankį: {tool_name}")
        galutinis_tekstas = "" 
        
        # 2. Vykdome funkciją
        if tool_name == "calculate_discount":
            tool_result = calculate_discount.invoke(tool_args)
            galutinis_tekstas = str(tool_result) 
            
        elif tool_name == "register_customer_request":
            # IŠTRAUKIAME TIK TEKSTĄ (be pašto)
            details = tool_args['request_details']
            
            # ĮRAŠOME Į BAZĘ NAUDODAMI PATIKIMĄ user_email IŠ BACKEND'O
            try:
                supabase.table("customer_requests").insert({
                    "email": user_email, 
                    "details": details
                }).execute()
                galutinis_tekstas = f"Jūsų užklausa sėkmingai užregistruota paskyrai: {user_email}"
            except Exception as e:
                print(f"DB Klaida: {e}")
                galutinis_tekstas = "Sistemos klaida registruojant užklausą."
            
        else:
            galutinis_tekstas = "Atsiprašau, sistemos klaida bandant naudoti įrankį."

        return galutinis_tekstas

    # 3. Jei įrankio nereikėjo, tiesiog grąžiname tekstą
    return str(result.content)