from backend.agents.base_agent import run_specialized_agent


def get_order_info(query, history: list, user_email: str):
    return run_specialized_agent(query, "order_agent", user_email, history)
