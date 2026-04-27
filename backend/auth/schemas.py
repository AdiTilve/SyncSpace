from pydantic import BaseModel,EmailStr,Field
from users.schemas import UserData

# Login Request Schema
class LoginRequest(BaseModel):
    email:EmailStr
    password:str= Field(...,min_length=8)

# Login Resposne Schema
class LoginResponse(BaseModel):
    status_code:int
    message:str
    data:UserData
    token:str

