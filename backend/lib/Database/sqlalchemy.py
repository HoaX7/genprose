from sqlalchemy import create_engine
import os

PG_USER = os.getenv("PG_USER")
PG_HOST = os.getenv("PG_HOST")
PG_PASSWORD = os.getenv("PG_PASSWORD")
PG_PORT = os.getenv("PG_PORT")
DB_NAME = os.getenv("DB_NAME")

db_string = f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{int(PG_PORT)}/{DB_NAME}"

print(db_string)
db = create_engine(db_string)
