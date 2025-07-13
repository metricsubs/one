from pathlib import Path
import logging


MODELS_DIR = Path("/models/")
DATA_DIR = Path("/data/")


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
