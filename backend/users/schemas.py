from pydantic import BaseModel,EmailStr,ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional

# User Creation Schema:
class UserCreate(BaseModel):
    first_name:str
    last_name:str
    email:EmailStr
    password:str

# User Creation Response Schema
class UserResponse(BaseModel):
    status_code:int
    message:str

# User Model for Login
class UserData(BaseModel):
    model_config = ConfigDict(from_attributes=True) 
    id:UUID
    first_name:str
    last_name:str
    email:EmailStr
    last_login: Optional[datetime]

# User data wrapper class
class UserDataResponse(BaseModel):
    status_code: int
    message: str
    data: UserData