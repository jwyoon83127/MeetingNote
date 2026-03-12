from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas, database
from database import get_db

router = APIRouter(prefix="/agendas", tags=["agendas"])

@router.post("/", response_model=schemas.Agenda)
def create_agenda(agenda: schemas.AgendaCreate, db: Session = Depends(get_db)):
    return crud.create_agenda(db=db, agenda=agenda)

@router.get("/meeting/{meeting_id}", response_model=List[schemas.Agenda])
def read_agendas_by_meeting(meeting_id: int, db: Session = Depends(get_db)):
    return crud.get_agendas_by_meeting(db, meeting_id=meeting_id)

@router.put("/{agenda_id}", response_model=schemas.Agenda)
def update_agenda(agenda_id: int, agenda: schemas.AgendaUpdate, db: Session = Depends(get_db)):
    db_agenda = crud.update_agenda(db=db, agenda_id=agenda_id, agenda_update=agenda)
    if not db_agenda:
        raise HTTPException(status_code=404, detail="Agenda not found")
    return db_agenda

@router.delete("/{agenda_id}")
def delete_agenda(agenda_id: int, db: Session = Depends(get_db)):
    success = crud.delete_agenda(db=db, agenda_id=agenda_id)
    if not success:
        raise HTTPException(status_code=404, detail="Agenda not found")
    return {"message": "Agenda deleted successfully"}
