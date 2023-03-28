from lib.Database.index import database as db
from typing import Dict, Any
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
import datetime

current_time = datetime.datetime.now()

"""
    @Model
    Extractor model to store generated contents
    such as keywords, transcript, ai generated content

    'is_private' col is of type boolean - we are using integers 
    0 - False & 1 - True since sqlite doesn't support boolean datatype
"""

tablename = "contents"
with db.conn:
    db.cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS contents
        (unique_id text, email text, content blob, args blob, 
        status text, content_type text, is_private integer DEFAULT 0, created_at timestamp DEFAULT CURRENT_TIMESTAMP, 
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP)
    """
    )


class Schema:
    def __init__(self, **kwargs):
        unique_id = kwargs.get("unique_id")
        content = kwargs.get("content")
        status = kwargs.get("status")
        content_type = kwargs.get("content_type")
        args = kwargs.get("args")
        email = kwargs.get("email")

        self._unique_id = unique_id
        self._content = content
        self._status = status
        self._content_type = content_type
        self._args = args
        self._email = email

    @property
    def unique_id(self):
        return self._unique_id

    @property
    def email(self):
        return self._email

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


def create(**kwargs):
    unique_id = kwargs.get("unique_id")
    content = kwargs.get("content")
    status = kwargs.get("status") or PROGRESSIVE_STATUS.QUEUED
    content_type = kwargs.get("content_type") or CONTENT_TYPES.EXTRACT_AUDIO
    args = kwargs.get("args")
    email = kwargs.get("email")
    data = Schema(
        unique_id=unique_id,
        email=email,
        content=content,
        args=args,
        content_type=content_type,
        status=status,
    )
    print("creating data", data)
    with db.conn:
        db.cursor.execute(
            """
            insert into contents(unique_id, content, args, content_type, status, email)
            values(?, ?, ?, ?, ?, ?);
        """,
            (
                data.unique_id,
                data.content,
                data.args,
                data.content_type,
                data.status,
                data.email,
            ),
        )


def get_by_id(unique_id: str):
    db.cursor.execute("select * from contents where unique_id = ? and is_private = 0", (unique_id,))
    result = db.cursor.fetchone()
    if result:
        column_names = [col[0] for col in db.cursor.description]
        return dict(zip(column_names, result))
    return

def get_by_email(email: str, content_type = "", unique_id = "", status = ""):
    queryStr = "select * from contents where email = ?"
    params = (email,)
    if content_type != "":
        queryStr += " and content_type = ?"
        params += (content_type,)
    if unique_id != "":
        queryStr += " and unique_id = ?"
        params += (unique_id,)
    if status != "":
        queryStr += " and status = ?"
        params += (status,)

    queryStr += " order by updated_at desc"
    db.cursor.execute(queryStr, params)
    result = db.cursor.fetchall()
    if result:
        column_names = [col[0] for col in db.cursor.description]
        data = []
        for row in result:
            resp = dict()
            for idx in range(len(row)):
                resp[column_names[idx]] = row[idx]
            data.append(resp)
        return data
    return result

def prepare_update_str(data):
    query_params = []
    for key, values in data.items():
        query_params.append(f"{key} = ?")
    query_params.append("updated_at = ?")
    query_str = "UPDATE contents SET {} WHERE unique_id = ?".format(", ".join(query_params))
    params = list(data.values())
    return (query_str, tuple(params))

def update(unique_id: str, data: Dict):
    print("updating: ", data)
    queryStr, values = prepare_update_str(data)
    values += (current_time, unique_id)
    print(f"Executing update query: {queryStr}")
    print(f"Updating with values: {values}")
    with db.conn:
        db.cursor.execute(queryStr, values)


def remove(unique_id: str):
    with db.conn:
        db.cursor.execute("""delete from contents where unique_id = ?""", (unique_id,))


def get_rows_by_content_type(
    status=PROGRESSIVE_STATUS.QUEUED, content_type=CONTENT_TYPES.EXTRACT_TRANSCRIPT
):
    db.cursor.execute(
        "select * from contents where status = ? and content_type = ?",
        (status, content_type),
    )
    result = db.cursor.fetchall()
    if result:
        column_names = [col[0] for col in db.cursor.description]
        data = []
        for row in result:
            resp = dict()
            for idx in range(len(row)):
                resp[column_names[idx]] = row[idx]
            data.append(resp)
        return data
    return result


# db.close()
