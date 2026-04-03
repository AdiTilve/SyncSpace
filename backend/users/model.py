from shared.database import Base
from sqlalchemy import Column, String,Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

# User Structure
class User(Base):
    __tablename__="users"

    id=Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    first_name= Column(String(50),nullable=False)
    last_name=Column(String(50),nullable=False)
    
    email=Column(String(255),unique=True,index=True,nullable=False)
    password_hash=Column(String(255),nullable=False)
    
    is_active=Column(Boolean,default=True)
    is_deleted=Column(Boolean,default=False)

    last_login=Column(DateTime,nullable=True)
    created_at=Column(DateTime,nullable=False, default=datetime.utcnow)
    updated_at=Column(DateTime,nullable=False, default=datetime.utcnow,onupdate=datetime.utcnow)
    