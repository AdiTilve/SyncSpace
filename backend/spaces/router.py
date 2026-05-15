from fastapi import APIRouter,Depends
from sqlalchemy.ext.asyncio import AsyncSession
from spaces.schemas import (SpaceCreate, SpaceDeleteResponse, SpaceUpdate, 
    SpaceListResponse, SpaceResponse,SpaceData, DocumentCreate, DocumentResponse,
    DocumentListResponse, DocumentData, DocumentUpdate,DocumentDeleteResponse,
    DocumentMemberCreate,DocumentMemberResponse,DocumentMemberUpdate, DocumentMemberData,
    DocumentMemberListResponse,DocumentMemberDeleteResponse)
from spaces.service import (create_space_service,get_all_spaces_service,get_space_by_id_service,
    update_space_service,delete_space_service, get_all_shared_spaces_service, get_shared_space_by_id_service,
    create_document_service,get_all_documents_service, get_all_shared_documents_service, update_document_service,
    delete_document_service, document_member_add_service, get_all_document_member_service, document_member_update_service,
    document_member_remove_service, get_document_by_id_service, get_shared_document_by_id_service)
from shared.database import get_db
from auth.dependencies import get_current_user
from uuid import UUID
from users.model import User
router = APIRouter()

@router.post("/documents/{document_id}/members", response_model=DocumentMemberResponse, status_code=201)
async def document_member_add(document_id:UUID,document_member_data:DocumentMemberCreate,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await document_member_add_service(db, document_member_data, document_id, current_user.id)
    return DocumentMemberResponse(status_code=201,message="Document member added successfully",data=DocumentMemberData(
    id=result["member"].id,
    email=result["email"],
    role=result["member"].role,
    created_at=result["member"].created_at
))

@router.get("/documents/{document_id}/members", response_model=DocumentMemberListResponse)
async def get_all_document_member(document_id:UUID,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await get_all_document_member_service(db, document_id)
    return DocumentMemberListResponse(status_code=200,message="Document members retrieved successfully",data=[

        DocumentMemberData(
            id=member.id,
            email=email,
            role=member.role,
            created_at=member.created_at
        )
        for member, email in result
    ])

@router.patch("/documents/{document_id}/members/{member_user_id}", response_model=DocumentMemberResponse)
async def document_member_update(document_id:UUID,member_user_id:UUID,document_member_data:DocumentMemberUpdate,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await document_member_update_service(db, document_member_data, document_id, member_user_id, current_user.id)
    return DocumentMemberResponse(status_code=200,message="Document member updated successfully",data=DocumentMemberData(
    id=result["member"].id,
    email=result["email"],
    role=result["member"].role,
    created_at=result["member"].created_at
))

@router.delete("/documents/{document_id}/members/{member_user_id}", response_model=DocumentMemberDeleteResponse)
async def document_member_remove(document_id:UUID,member_user_id:UUID,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    await document_member_remove_service(db, document_id, member_user_id, current_user.id)
    return DocumentMemberDeleteResponse(status_code=200,message="Document member deleted successfully")

@router.post("/", response_model=SpaceResponse, status_code=201)
async def create_space(space_data:SpaceCreate,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await create_space_service(db, space_data,current_user.id)
    return SpaceResponse(status_code=201,message="Space created successfully",data=result)

@router.get("/", response_model=SpaceListResponse)
async def get_all_spaces(db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await get_all_spaces_service(db, current_user.id)
    return SpaceListResponse(status_code=200,message="Spaces data retrieved successfully",data=[SpaceData(
            id=r["space"].id,
            name=r["space"].name,
            created_at=r["space"].created_at,
            is_owner=r["is_owner"],
            role=r["role"]
        )
        for r in result
    ])

@router.get("/shared", response_model=SpaceListResponse)
async def get_all_shared_spaces(db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await get_all_shared_spaces_service(db, current_user.id)
    return SpaceListResponse(status_code=200,message="Shared spaces data retrieved successfully",data=[SpaceData(
            id=r["space"].id,
            name=r["space"].name,
            created_at=r["space"].created_at,
            is_owner=r["is_owner"],
            role=r["role"]
        )
        for r in result
    ])

@router.get("/shared/documents", response_model=DocumentListResponse)
async def get_all_shared_documents(db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await get_all_shared_documents_service(db,current_user.id)
    return DocumentListResponse(status_code=200,message="Shared document data retrieved successfully",data=[DocumentData(
            id=r["document"].id,
            type=r["document"].type,
            title=r["document"].title,
            is_owner=r["is_owner"],
            created_at=r["document"].created_at,
            role=r["role"],
            parent_document_id=r["document"].parent_document_id
        )
        for r in result
    ])

@router.get("/shared/{space_id}", response_model=SpaceResponse)
async def get_shared_space_by_id(space_id:UUID,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await get_shared_space_by_id_service(db, space_id, current_user.id)
    return SpaceResponse(status_code=200,message="Space data retrieved successfully",data=SpaceData(
            id=result["space"].id, 
            name=result["space"].name,
            created_at=result["space"].created_at,
            is_owner=result["is_owner"],
            role=result["role"]
         ))


@router.get("/shared/documents/{document_id}", response_model=DocumentResponse)
async def get_shared_document_by_id(document_id:UUID, db:AsyncSession=Depends(get_db), current_user: User=Depends(get_current_user)):
    result = await get_shared_document_by_id_service(db, document_id, current_user.id)
    return DocumentResponse(status_code=200, message="Document retrieved successfully", data=DocumentData(
        id=result["document"].id,
        type=result["document"].type,
        title=result["document"].title,
        is_owner=result["is_owner"],
        created_at=result["document"].created_at,
        role=result["role"],
        parent_document_id=result["document"].parent_document_id
    ))

@router.get("/{space_id}/documents/{document_id}", response_model=DocumentResponse)
async def get_document_by_id(space_id:UUID, document_id:UUID, db:AsyncSession=Depends(get_db), current_user: User=Depends(get_current_user)):
    result = await get_document_by_id_service(db, document_id, current_user.id)
    return DocumentResponse(status_code=200, message="Document retrieved successfully", data=DocumentData(
        id=result["document"].id,
        type=result["document"].type,
        title=result["document"].title,
        is_owner=result["is_owner"],
        created_at=result["document"].created_at,
        role=result["role"],
        parent_document_id=result["document"].parent_document_id
    ))


@router.get("/{space_id}", response_model=SpaceResponse)
async def get_space_by_id(space_id:UUID,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await get_space_by_id_service(db, space_id, current_user.id)
    return SpaceResponse(status_code=200,message="Space data retrieved successfully",data=SpaceData(
            id=result["space"].id, 
            name=result["space"].name,
            created_at=result["space"].created_at,
            is_owner=result["is_owner"],
            role=result["role"]
         ))


@router.patch("/{space_id}", response_model=SpaceResponse)
async def update_space(space_id:UUID,space_data:SpaceUpdate,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await update_space_service(db, space_data, space_id,current_user.id)
    return SpaceResponse(status_code=200,message="Space updated successfully",data=result)

@router.delete("/{space_id}", response_model=SpaceDeleteResponse)
async def delete_space(space_id:UUID,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    await delete_space_service(db, space_id,current_user.id)
    return SpaceDeleteResponse(status_code=200,message="Space deleted successfully")

@router.post("/{space_id}/documents", response_model=DocumentResponse, status_code=201)
async def create_document(space_id:UUID,document_data:DocumentCreate,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await create_document_service(db, document_data, space_id, current_user.id)
    return DocumentResponse(status_code=201,message="Document created successfully", data=result)

@router.get("/{space_id}/documents", response_model=DocumentListResponse)
async def get_all_document(space_id:UUID,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await get_all_documents_service(db, space_id, current_user.id)
    return DocumentListResponse(status_code=200,message="Document data retrieved successfully",data=[DocumentData(
            id=r["document"].id,
            type=r["document"].type,
            title=r["document"].title,
            is_owner=r["is_owner"],
            created_at=r["document"].created_at,
            role=r["role"],
            parent_document_id=r["document"].parent_document_id
        )
        for r in result
    ])


@router.patch("/{space_id}/documents/{document_id}", response_model=DocumentResponse)
async def update_document(space_id:UUID,document_id:UUID,document_data:DocumentUpdate,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    result = await update_document_service(db, document_data, space_id, document_id, current_user.id)
    return DocumentResponse(status_code=200,message="Document updated successfully",data=result)

@router.delete("/{space_id}/documents/{document_id}", response_model=DocumentDeleteResponse)
async def delete_document(space_id:UUID,document_id:UUID,db:AsyncSession=Depends(get_db),current_user: User=Depends(get_current_user)):
    await delete_document_service(db,space_id, document_id, current_user.id)
    return DocumentDeleteResponse(status_code=200,message="Document deleted successfully")
