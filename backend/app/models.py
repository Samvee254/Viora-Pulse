from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone, timedelta

EAT = timezone(timedelta(hours=3))

def kenya_now():
    return datetime.now(EAT).replace(tzinfo=None)
import enum
from app.database import Base

class UtilityType(str, enum.Enum):
    water = "water"
    electricity = "electricity"

class StatusType(str, enum.Enum):
    available = "available"
    unavailable = "unavailable"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=kenya_now)
    reports = relationship("Report", back_populates="user")

class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    county = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    reports = relationship("Report", back_populates="location")

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    location_id = Column(Integer, ForeignKey("locations.id"))
    utility_type = Column(Enum(UtilityType))
    status = Column(Enum(StatusType))
    timestamp = Column(DateTime, default=kenya_now)
    user = relationship("User", back_populates="reports")
    location = relationship("Location", back_populates="reports")
