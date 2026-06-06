import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("DELETE FROM codigos")

conn.commit()
conn.close()

print("Todos los registros fueron eliminados.")
import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("DELETE FROM codigos")
cursor.execute("DELETE FROM sqlite_sequence WHERE name='codigos'")

conn.commit()
conn.close()

print("Tabla limpiada y contador reiniciado.")