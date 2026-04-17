from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from backend.agents.orchestrator import handle_customer_query
from backend.auth import hash_password, verify_password, create_token, verify_token
from backend.core.supabase_client import supabase

app = FastAPI(title="LITIT AI E-commerce Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


class MessageHistory(BaseModel):
    role: str
    content: str


class Query(BaseModel):
    text: str
    history: Optional[List[MessageHistory]] = []


class AuthRequest(BaseModel):
    email: str
    password: str


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    email = verify_token(credentials.credentials)
    if not email:
        raise HTTPException(status_code=401, detail="Neteisingas arba pasibaigęs token'as")
    return email


@app.get("/")
def read_root():
    return {"status": "AI Assistant is Online"}


@app.post("/auth/register")
def register(data: AuthRequest):
    existing = supabase.table("users").select("email").eq("email", data.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Šis el. paštas jau užregistruotas")
    pw_hash = hash_password(data.password)
    supabase.table("users").insert({"email": data.email, "password_hash": pw_hash}).execute()
    return {"message": "Registracija sėkminga"}


@app.post("/auth/login")
def login(data: AuthRequest):
    result = supabase.table("users").select("*").eq("email", data.email).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Neteisingas el. paštas arba slaptažodis")
    user = result.data[0]
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Neteisingas el. paštas arba slaptažodis")
    token = create_token(data.email)
    return {"token": token, "email": data.email}


@app.post("/chat")
def chat(query: Query, current_user: str = Depends(get_current_user)):
    # Perduodame current_user (kuris turėtų būti tavo el. paštas)
    response = handle_customer_query(query.text, query.history, current_user)
    return {"response": response}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
