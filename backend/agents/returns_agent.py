from backend.agents.base_agent import run_specialized_agent

def get_returns_info(query):
    # Tiesiog iškviečiame bendrą variklį su specifiniu filtru
    return run_specialized_agent(query, "returns_agent")

if __name__ == "__main__":
    print("Tikriname Grąžinimo agentą (per base_agent)...")
    try:
        answer = get_returns_info("Per kiek dienų galiu grąžinti prekę?")
        print(f"\nATSAKYMAS: {answer}")
    except Exception as e:
        print(f"Klaida: {e}")