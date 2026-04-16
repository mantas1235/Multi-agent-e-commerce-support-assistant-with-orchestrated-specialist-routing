from backend.agents.base_agent import run_specialized_agent

def get_product_info(query):
    return run_specialized_agent(query, "product_agent")

if __name__ == "__main__":
    print(get_product_info("Iš ko pagaminti AeroRun 210 batai?"))