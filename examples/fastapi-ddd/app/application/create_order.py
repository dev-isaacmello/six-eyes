from app.domain.order import Order
from app.infrastructure.order_repository import save_order


def create_order(payload: dict):
    order = Order(order_id=payload["id"], total=float(payload["total"]))
    save_order(order)
    return {"id": order.order_id, "highValue": order.is_high_value()}
