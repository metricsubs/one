import base64
from pathlib import Path
import logging
import os

MODELS_DIR = Path("/models")
DATA_DIR = Path("/data")
YOUTUBE_DIR = DATA_DIR / "youtube"

YOUTUBE_COOKIES = os.getenv("YOUTUBE_COOKIES")

if YOUTUBE_COOKIES:
    YOUTUBE_COOKIES = base64.b64decode(YOUTUBE_COOKIES).decode("utf-8")

CONVEX_SELF_HOSTED_URL = os.getenv("CONVEX_SELF_HOSTED_URL")
CONVEX_SERVICE_TOKEN = os.getenv("SERVICE_TOKEN")


def get_logger(name, level=logging.INFO):
    """Return a logger with a default handler."""
    logger = logging.getLogger(name)
    handler = logging.StreamHandler()
    handler.setFormatter(
        logging.Formatter("%(levelname)s: %(asctime)s: %(name)s  %(message)s")
    )
    logger.addHandler(handler)
    logger.setLevel(level)
    logger.propagate = False  # Prevent the modal client from double-logging.
    return logger


def get_convex_service_bot_session_token():
    import requests

    response = requests.post(
        f"{CONVEX_SELF_HOSTED_URL}/http/auth/service-bot-session-token",
        headers={"Authorization": f"Bearer {CONVEX_SERVICE_TOKEN}"},
    )
    response.raise_for_status()
    session_token = response.json()["sessionToken"]

    return session_token

def get_convex_client():
    from convex.http_client import ConvexHttpClient

    session_token = get_convex_service_bot_session_token()
    client = ConvexHttpClient(CONVEX_SELF_HOSTED_URL)
    client.set_auth(session_token)
    return client
