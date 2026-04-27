from sqlalchemy.ext.asyncio import AsyncSession
from users.model import User
from sqlalchemy import select

# Creating User in DB
async def create_user(db: AsyncSession, user_data: dict):
    user=User(**user_data)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

# Fetching a specific user from DB by email
async def get_user_by_email(db: AsyncSession, email:str):
    result= await db.execute(
        select(User).where(User.email==email.lower())
        )
    return result.scalar_one_or_none()

# Fetching a user from DB by user ID
async def get_user_by_userId(db:AsyncSession,user_Id):
    result=await db.execute(
        select(User).where(User.id==user_Id)
        )
    return result.scalar_one_or_none()

# Updating the passowrd of a user
async def update_user_password(db:AsyncSession,id:str,password:str):
    result= await db.execute(
        select(User).where(User.id==id)
        )
    user=result.scalar_one_or_none()
    user.password_hash=password
    await db.commit()
    await db.refresh(user)