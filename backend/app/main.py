from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models
from app.routes import reports, locations, auth

import time

for attempt in range(5):
    try:
        models.Base.metadata.create_all(bind=engine)
        break
    except Exception as e:
        print(f"Database connection attempt {attempt + 1} failed: {e}")
        if attempt < 4:
            time.sleep(3)
        else:
            raise

app = FastAPI(
    title="Viora Pulse",
    description="Real-time utility status platform for Kenya. Know Before You Go.",
    version="1.0.0"
)

import os

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
production_origin = os.getenv("FRONTEND_URL")
if production_origin:
    allowed_origins.append(production_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(locations.router, prefix="/locations", tags=["Locations"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])

@app.get("/")
def root():
    return {
        "message": "Welcome to Viora Pulse",
        "tagline": "Know Before You Go",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
