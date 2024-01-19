import json
import sys
from http import HTTPStatus

import requests
from constants import API_KEY, API_URL
from exceptions import FPADBException, FPAException, FPAExceptionCode
from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse
from loguru import logger
from models.RequestModels import (
    CreateTodoRequest,
    DeleteTodoRequest,
    DeleteUserRequest,
    RegisterUserRequest,
)
from models.ResponseModels import (
    CreateTodoResponse,
    DeleteTodoResponse,
    DeleteUserResponse,
    ErrorDTO,
    GetUserResponse,
    RegisterUserResponse,
    WeatherResponse,
)
from services import DynamoDBService

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.remove()
logger.add(
    sys.stderr,
    format=(
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS!UTC}</green> "
        "| <level>{level: <5}</level> | <cyan>{file}</cyan>:<cyan>{line}</cyan> "
        "<yellow>{function}</yellow> - <level>{message}</level>"
    ),
    level="INFO",
)


@app.exception_handler(FPAException)
async def fpa_api_exception_handler(request: Request, e: FPAException):
    return JSONResponse(
        status_code=HTTPStatus.BAD_REQUEST.value,
        content={"code": e.code.value, "message": e.message},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=HTTPStatus.UNPROCESSABLE_ENTITY.value,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get(
    "/weather",
    tags=["Weather"],
    response_model=WeatherResponse,
    responses={
        200: {"model": WeatherResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def weather(zip_code: str):
    logger.info("zip_code={}", zip_code)

    response = requests.get(f"{API_URL}?q={zip_code}&key={API_KEY}")
    data = json.loads(response.text)

    if "error" in data:
        return JSONResponse(
            status_code=HTTPStatus.BAD_REQUEST.value,
            content={"code": 400, "message": data["error"]["message"]},
        )

    location = data["location"]["name"] + ", " + data["location"]["region"]
    temp_c = data["current"]["temp_c"]
    temp_f = data["current"]["temp_f"]

    return WeatherResponse(status=200, location=location, temp_c=temp_c, temp_f=temp_f)


@app.post(
    "/user",
    summary="Register a new user",
    tags=["User"],
    response_model=RegisterUserResponse,
    responses={
        200: {"model": RegisterUserResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def register_user(register_request: RegisterUserRequest):
    if not register_request.id or not register_request.name:
        raise FPAException(
            code=FPAExceptionCode.BAD_REQUEST,
            message="User id or name is required",
        )

    logger.info("register_request={}", register_request)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.register_user(
            user_id=register_request.id, name=register_request.name
        )
    except FPAException as e:
        logger.error(
            "register_request={}, error={}",
            register_request,
            e,
        )
        raise

    return RegisterUserResponse(status=HTTPStatus.OK.value)


@app.get(
    "/user/{user_id}",
    summary="Retrieve a user's details",
    tags=["User"],
    response_model=GetUserResponse,
    responses={
        200: {"model": GetUserResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def get_user(user_id: str):
    if not user_id:
        raise FPAException(
            code=FPAExceptionCode.BAD_REQUEST,
            message="User id is required",
        )

    logger.info("user_id={}", user_id)

    dynamodb_service = DynamoDBService()

    try:
        user = dynamodb_service.get_user(user_id=user_id)
    except FPADBException as e:
        logger.error("user_id={}, error={}", user_id, e)
        raise

    return GetUserResponse(status=HTTPStatus.OK.value, user=user)


@app.delete(
    "/user",
    summary="Delete a user's account",
    tags=["User"],
    response_model=DeleteUserResponse,
    responses={
        200: {"model": DeleteUserResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def delete_user(delete_request: DeleteUserRequest):
    if not delete_request.id:
        raise FPAException(
            code=FPAExceptionCode.BAD_REQUEST,
            message="User id is required",
        )

    logger.info("user_id={}", delete_request.id)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.remove_user(user_id=delete_request.id)
    except FPAException as e:
        logger.error("user_id={}, error={}", delete_request.id, e)
        raise

    return DeleteUserResponse(status=HTTPStatus.OK.value)


@app.post(
    "/todo",
    summary="Add todo item to a user",
    tags=["Todo"],
    response_model=CreateTodoResponse,
    responses={
        200: {"model": CreateTodoResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def create_todo(create_request: CreateTodoRequest):
    if (
        not create_request.id
        or not create_request.description
        or not create_request.user_id
    ):
        raise FPAException(
            code=FPAExceptionCode.BAD_REQUEST,
            message="Id or description is required",
        )

    logger.info("create_request={}", create_request)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.create_todo_item(
            id=create_request.id,
            description=create_request.description,
            user_id=create_request.user_id,
        )
    except FPADBException as e:
        logger.error("create_request={}, error={}", create_request, e)
        raise

    return CreateTodoResponse(status=HTTPStatus.OK.value)


@app.delete(
    "/todo",
    summary="Delete todo item from a user",
    tags=["Todo"],
    response_model=DeleteTodoResponse,
    responses={
        200: {"model": DeleteTodoResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def delete_todo(delete_request: DeleteTodoRequest):
    if not delete_request.id or not delete_request.user_id:
        raise FPAException(
            code=FPAExceptionCode.BAD_REQUEST,
            message="Id or description is required",
        )

    logger.info("delete_request={}", delete_request)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.delete_todo_item(
            id=delete_request.id,
            user_id=delete_request.user_id,
        )
    except FPADBException as e:
        logger.error("delete_request={}, error={}", delete_request, e)
        raise

    return DeleteTodoResponse(status=HTTPStatus.OK.value)


def fpa_openapi() -> dict:
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="FPA API",
        version="1.0.0",
        summary="Python backend of FPA application built with FastAPI",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = fpa_openapi
