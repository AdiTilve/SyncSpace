from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from .utils import verify_password,hash_password,needs_rehash,create_access_token
from .schemas import LoginRequest
from users.repository import update_user_password
from users.repository import get_user_by_email

# Service function to Validate User and returning token along with User details
async def login_user(db:AsyncSession,details:LoginRequest):
    existing_user = await get_user_by_email(db,details.email)
    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    try:
        is_valid = verify_password(details.password, existing_user.password_hash)
    except Exception as e:
        print("Password verification error:", e)
        is_valid = False

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if needs_rehash(existing_user.password_hash):
        new_hash=hash_password(details.password)
        await update_user_password(db,existing_user.id,new_hash)
    
    token=create_access_token({"userId":str(existing_user.id)})
    print("token:",token)
    return existing_user,token

