import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

codigos = [
    ("KING001",),
    ("KING002",),
    ("KING003",),
    ("KING004",),
    ("KING005",)
]

cursor.executemany(
    "INSERT OR IGNORE INTO codigos(codigo) VALUES (?)",
    codigos
)

conn.commit()
conn.close()

print("Códigos agregados.")