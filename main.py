from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.agents.orchestrator import handle_customer_query
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="LITIT AI E-commerce Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Leidžiame visiems (vėliau galime apriboti)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Duomenų modelis užklausai
class Query(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"status": "AI Assistant is Online"}

@app.post("/chat")
def chat(query: Query):
    try:
        # Paduodame vartotojo tekstą orchestratoriui
        response = handle_customer_query(query.text)
        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Paleidžiame serverį
    uvicorn.run(app, host="127.0.0.1", port=8000)