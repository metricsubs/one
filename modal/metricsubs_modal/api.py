
from fastapi import FastAPI
from modal import FunctionCall
import modal
from metricsubs_modal.utils.config import get_logger
from pydantic import BaseModel

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
    result = call.get_call_graph()
    result[0].status
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

class KickoffSystemPrepJobRequest(BaseModel):
    project_id: str

@web_app.post("/kickoff-system-prep-job")
async def kickoff_system_prep_job(
    request: KickoffSystemPrepJobRequest
):
    # from metricsubs_modal.utils.config import get_convex_client
    # convex_client = get_convex_client()
    from metricsubs_modal.utils.config import log_current_function
    first_caller_id = modal.current_function_call_id()
    logger.info(f"first_caller_id: {first_caller_id}")
    log_current_function(logger)

    from .main import square
    call = square.spawn(1)
    logger.info(f"spawned square call object id: {call.object_id}")

    [y] = modal.FunctionCall.gather(call)
    return {"result": y}

    
@web_app.post("/example")
async def example():
    from metricsubs_modal.utils.config import get_convex_client
    convex_client = get_convex_client()
    result = convex_client.action(
        "large_files:getPresignedPutObjectUrl",
        {
            "filename": "test.txt",
            "contentType": "text/plain",
            "contentLength": 100,
        }
    )
    return {"result": result}
