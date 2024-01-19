from pydantic import BaseModel


class ErrorDTO(BaseModel):
    code: int
    message: str


class WeatherResponse(BaseModel):
    status: int
    location: str
    temp_c: float
    temp_f: float
