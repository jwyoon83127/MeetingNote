from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text, Table
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

# Enums
class MeetingStatus(enum.Enum):
    DRAFT = "DRAFT"
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    WRITING_MINUTES = "WRITING_MINUTES"
    REVIEWING = "REVIEWING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class ParticipantStatus(enum.Enum):
    INVITED = "INVITED"
    ATTENDING = "ATTENDING"
    ABSENT = "ABSENT"

class ActionItemPriority(enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class ActionItemStatus(enum.Enum):
    REGISTERED = "REGISTERED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    OVERDUE = "OVERDUE"

# Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String)

    meetings_organized = relationship("Meeting", back_populates="organizer")
    action_items = relationship("ActionItem", back_populates="assignee")

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    location = Column(String)
    meeting_type = Column(String)
    status = Column(Enum(MeetingStatus), default=MeetingStatus.DRAFT)
    organizer_id = Column(Integer, ForeignKey("users.id"))

    organizer = relationship("User", back_populates="meetings_organized")
    participants = relationship("MeetingParticipant", back_populates="meeting")
    agendas = relationship("Agenda", back_populates="meeting")
    attachments = relationship("Attachment", back_populates="meeting")

class MeetingParticipant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(ParticipantStatus), default=ParticipantStatus.INVITED)

    meeting = relationship("Meeting", back_populates="participants")
    user = relationship("User")

class Agenda(Base):
    __tablename__ = "agendas"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    title = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    duration_minutes = Column(Integer)
    order = Column(Integer)
    status = Column(String)

    meeting = relationship("Meeting", back_populates="agendas")
    comments = relationship("Comment", back_populates="agenda")
    decisions = relationship("Decision", back_populates="agenda")
    action_items = relationship("ActionItem", back_populates="agenda")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    agenda_id = Column(Integer, ForeignKey("agendas.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    agenda = relationship("Agenda", back_populates="comments")
    user = relationship("User")

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True, index=True)
    agenda_id = Column(Integer, ForeignKey("agendas.id"))
    content = Column(Text, nullable=False)

    agenda = relationship("Agenda", back_populates="decisions")

class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, index=True)
    agenda_id = Column(Integer, ForeignKey("agendas.id"))
    description = Column(Text, nullable=False)
    assignee_id = Column(Integer, ForeignKey("users.id"))
    due_date = Column(DateTime)
    priority = Column(Enum(ActionItemPriority), default=ActionItemPriority.MEDIUM)
    status = Column(Enum(ActionItemStatus), default=ActionItemStatus.REGISTERED)

    agenda = relationship("Agenda", back_populates="action_items")
    assignee = relationship("User", back_populates="action_items")

class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    file_path = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    meeting = relationship("Meeting", back_populates="attachments")
