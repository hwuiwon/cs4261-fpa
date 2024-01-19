"""Set of constants."""
import os

from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY = os.environ["AWS_ACCESS_KEY"]
AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]
AWS_REGION = os.environ["AWS_REGION"]

API_KEY = os.environ["API_KEY"]
API_URL = "https://api.weatherapi.com/v1/current.json"

DYNAMODB_USER_TABLE = os.environ["DYNAMODB_USER_TABLE"]
