import random
import string
import sqlite3
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def inicio():
    return render_template("index.html")

@app.route("/admin")
def admin():

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT codigo, cliente, telefono, total, premio, giros, usado
        FROM codigos
        ORDER BY id DESC
    """)

    codigos = cursor.fetchall()

    conn.close()

    return render_template("admin.html", codigos=codigos)

@app.route("/generar_codigo", methods=["POST"])
def generar_codigo():

    cliente = request.form.get("cliente")
    telefono = request.form.get("telefono")
    total = request.form.get("total")

    codigo = "WDY-" + ''.join(
        random.choices(
            string.ascii_uppercase + string.digits,
            k=5
        )
    )

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO codigos
        (codigo, cliente, telefono, total)
        VALUES (?, ?, ?, ?)
        """,
        (codigo, cliente, telefono, total)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "codigo": codigo
    })
@app.route("/guardar_premio", methods=["POST"])
def guardar_premio():

    codigo = request.form["codigo"]
    premio = request.form["premio"]

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT giros FROM codigos WHERE codigo=?",
        (codigo,)
    )

    giros = cursor.fetchone()[0]

    if premio == "Giro Extra" and giros == 0:

        cursor.execute(
            """
            UPDATE codigos
            SET giros = 1
            WHERE codigo = ?
            """,
            (codigo,)
        )

    else:

        cursor.execute(
            """
            UPDATE codigos
            SET premio=?,
                usado=1
            WHERE codigo=?
            """,
            (premio, codigo)
        )

    conn.commit()
    conn.close()

    return jsonify({
        "ok": True
    })
@app.route("/validar", methods=["POST"])
def validar():
    
    codigo = request.form["codigo"]

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute(
    "SELECT usado, giros FROM codigos WHERE codigo=?",
    (codigo,)
)
    resultado = cursor.fetchone()

    conn.close()

    if resultado is None:
        return jsonify({
            "valido": False,
            "mensaje": "Código inválido"
        })

    usado = resultado[0]
    giros = resultado[1]

    if usado == 1:
     return jsonify({
        "valido": False,
        "mensaje": "Código ya utilizado"
        })

    return jsonify({
        "valido": True
         })

if __name__ == "__main__":
    app.run(debug=True)