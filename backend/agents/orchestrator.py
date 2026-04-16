from langchain_openai import ChatOpenAI
from backend.agents.product_agent import get_product_info
from backend.agents.delivery_agent import get_delivery_info
from backend.agents.returns_agent import get_returns_info
from backend.agents.order_agent import get_order_info

# Naudojame gpt-4o-mini, nes jis greitas ir puikiai supranta instrukcijas
llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

def handle_customer_query(user_query):
    # 1. Sistemos instrukcija "dispečeriui"
    system_prompt = """
    Esi išmanus el. parduotuvės asistentas. Tavo užduotis - suprasti kliento klausimą 
    ir nuspręsti, kuriam specialistui jį perduoti.
    
    Kategorijos:
    - PRODUCT: Klausimai apie prekių savybes, sudėtį, batų modelius.
    - DELIVERY: Klausimai apie siuntimą, terminus, kainas, šalis.
    - RETURNS: Klausimai apie prekių grąžinimą, pinigų susigrąžinimą, broką.
    - ORDER: Klausimai apie užsakymo būseną, sekimą, asmeninę paskyrą.

    Atsakyk TIK vienu žodžiu iš šių keturių: PRODUCT, DELIVERY, RETURNS, ORDER.
    """

    # 2. AI nusprendžia kategoriją
    decision = llm.invoke([
        ("system", system_prompt),
        ("human", user_query)
    ]).content.strip().upper()

    print(f"--- [Orchestrator] Kategorija: {decision} ---")

    # 3. Nukreipiame užklausą
    if "PRODUCT" in decision:
        return get_product_info(user_query)
    elif "DELIVERY" in decision:
        return get_delivery_info(user_query)
    elif "RETURNS" in decision:
        return get_returns_info(user_query)
    elif "ORDER" in decision:
        return get_order_info(user_query)
    else:
        return "Atsiprašau, negaliu suprasti jūsų klausimo temos. Gal galite patikslinti?"

if __name__ == "__main__":
    # Testas: Išbandykime skirtingas temas
    test_queries = [
        "Iš ko pagaminti AeroRun batai?",
        "Kiek kainuoja siuntimas į Latviją?",
        "Ar galiu grąžinti prekę po 10 dienų?"
    ]
    
    for query in test_queries:
        print(f"\nVartotojas: {query}")
        result = handle_customer_query(query)
        print(f"AI: {result}")