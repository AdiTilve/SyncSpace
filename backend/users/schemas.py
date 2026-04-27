from pydantic import BaseModel,EmailStr,ConfigDict,Field
from datetime import datetime
from uuid import UUID
from typing import Optional

# User Creation Schema:
class UserCreate(BaseModel):
    first_name:str = Field(...,min_length=1)
    last_name:str = Field(...,min_length=1)
    email:EmailStr
    password:str= Field(...,min_length=8)
    model_config = {

        "extra": "forbid" 

    }

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
    model_config = {"from_attributes": True}

# User data wrapper class
class UserDataResponse(BaseModel):
    status_code: int
    message: str
    data: UserData