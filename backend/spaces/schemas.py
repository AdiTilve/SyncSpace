from pydantic import BaseModel,Field, EmailStr
from datetime import datetime
from uuid import UUID
from typing import Optional
from model import MemberRole, DocumentType


# Space Schemas 

class SpaceCreate(BaseModel):
    name: str = Field(..., min_length=1)

class SpaceUpdate(BaseModel):
    name: str = Field(..., min_length=1)

class SpaceData(BaseModel):
    id: UUID
    name: str
    created_at: datetime
    is_owner: bool = None
    role: Optional[MemberRole] = None

class SpaceResponse(BaseModel):
    status_code: int
    message: str
    data: SpaceData

class SpaceListResponse(BaseModel):
    status_code: int
    message: str
    data: list[SpaceData]

class SpaceDeleteResponse(BaseModel):
    status_code: int
    message: str


# Document Schemas
class DocumentCreate(BaseModel):
    type : DocumentType
    title : str = Field(..., min_length=1)
    content  : Optional[dict] = None
    parent_document_id : Optional[UUID] = None

class DocumentUpdate(BaseModel):
    title  : Optional[str] = None
    content  : Optional[dict] = None

class DocumentData(BaseModel):
    id: UUID
    type : DocumentType
    title : str 
    is_owner: bool
    content  : Optional[dict] = None
    created_at: datetime
    role: Optional[MemberRole] = None
    parent_document_id : Optional[UUID] = None
    
class DocumentResponse(BaseModel):
    status_code : int
    message : str
    data : DocumentData

class DocumentListResponse(BaseModel):
    status_code : int
    message : str
    data : list[DocumentData]

class DocumentDeleteResponse(BaseModel):
    status_code : int
    message : str


# Share Document Members

class DocumentMemberCreate(BaseModel):
    email : EmailStr
    role : MemberRole

class DocumentMemberUpdate(BaseModel):
    role : MemberRole 

class DocumentMemberData(BaseModel):
    id: UUID
    email: EmailStr
    role: MemberRole
    created_at: datetime

class DocumentMemberResponse(BaseModel):
    status_code: int
    message: str
    data: DocumentMemberData

class DocumentMemberListResponse(BaseModel):
    status_code: int
    message: str
    data: list[DocumentMemberData]

class DocumentMemberDeleteResponse(BaseModel):
    status_code : int
    message : str

# Space Member Schemas

class SpaceMemberCreate(BaseModel):
    user_id: UUID
    role: MemberRole

class SpaceMemberUpdate(BaseModel):
    role: MemberRole

class SpaceMemberData(BaseModel):
    id: UUID
    user_id: UUID
    role: MemberRole
    invited_by: UUID
    created_at: datetime

class SpaceMemberResponse(BaseModel):
    status_code: int
    message: str
    data: SpaceMemberData

class SpaceMemberListResponse(BaseModel):
    status_code: int
    message: str
    data: list[SpaceMemberData]