from pydantic import BaseModel

from .UserModel import UserModel


class ErrorDTO(BaseModel):
    code: int
    message: str


class WeatherResponse(BaseModel):
    status: int
    location: str
    temp_c: float
    temp_f: float


class GetUserResponse(BaseModel):
    status: int
    user: UserModel


class RegisterUserResponse(BaseModel):
    status: int


class DeleteUserResponse(BaseModel):
    status: int


class CreateTodoResponse(BaseModel):
    status: int


class DeleteTodoResponse(BaseModel):
    status: int
