from backend.agents.base_agent import run_specialized_agent

def get_delivery_info(query):
    # Tiesiog iškviečiame bendrą variklį su specifiniu filtru
    return run_specialized_agent(query, "delivery_agent")

if __name__ == "__main__":
    print("Tikriname Pristatymo agentą (per base_agent)...")
    try:
        answer = get_delivery_info("Kiek kainuoja pristatymas?")
        print(f"\nATSAKYMAS: {answer}")
    except Exception as e:
        print(f"Klaida: {e}")