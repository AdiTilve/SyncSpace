import pytest
import jwt
import os
from datetime import datetime, timedelta, timezone

@pytest.mark.asyncio
async def test_login_returns_token(client,setup_test_user):
    
    payload = {
        "email": "test7@gmail.com",
        "password": "test1234"
    }

    response = await client.post("/auth/login",json=payload)
    
    assert response.status_code == 200 
    
    data = response.json()

    assert "token" in data
    token = data["token"]

    assert isinstance(token, str)
    assert len(token.split(".")) == 3

async def test_login_token_payload(client,setup_test_user):
    payload = {
        "email": "test7@gmail.com",
        "password": "test1234"
    }

    response = await client.post("/auth/login",json=payload)
    
    data = response.json()

    assert "token" in data
    token = data["token"]

    #Loading environment properties for JWT 
    SECRET_KEY=os.getenv("JWT_SECRET_KEY")
    ALGORITHM=os.getenv("JWT_ALGORITHM")

    decoded = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)

    assert "userId" in decoded
    assert "exp" in decoded

@pytest.mark.asyncio

async def test_invalid_token_access(client):

    headers = {

        "Authorization": "Bearer invalidtoken123"

    }

    response = await client.get("/users/me", headers=headers)

    assert response.status_code == 401

    data = response.json()

    assert "detail" in data

@pytest.mark.asyncio
async def test_valid_token_access(client, setup_test_user):
    payload = {
        "email": "test7@gmail.com",
        "password": "test1234"
    }

    login_response = await client.post("/auth/login", json=payload)
    token = login_response.json()["token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = await client.get("/users/me", headers=headers)

    assert response.status_code == 200

@pytest.mark.asyncio
async def test_expired_token_access(client):

    SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    ALGORITHM = os.getenv("JWT_ALGORITHM")

    # Create expired token
    payload = {
        "userId": 1,
        "exp": datetime.now(timezone.utc) - timedelta(minutes=5)  # already expired
    }

    expired_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    headers = {
        "Authorization": f"Bearer {expired_token}"
    }

    response = await client.get("/users/me", headers=headers)
    assert response.status_code == 401

    data = response.json()
    assert "detail" in data

@pytest.mark.asyncio
async def test_logout_success(client, setup_test_user):
    
    login_payload = {
        "email": "test7@gmail.com",
        "password": "test1234"
    }

    login_response = await client.post("/auth/login", json=login_payload)
    assert login_response.status_code == 200

    token = login_response.json()["token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    logout_response = await client.post("/auth/logout", headers=headers)
    assert logout_response.status_code == 200

    data = logout_response.json()
    assert data["message"] == "Logged out Successfully"



@pytest.mark.asyncio
async def test_logout_no_token(client):

    response = await client.post("/auth/logout")
    assert response.status_code == 401

    data = response.json()
    assert data["detail"] == "Not authenticated"

@pytest.mark.asyncio
async def test_logout_invalid_token(client):

    token="abc.def.ghf"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = await client.post("/auth/logout",headers=headers)
    assert response.status_code == 401

    data = response.json()
    assert data["detail"] == "Invalid token"

@pytest.mark.asyncio
async def test_logout_expired_token(client):

    SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    ALGORITHM = os.getenv("JWT_ALGORITHM")

    # Create expired token
    payload = {
        "userId": 1,
        "exp": datetime.now(timezone.utc) - timedelta(minutes=5)
    }

    expired_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    headers = {
        "Authorization": f"Bearer {expired_token}"
    }

    response = await client.post("/auth/logout", headers=headers)
    assert response.status_code == 401

    data = response.json()
    assert data["detail"] == "Token expired"