from supabase.client import create_client
from backend.core.config import settings

# Sukuriame vieną klientą naudodami nustatymus iš config.py
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)