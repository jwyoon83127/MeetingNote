from sqlalchemy.orm import Session
import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# User operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        update_data = user_update.dict(exclude_unset=True)
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

# Meeting operations
def get_meeting(db: Session, meeting_id: int):
    return db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()

def create_meeting(db: Session, meeting: schemas.MeetingCreate, organizer_id: int):
    db_meeting = models.Meeting(**meeting.dict(), organizer_id=organizer_id)
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

def get_meetings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Meeting).offset(skip).limit(limit).all()

# Agenda operations
def get_agendas_by_meeting(db: Session, meeting_id: int):
    return db.query(models.Agenda).filter(models.Agenda.meeting_id == meeting_id).all()

def create_agenda(db: Session, agenda: schemas.AgendaCreate):
    db_agenda = models.Agenda(**agenda.dict())
    db.add(db_agenda)
    db.commit()
    db.refresh(db_agenda)
    return db_agenda

def update_agenda(db: Session, agenda_id: int, agenda_update: schemas.AgendaUpdate):
    db_agenda = db.query(models.Agenda).filter(models.Agenda.id == agenda_id).first()
    if db_agenda:
        for key, value in agenda_update.dict(exclude_unset=True).items():
            setattr(db_agenda, key, value)
        db.commit()
        db.refresh(db_agenda)
    return db_agenda

def delete_agenda(db: Session, agenda_id: int):
    db_agenda = db.query(models.Agenda).filter(models.Agenda.id == agenda_id).first()
    if db_agenda:
        db.delete(db_agenda)
        db.commit()
        return True
    return False
