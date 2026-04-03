from sqlalchemy.ext.asyncio import AsyncSession
from .schemas import UserCreate
from .repository import get_user_by_email,create_user,update_user_password
from fastapi import HTTPException
from auth.utils import hash_password

# User Regstration Service
async def register_user(db: AsyncSession,user: UserCreate):
    existing_user = await get_user_by_email(db,user.email)
    
    if existing_user:
        raise HTTPException(status_code=409,detail="User already exists")
    
    hashed_password=hash_password(user.password)

    user_data={
        "first_name":user.first_name,
        "last_name":user.last_name,
        "email":user.email.lower(),
        "password_hash":hashed_password
    }
    
    await create_user(db,user_data)

