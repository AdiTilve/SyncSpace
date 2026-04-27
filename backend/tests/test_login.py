import pytest

@pytest.mark.asyncio
@pytest.mark.parametrize("email, password, expected_status", [
    ("test7@gmail.com", "test1234", 200),   # User Exist
    ("test7@gmail.com", "test1237", 401),    # Invalid Password
    ("test9@gmail.com", "test1234", 401),    # User Not Found
    ("Test7@gmaiL.com", "test1234", 200),    # Email Case sensitivity
])
async def test_login_authentication(client,setup_test_user,email,password,expected_status):
    payload={
        "email": email,
        "password": password
    }
    response = await client.post("/auth/login",json=payload)
    assert response.status_code == expected_status



@pytest.mark.asyncio
@pytest.mark.parametrize("email, password, expected_status", [
    ("test7@gmail", "test1234", 422),        # Invalid Email Format
    ("test7@gmail.com", "test123", 422),     # Password too short
    ("", "test1234", 422)                   # Empty Email
])
async def test_login_validation(client,setup_test_user,email,password,expected_status):
    payload={
        "email": email,
        "password": password
    }
    response = await client.post("/auth/login",json=payload)
    assert response.status_code == expected_status
