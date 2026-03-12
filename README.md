# MeetingHub Execution Guide

This project is built with FastAPI and requires a PostgreSQL 15 database.

## 1. Prerequisites
- Python 3.9+ 
- PostgreSQL 15

## 2. Environment Setup
Create a `.env` file or export the `DATABASE_URL` environment variable:
```bash
export DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<dbname>"
```

## 3. Database Initialization
Local tables can be created by uncommenting the initialization line in `main.py`:
```python
# models.Base.metadata.create_all(bind=engine)
```

## 4. Running the Server
Run the application using `uvicorn`:
```bash
python3 -m uvicorn main:app --reload
```

## 5. Accessing API Documentation
Once the server is running, visit:
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
