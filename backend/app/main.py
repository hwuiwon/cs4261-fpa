import json
import sys
from http import HTTPStatus

import requests
from constants import API_KEY, API_URL
from exceptions import FPAException
from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse
from loguru import logger
from models.ResponseModels import ErrorDTO, WeatherResponse

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
