from lib.Database.index import database as db
from typing import Dict
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES

"""
    @Model
    Extractor model to store generated contents
    such as keywords, transcript, ai generated content
"""

tablename = "contents"
class Schema:
    def __init__(self, unique_id, content, args, content_type, status = PROGRESSIVE_STATUS.QUEUED):
        self._unique_id = unique_id
        self._content = content
        self._status = status
        self._content_type = content_type
        self._args = args
        with db.conn:
            db.cursor.execute("""
                CREATE TABLE IF NOT EXISTS contents
                (unique_id text, content blob, args blob, status text, content_type text)
            """)

    @property
    def unique_id(self):
        return self._unique_id

    @property
    def content(self):
        return self._content

    @property
    def status(self):
        return self._status
    
    @property
    def content_type(self):
        return self._content_type

    @property
    def args(self):
        return self._args

def create(unique_id: str, content, args, content_type = CONTENT_TYPES.EXTRACT_AUDIO, status = PROGRESSIVE_STATUS.QUEUED):
    data = Schema(unique_id, content, args, content_type, status)
    print("creating data", data)
    with db.conn:
        db.cursor.execute("""
            insert into contents(unique_id, content, args, content_type, status)
            values(?, ?, ?, ?, ?);
        """, (data.unique_id, data.content, data.args, data.content_type, data.status))

def get_by_id(unique_id: str):
    db.cursor.execute("select * from contents where unique_id = ?", (unique_id,))
    result = db.cursor.fetchone()
    if result:
        column_names = [ col[0] for col in db.cursor.description ]
        return dict(zip(column_names, result))
    return

def update(unique_id: str, data: Dict, status = PROGRESSIVE_STATUS.INPROGRESS):
    print("updating: ", data)
    with db.conn:
        if data["args"]:
            db.cursor.execute("""
                update contents set content = ?, status = ?, args = ? where unique_id = ?
            """, (data["content"], status, data["args"], unique_id))
        else:
            db.cursor.execute("""
                update contents set content = ?, status = ? where unique_id = ?
            """, (data["content"], status, unique_id))

def remove(unique_id: str):
    with db.conn:
        db.cursor.execute(
            """delete from contents where unique_id = ?""",
            (unique_id,)
        )

def get_rows_by_status(status = PROGRESSIVE_STATUS.QUEUED):
    db.cursor.execute(
            "select * from contents where status = ?",
            (status,)
        )
    result = db.cursor.fetchall()
    if result:
        column_names = [ col[0] for col in db.cursor.description ]
        data = []
        for row in result:
            resp = dict()
            for idx in range(len(row)):
                resp[column_names[idx]] = row[idx]
            data.append(resp)
        return data
    return result

# db.close()
