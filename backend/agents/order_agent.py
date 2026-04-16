from backend.agents.base_agent import run_specialized_agent

def get_order_info(query):
    # Šis agentas skirtas užsakymų sekimui ir paskyros klausimams
    return run_specialized_agent(query, "order_agent")

if __name__ == "__main__":
    print("--- Testuojamas Užsakymų Agentas ---")
    print(get_order_info("Kur galiu rasti savo užsakymo sekimo numerį?"))