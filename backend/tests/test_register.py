import pytest

@pytest.mark.asyncio
@pytest.mark.parametrize("first_name, last_name, email, password, expected_status", [
    ("Aditya", "Tilve","test6@gmail.com", "test1234", 200),   # User Register Success
    ("Aditya", "Tilve","test6@gmail.com", "test1234", 409),   # Duplicate User
     ("Aditya", "Tilve","tesT5@gmaiL.com", "test1234", 200),   # Email Case Insensitivity
])
async def test_register_authentication(client,first_name,last_name,email,password,expected_status):
    payload = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "password": password
    }

    response = await client.post("/users/register", json=payload)

    assert response.status_code == expected_status

@pytest.mark.asyncio
@pytest.mark.parametrize("first_name, last_name, email, password, expected_status", [
    ("Aditya", "Tilve","test8@gmail", "test1234", 422),   # Invalid Email
    ("Aditya", "Tilve","test8@gmail.com", "test123", 422),   # Password length too short
     ("", "Tilve","test8@gmail.com", "test1234", 422),   # Empty Field
])
async def test_register_validation(client,first_name,last_name,email,password,expected_status):
    payload = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "password": password
    }

    response = await client.post("/users/register", json=payload)

    assert response.status_code == expected_status


@pytest.mark.asyncio
async def test_register_missing_field(client):
    payload = {
        "last_name": "Tilve",
        "email": "test8@gmail.com",
        "password": "test1234"
    }

    response = await client.post("/users/register", json=payload)

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_extra_field(client):
    payload = {
        "first_name": "aditya",
        "last_name": "Tilve",
        "email": "test8@gmail.com",
        "password": "test1234",
        "mobile":"123456789"
    }

    response = await client.post("/users/register", json=payload)

    assert response.status_code == 422