from flask import Flask, jsonify, request
from flask_cors import CORS

from database import db
import models


# ============================================================
# APP CONFIGURATION
# ============================================================

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///stocksense.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
CORS(app)


# ============================================================
# HOME / TEST
# ============================================================

@app.route("/")
def home():
    return jsonify({
        "message": "StockSense Backend is running successfully"
    })


@app.route("/api/test")
def test():
    return jsonify({
        "status": "success",
        "message": "StockSense API is working"
    })


# ============================================================
# DATABASE
# ============================================================

with app.app_context():
    db.create_all()


# ============================================================
# PRODUCTS API
# ============================================================

@app.route("/api/products", methods=["GET"])
def get_products():

    products = models.Product.query.all()

    return jsonify([
        {
            "id": product.id,
            "name": product.name,
            "sku": product.sku,
            "category": product.category,
            "unit": product.unit,
            "stock": product.stock,
            "min_stock": product.min_stock
        }
        for product in products
    ])


@app.route("/api/products", methods=["POST"])
def add_product():

    data = request.get_json()

    product = models.Product(
        name=data["name"],
        sku=data["sku"],
        category=data.get("category"),
        unit=data.get("unit"),
        stock=data.get("stock", 0),
        min_stock=data.get("min_stock", 0)
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({
        "message": "Product added successfully",
        "id": product.id
    }), 201


# ============================================================
# RECEIPTS API
# ============================================================

@app.route("/api/receipts", methods=["GET"])
def get_receipts():

    receipts = models.Receipt.query.all()

    return jsonify([
        {
            "id": receipt.id,
            "reference": receipt.reference,
            "supplier": receipt.supplier,
            "status": receipt.status,
            "schedule_date": receipt.schedule_date,
            "responsible": receipt.responsible
        }
        for receipt in receipts
    ])


@app.route("/api/receipts", methods=["POST"])
def add_receipt():

    data = request.get_json()

    receipt = models.Receipt(
        reference=data["reference"],
        supplier=data.get("supplier"),
        status=data.get("status", "Draft"),
        schedule_date=data.get("schedule_date"),
        responsible=data.get("responsible")
    )

    db.session.add(receipt)
    db.session.commit()

    return jsonify({
        "message": "Receipt created successfully",
        "id": receipt.id
    }), 201


# ============================================================
# VALIDATE RECEIPT
# ============================================================

@app.route("/api/receipts/<int:receipt_id>/validate", methods=["POST"])
def validate_receipt(receipt_id):

    receipt = models.Receipt.query.get(receipt_id)

    if not receipt:
        return jsonify({
            "message": "Receipt not found"
        }), 404

    # Prevent duplicate validation
    if receipt.status == "Done":
        return jsonify({
            "message": "Receipt is already validated"
        }), 400

    data = request.get_json()

    items = data.get("items", [])

    if not items:
        return jsonify({
            "message": "No products found in receipt"
        }), 400

    for item in items:

        product_id = item.get("product_id")
        quantity = int(item.get("quantity", 0))

        if quantity <= 0:
            return jsonify({
                "message": "Invalid quantity"
            }), 400

        product = models.Product.query.get(product_id)

        if not product:
            return jsonify({
                "message": "Product not found"
            }), 404

        # Increase stock
        product.stock += quantity

        # Save receipt item
        receipt_item = models.ReceiptItem(
            receipt_id=receipt.id,
            product_id=product.id,
            quantity=quantity
        )

        db.session.add(receipt_item)

        # Create stock movement
        movement = models.StockMove(
            reference=receipt.reference,
            date=receipt.schedule_date,
            contact=receipt.supplier,
            from_location="Supplier",
            to_location="Warehouse",
            quantity=quantity,
            status="Done"
        )

        db.session.add(movement)

    # Change receipt status
    receipt.status = "Done"

    db.session.commit()

    return jsonify({
        "message": "Receipt validated successfully",
        "receipt_id": receipt.id
    }), 200


# ============================================================
# DELIVERIES API
# ============================================================

@app.route("/api/deliveries", methods=["GET"])
def get_deliveries():

    deliveries = models.Delivery.query.all()

    return jsonify([
        {
            "id": delivery.id,
            "reference": delivery.reference,
            "address": delivery.address,
            "status": delivery.status,
            "schedule_date": delivery.schedule_date,
            "responsible": delivery.responsible,
            "operation_type": delivery.operation_type
        }
        for delivery in deliveries
    ])


@app.route("/api/deliveries", methods=["POST"])
def add_delivery():

    data = request.get_json()

    delivery = models.Delivery(
        reference=data["reference"],
        address=data.get("address"),
        status=data.get("status", "Draft"),
        schedule_date=data.get("schedule_date"),
        responsible=data.get("responsible"),
        operation_type=data.get("operation_type")
    )

    db.session.add(delivery)
    db.session.commit()

    return jsonify({
        "message": "Delivery created successfully",
        "id": delivery.id
    }), 201


# ============================================================
# VALIDATE DELIVERY
# ============================================================

@app.route("/api/deliveries/<int:delivery_id>/validate", methods=["POST"])
def validate_delivery(delivery_id):

    delivery = models.Delivery.query.get(delivery_id)

    if not delivery:
        return jsonify({
            "message": "Delivery not found"
        }), 404

    # Prevent duplicate validation
    if delivery.status == "Done":
        return jsonify({
            "message": "Delivery is already validated"
        }), 400

    data = request.get_json()

    items = data.get("items", [])

    if not items:
        return jsonify({
            "message": "No products found in delivery"
        }), 400

    for item in items:

        product_id = item.get("product_id")
        quantity = int(item.get("quantity", 0))

        if quantity <= 0:
            return jsonify({
                "message": "Invalid quantity"
            }), 400

        product = models.Product.query.get(product_id)

        if not product:
            return jsonify({
                "message": "Product not found"
            }), 404

        # Check available stock
        if product.stock < quantity:
            return jsonify({
                "message":
                    f"Not enough stock for {product.name}. "
                    f"Available: {product.stock}"
            }), 400

        # Decrease stock
        product.stock -= quantity

        # Save delivery item
        delivery_item = models.DeliveryItem(
            delivery_id=delivery.id,
            product_id=product.id,
            quantity=quantity
        )

        db.session.add(delivery_item)

        # Create stock movement
        movement = models.StockMove(
            reference=delivery.reference,
            date=delivery.schedule_date,
            contact=delivery.address,
            from_location="Warehouse",
            to_location="Customer",
            quantity=quantity,
            status="Done"
        )

        db.session.add(movement)

    # Change delivery status
    delivery.status = "Done"

    db.session.commit()

    return jsonify({
        "message": "Delivery validated successfully",
        "delivery_id": delivery.id
    }), 200


# ============================================================
# MOVE HISTORY API - GET
# ============================================================

@app.route("/api/moves", methods=["GET"])
def get_moves():

    moves = models.StockMove.query.order_by(
        models.StockMove.id.desc()
    ).all()

    return jsonify([
        {
            "id": move.id,
            "reference": move.reference,
            "date": move.date,
            "contact": move.contact,
            "from_location": move.from_location,
            "to_location": move.to_location,
            "quantity": move.quantity,
            "status": move.status
        }
        for move in moves
    ])


# ============================================================
# CREATE STOCK MOVE - POST
# ============================================================

@app.route("/api/moves", methods=["POST"])
def add_move():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data received"
        }), 400

    reference = data.get("reference")
    quantity = int(data.get("quantity", 0))

    if not reference:
        return jsonify({
            "message": "Reference is required"
        }), 400

    if quantity <= 0:
        return jsonify({
            "message": "Quantity must be greater than 0"
        }), 400

    move = models.StockMove(
        reference=reference,
        date=data.get("date"),
        contact=data.get("contact"),
        from_location=data.get("from_location"),
        to_location=data.get("to_location"),
        quantity=quantity,
        status=data.get("status", "Done")
    )

    db.session.add(move)
    db.session.commit()

    return jsonify({
        "message": "Stock move created successfully",
        "id": move.id
    }), 201


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":
    app.run(debug=True)