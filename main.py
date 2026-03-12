from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
import models, schemas, database
from database import engine
import os

from routers import users, meetings, agendas

# Create tables
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MeetingHub API", description="Corporate Meeting Minutes Management System")

app.include_router(users.router, prefix="/api")
app.include_router(meetings.router, prefix="/api")
app.include_router(agendas.router, prefix="/api")

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    static_path = os.path.join(os.path.dirname(__file__), "static", "index.html")
    with open(static_path, "r") as f:
        return HTMLResponse(content=f.read())

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}
