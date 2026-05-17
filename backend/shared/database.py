from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os
import ssl
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
print("URL:", DATABASE_URL)

ssl_context = ssl.create_default_context()

engine = create_async_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL and "sqlite" in DATABASE_URL else {},
)

SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# Base class to keep track of schemas for future migration
class Base(DeclarativeBase):
    pass

# A dependency function for creating th AsyncSession for a request
async def get_db():
    async with SessionLocal() as session:
        yield session