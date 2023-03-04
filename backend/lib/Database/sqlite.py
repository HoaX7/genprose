import sqlite3

conn = sqlite3.connect("../database.db", check_same_thread=False)
cursor = conn.cursor()

def reconnect():
    close()
    conn = sqlite3.connect("../database.db", check_same_thread=False)
    cursor = conn.cursor()

def close():
    cursor.close()
    conn.close()
