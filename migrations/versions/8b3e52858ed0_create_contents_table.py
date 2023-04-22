"""create contents table

Revision ID: 8b3e52858ed0
Revises: 56a33cc7d01f
Create Date: 2023-04-15 16:14:53.762252

"""
from email.policy import default
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid


# revision identifiers, used by Alembic.
revision = "8b3e52858ed0"
down_revision = "56a33cc7d01f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "contents",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column(
            "user_id",
            UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="cascade"),
            nullable=False,
            index=True,
        ),
        sa.Column("args", JSONB(), nullable=True),
        sa.Column("content", JSONB(), nullable=True),
        sa.Column(
            "content_type",
            sa.Enum(
                "EXTRACT_AUDIO",
                "EXTRACT_KEYWORDS",
                "EXTRACT_CONTENT",
                "EXTRACT_TRANSCRIPT",
                name="content_type",
            ),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.Enum(
                "QUEUED",
                "INPROGRESS",
                "COMPLETED",
                "ERROR",
                "PRIORITY_QUEUE",
                name="status",
            ),
            default="QUEUED",
        ),
        sa.Column("transcript_model", sa.String(20), nullable=True),
        sa.Column("is_private", sa.Boolean, default=False),
        sa.Column("metadata", JSONB(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_onupdate=sa.func.now()
        ),
    )


def downgrade() -> None:
    op.execute("drop type status cascade")
    op.execute("drop type content_type cascade")
    op.drop_table("contents")
