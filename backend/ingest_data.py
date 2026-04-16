import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from supabase.client import create_client

# Užkrauname .env nustatymus
load_dotenv()

# Prisijungimo duomenys
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(supabase_url, supabase_key)

# Inicializuojame OpenAI embedding modelį
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

def process_pdf(file_path, agent_label):
    if not os.path.exists(file_path):
        print(f"⚠️ Klaida: Failas {file_path} nerastas!")
        return

    print(f"⏳ Apdorojamas {file_path}...")
    
    # 1. Užkrauname PDF
    loader = PyPDFLoader(file_path)
    raw_docs = loader.load()

    # 2. Skaidome į iškarpas (Chunks)
    # chunk_size=1000 simbolių, chunk_overlap=100, kad neprarastume konteksto tarp puslapių
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    docs = text_splitter.split_documents(raw_docs)

    # 3. Pridedame metaduomenis (Metadata)
    # Tai leidžia vėliau filtruoti: "ieškok informacijos tik DeliveryAgent"
    for doc in docs:
        doc.metadata = {"agent": agent_label}

    # 4. Siunčiame į Supabase
    SupabaseVectorStore.from_documents(
        docs,
        embeddings,
        client=supabase,
        table_name="documents", # Lentelės pavadinimas, kurį sukurei per SQL
        query_name="match_documents",
    )
    print(f"✅ Sėkmingai įkelta į DB. Agentas: {agent_label}")

if __name__ == "__main__":
    # Čia nurodome tavo 4 failus ir jiems priklausančias etiketes
    files_to_ingest = [
        ("backend/data/produktu_katalogas_technines_specifikacijos_prieziura.pdf", "product_agent"),
        ("backend/data/siuntimo_taisykles_ir_tarptautinio_siuntimo_politika.pdf", "delivery_agent"),
        ("backend/data/grazinimo_politika_ir_broko_kriterijai.pdf", "returns_agent"),
        ("backend/data/mano_paskyra_instrukcija_ir_statusu_aprasymai.pdf", "order_agent")
    ]

    for path, label in files_to_ingest:
        process_pdf(path, label)