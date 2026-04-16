from backend.agents.base_agent import run_specialized_agent


def get_returns_info(query, history=None):
    return run_specialized_agent(query, "returns_agent", history)
