

import modal

from metricsubs_modal.config import DATA_DIR, MODELS_DIR

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
)

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


# @app.function(
#     image=image,
# )
# def download_youtube_video()

@app.local_entrypoint()
def main():
    print("the square is", square.remote(42))
