from database import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    sku = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(100))
    unit = db.Column(db.String(50))
    stock = db.Column(db.Integer, default=0)
    min_stock = db.Column(db.Integer, default=0)


class Warehouse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    short_code = db.Column(db.String(20))
    address = db.Column(db.String(250))


class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    short_code = db.Column(db.String(20))
    warehouse_id = db.Column(db.Integer, db.ForeignKey("warehouse.id"))


class Receipt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(50), unique=True, nullable=False)
    supplier = db.Column(db.String(100))
    status = db.Column(db.String(30), default="Draft")
    schedule_date = db.Column(db.String(50))
    responsible = db.Column(db.String(100))


class ReceiptItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    receipt_id = db.Column(db.Integer, db.ForeignKey("receipt.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"))
    quantity = db.Column(db.Integer, default=0)


class Delivery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(50), unique=True, nullable=False)
    address = db.Column(db.String(250))
    status = db.Column(db.String(30), default="Draft")
    schedule_date = db.Column(db.String(50))
    responsible = db.Column(db.String(100))
    operation_type = db.Column(db.String(100))


class DeliveryItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    delivery_id = db.Column(db.Integer, db.ForeignKey("delivery.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"))
    quantity = db.Column(db.Integer, default=0)


class StockMove(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(50))
    contact = db.Column(db.String(100))
    from_location = db.Column(db.String(100))
    to_location = db.Column(db.String(100))
    quantity = db.Column(db.Integer, default=0)
    status = db.Column(db.String(30), default="Done")