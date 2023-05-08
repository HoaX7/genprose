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
    keywords = Column(JSONB, server_default="[]")
    transcript = Column(JSONB, server_default="")
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
        content = kwargs.get("content") or []
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
            keywords=[],
            transcript=""
        )
        session.add(content)
        session.commit()
        session.refresh(content)
        result = {"id": content.id}
        return result


def get_by_id(id: str, is_private = False):
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
                    Content.keywords,
                    Content.transcript
                )
                .filter_by(id=uuid.UUID(id))
                .filter_by(is_private=is_private)
                .one()
            )
            res = result._asdict()
            res["id"] = res["id"].hex
            res["user_id"] = res["user_id"].hex
            return res
    except Exception as e:
        print("models.Content.get_by_id: Failed", e)
        return None


def get_by_user_id(user_id: str, **kwargs):
    id = kwargs.get("id")
    content_type = kwargs.get("content_type")
    status = kwargs.get("status")
    with Session() as session:
        query = session.query(
            Content.id,
            Content.args,
            Content.content,
            Content.content_type,
            Content.status,
            Content.user_id,
            Content.is_private,
            Content.keywords,
            Content.transcript
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
                Content.keywords.label("keywords"),
                Content.transcript.label("transcript")
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


def update_content(id: str, data, task_completed = False):
    print(f"updating contents 'content' column for id: {id} data: {json.dumps(data)}")
    with Session() as session:
        task_completed_stmt = ""
        if task_completed == True:
            task_completed_stmt = f"status = '{PROGRESSIVE_STATUS.COMPLETED}',"
        statement = sql.text(
            f"UPDATE contents SET {task_completed_stmt} content = :data || content WHERE id = :id"
        )
        session.execute(statement, {"data": json.dumps(data), "id": str(id)})
        session.commit()

