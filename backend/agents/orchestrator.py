from langchain_openai import ChatOpenAI
from backend.core.config import settings
from backend.agents.product_agent import get_product_info
from backend.agents.delivery_agent import get_delivery_info
from backend.agents.returns_agent import get_returns_info
from backend.agents.order_agent import get_order_info

# Naudojame LLM iš nustatymų
llm = ChatOpenAI(model_name=settings.MAIN_LLM_MODEL, temperature=0)

def handle_customer_query(user_query):
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

    decision = llm.invoke([
        ("system", system_prompt),
        ("human", user_query)
    ]).content.strip().upper()

    print(f"--- [Orchestrator] Kategorija: {decision} ---")

    if "PRODUCT" in decision:
        return get_product_info(user_query)
    elif "DELIVERY" in decision:
        return get_delivery_info(user_query)
    elif "RETURNS" in decision:
        return get_returns_info(user_query)
    elif "ORDER" in decision:
        return get_order_info(user_query)
    else:
        return "Atsiprašau, negaliu suprasti temos. Galite patikslinti?"