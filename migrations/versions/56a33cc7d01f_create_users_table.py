"""create users table

Revision ID: 56a33cc7d01f
Revises: 
Create Date: 2023-04-15 16:07:27.633934

"""
from email.policy import default
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid

# revision identifiers, used by Alembic.
revision = '56a33cc7d01f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('users',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('email', sa.String(20), nullable=False),
        sa.Column('coins', sa.Float, default=0),
        sa.Column('is_premium', sa.Boolean, default=False),
        sa.Column('premium_since', sa.TIMESTAMP, nullable=True),
        sa.Column('premium_days', sa.Integer, nullable=True),
        sa.Column('is_deleted', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_onupdate=sa.func.now())
    )


def downgrade() -> None:
    op.drop_table('users')
