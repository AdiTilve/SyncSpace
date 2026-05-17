from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os
import ssl
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()
# Database connectivity URL 
DATABASE_URL= os.getenv('DATABASE_URL')
#Debugging
print("URL:", DATABASE_URL)

ssl_context = ssl.create_default_context()
# Creating Async Engine
if os.getenv('TESTING') != 'true':
    engine = create_async_engine(
    DATABASE_URL
    # connect_args={"ssl": ssl_context}
    )
    # Creating Session
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


# Base class to keep track of schemas for future migration
class Base(DeclarativeBase):
    pass

# A dependency function for creating th AsyncSession for a request
async def get_db():
    async with SessionLocal() as session:
        yield session