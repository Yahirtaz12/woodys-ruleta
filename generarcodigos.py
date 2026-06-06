import sqlite3
import random
import string

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cantidad = 20

print("\n=== CODIGOS GENERADOS ===\n")

for _ in range(cantidad):

    codigo = "WDY-" + ''.join(
        random.choices(
            string.ascii_uppercase + string.digits,
            k=5
        )
    )

    try:
        cursor.execute(
            "INSERT INTO codigos(codigo) VALUES (?)",
            (codigo,)
        )

        print(codigo)

    except:
        pass

conn.commit()
conn.close()

print("\n=========================\n")