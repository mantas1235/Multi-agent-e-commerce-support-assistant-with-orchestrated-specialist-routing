from backend.agents.base_agent import run_specialized_agent


# Turi priimti user_email!
def get_product_info(query: str, history: list, user_email: str):
    # Ir perduoti jį į run_specialized_agent!
    return run_specialized_agent(query, "product_agent", user_email, history)
