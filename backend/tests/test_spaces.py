import pytest
import uuid
@pytest.mark.asyncio
@pytest.mark.parametrize("name, expected_status", [
    ("Test Space", 201),
    ("",422),
    (" ",422)
])
async def test_create_space(client, auth_headers, name, expected_status):

    payload = {
        "name": name
    }
    response = await client.post(
        "/spaces/",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == expected_status

@pytest.mark.asyncio
async def test_create_space_duplicate(client, auth_headers, setup_space):
    payload = {"name": setup_space["name"]}
    response = await client.post("/spaces/", json=payload, headers=auth_headers)
    assert response.status_code == 409

async def test_get_space_by_id_success(client,auth_headers,setup_space):
    space_id=setup_space["id"]

    response = await client.get(
        f"/spaces/{space_id}", 
        headers=auth_headers
        )
    assert response.status_code == 200

@pytest.mark.asyncio
@pytest.mark.parametrize("space_id, expected_status", [
    ("875655454gfgfgh", 422),           # invalid uuid
    ("123e4567-e89b-12d3-a456-426614174000", 404),  # valid uuid not found
])
async def test_get_space_by_id_static(client,auth_headers,space_id,expected_status):

    response = await client.get(
        f"/spaces/{space_id}", 
        headers=auth_headers
        )
    assert response.status_code == expected_status

async def test_get_space_by_id_wrong_user(client,auth_headers_2,setup_space):
    space_id = setup_space["id"]

    response = await client.get(
        f"/spaces/{space_id}", 
        headers=auth_headers_2
        )
    assert response.status_code == 404

async def test_get_all_space_success(client,auth_headers):

    response = await client.get(
        f"/spaces/", 
        headers=auth_headers
        )
    assert response.status_code == 200

async def test_get_all_space_empty(client,auth_headers_2):

    response = await client.get(
        f"/spaces/", 
        headers=auth_headers_2
        )
    assert response.status_code == 200
    assert response.json()["data"]==[]

async def test_update_space_success(client,auth_headers,setup_space):
    space_id=setup_space["id"]
    payload = {
        "name": f"test1{uuid.uuid4()}"
    }
    response = await client.patch(
        f"/spaces/{space_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 200

async def test_update_space_unauthorized_user(client,auth_headers_2,setup_space):
    space_id=setup_space["id"]
    payload = {
        "name": f"test1{uuid.uuid4()}"
    }
    response = await client.patch(
        f"/spaces/{space_id}",
        json=payload,
        headers=auth_headers_2
    )
    assert response.status_code == 404

async def test_update_space_duplicate_name(client,auth_headers,setup_space,setup_space_2):
    space_id=setup_space_2["id"]
    payload = {
        "name": setup_space["name"]
    }
    response = await client.patch(
        f"/spaces/{space_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 409

async def test_update_space_nonexistent(client,auth_headers):
    space_id=uuid.uuid4()
    payload = {
        "name": f"test1{uuid.uuid4()}"
    }
    response = await client.patch(
        f"/spaces/{space_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 404

async def test_update_space_empty_name(client,auth_headers,setup_space):
    space_id=setup_space["id"]
    payload = {
        "name": ""
    }
    response = await client.patch(
        f"/spaces/{space_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 422

async def test_update_space_white_space_name(client,auth_headers,setup_space):
    space_id=setup_space["id"]
    payload = {
        "name": " "
    }
    response = await client.patch(
        f"/spaces/{space_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 422

async def test_delete_space_unauthorized(client,auth_headers_2,setup_space):
    space_id=setup_space["id"]
    response = await client.delete(
        f"/spaces/{space_id}",
        headers=auth_headers_2
    )
    assert response.status_code == 404
    
async def test_delete_space_success_and_deleted(client,auth_headers,setup_space):
    space_id=setup_space["id"]
    response = await client.delete(
        f"/spaces/{space_id}",
        headers=auth_headers
    )
    assert response.status_code == 200

    response = await client.delete(
        f"/spaces/{space_id}",
        headers=auth_headers
    )
    assert response.status_code == 404


async def test_create_document_success_and_duplicate(client,auth_headers,setup_space):
    space_id=setup_space['id']
    payload = {
        "title": f"Test Document {uuid.uuid4()}",
        "type": "note",
        "content": None,
        "parent_document_id": None
    }
    response = await client.post(
        f"/spaces/{space_id}/documents",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 201

    response = await client.post(
        f"/spaces/{space_id}/documents",
        json=payload,
        headers=auth_headers
    )

    assert response.status_code == 409

async def test_create_document_space_not_exist(client,auth_headers):
    space_id=uuid.uuid4()
    payload = {
        "title": f"Test Document {uuid.uuid4()}",
        "type": "note",
        "content": None,
        "parent_document_id": None
    }
    response = await client.post(
        f"/spaces/{space_id}/documents",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 404

@pytest.mark.asyncio
@pytest.mark.parametrize("title, expected_status", [
    ("",422),
    (" ",422)
])
async def test_create_document_static(client,auth_headers,setup_space,title,expected_status):
    space_id=setup_space['id']
    payload = {
        "title": title,
        "type": "note",
        "content": None,
        "parent_document_id": None
    }
    response = await client.post(
        f"/spaces/{space_id}/documents",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == expected_status

async def test_create_document_unauthorized(client,auth_headers_2,setup_space):
    space_id=setup_space["id"]
    payload = {
        "title": f"Test Document {uuid.uuid4()}",
        "type": "note",
        "content": None,
        "parent_document_id": None
    }
    response = await client.post(
        f"/spaces/{space_id}/documents",
        json=payload,
        headers=auth_headers_2
    )
    assert response.status_code == 404

async def test_create_document_wrong_type(client,auth_headers,setup_space):
    space_id=setup_space["id"]
    payload = {
        "title": f"Test Document {uuid.uuid4()}",
        "type": "hybrid",
        "content": None,
        "parent_document_id": None
    }
    response = await client.post(
        f"/spaces/{space_id}/documents",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 422

async def test_create_document_empty_type(client,auth_headers,setup_space):
    space_id=setup_space["id"]
    payload = {
        "title": f"Test Document {uuid.uuid4()}",
        "type": "",
        "content": None,
        "parent_document_id": None
    }
    response = await client.post(
        f"/spaces/{space_id}/documents",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 422

async def test_create_document_missing_field(client,auth_headers,setup_space):
    space_id=setup_space["id"]
    payload = {
        "type": "",
        "content": None,
        "parent_document_id": None
    }
    response = await client.post(
        f"/spaces/{space_id}/documents",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 422

async def test_update_document_success(client,auth_headers,setup_space,setup_document):
    space_id=setup_space['id']
    document_id=setup_document['id']
    payload = {
        "title": f"Test Document {uuid.uuid4()}",
        "content": {"text": "This is a test."}
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 200

async def test_update_document_duplicate(client,auth_headers,setup_space,setup_document,setup_document_2):
    space_id=setup_space['id']
    document_id=setup_document['id']
    payload = {
        "title": setup_document_2["title"]
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 409

async def test_update_document_space_not_exist(client,auth_headers,setup_document):
    space_id=uuid.uuid4()
    document_id=setup_document['id']
    payload = {
        "title": f"Test Document {uuid.uuid4()}"
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 404

async def test_update_document_document_not_exist(client,auth_headers,setup_space):
    space_id=setup_space['id']
    document_id=uuid.uuid4()
    payload = {
        "title": f"Test Document {uuid.uuid4()}"
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 404

async def test_update_document_document_empty_title(client,auth_headers,setup_space,setup_document):
    space_id=setup_space['id']
    document_id=setup_document['id']
    payload = {
        "title": ""
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 422

async def test_update_document_document_white_space_title(client,auth_headers,setup_space,setup_document):
    space_id=setup_space['id']
    document_id=setup_document['id']
    payload = {
        "title": " "
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 422

async def test_update_document_unauthorzied(client,auth_headers_2,setup_space,setup_document):
    space_id=setup_space['id']
    document_id=setup_document['id']
    payload = {
        "title": f"Test Document {uuid.uuid4()}",
        "content": {"text": "This is a test."}
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers_2
    )
    assert response.status_code == 404

async def test_update_document_success(client,auth_headers,setup_space,setup_document):
    space_id=setup_space['id']
    document_id=setup_document['id']
    payload = {
        "title": f"Test Document {uuid.uuid4()}",
        "content": {"text": "This is a test."}
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 200

async def test_update_document_duplicate(client,auth_headers,setup_space,setup_document,setup_document_2):
    space_id=setup_space['id']
    document_id=setup_document['id']
    payload = {
        "title": setup_document_2["title"]
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 409

async def test_update_document_space_not_exist(client,auth_headers,setup_document):
    space_id=uuid.uuid4()
    document_id=setup_document['id']
    payload = {
        "title": f"Test Document {uuid.uuid4()}"
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 404

async def test_update_document_document_not_exist(client,auth_headers,setup_space):
    space_id=setup_space['id']
    document_id=uuid.uuid4()
    payload = {
        "title": f"Test Document {uuid.uuid4()}"
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 404

async def test_update_document_document_empty_title(client,auth_headers,setup_space,setup_document):
    space_id=setup_space['id']
    document_id=setup_document['id']
    payload = {
        "title": ""
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 422

async def test_update_document_document_white_space_title(client,auth_headers,setup_space,setup_document):
    space_id=setup_space['id']
    document_id=setup_document['id']
    payload = {
        "title": " "
    }
    response = await client.patch(
        f"/spaces/{space_id}/documents/{document_id}",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 422

async def test_delete_document_space_not_exist(client,auth_headers,setup_document):
    space_id=uuid.uuid4()
    document_id=setup_document['id']

    response = await client.delete(
        f"/spaces/{space_id}/documents/{document_id}",
        headers=auth_headers
    )
    assert response.status_code == 404

async def test_delete_document_not_exist(client,auth_headers,setup_space):
    space_id=setup_space['id']
    document_id=uuid.uuid4()

    response = await client.delete(
        f"/spaces/{space_id}/documents/{document_id}",
        headers=auth_headers
    )
    assert response.status_code == 404

async def test_delete_document_unauthorized(client,auth_headers_2,setup_space,setup_document):
    space_id=setup_space['id']
    document_id=setup_document['id']

    response = await client.delete(
        f"/spaces/{space_id}/documents/{document_id}",
        headers=auth_headers_2
    )
    assert response.status_code == 404

async def test_delete_document_success_deleted(client,auth_headers,setup_space,setup_document):
    space_id=setup_space['id']
    document_id=setup_document['id']

    response = await client.delete(
        f"/spaces/{space_id}/documents/{document_id}",
        headers=auth_headers
    )
    assert response.status_code == 200

    response = await client.delete(
        f"/spaces/{space_id}/documents/{document_id}",
        headers=auth_headers
    )

    assert response.status_code == 404

async def test_get_document_by_id_success(client,auth_headers,setup_space,setup_document):
    space_id=setup_space['id']
    document_id=setup_document['id']
    response = await client.get(
        f"/spaces/{space_id}/documents/{document_id}", 
        headers=auth_headers
        )
    assert response.status_code == 200

@pytest.mark.asyncio
@pytest.mark.parametrize("document_id, expected_status", [
    ("875655454gfgfgh", 422),           # invalid uuid
    ("123e4567-e89b-12d3-a456-426614174000", 404),  # valid uuid not found
])
async def test_get_document_by_id_static(client,auth_headers,setup_space,document_id,expected_status):
    space_id=setup_space['id']
    response = await client.get(
        f"/spaces/{space_id}/documents/{document_id}", 
        headers=auth_headers
        )
    assert response.status_code == expected_status

async def test_get_document_by_id_unauthorized(client,auth_headers_2,setup_space,setup_document):
    space_id=setup_space['id']
    document_id=setup_document['id']
    response = await client.get(
        f"/spaces/{space_id}/documents/{document_id}", 
        headers=auth_headers_2
        )
    assert response.status_code == 404

async def test_get_all_documents_success(client, auth_headers, setup_space):
    space_id = setup_space['id']
    response = await client.get(
        f"/spaces/{space_id}/documents",
        headers=auth_headers
    )
    assert response.status_code == 200

async def test_get_all_documents_empty(client, auth_headers_2, setup_space):
    space_id = setup_space['id']
    response = await client.get(
        f"/spaces/{space_id}/documents",
        headers=auth_headers_2
    )
    assert response.status_code == 200
    assert response.json()["data"] == []


async def test_document_member_add_document_not_exist(client, auth_headers,setup_test_user_2):
    document_id = uuid.uuid4()
    payload = {
        "email":setup_test_user_2["email"],
        "role": "viewer"
    }
    response = await client.post(
        f"/spaces/documents/{document_id}/members",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 404

async def test_document_member_add_unauthorized(client, auth_headers_2,setup_document,setup_test_user_2):
    document_id = setup_document['id']
    payload = {
        "email":setup_test_user_2["email"],
        "role": "viewer"
    }
    response = await client.post(
        f"/spaces/documents/{document_id}/members",
        json=payload,
        headers=auth_headers_2
    )
    assert response.status_code == 404

async def test_document_member_add_member_not_found(client, auth_headers,setup_document):
    document_id = setup_document['id']
    payload = {
        "email": "not_found@gmail.com",
        "role": "viewer"
    }
    response = await client.post(
        f"/spaces/documents/{document_id}/members",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 404

async def test_document_member_add_invalid_email(client, auth_headers,setup_document):
    document_id = setup_document['id']

    payload = {
        "email": "not_found@gmail",
        "role": "viewer"
    }

    response = await client.post(
        f"/spaces/documents/{document_id}/members",
        json=payload,
        headers=auth_headers
    )

    assert response.status_code == 422

async def test_document_member_add_success_already_member(client, auth_headers,setup_document,setup_test_user_2):
    document_id = setup_document['id']
    payload = {
        "email":setup_test_user_2["email"],
        "role": "viewer"
    }
    response = await client.post(
        f"/spaces/documents/{document_id}/members",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 201

    payload = {
        "email":setup_test_user_2["email"],
        "role": "editor"
    }
    response = await client.post(
        f"/spaces/documents/{document_id}/members",
        json=payload,
        headers=auth_headers
    )
    assert response.status_code == 409

async def test_get_all_shared_documents_success(client, auth_headers_2):

    response = await client.get(
        f"/spaces/shared/documents",
        headers=auth_headers_2
    )
    print(response.json())
    assert response.status_code == 200

async def test_document_member_update_success(client, auth_headers,setup_document_member):
    document_id = setup_document_member["document"]["id"]

    
    member_user_id=setup_document_member["user"]["id"]
    print()
    payload = {
        "role": "editor"
    }
    response = await client.patch(
        f"/spaces/documents/{document_id}/members/{member_user_id}",
        json=payload,
        headers=auth_headers
    )
    print(response.json())
    assert response.status_code == 200

async def test_document_member_update_member_not_exist(client, auth_headers,setup_document,setup_test_user_2):
    document_id = setup_document['id']
    
    member_user_id=setup_test_user_2['id']
    print()
    payload = {
        "role": "editor"
    }
    response = await client.patch(
        f"/spaces/documents/{document_id}/members/{member_user_id}",
        json=payload,
        headers=auth_headers
    )
    print(response.json())
    assert response.status_code == 404

async def test_document_member_update_document_not_exist(client, auth_headers,setup_document_member):
    document_id = uuid.uuid4()
    
    member_user_id=setup_document_member["user"]["id"]
    print()
    payload = {
        "role": "editor"
    }
    response = await client.patch(
        f"/spaces/documents/{document_id}/members/{member_user_id}",
        json=payload,
        headers=auth_headers
    )
    print(response.json())
    assert response.status_code == 404

async def test_document_member_update_unauthorized(client, auth_headers_2,setup_test_user_2,setup_document_member):
    document_id = setup_document_member["document"]["id"]
    
    member_user_id=setup_test_user_2['id']
    print()
    payload = {
        "role": "editor"
    }
    response = await client.patch(
        f"/spaces/documents/{document_id}/members/{member_user_id}",
        json=payload,
        headers=auth_headers_2
    )
    print(response.json())
    assert response.status_code == 404

async def test_get_all_shared_documents_empty(client, auth_headers_2):

    response = await client.get(
        f"/spaces/shared/documents",
        headers=auth_headers_2
    )

    assert response.status_code == 200
    assert response.json()["data"]==[]

async def test_get_all_shared_documents_success(client, auth_headers_2):

    response = await client.get(
        f"/spaces/shared/documents",
        headers=auth_headers_2
    )

    assert response.status_code == 200

async def test_get_shared_document_by_id_success(client, auth_headers_2,setup_document_member):
    document_id=setup_document_member["document"]["id"]
    response = await client.get(
        f"/spaces/shared/documents/{document_id}",
        headers=auth_headers_2
    )
    print(response.json())
    assert response.status_code == 200

async def test_get_shared_document_by_id_document_not_exist(client, auth_headers_2):
    document_id=uuid.uuid4()
    response = await client.get(
        f"/spaces/shared/documents/{document_id}",
        headers=auth_headers_2
    )
    print(response.json())
    assert response.status_code == 404

async def test_get_shared_document_by_id_unauthorized(client, auth_headers,setup_document_member):
    document_id=setup_document_member["document"]["id"]
    response = await client.get(
        f"/spaces/shared/documents/{document_id}",
        headers=auth_headers
    )
    print(response.json())
    assert response.status_code == 404

async def test_get_shared_document_by_id_invalid_id(client, auth_headers_2):
    document_id="invalid"
    response = await client.get(
        f"/spaces/shared/documents/{document_id}",
        headers=auth_headers_2
    )
    print(response.json())
    assert response.status_code == 422