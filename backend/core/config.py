import os
from dotenv import load_dotenv

# Užkrauname .env failą
load_dotenv(override=True)

class Settings:
    PROJECT_NAME: str = "LITIT AI E-commerce Assistant"
    
    # Supabase duomenys iš tavo .env
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY")
    
    # OpenAI duomenys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    MAIN_LLM_MODEL: str = "gpt-4o-mini"

# Sukuriame nustatymų objektą, kurį importuosime kitur
settings = Settings()