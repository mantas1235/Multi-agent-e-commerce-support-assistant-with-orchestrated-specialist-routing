from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from backend.core.config import settings
from backend.agents.product_agent import get_product_info
from backend.agents.delivery_agent import get_delivery_info
from backend.agents.returns_agent import get_returns_info
from backend.agents.order_agent import get_order_info

llm = ChatOpenAI(model_name=settings.MAIN_LLM_MODEL, temperature=0)


def handle_customer_query(query: str, history: list, user_email: str):
    if history is None:
        history = []

    system_prompt = """
    You are a smart e-commerce assistant orchestrator. Your task is to analyze the user's question 
    and decide which specialist to route it to.

    Categories:
    - PRODUCT: Questions about product features, specs, models, or general inventory.
    - DELIVERY: Questions about shipping, delivery times, and costs.
    - RETURNS: Questions about refund policies and the returns process.
    - ORDER: Questions about order status or account-related inquiries.
    - GENERAL: Greetings, thanks, or requests to speak in another language.

    CRITICAL RULE: Regardless of the language used by the user (Russian, Lithuanian, English, etc.), 
    you MUST respond ONLY with the English category name: PRODUCT, DELIVERY, RETURNS, ORDER, or GENERAL.
    Do not include any other words, punctuation, or translations.
    """
    messages = [SystemMessage(content=system_prompt)]
    for msg in list(history)[-6:]:
        role = msg.role if hasattr(msg, 'role') else msg.get('role', 'user')
        content = msg.content if hasattr(msg, 'content') else msg.get('content', '')
        if role == 'user':
            messages.append(HumanMessage(content=content))
        else:
            messages.append(AIMessage(content=content))
    messages.append(HumanMessage(content=query))

    decision = llm.invoke(messages).content.strip().upper()
    print(f"--- [Orchestrator] Kategorija: {decision} ---")

    if "PRODUCT" in decision:
        return get_product_info(query, history, user_email)
    elif "DELIVERY" in decision:
        return get_delivery_info(query, history, user_email)
    elif "RETURNS" in decision:
        return get_returns_info(query, history, user_email)
    elif "ORDER" in decision:
        return get_order_info(query, history, user_email)
    elif "GENERAL" in decision:
        # Sukuriame naują, švarų kontekstą be "1 žodžio" taisyklės
        general_prompt = """Esi mandagus LITIT el. parduotuvės asistentas. 
        Atsakyk į vartotojo klausimus normaliais sakiniais. 
        Jei vartotojas prašo vidinės įmonės informacijos (pvz., pardavimų, duomenų bazių išrašų), mandagiai atsisakyk tai atskleisti."""
        
        general_messages = [
            SystemMessage(content=general_prompt),
            HumanMessage(content=query)
        ]
        return llm.invoke(general_messages).content
    else:
        return "Atsiprašau, negaliu suprasti temos. Galite patikslinti?"
 
