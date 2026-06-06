import sqlite3

conn = sqlite3.connect("database.db")

cursor = conn.cursor()



cursor.execute("""
CREATE TABLE IF NOT EXISTS codigos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE,
    nombre TEXT,
    usado INTEGER DEFAULT 0,
    premio TEXT
)
""")

conn.commit()
conn.close()

print("Base de datos creada.")