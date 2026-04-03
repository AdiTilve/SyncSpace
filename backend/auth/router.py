from fastapi import APIRouter,Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .schemas import LoginRequest,LoginResponse
from auth.service import login_user
from shared.database import get_db

router = APIRouter()
# User Login Endpoint 
@router.post("/login",response_model=LoginResponse)
async def login(details:LoginRequest, db:AsyncSession=Depends(get_db)):
    user,bearer=await login_user(db,details)
    return LoginResponse(status_code=200, message="Login Successfull",data=user,token=bearer)
