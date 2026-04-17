from backend.agents.base_agent import run_specialized_agent


def get_returns_info(query, history: list, user_email: str):
    return run_specialized_agent(query, "returns_agent", user_email, history)
