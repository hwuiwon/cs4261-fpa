from pydantic import BaseModel
from utils import deserialize


class UserModel(BaseModel):
    id: str
    todo_list: list


def to_user_model(response: dict) -> UserModel:
    item = deserialize(response["Item"])

    return UserModel(
        id=item.get("id", ""),
        todo_list=item.get("todo_list", []),
    )


def get_user_key(user_id: str) -> dict:
    return {"id": {"S": user_id}}
