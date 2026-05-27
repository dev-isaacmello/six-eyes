from fastapi import FastAPI

from app.application.create_order import create_order

app = FastAPI()


@app.post("/orders")
def create_order_route(payload: dict):
    return create_order(payload)
