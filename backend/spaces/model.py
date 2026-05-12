from shared.database import Base
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy import Index
import uuid
import enum
from datetime import datetime, timezone


# Enums
class DocumentType(enum.Enum):
    note = "note"
    task = "task"


class MemberRole(enum.Enum):
    editor = "editor"
    viewer = "viewer"


# Space Structure
class Space(Base):
    __tablename__ = "spaces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    __table_args__ = (
        Index('idx_spaces_owner_name', 'owner_id', 'name'),
    )

# Documents Structure
class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    space_id = Column(UUID(as_uuid=True), ForeignKey("spaces.id", ondelete="CASCADE"), nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    type = Column(Enum(DocumentType), nullable=False)
    content = Column(JSONB, default=None)
    parent_document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), default=None)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    __table_args__ = (
    Index('idx_documents_space_title', 'space_id', 'title'),
    )

# Document Members Structure
class DocumentMember(Base):
    __tablename__ = "document_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(Enum(MemberRole), nullable=False)
    permissions = Column(JSONB, default=None)
    invited_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc), onupdate= datetime.now(timezone.utc))

    __table_args__ = (UniqueConstraint("document_id", "user_id"),)


# Space Members Structure
class SpaceMember(Base):
    __tablename__ = "space_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    space_id = Column(UUID(as_uuid=True), ForeignKey("spaces.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(Enum(MemberRole), nullable=False)
    permissions = Column(JSONB, default=None)
    invited_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    __table_args__ = (UniqueConstraint("space_id", "user_id"),)