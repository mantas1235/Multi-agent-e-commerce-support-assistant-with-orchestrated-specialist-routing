from backend.agents.base_agent import run_specialized_agent

def get_product_info(query):
    # Tiesiog iškviečiame bendrą variklį su specifiniu filtru
    return run_specialized_agent(query, "product_agent")

if __name__ == "__main__":
    print("Tikriname Produktų agentą (per base_agent)...")
    try:
        answer = get_product_info("Iš ko pagaminti AeroRun 210 batai?")
        print(f"\nATSAKYMAS: {answer}")
    except Exception as e:
        print(f"Klaida: {e}")