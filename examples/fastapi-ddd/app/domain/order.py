class Order:
    def __init__(self, order_id: str, total: float):
        self.order_id = order_id
        self.total = total

    def is_high_value(self) -> bool:
        return self.total >= 1000
