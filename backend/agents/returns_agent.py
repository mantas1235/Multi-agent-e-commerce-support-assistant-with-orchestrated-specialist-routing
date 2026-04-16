from backend.agents.base_agent import run_specialized_agent

def get_returns_info(query):
    # Šis agentas atsako į klausimus apie grąžinimą ir broką
    return run_specialized_agent(query, "returns_agent")

if __name__ == "__main__":
    print("--- Testuojamas Grąžinimo Agentas ---")
    print(get_returns_info("Ar galiu grąžinti prekę, jei ji man tiesiog nepatiko?"))