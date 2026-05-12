from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import  select, update , delete
from model import Space, SpaceMember, Document, DocumentMember
from users.model import User
from uuid import UUID
from schemas import SpaceCreate, SpaceUpdate, DocumentCreate, DocumentUpdate
from schemas import SpaceMemberUpdate, DocumentMemberUpdate, SpaceMemberCreate, DocumentMemberCreate

# Space methods
async def create_space(db: AsyncSession, space_data: SpaceCreate, user_id: UUID):
    new_space = Space(
        name = space_data.name,
        owner_id = user_id
    )

    db.add(new_space)
    await db.commit()
    await db.refresh(new_space)
    return new_space

async def get_space_by_id(db: AsyncSession, space_id: UUID, user_id: UUID):
    result= await db.execute(
        select(Space).where(Space.id==space_id, Space.is_deleted == False, Space.owner_id == user_id)
        )
    space = result.scalar_one_or_none()
    return {
        "space": space,
        "is_owner": True,
        "role": None
    }

async def get_shared_space_by_id(db: AsyncSession, space_id: UUID, user_id: UUID):
    result = await db.execute(
        select(Space, SpaceMember.role)
        .join(SpaceMember, SpaceMember.space_id == Space.id)
        .where(
            SpaceMember.space_id == space_id,
            SpaceMember.user_id == user_id,
            Space.is_deleted == False
        )
    )
    row = result.first()    

    if not row:
        return {
            "space": None,
            "is_owner": False,
            "role": None
        }
    
    space, role = row
    return {
        "space": space,
        "is_owner": False,
        "role": role
    }

async def get_all_spaces(db: AsyncSession, user_id: UUID):
    result= await db.execute(
        select(Space).where(Space.owner_id == user_id, Space.is_deleted == False)
    )
    spaces = result.scalars().all()
    return [{"space": space, "is_owner": True, "role": None}
            for space in spaces
            ]
    
async def get_all_shared_spaces(db: AsyncSession,user_id: UUID):
    result = await db.execute(
        select(Space, SpaceMember.role)
        .join(SpaceMember, SpaceMember.space_id == Space.id)
        .where(
            SpaceMember.user_id == user_id,
            Space.is_deleted == False
        )
    )
    rows = result.all()
    return [{"space": space, "is_owner": False, "role": role}
            for space, role in rows
            ]

async def update_space(db: AsyncSession, space_id: UUID, space_data: SpaceUpdate):
    result = await db.execute(
        select(Space)
        .where(Space.id == space_id, Space.is_deleted == False)
    )
    space = result.scalar_one_or_none()
    
    if space:
        space.name = space_data.name
        await db.commit()
        await db.refresh(space)
    return space

async def delete_space(db: AsyncSession, space_id: UUID):

    result = await db.execute(
        select(Space)
        .where(Space.id == space_id, Space.is_deleted == False)
    )
    space = result.scalar_one_or_none()
    
    if space:
        space.is_deleted = True
        await db.commit()
    return space

async def get_space_by_name(db: AsyncSession, name:str, user_id:UUID):
    result= await db.execute(
        select(Space).where(Space.name==name, Space.is_deleted == False, Space.owner_id == user_id)
        )
    return result.scalar_one_or_none()
    
# Document methods
async def create_document(db: AsyncSession, document_data: DocumentCreate, space_id: UUID, user_id: UUID):
    new_document= Document(
        space_id = space_id,
        owner_id = user_id,
        title = document_data.title,
        type = document_data.type,
        content = document_data.content,
        parent_document_id=document_data.parent_document_id
    )

    db.add(new_document)
    await db.commit()
    await db.refresh(new_document)
    return new_document

async def get_document_by_id(db: AsyncSession, document_id: UUID, user_id: UUID):
    result= await db.execute(
        select(Document).where(Document.id==document_id, Document.is_deleted == False, Document.owner_id == user_id)
        )
    document = result.scalar_one_or_none()
    return {
        "document": document,
        "is_owner": True,
        "role": None
    }

async def get_all_documents(db: AsyncSession, space_id: UUID, user_id: UUID):
    result= await db.execute(
        select(Document).where(Document.space_id == space_id, Document.owner_id == user_id, Document.is_deleted == False)
    )
    documents = result.all()
    return [{"document": document, "is_owner": True, "role": None}
            for document in documents
            ]

async def get_shared_document_by_id(db: AsyncSession, document_id: UUID, user_id: UUID):
    result = await db.execute(
        select(Document, DocumentMember.role)
        .join(DocumentMember, DocumentMember.document_id == Document.id)
        .where(
            DocumentMember.space_id == document_id,
            DocumentMember.user_id == user_id,
            Document.is_deleted == False
        )
    )
    row = result.first()    

    if not row:
        return {
            "document": None,
            "is_owner": False,
            "role": None
        }
    
    document, role = row
    return {
        "document": document,
        "is_owner": False,
        "role": role
    }
