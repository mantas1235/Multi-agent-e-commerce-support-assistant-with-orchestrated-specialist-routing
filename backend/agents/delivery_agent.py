from backend.agents.base_agent import run_specialized_agent


def get_delivery_info(query, history: list, user_email: str):
    return run_specialized_agent(query, "delivery_agent", user_email, history)
