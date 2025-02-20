import json
import random
import urllib.request

class OdooAPI:
    def __init__(self, host, db, user, password):
        self.host = host
        self.db = db
        self.user = user
        self.password = password
        self.url = f"https://{host}/jsonrpc" 
        self.uid = self.login()

    def json_rpc(self, method, params):
        data = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params,
            "id": random.randint(0, 1000000000),
        }
        req = urllib.request.Request(url=self.url, data=json.dumps(data).encode(), headers={
            "Content-Type": "application/json",
        })
        reply = json.loads(urllib.request.urlopen(req).read().decode('UTF-8'))
        if reply.get("error"):
            raise Exception(reply["error"])
        return reply["result"]

    def call(self, service, method, *args):
        return self.json_rpc("call", {"service": service, "method": method, "args": args})

    def login(self):
        try:
            return self.call("common", "login", self.db, self.user, self.password)
        except Exception as e:
            raise Exception(f"Login failed: {e}")
        
    def get_client_name_by_id(self, client_id):
        try:
            result = self.call("object", "execute", self.db, self.uid, self.password, 'res.partner', 'read', [client_id], ['name'])
            if result:
                return result[0]['name']
            return None
        except Exception as e:
            raise Exception(f"Failed to get client name: {e}")



    def list_tickets(self):
        try:
            # Filtrer les tickets où le 'name' (client/demandeur) est égal à l'ID client (26140)
            client_id = 26140  # ID statique du client
            result = self.call("object", "execute", self.db, self.uid, self.password, 
                            'ticket.ticket', 'search_read', 
                            [['name', '=', client_id]],  # Filtrer par l'ID du client
                            ['problem_type', 'statut', 'niveau_urgence', 'description', 'period', 'directory'])
            return result
        except Exception as e:
            raise Exception(f"Failed to list tickets: {e}")


    def create_ticket(self, data):
        try:
            ticket = {
                'name': data['name'],
                'problem_type': data['problem_type'],
                'description': data['description'],
                'location': data.get('location', ''), 
                'user_ticket': f"{data['name']} - {data['function']}",
            }
            # Créez le ticket dans Odoo ici
            ticket_id = self.call("object", "execute", self.db, self.uid, self.password, 'ticket.ticket', 'create', ticket)
            return ticket_id
        except Exception as e:
            raise Exception(f"Failed to create ticket: {e}")