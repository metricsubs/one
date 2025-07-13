
from fastapi import FastAPI
from modal import FunctionCall
from metricsubs_modal.utils.config import get_logger

logger = get_logger(__name__)

web_app = FastAPI()

@web_app.get("/")
async def root():
    """A simple endpoint to test the API."""

    return {"message": "ok"}

@web_app.post("/youtube/download")
async def download_youtube_video(url: str):
    from metricsubs_modal.main import download_youtube_video_and_transcode
    call = download_youtube_video_and_transcode.spawn(url)
    return {"call_id": call.object_id}

@web_app.get("/youtube/download/{call_id}")
async def get_youtube_video_download_status(call_id: str):
    call = FunctionCall.from_id(call_id)
    result = call.get(timeout=0)
    return result

@web_app.get("/youtube/cookies")
async def get_youtube_cookies():
    from metricsubs_modal.utils.config import YOUTUBE_COOKIES
    return {"cookies": YOUTUBE_COOKIES}

@web_app.post("/youtube/clear-cache")
async def clear_youtube_cache():
    from metricsubs_modal.utils.config import YOUTUBE_DIR
    import shutil
    shutil.rmtree(YOUTUBE_DIR, ignore_errors=True)
    return {"message": "Cache cleared"}
