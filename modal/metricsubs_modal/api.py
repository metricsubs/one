
from fastapi import FastAPI
from metricsubs_modal.config import get_logger

logger = get_logger(__name__)

web_app = FastAPI()

@web_app.get("/")
async def root():
    """A simple endpoint to test the API."""

    return {"message": "ok"}
