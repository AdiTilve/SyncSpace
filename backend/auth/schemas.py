from pydantic import BaseModel,EmailStr
from users.schemas import UserData

# Login Request Schema
class LoginRequest(BaseModel):
    email:EmailStr
    password:str

# Login Resposne Schema
class LoginResponse(BaseModel):
    status_code:int
    message:str
    data:UserData
    token:str

