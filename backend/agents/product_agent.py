from backend.agents.base_agent import run_specialized_agent


def get_product_info(query, history=None):
    return run_specialized_agent(query, "product_agent", history)
