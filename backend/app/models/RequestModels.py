from pydantic import BaseModel


class RegisterUserRequest(BaseModel):
    id: str
    name: str


class DeleteUserRequest(BaseModel):
    id: str


class CreateTodoRequest(BaseModel):
    id: str
    user_id: str
    description: str


class DeleteTodoRequest(BaseModel):
    id: str
    user_id: str
