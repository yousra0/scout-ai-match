
"""Initial migration

Revision ID: 5b6982a4a7e9
Revises: 
Create Date: 2023-04-14 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '5b6982a4a7e9'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create enum type for user roles
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('role', sa.Enum('PLAYER', 'CLUB', 'AGENT', 'COACH', 'ADMIN', name='userrole'), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('is_superuser', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    
    # Other tables
    # ...


def downgrade():
    op.drop_table('users')
    # Drop other tables
    # ...
    op.execute("DROP TYPE userrole")
