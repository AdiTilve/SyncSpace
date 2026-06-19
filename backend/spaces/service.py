from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from users.repository import get_user_by_email
from spaces.schemas import (SpaceCreate, SpaceUpdate, DocumentCreate, DocumentUpdate, 
    DocumentMemberCreate, DocumentMemberUpdate)
from users.repository import get_user_by_userId
from uuid import UUID
from spaces.repository import (
    get_space_by_name, create_space, get_space_by_id, update_space, create_document,
    get_document_by_name, delete_space, delete_document_by_space_id, fetch_spaces_from_db, 
    fetch_all_shared_spaces_from_db,get_shared_space_by_id, update_document, get_document_by_id, 
    delete_document, get_all_documents,get_all_shared_documents, get_shared_document_by_id,
    document_member_add, get_document_member, document_member_update, document_member_remove,
    get_all_document_member)


# Space related services

async def create_space_service(db:AsyncSession, space_data:SpaceCreate,user_id:UUID):
    
    space_data.name = space_data.name.strip()

    if len(space_data.name)<1:
        raise HTTPException(status_code=422,detail="Space name cannot be empty")
    
    existing_space= await get_space_by_name(db,space_data.name,user_id)
    
    if existing_space:
        raise HTTPException(status_code=409,detail="Space already exists")
    
    
    result=await create_space(db,space_data,user_id)
    
    return result

async def update_space_service(db:AsyncSession, space_data:SpaceUpdate, space_id: UUID,user_id:UUID):

    space_data.name = space_data.name.strip()

    if len(space_data.name)<1:
        raise HTTPException(status_code=422,detail="Space name cannot be empty")
    
    space_existence= await get_space_by_id(db,space_id,user_id)

    if not space_existence["space"]:
        raise HTTPException(status_code=404,detail="Space not found")
    
    
    existing_space= await get_space_by_name(db,space_data.name,user_id)
    
    if existing_space:
        raise HTTPException(status_code=409,detail="Space already exists")
    
    result= await update_space(db,space_id,space_data)

    return result

async def delete_space_service(db: AsyncSession, space_id: UUID, user_id: UUID):
    space_existence= await get_space_by_id(db,space_id,user_id)

    if not space_existence["space"]:
        raise HTTPException(status_code=404,detail="Space not found")
    
    await delete_document_by_space_id(db, space_id)
    result = await delete_space(db, space_id)
    return result

async def get_space_by_id_service(db: AsyncSession, space_id: UUID, user_id: UUID):
    result = await get_space_by_id(db, space_id, user_id)
    if not result["space"]:
        raise HTTPException(status_code=404,detail="Space does not exists")
    return result

async def get_shared_space_by_id_service(db: AsyncSession, space_id: UUID, user_id: UUID):
    result = await get_shared_space_by_id(db, space_id, user_id)
    return result

async def get_all_spaces_service(db: AsyncSession, user_id: UUID):
    result = await fetch_spaces_from_db(db, user_id)
    return result

async def get_all_shared_spaces_service(db: AsyncSession,user_id: UUID):
    result = await fetch_all_shared_spaces_from_db(db,user_id)
    return result


# Document related services

async def create_document_service(db:AsyncSession, document_data: DocumentCreate, space_id:UUID, user_id:UUID):
    document_data.title = document_data.title.strip()

    if len(document_data.title)<1:
        raise HTTPException(status_code=422,detail="Document name cannot be empty")
    
    space_existence= await get_space_by_id(db,space_id,user_id)

    if not space_existence["space"]:
        raise HTTPException(status_code=404,detail="Document not found")
    
    existing_document= await get_document_by_name(db,document_data.title,space_id)
    
    if existing_document:
        raise HTTPException(status_code=409,detail="Document already exists")
    
    result = await create_document(db,document_data, space_id, user_id)

    return result

async def update_document_service(db:AsyncSession, document_data:DocumentUpdate, space_id: UUID, document_id:UUID, user_id: UUID):
    if document_data.title is not None:
        document_data.title = document_data.title.strip()

    if len(document_data.title)<1:
        raise HTTPException(status_code=422,detail="Document name cannot be empty")
    
    space_existence= await get_space_by_id(db,space_id,user_id)

    if not space_existence["space"]:
        raise HTTPException(status_code=404,detail="Space not found")
    
    document_existence = await get_document_by_id(db, document_id, user_id)

    if not document_existence["document"]:
        raise HTTPException(status_code=404,detail="Document not found")
    
    if not document_existence["is_owner"]:
        raise HTTPException(status_code=403,detail="Unauthorized User Request")
    
    existing_document= await get_document_by_name(db,document_data.title,space_id)
    
    if existing_document and existing_document.id != document_id:
        raise HTTPException(status_code=409,detail="Document already exists")
    
    result= await update_document(db,document_id,document_data)

    return result

