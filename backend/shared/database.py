from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()

# Loading database connection related properties from environment
pg_user=os.getenv("POSTGRES_USER")
pg_password=quote_plus(os.getenv('POSTGRES_PASSWORD'))
pg_dbname=os.getenv('POSTGRES_DB')

# Database connectivity URL 
DATABASE_URL= f"postgresql+asyncpg://{pg_user}:{pg_password}@localhost:5432/{pg_dbname}?prepared_statement_cache_size=500"

#Debugging
print("USER:", pg_user)
print("PASS:", pg_password)
print("DB:", pg_dbname)
print("URL:", DATABASE_URL)

# Creating Async Engine
engine = create_async_engine(
    f"postgresql+asyncpg://{pg_user}:{pg_password}@localhost:5432/{pg_dbname}?prepared_statement_cache_size=500"
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