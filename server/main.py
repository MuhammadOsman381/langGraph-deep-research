from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.router import research
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   
        "http://localhost:3000", 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(research.router)

@app.get("/")
def root():
    return {"message": "Hello, from Multimodel agent server"}