async def delete_document_service(db: AsyncSession,space_id:UUID, document_id: UUID, user_id:UUID):
    
    space_existence= await get_space_by_id(db,space_id,user_id)

    if not space_existence["space"]:
        raise HTTPException(status_code=404,detail="Space not found")
    
    document_existence = await get_document_by_id(db, document_id, user_id)

    if not document_existence["document"]:
        raise HTTPException(status_code=404,detail="Document not found")
    
    if not document_existence["is_owner"]:
        raise HTTPException(status_code=403,detail="Unauthorized User Request")
    
    result = await delete_document(db,document_id,space_id)
    return result

async def get_document_by_id_service(db: AsyncSession, document_id: UUID, user_id: UUID):
    result = await get_document_by_id(db, document_id, user_id)
    if not result["document"]:
        raise HTTPException(status_code=404,detail="Document does not exists")
    return result

async def get_all_documents_service(db: AsyncSession, space_id: UUID, user_id: UUID):
    result = await get_all_documents(db, space_id, user_id)
    return result

async def get_shared_document_by_id_service(db: AsyncSession, document_id: UUID, user_id: UUID):
    result = await get_shared_document_by_id(db, document_id, user_id)
    if not result["document"]:
        raise HTTPException(status_code=404,detail="Document does not exists")
    return result

async def get_all_shared_documents_service(db: AsyncSession,user_id: UUID):
    result = await get_all_shared_documents(db,user_id)
    return result

async def document_member_add_service(db: AsyncSession, document_member_data : DocumentMemberCreate, document_id: UUID, user_id: UUID):
    document_existence = await get_document_by_id(db, document_id, user_id)

    if not document_existence["document"]:
        raise HTTPException(status_code=404,detail="Document not found")
    
    if not document_existence["is_owner"]:
        raise HTTPException(status_code=403,detail="Unauthorized User Request")
    
    existing_user = await get_user_by_email(db,document_member_data.email)
    
    if not existing_user:
        raise HTTPException(status_code=404,detail="User doesn't exist")
    
    existing_member = await get_document_member(db, document_id, existing_user.id)

    if existing_member:
        raise HTTPException(status_code=409,detail="User already a member")
    
    result = await document_member_add(db,document_member_data, document_id, existing_user.id, user_id)
    return {
        "member": result,
        "email": existing_user.email
        }

async def document_member_update_service(db: AsyncSession, document_member_data: DocumentMemberUpdate, document_id:UUID, member_user_id:UUID, user_id:UUID):
    document_existence = await get_document_by_id(db, document_id, user_id)

    if not document_existence["document"]:
        raise HTTPException(status_code=404,detail="Document not found")
    
    if not document_existence["is_owner"]:
        raise HTTPException(status_code=403,detail="Unauthorized User Request")
    
    existing_member = await get_document_member(db, document_id, member_user_id)
    
    if not existing_member:
        raise HTTPException(status_code=404,detail="User not found")
    
    result = await document_member_update(db,document_member_data, document_id, member_user_id)
    
    user = await get_user_by_userId(db, member_user_id)
    return {
        "member": result,
        "email": user.email
        }

async def document_member_remove_service(db: AsyncSession, document_id : UUID, member_user_id:UUID, user_id: UUID):
    document_existence = await get_document_by_id(db, document_id, user_id)

    if not document_existence["document"]:
        raise HTTPException(status_code=404,detail="Document not found")
    
    if not document_existence["is_owner"]:
        raise HTTPException(status_code=403,detail="Unauthorized User Request")
    
    existing_member = await get_document_member(db, document_id, member_user_id)
    
    if not existing_member:
        raise HTTPException(status_code=404,detail="User not found")
    
    await document_member_remove(db,document_id, member_user_id)

    return None

async def get_all_document_member_service(db: AsyncSession, document_id: UUID):
    result = await get_all_document_member(db, document_id)
    return result