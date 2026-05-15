import pytest

@pytest.mark.asyncio
async def test_login_valid(client, setup_test_user):
    response = await client.post("/auth/login", json={
        "email": setup_test_user["email"],
        "password": setup_test_user["password"]
    })
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_login_wrong_password(client, setup_test_user):
    response = await client.post("/auth/login", json={
        "email": setup_test_user["email"],
        "password": "wrongpassword"
    })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_login_user_not_found(client):
    response = await client.post("/auth/login", json={
        "email": "nonexistent_@gmail.com",
        "password": "test1234"
    })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_login_email_case_insensitive(client, setup_test_user):
    response = await client.post("/auth/login", json={
        "email": setup_test_user["email"].upper(),
        "password": setup_test_user["password"]
    })
    assert response.status_code == 200


@pytest.mark.asyncio
@pytest.mark.parametrize("email, password, expected_status", [
    ("test7@gmail", "test1234", 422),        # Invalid Email Format
    ("test7@gmail.com", "test123", 422),     # Password too short
    ("", "test1234", 422)                   # Empty Email
])
async def test_login_validation(client,email,password,expected_status):
    payload={
        "email": email,
        "password": password
    }
    response = await client.post("/auth/login",json=payload)
    assert response.status_code == expected_status
