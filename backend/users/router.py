from fastapi import APIRouter,Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .schemas import UserCreate,UserResponse,UserDataResponse
from .service import register_user
from shared.database import get_db
from auth.dependencies import get_current_user
router = APIRouter()

# User Registration
@router.post("/register", response_model=UserResponse)
async def register( user:UserCreate,db: AsyncSession = Depends(get_db)):
    await register_user(db,user)
    return UserResponse(status_code=201,message="User Created Successfully")

# Dummy endpoint to test JWT Verification
@router.get("/me", response_model=UserDataResponse)
async def get_me(user=Depends(get_current_user)):
    return UserDataResponse(status_code=200,message="User fetched successfully",data=user)