from backend.agents.base_agent import run_specialized_agent

def get_delivery_info(query):
    # Šis agentas ieško tik su siuntimu susijusios informacijos
    return run_specialized_agent(query, "delivery_agent")

if __name__ == "__main__":
    print("--- Testuojamas Pristatymo Agentas ---")
    print(get_delivery_info("Kokie yra pristatymo terminai į Estiją?"))