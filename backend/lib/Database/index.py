import lib.Database.sqlite as sqlite
from lib.Database.sqlalchemy import db as sqlalchemy

database = sqlite
alchemy_database = sqlalchemy
def initializeConnection():
    """ensure the parent proc's database connections are not touched
    in the new connection pool"""
    alchemy_database.dispose(close=False)