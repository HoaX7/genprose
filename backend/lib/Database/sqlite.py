import sqlite3

conn = sqlite3.connect(
    "../database.db",
    check_same_thread=False,
    detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES,
)
cursor = conn.cursor()

def reconnect():
    close()
    conn = sqlite3.connect(
        "../database.db",
        check_same_thread=False,
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES,
    )
    cursor = conn.cursor()

def close():
    cursor.close()
    conn.close()
