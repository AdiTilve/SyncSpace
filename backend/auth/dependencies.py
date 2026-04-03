from fastapi import Header,HTTPException,Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .utils import verify_access_token
from users.repository import get_user_by_userId
from shared.database import get_db
from uuid import UUID
async def get_current_user(authorization: str=Header(...),db: AsyncSession = Depends(get_db)):
    print("HEADER:",authorization)
    scheme, token=authorization.split()
    if scheme.lower()!="bearer":
        raise HTTPException(status_code=401,detail="Invalid Authentication Scheme")
    userID=verify_access_token(token)
    print("Got userid:",userID)
    user=await get_user_by_userId(db,UUID(userID))
    return user