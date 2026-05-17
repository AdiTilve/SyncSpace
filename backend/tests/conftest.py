import sys
import os
import uuid

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool
from shared.database import Base, get_db

os.environ["TESTING"] = "true"

from main import app


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
@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


# Test client
@pytest_asyncio.fixture(scope="session")
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
        "email": f"test_{uuid.uuid4()}@gmail.com",
        "password": "test1234"
    }
    await client.post("/users/register", json=user_data)
    return user_data

@pytest_asyncio.fixture
async def setup_test_user_2(client):
    """
    Registers a global test user that stays in the 
    in-memory DB for all tests in this file.
    """
    user_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": f"test_{uuid.uuid4()}@gmail.com",
        "password": "test1234"
    }
    await client.post("/users/register", json=user_data)

    login_response = await client.post("/auth/login", json={
        "email": user_data["email"],
        "password": user_data["password"]
    })
    token = login_response.json()["token"]
    
    me_response = await client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    user_data["id"] = me_response.json()["data"]["id"]

    return user_data

@pytest_asyncio.fixture
async def auth_headers(client, setup_test_user):

    login_data = {
        "email": setup_test_user["email"],
        "password": setup_test_user["password"]
    }

    response = await client.post(
        "/auth/login",
        json=login_data
    )
    token = response.json()["token"]

    return {
        "Authorization": f"Bearer {token}"
    }

@pytest_asyncio.fixture
async def auth_headers_2(client, setup_test_user_2):

    login_data = {
        "email": setup_test_user_2["email"],
        "password": setup_test_user_2["password"]
    }

    response = await client.post(
        "/auth/login",
        json=login_data
    )
    token = response.json()["token"]

    return {
        "Authorization": f"Bearer {token}"
    }

@pytest_asyncio.fixture
async def setup_space(client, auth_headers):

    payload = {
        "name": f"Test Space {uuid.uuid4()}"
    }
    response = await client.post(
        "/spaces/",
        json=payload,
        headers=auth_headers
    )

    print(response.json())
    return response.json()["data"]

@pytest_asyncio.fixture
async def setup_space_2(client, auth_headers):
    payload = {"name": f"Test Space 2 {uuid.uuid4()}"}
    response = await client.post("/spaces/", json=payload, headers=auth_headers)
    return response.json()["data"]

@pytest_asyncio.fixture
async def setup_document(client, auth_headers, setup_space):
    payload = {
        "title": f"Test Document {uuid.uuid4()}",
        "type": "note",
        "content": None,
        "parent_document_id": None
    }
    response = await client.post(
        f"/spaces/{setup_space['id']}/documents",
        json=payload,
        headers=auth_headers
    )
    print(response.json())
    return response.json()["data"]

@pytest_asyncio.fixture
async def setup_document_2(client, auth_headers, setup_space):
    payload = {
        "title": f"Test Document 2 {uuid.uuid4()}",
        "type": "note",
        "content": None,
        "parent_document_id": None
    }
    response = await client.post(
        f"/spaces/{setup_space['id']}/documents",
        json=payload,
        headers=auth_headers
    )
    print(response.json())
    return response.json()["data"]

@pytest_asyncio.fixture
async def setup_document_member(client, auth_headers, setup_document, setup_test_user_2):
    document_id = setup_document["id"]

    payload = {
        "email": setup_test_user_2["email"],
        "role": "viewer"
    }

    response = await client.post(
        f"/spaces/documents/{document_id}/members",
        json=payload,
        headers=auth_headers
    )

    member_data = response.json()["data"]
    return {
        "document": setup_document,
        "member": member_data,
        "user": setup_test_user_2
    }