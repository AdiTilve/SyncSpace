from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os
from dotenv import load_dotenv

load_dotenv()

pg_user=os.environ['POSTGRES_USER']
pg_password=os.environ['POSTGRES_PASSWORD']
pg_dbname=os.environ['POSTGRES_DB']

# Creating Async Engine
engine = create_async_engine(
    f"postgresql+asyncpg://{pg_user}:{pg_password}@localhost:5432/{pg_dbname}?prepared_statement_cache_size=500"
)

# Creating Session
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with SessionLocal() as session:
        yield session