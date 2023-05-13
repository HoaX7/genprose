from __future__ import annotations
from email.policy import default
from tkinter import E

# from schema import Schema
from lib.Database.index import alchemy_database as db
from sqlalchemy import (
    Table,
    Column,
    String,
    MetaData,
    Boolean,
    TIMESTAMP,
    Integer,
    DateTime,
    func,
    Float
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session 
from sqlalchemy.dialects.postgresql import UUID
import uuid

BaseModel = declarative_base()


class User(BaseModel):
    __tablename__ = "users"

    id = Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column("email", String)
    coins = Column("coins", Float, default=0)
    is_premium = Column("is_premium", Boolean, default=False)
    premium_since = Column("premium_since", TIMESTAMP)
    premium_days = Column("premium_days", Integer)
    is_deleted = Column("is_deleted", Boolean, default=False)
    created_at = Column(
        "created_at", DateTime(timezone=True), server_default=func.now()
    )
    updated_at = Column(
        "updated_at", DateTime(timezone=True), server_onupdate=func.now()
    )


Session = scoped_session(sessionmaker(bind=db))

# BaseModel.metadata.create_all(db)


def create(email: str) -> None:
    with Session() as session:
        user = User(email=email)
        session.add(user)
        session.commit()

        session.refresh(user)
        result = dict(
            id=user.id.hex,
            email=user.email,
            is_premium=user.is_premium,
            premium_days=user.premium_days,
            premium_since=user.premium_since,
            coins=user.coins
        )
        return result


def find(email: str) -> User:
    session = Session()
    try:
        result = (
            session.query(
                User.id.label("id"),
                User.email.label("email"),
                User.is_premium.label("is_premium"),
                User.premium_days.label("premium_days"),
                User.premium_since.label("premium_since"),
                User.coins.label("coins")
            )
            .filter_by(email=email)
            .filter_by(is_deleted=False)
            .one()
        )._asdict()

        result["id"] = result["id"].hex
    except Exception as e:
        print(e)
        result = None

    session.close()

    return result
