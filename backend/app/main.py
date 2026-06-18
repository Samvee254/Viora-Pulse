from fastapi import FastAPI
from app.database import engine
from app import models
from app.routes import reports, locations

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Viora Pulse",
    description="Real-time utility status platform for Kenya. Know Before You Go. 🇰🇪",
    version="1.0.0"
)

app.include_router(locations.router, prefix="/locations", tags=["Locations"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])

@app.get("/")
def root():
    return {
        "message": "Welcome to Viora Pulse 🇰🇪",
        "tagline": "Know Before You Go",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
