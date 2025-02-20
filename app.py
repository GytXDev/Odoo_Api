from flask import Flask, jsonify, request, render_template, redirect, url_for, session
from flask_cors import CORS
from odoo_api import OdooAPI

app = Flask(__name__)
app.secret_key = "secret_key_123" 
CORS(app)

# Connexion à Odoo
odoo_api = OdooAPI(
    host="devotech.archisec-it.com", 
    db="newdev",
    user="n.leyalangoye@ogoouetech.com",
    password="Ogooue1234"
)

# Mot de passe autorisé
AUTHORIZED_PASSWORD = "g5T#8zKv@2jF"
AUTHORIZED_USER_ID = 26140  


@app.route('/', methods=['GET'])
def index():
    if not session.get("user_id"):
        return redirect(url_for("login"))

    # Utiliser l'ID statique de l'utilisateur (par exemple 26140)
    static_user_id = 26140

    try:
        # Récupérer le nom du client avec l'ID statique
        client_name = odoo_api.get_client_name_by_id(static_user_id)
        if client_name:
            return render_template('index.html', client_name=client_name)
        else:
            return jsonify({"status": "error", "message": "Client not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        password = request.form.get("password")

        if password == AUTHORIZED_PASSWORD:
            session["user_id"] = AUTHORIZED_USER_ID
            return redirect(url_for("index"))
        else:
            return render_template('login.html', error="Mot de passe incorrect")

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop("user_id", None)
    return redirect(url_for("login"))


@app.route('/tickets', methods=['GET'])
def list_tickets():

    try:
        tickets = odoo_api.list_tickets()
        return jsonify({"status": "success", "tickets": tickets})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/ticket', methods=['POST'])
def create_ticket():
    data = request.json
    try:
        odoo_api = OdooAPI() 
        ticket_id = odoo_api.create_ticket(data)
        return jsonify({"status": "success", "ticket_id": ticket_id}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
