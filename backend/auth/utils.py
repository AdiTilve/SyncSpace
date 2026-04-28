from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import os
from fastapi import HTTPException

pwd_context=CryptContext(schemes=["argon2"], deprecated="auto")

#Loading environment properties for JWT 
ACCESS_TOKEN_EXPIRE_HOURS=int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS"))
SECRET_KEY=os.getenv("JWT_SECRET_KEY")
ALGORITHM=os.getenv("JWT_ALGORITHM")

# Hashing Password
def hash_password(password: str):
    return pwd_context.hash(password)

# Verifying the Password with plain password for Login
def verify_password(plain_password: str, hashed_password:str):
    return pwd_context.verify(plain_password,hashed_password)

# Rehashing the ppassword with new hash aldgorithm if changed
def needs_rehash(password:str):
    if pwd_context.needs_update(password):
        return True
    return False

# Creating JWT Access Token
def create_access_token(data: dict):
    to_encode = data.copy()
    print("timedelta type:",type(ACCESS_TOKEN_EXPIRE_HOURS))
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp":expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
   
    return encoded_jwt

# Verifying the JWT Access Token
def verify_access_token(token:str):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        return payload.get("userId")

    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")