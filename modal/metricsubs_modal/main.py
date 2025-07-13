

from pathlib import Path
import modal

from metricsubs_modal.utils.config import DATA_DIR, MODELS_DIR, get_logger

models_volume = modal.Volume.from_name("metricsubs-models", create_if_missing=True)
data_volume = modal.Volume.from_name("metricsubs-data", create_if_missing=True)

image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install_from_pyproject("pyproject.toml")
    .apt_install("ffmpeg")
)

app = modal.App(
    "metricsubs-modal",
    image=image,
    volumes={
        MODELS_DIR: models_volume,
        DATA_DIR: data_volume,
    },
    secrets=[modal.Secret.from_name("metricsubs-secret")]
)

logger = get_logger(__name__)

@app.function(keep_warm=True)
@modal.asgi_app()
def fastapi_app():
    """The entrypoint for the api service."""

    from metricsubs_modal.api import web_app
    return web_app


@app.function()
def square(x):
    print("This code is running on a remote worker!")
    return x**2

@app.function()
def extract_audio_from_video(video_path: Path, output_path: Path):
    from metricsubs_modal.utils.video import extract_audio_from_video
    return extract_audio_from_video(video_path, output_path)

@app.function()
def transcode_video_to_1080p(video_path: Path, output_path: Path):
    from metricsubs_modal.utils.video import transcode_video_to_1080p
    return transcode_video_to_1080p(video_path, output_path)

@app.function()
def download_youtube_video_and_transcode(url: str):
    from metricsubs_modal.utils.youtube import download_youtube_video
    local_video_info = download_youtube_video(url)
    if not local_video_info:
        raise Exception("Failed to download video")
    
    video_1080p_path = local_video_info["video_path"].with_suffix(".1080p.mp4")
    audio_path = local_video_info["video_path"].with_suffix(".mp3")

    transcode_call = transcode_video_to_1080p.spawn(local_video_info["video_path"], video_1080p_path)
    extract_audio_call = extract_audio_from_video.spawn(local_video_info["video_path"], audio_path)

    [transcode_success, extract_audio_success] = modal.FunctionCall.gather(transcode_call, extract_audio_call)
    if not transcode_success:
        video_1080p_path = None
    if not extract_audio_success:
        audio_path = None

    return local_video_info

@app.local_entrypoint()
def main():
    print("the square is", square.remote(42))
