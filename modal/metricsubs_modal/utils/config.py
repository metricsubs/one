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


def get_convex_client():
    import os
    from convex import ConvexClient

    CONVEX_SELF_HOSTED_URL = os.getenv("CONVEX_SELF_HOSTED_URL")
    return ConvexClient(CONVEX_SELF_HOSTED_URL)
