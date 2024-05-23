from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
from flask_swagger_ui import get_swaggerui_blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
swaggerui_blueprint = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={'app_name': "Flask API"})
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

class WalletTransaction(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    date = db.Column(db.String(24), nullable=False)
    reason = db.Column(db.String(100), nullable=True)
    amount = db.Column(db.Integer, nullable=False)
    wallet_id = db.Column(db.String(36), db.ForeignKey('wallet.id'), nullable=False)
    
    wallet = db.relationship('Wallet', back_populates='transactions')

class Wallet(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    currency = db.Column(db.String(3), nullable=False)
    description = db.Column(db.String(100), nullable=True)
    
    transactions = db.relationship('WalletTransaction', back_populates='wallet', cascade='all, delete-orphan')

with app.app_context():
    db.create_all()

@app.route('/api/token', methods=['POST'])
def create_token():
    data = request.get_json()
    permissions = data.get('permissions', [])
    access_token = create_access_token(identity=data['username'], additional_claims={"permissions": permissions})
    return jsonify(access_token=access_token)

@app.route('/api/wallets/<string:wallet_id>', methods=['GET', 'POST'])
@jwt_required()
def manage_wallets(wallet_id):
    claims = get_jwt()
    if request.method == 'GET':
        if "READ" not in claims['permissions']:
            return jsonify(msg="Permission denied"), 403
        
        if wallet_id == "all":
            wallets = Wallet.query.all()
            return jsonify(
                wallets=[
                    {
                        "id": wallet.id,
                        "name": wallet.name
                    } for wallet in wallets
                ]
            ), 200
        
        elif wallet_id:
            wallet = Wallet.query.get_or_404(wallet_id)
            return jsonify({
                "id": wallet.id,
                "name": wallet.name,
                "currency": wallet.currency,
                "description": wallet.description,
                "walletTransactions": sorted([{
                    "id": t.id,
                    "date": t.date,
                    "reason": t.reason,
                    "amount": t.amount #give me the format for this "5/21/2024, 5:46:53 PM"
                    } for t in wallet.transactions], key=lambda x: datetime.strptime(x['date'], '%m/%d/%Y, %I:%M:%S %p'))
            })
        
    elif request.method == 'POST':
        
        if "WRITE" not in claims['permissions']:
            return jsonify(msg="Permission denied"), 403
        
        data = request.get_json()
        try:
            db.session.add(Wallet(
                id=wallet_id, 
                name=data["name"],
                currency=data["currency"], 
                description=data.get("description")
            ))
            db.session.commit()
        except Exception as e:
            print(e)
            return jsonify(msg="Wallet creation failed"), 404
        return jsonify(msg="Wallet created"), 201

@app.route('/api/wallets/<string:wallet_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def modify_wallet(wallet_id):
    print(wallet_id)
    claims = get_jwt()
    wallet = Wallet.query.get_or_404(wallet_id)
    
    if "WRITE" not in claims['permissions']:
        return jsonify(msg="Permission denied"), 403
    
    if request.method == 'PUT':
        data = request.get_json()
        if data.get("name"):
            wallet.name = data["name"]
        if data.get("currency"):
            wallet.currency = data["currency"]
        if data.get("description"):
            wallet.description = data["description"]
        db.session.commit()
        return jsonify(msg="Wallet updated"), 200
    
    if request.method == 'DELETE':
        db.session.delete(wallet)
        db.session.commit()
        return jsonify(msg="Wallet deleted"), 200
        
@app.route('/api/wallets/<string:wallet_id>/transactions/<string:transaction_id>', methods=['POST', 'PUT', 'DELETE'])
@jwt_required()
def modify_transaction(wallet_id, transaction_id):
    claims = get_jwt()
    
    if "WRITE" not in claims['permissions']:
        return jsonify(msg="Permission denied"), 403
    
    if request.method == 'POST':
        Wallet.query.get_or_404(wallet_id)
        data = request.get_json()
        print(data)
        try:
            date = data["date"]
            try:
                datetime.strptime(date, "%m/%d/%Y, %I:%M:%S %p")
            except ValueError as e:
                return jsonify(msg="Invalid date time format, expected format '1/25/2024, 6:45:00 PM'"), 404
            db.session.add(WalletTransaction(id=transaction_id, date=date, reason=data.get("reason"), amount=data["amount"], wallet_id=wallet_id))
            db.session.commit()
        except Exception as e:
            return jsonify(msg="Transaction creation failed"), 404
        return jsonify(msg="Transaction created"), 200
        
    
    transaction = WalletTransaction.query.filter_by(wallet_id=wallet_id, id=transaction_id).first()
    
    if not transaction:
        return jsonify(msg="Transaction not found"), 404
    
    if request.method == 'PUT':
        data = request.get_json()
        if data.get("date"):
            try:
                datetime.strptime(data["date"], "%m/%d/%Y, %I:%M:%S %p")
                transaction.date = data["date"]
            except:
                pass
        if data.get("reason"):
            transaction.reason = data["reason"]
        if data.get("amount"):
            transaction.amount = data["amount"]
        db.session.commit()
        return jsonify(msg="Transaction updated"), 200
    
    if request.method == "DELETE":
        db.session.delete(transaction)
        db.session.commit()
        return jsonify(msg="Transaction deleted"), 200
   
if __name__ == '__main__':
    app.run(debug=True)
