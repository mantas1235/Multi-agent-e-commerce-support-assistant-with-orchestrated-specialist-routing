from backend.agents.base_agent import run_specialized_agent


def get_order_info(query, history=None):
    return run_specialized_agent(query, "order_agent", history)
