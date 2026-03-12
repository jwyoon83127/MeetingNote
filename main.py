from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from sqlalchemy.orm import Session
import os
import sys

# Python 3.12 compatibility fix for passlib
try:
    import crypt
except ImportError:
    import types
    sys.modules["crypt"] = types.ModuleType("crypt")

import models, schemas, database
from database import engine

from routers import users, meetings, agendas

# Create tables
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="경영집행위원회 API", description="경영집행위원회 회의록 관리 시스템")

app.include_router(users.router, prefix="/api")
app.include_router(meetings.router, prefix="/api")
app.include_router(agendas.router, prefix="/api")

# Serve static files with absolute path
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    # Fallback for local dev if index.html is in root (unlikely but safe)
    static_dir = "static"
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def read_root():
    static_path = os.path.join(os.path.dirname(__file__), "static", "index.html")
    return FileResponse(static_path)

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}