async def get_all_shared_documents(db: AsyncSession,user_id: UUID):
    result = await db.execute(
        select(Document, DocumentMember.role)
        .join(DocumentMember, DocumentMember.document_id == Document.id)
        .where(
            DocumentMember.user_id == user_id,
            Document.is_deleted == False
        )
    )
    rows = result.all()
    return [{"document": document, "is_owner": False, "role": role}
            for document, role in rows
            ]

async def get_document_by_name(db: AsyncSession, name:str, space_id:UUID):
    result= await db.execute(
        select(Document).where(Document.title==name, Document.is_deleted == False, Document.space_id == space_id)
        )
    return result.scalar_one_or_none()

async def update_document(db: AsyncSession, document_id: UUID, document_data: DocumentUpdate):
    result = await db.execute(
        select(Document)
        .where(Document.id == document_id, Document.is_deleted == False)
    )
    document = result.scalar_one_or_none()
    
    if document:
        document.title = document_data.title
        await db.commit()
        await db.refresh(document)
    return document

async def delete_document(db: AsyncSession, document_id: UUID,space_id:UUID):

    result = await db.execute(
        select(Document)
        .where(Document.id == document_id, Document.space_id==space_id,Document.is_deleted == False)
    )
    document = result.scalar_one_or_none()
    
    if document:
        document.is_deleted = True
        await db.commit()
    return document

async def delete_document_by_space_id(db:AsyncSession, space_id:UUID):
    await db.execute(
        update(Document)
        .where(Document.space_id == space_id)
        .values(is_deleted=True)
    )
    await db.commit()

# Space Member sharing
async def space_member_add(db: AsyncSession, space_member_data : SpaceMemberCreate, space_id: UUID, user_id: UUID):
    space_member=SpaceMember(
        space_id = space_id,
        user_id = space_member_data.user_id,
        role = space_member_data.role,
        invited_by = user_id
    )
    db.add(space_member)
    await db.commit()
    await db.refresh(space_member)
    return space_member

async def space_member_remove(db: AsyncSession,space_id : UUID, user_id: UUID):
    await db.execute(
        delete(SpaceMember)
        .where(SpaceMember.space_id == space_id, SpaceMember.user_id == user_id)
    )
    await db.commit()

async def space_member_update(db: AsyncSession, space_member_data : SpaceMemberUpdate, space_id: UUID, user_id: UUID):
    result = await db.execute(
        select(SpaceMember)
        .where(SpaceMember.space_id == space_id, SpaceMember.user_id == user_id)
    )
    space_member = result.scalar_one_or_none()
    
    if space_member:
        space_member.role = space_member_data.role
        await db.commit()
        await db.refresh(space_member)
    return space_member

async def get_space_member(db: AsyncSession, space_id:UUID, user_id: UUID):
    result = await db.execute(
        select(SpaceMember)
        .where(SpaceMember.space_id == space_id, SpaceMember.user_id == user_id)
    )
    return result.scalar_one_or_none


# Document Member sharing
async def document_member_add(db: AsyncSession, document_member_data : DocumentMemberCreate, document_id: UUID, member_user_id: UUID, user_id: UUID):
    document_member=DocumentMember(
        document_id = document_id,
        user_id = member_user_id,
        role = document_member_data.role,
        invited_by = user_id
    )
    db.add(document_member)
    await db.commit()
    await db.refresh(document_member)
    return document_member

async def document_member_remove(db: AsyncSession, document_id : UUID, user_id: UUID):
    await db.execute(
        delete(DocumentMember)
        .where(DocumentMember.document_id == document_id, DocumentMember.user_id == user_id)
    )
    await db.commit()

async def document_member_update(db: AsyncSession, document_member_data : DocumentMemberUpdate, document_id: UUID, user_id: UUID):
    result = await db.execute(
        select(DocumentMember)
        .where(DocumentMember.document_id == document_id, DocumentMember.user_id == user_id)
    )
    document_member = result.scalar_one_or_none()
    
    if document_member:
        document_member.role = document_member_data.role
        await db.commit()
        await db.refresh(document_member)
    return document_member

async def get_document_member(db: AsyncSession, document_id: UUID, user_id: UUID):
    result = await db.execute(
        select(DocumentMember)
        .where(DocumentMember.document_id == document_id, DocumentMember.user_id == user_id)
    )
    return result.scalar_one_or_none()

async def get_all_document_member(db: AsyncSession, document_id: UUID):
    result = await db.execute(
        select(DocumentMember,User.email)
        .join(User, User.id == DocumentMember.user_id)
        .where(DocumentMember.document_id == document_id)
    )
    return result.all()