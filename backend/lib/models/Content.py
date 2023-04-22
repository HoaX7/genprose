from asyncio.log import logger
from sqlalchemy import (
    Column,
    DateTime,
    Boolean,
    ForeignKey,
    Enum,
    func,
    update as query_builder_update,
    Text,
    sql,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, scoped_session
from datetime import datetime
from typing import Dict, Any
from lib.helpers.constants import TRANSCRIPTION_MODELS
from lib.helpers.constants import (
    CONTENT_TYPES,
    PROGRESSIVE_STATUS,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
from lib.Database.index import alchemy_database as db
from lib.models.User import User, BaseModel, Session
import json

# Base = declarative_base()


class Content(BaseModel):
    __tablename__ = "contents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="cascade"), nullable=False
    )
    content = Column(JSONB, server_default="{}")
    args = Column(JSONB)
    content_type = Column(
        Enum(
            CONTENT_TYPES.EXTRACT_AUDIO,
            CONTENT_TYPES.EXTRACT_CONTENT,
            CONTENT_TYPES.EXTRACT_KEYWORDS,
            CONTENT_TYPES.EXTRACT_TRANSCRIPT,
            name="content_type",
        )
    )
    status = Column(
        Enum(
            PROGRESSIVE_STATUS.QUEUED,
            PROGRESSIVE_STATUS.COMPLETED,
            PROGRESSIVE_STATUS.ERROR,
            PROGRESSIVE_STATUS.INPROGRESS,
            PROGRESSIVE_STATUS.PRIORITY_QUEUE,
            name="status",
        )
    )
    is_private = Column(Boolean, default=False)
    transcript_model = Column(
        Enum(TRANSCRIPTION_MODELS.ASSEMBLYAI, TRANSCRIPTION_MODELS.DEEPGRAM),
        name="transcript_model",
    )
    meta = Column(JSONB, name="metadata")
    # user = relationship(User, foreign_keys=[user_id])
    created_at = Column(
        "created_at", DateTime(timezone=True), server_default=func.now()
    )
    updated_at = Column(
        "updated_at", DateTime(timezone=True), server_onupdate=func.now()
    )


# Session = scoped_session(sessionmaker(bind=db))


def create(**kwargs):
    with Session() as session:
        content = kwargs.get("content") or {}
        status = kwargs.get("status") or PROGRESSIVE_STATUS.QUEUED
        content_type = kwargs.get("content_type") or CONTENT_TYPES.EXTRACT_AUDIO
        args = kwargs.get("args")
        user_id = kwargs.get("user_id")
        content = Content(
            user_id=user_id,
            content=content,
            args=args,
            content_type=content_type,
            status=status,
        )
        session.add(content)
        session.commit()
        session.refresh(content)
        result = {"id": content.id}
        return result


def get_by_id(id: str):
    try:
        with Session() as session:
            result = (
                session.query(
                    Content.id,
                    Content.args,
                    Content.content,
                    Content.content_type,
                    Content.status,
                    Content.user_id,
                    Content.is_private,
                )
                .filter_by(id=uuid.UUID(id))
                .one()
            )
            res = result._asdict()
            res["id"] = res["id"].hex
            res["user_id"] = res["user_id"].hex
            return res
    except Exception as e:
        print("models.Content.get_by_id: Failed", e)
        return None


def get_by_user_id(user_id: str, content_type="", id="", status=""):
    with Session() as session:
        query = session.query(
            Content.id,
            Content.args,
            Content.content,
            Content.content_type,
            Content.status,
            Content.user_id,
            Content.is_private,
        ).filter_by(user_id=uuid.UUID(user_id))
        if content_type:
            query = query.filter_by(content_type=content_type)
        if id:
            query = query.filter_by(id=uuid.UUID(id))
        if status:
            query = query.filter_by(status=status)
        query = query.order_by(Content.updated_at.desc())
        result = query.all()
        if result:
            return [
                dict(res._asdict(), id=res.id.hex, user_id=res.user_id.hex)
                for res in result
            ]
    return []


def get_rows_by_content_type(status: str, content_type: str):
    with Session() as session:
        result = (
            session.query(
                Content.id.label("id"),
                Content.args.label("args"),
                Content.content.label("content"),
                Content.content_type.label("content_type"),
                Content.status.label("status"),
                Content.is_private.label("is_private"),
                Content.user_id.label("user_id"),
            )
            .filter_by(status=status)
            .filter_by(content_type=content_type)
            .order_by(Content.updated_at.desc())
            .all()
        )
        if result:
            return [
                dict(res._asdict(), id=res.id.hex, user_id=res.user_id.hex)
                for res in result
            ]
        return []


def update(id: str, data: Dict):
    print(f"updating contents data: {json.dumps(data)} for id: {id}")
    with Session() as session:
        session.query(Content).filter_by(id=id).update(data)
        session.commit()
        return True


def update_content(id: str, data):
    print(f"updating contents 'content' column for id: {id} data: {json.dumps(data)}")
    with Session() as session:
        statement = sql.text(
            f"UPDATE contents SET content = content || :data WHERE id = :id"
        )
        session.execute(statement, {"data": json.dumps(data), "id": str(id)})
        session.commit()


# def update(unique_id: str, data: dict):
#     print("updating: ", data)
#     query_str = prepare_update_str(data)
#     data['unique_id'] = unique_id
#     data['updated_at'] = datetime.datetime.utcnow()
#     print(f"Executing update query: {query_str}")
#     print(f"Updating with values: {data}")
#     db_session.query(Content).filter_by(unique_id=unique_id).update(data)
#     db_session.commit()
