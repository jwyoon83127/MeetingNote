from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import enum

# Enums (re-defined or imported if we want to use them in API schemas)
from models import MeetingStatus, ParticipantStatus, ActionItemPriority, ActionItemStatus

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None

# Meeting Schemas
class MeetingBase(BaseModel):
    title: str
    start_time: datetime
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    meeting_type: Optional[str] = None
    status: MeetingStatus = MeetingStatus.DRAFT

class MeetingCreate(MeetingBase):
    pass

class Meeting(MeetingBase):
    id: int
    organizer_id: int

    class Config:
        orm_mode = True

# Agenda Schemas
class AgendaBase(BaseModel):
    title: str
    owner_id: Optional[int] = None
    duration_minutes: Optional[int] = None
    order: Optional[int] = None
    status: Optional[str] = None

class AgendaCreate(AgendaBase):
    meeting_id: int

class Agenda(AgendaBase):
    id: int
    meeting_id: int

    class Config:
        orm_mode = True

class AgendaUpdate(BaseModel):
    title: Optional[str] = None
    owner_id: Optional[int] = None
    duration_minutes: Optional[int] = None
    order: Optional[int] = None
    status: Optional[str] = None

# Action Item Schemas
class ActionItemBase(BaseModel):
    description: str
    assignee_id: Optional[int] = None
    due_date: Optional[datetime] = None
    priority: ActionItemPriority = ActionItemPriority.MEDIUM
    status: ActionItemStatus = ActionItemStatus.REGISTERED

class ActionItemCreate(ActionItemBase):
    agenda_id: int

class ActionItem(ActionItemBase):
    id: int
    agenda_id: int

    class Config:
        orm_mode = True
