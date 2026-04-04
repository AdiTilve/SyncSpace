from fastapi import Header,HTTPException,Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from .utils import verify_access_token
from users.repository import get_user_by_userId
from shared.database import get_db
from uuid import UUID

oauth2scheme=OAuth2PasswordBearer(tokenUrl="/auth/login")
async def get_current_user(token:str=Depends(oauth2scheme),db: AsyncSession = Depends(get_db)):
    userID=verify_access_token(token)
    
    user=await get_user_by_userId(db,UUID(userID))

    return user