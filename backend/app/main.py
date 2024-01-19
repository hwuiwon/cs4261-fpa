import json
from http import HTTPStatus

import requests
from constants import API_KEY, API_URL
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from models.ResponseModels import ErrorDTO, WeatherResponse

app = FastAPI()


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
