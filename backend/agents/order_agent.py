from backend.agents.base_agent import run_specialized_agent

def get_order_info(query):
    # Tiesiog iškviečiame bendrą variklį su specifiniu filtru
    return run_specialized_agent(query, "order_agent")

if __name__ == "__main__":
    print("Tikriname Užsakymų agentą (per base_agent)...")
    try:
        answer = get_order_info("Koks mano užsakymo statusas?")
        print(f"\nATSAKYMAS: {answer}")
    except Exception as e:
        print(f"Klaida: {e}")