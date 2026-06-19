from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class UtilityType(str, Enum):
    water = "water"
    electricity = "electricity"

class StatusType(str, Enum):
    available = "available"
    unavailable = "unavailable"

class LocationCreate(BaseModel):
    name: str
    county: str
    latitude: float
    longitude: float

class LocationResponse(BaseModel):
    id: int
    name: str
    county: str
    latitude: float
    longitude: float

    class Config:
        from_attributes = True

class ReportCreate(BaseModel):
    location_id: int
    utility_type: UtilityType
    status: StatusType

class ReportResponse(BaseModel):
    id: int
    location_id: int
    utility_type: UtilityType
    status: StatusType
    timestamp: datetime

    class Config:
        from_attributes = True


class UserSignup(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
