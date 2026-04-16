from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from backend.core.config import settings
from backend.agents.product_agent import get_product_info
from backend.agents.delivery_agent import get_delivery_info
from backend.agents.returns_agent import get_returns_info
from backend.agents.order_agent import get_order_info

llm = ChatOpenAI(model_name=settings.MAIN_LLM_MODEL, temperature=0)


def handle_customer_query(user_query, history=None):
    if history is None:
        history = []

    system_prompt = """
    Esi išmanus el. parduotuvės asistentas. Tavo užduotis - suprasti kliento klausimą
    ir nuspręsti, kuriam specialistui jį perduoti.

    Kategorijos:
    - PRODUCT: Klausimai apie prekių savybes, sudėtį, modelius.
    - DELIVERY: Klausimai apie siuntimą, terminus, kainas.
    - RETURNS: Klausimai apie grąžinimą, pinigų susigrąžinimą.
    - ORDER: Klausimai apie užsakymo būseną, paskyrą.

    Atsakyk TIK vienu žodžiu: PRODUCT, DELIVERY, RETURNS, arba ORDER.
    """

    messages = [SystemMessage(content=system_prompt)]
    for msg in list(history)[-6:]:
        role = msg.role if hasattr(msg, 'role') else msg.get('role', 'user')
        content = msg.content if hasattr(msg, 'content') else msg.get('content', '')
        if role == 'user':
            messages.append(HumanMessage(content=content))
        else:
            messages.append(AIMessage(content=content))
    messages.append(HumanMessage(content=user_query))

    decision = llm.invoke(messages).content.strip().upper()
    print(f"--- [Orchestrator] Kategorija: {decision} ---")

    if "PRODUCT" in decision:
        return get_product_info(user_query, history)
    elif "DELIVERY" in decision:
        return get_delivery_info(user_query, history)
    elif "RETURNS" in decision:
        return get_returns_info(user_query, history)
    elif "ORDER" in decision:
        return get_order_info(user_query, history)
    else:
        return "Atsiprašau, negaliu suprasti temos. Galite patikslinti?"
