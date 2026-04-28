import sys
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from shared.database import Base, get_db




# SQLite test DB (in-memory)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # IMPORTANT
)

TestingSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False
)


# Override DB dependency
async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session


app.dependency_overrides[get_db] = override_get_db


# Create tables before tests
@pytest.fixture(scope="session", autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


# Test client
@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

@pytest_asyncio.fixture
async def setup_test_user(client):
    """
    Registers a global test user that stays in the 
    in-memory DB for all tests in this file.
    """
    user_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test7@gmail.com",
        "password": "test1234"
    }
    await client.post("/users/register", json=user_data)
    return user_data