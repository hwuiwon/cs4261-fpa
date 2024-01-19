"""Set of constants."""
import os

from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ["API_KEY"]
API_URL = "https://api.weatherapi.com/v1/current.json"
