import boto3
from botocore.exceptions import ClientError
from constants import (
    AWS_ACCESS_KEY,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
    DYNAMODB_USER_TABLE,
)
from exceptions import FPADBException, FPADBExceptionCode
from loguru import logger
from models import UserModel, get_user_key, to_user_model
from utils import serialize


class DynamoDBService:
    """
    Handles all of the operations related to DynamoDB.
    https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html
    """

    def __init__(self):
        self.client = boto3.client(
            "dynamodb",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )

    def put_item(self, table_name: str, item: dict) -> None:
        try:
            self.client.put_item(
                Item=item,
                TableName=table_name,
            )
        except ClientError as e:
            logger.error("table_name={}, item={}, error={}", table_name, item, str(e))
            raise FPADBException(
                code=FPADBExceptionCode.ITEM_PUT_ERROR,
                message="Could not append item to table",
            )

    def get_item(self, table_name: str, key: dict) -> dict:
        response = self.client.get_item(
            Key=key,
            TableName=table_name,
        )

        if "Item" not in response:
            raise FPADBException(
                code=FPADBExceptionCode.ITEM_DOES_NOT_EXIST,
                message="Item does not exist",
            )

        return response

    def delete_item(self, table_name: str, key: dict) -> dict:
        response = self.client.delete_item(
            TableName=table_name, Key=key, ReturnValues="ALL_OLD"
        )

        if "Attributes" not in response:
            raise FPADBException(
                code=FPADBExceptionCode.ITEM_DOES_NOT_EXIST,
                message="Item does not exist",
            )

        return response

    def register_user(self, user_id: str, name: str):
        logger.info("user_id={}", user_id)

        new_user = {
            "id": {"S": user_id},
            "name": {"S": name},
            "todo_list": {"L": []},
        }

        self.put_item(DYNAMODB_USER_TABLE, new_user)

    def get_user(self, user_id: str) -> UserModel:
        logger.info("user_id={}", user_id)

        try:
            response = self.get_item(DYNAMODB_USER_TABLE, get_user_key(user_id))
            return to_user_model(response)
        except FPADBException as e:
            e.message = "Could not find user"
            raise

    def remove_user(self, user_id: str) -> dict:
        logger.info("user_id={}", user_id)

        return self.delete_item(DYNAMODB_USER_TABLE, get_user_key(user_id))

    def create_todo_item(self, id: str, description: str, user_id: str) -> None:
        logger.info(
            "id={}, description={}, user_id={}",
            id,
            description,
            user_id,
        )

        new_item = {
            "id": {"S": id},
            "description": {"S": description},
        }

        user = self.get_user(user_id)
        todo_list = user.todo_list
        todo_list.append(new_item)

        try:
            self.put_item(DYNAMODB_USER_TABLE, serialize(user.model_dump()))
        except FPADBException as e:
            e.message = "Could not create new todo item"
            raise

    def delete_todo_item(self, user_id: str, todo_id: str) -> dict:
        logger.info("user_id={}, todo_id={}", user_id, todo_id)

        user = self.get_user(user_id)
        todo_list = user.todo_list
        user.todo_list = [todo for todo in todo_list if todo["id"]["S"] != todo_id]

        try:
            self.put_item(DYNAMODB_USER_TABLE, serialize(user.model_dump()))
        except FPADBException as e:
            e.message = "Could not delete new todo item"
            raise
