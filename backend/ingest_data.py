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

def clear_agent_data(agent_label):
   # Ištrina visus įrašus iš Supabase, kurie priklauso konkrečiam agentui
    print(f"🧹 Valomi seni '{agent_label}' duomenys iš Supabase...")
    try:
        # Naudojame .eq() filtrą, kad pasiektume metaduomenų viduje esantį 'agent' lauką
        # Supabase Python bibliotekoje tai daroma nurodant kelią per ->>
        supabase.table("documents").delete().eq("metadata->>agent", agent_label).execute()
        print(f"✅ Seni '{agent_label}' duomenys sėkmingai pašalinti.")
    except Exception as e:
        print(f"⚠️ Klaida valant duomenis: {e}")

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
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1300, chunk_overlap=100)
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
    pass

if __name__ == "__main__":
    files_to_ingest = [
        ("data/produktu_katalogas_technines_specifikacijos_prieziura_papildytas.pdf", "product_agent"),
        ("data/siuntimo_taisykles_ir_tarptautinio_siuntimo_politika.pdf", "delivery_agent"),
        ("data/grazinimo_politika_ir_broko_kriterijai.pdf", "returns_agent"),
        ("data/mano_paskyra_instrukcija_ir_statusu_aprasymai.pdf", "order_agent")
    ]

    for path, label in files_to_ingest:
        # 1. Pirmiausia tikriname, ar failas yra tavo kompiuteryje
        if os.path.exists(path):
            # 2. Tik jei failas rastas, valome bazę
            clear_agent_data(label)
            # 3. Įkeliame naujus duomenis
            process_pdf(path, label)
        else:
            print(f"❌ PRALEIDŽIAMA: Failas {path} nerastas. Duomenys bazėje NEIŠTRINTI.")