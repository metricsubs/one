import logging
from typing import List, Optional, TypedDict
from pathlib import Path
from .config import YOUTUBE_COOKIES, YOUTUBE_DIR, get_logger

logger = get_logger(__name__)

COOKIES_FILE = YOUTUBE_DIR / "cookies.txt"

def is_url_youtube(url: str) -> bool:
    """Return True if the URL is a YouTube URL."""

    return (
        url.startswith("https://www.youtube.com/")
        or url.startswith("https://youtu.be/")
        or url.startswith("https://youtube.com/")
        or url.startswith("https://m.youtube.com/")
    )

class LocalYoutubeVideoInfo(TypedDict):
    video_id: str
    title: str
    description: str
    duration: int
    dir_path: Path
    video_path: Path
    thumbnail_path: Optional[Path]
    subtitle_path: Optional[Path]
    info_path: Optional[Path]
    description_path: Optional[Path]

def write_cookies_to_file(cookies: str):
    """Write the cookies to the data directory."""
    try:
        COOKIES_FILE.parent.mkdir(parents=True, exist_ok=True)
        logger.info(f"Writing cookies to {COOKIES_FILE}")
        with open(COOKIES_FILE, "w") as f:
            f.write(cookies)
        logger.info(f"Successfully wrote cookies to {COOKIES_FILE}")
    except Exception as e:
        logger.error(f"Failed to write cookies to {COOKIES_FILE}: {e}")
        raise

def download_youtube_video(
    url: str
) -> LocalYoutubeVideoInfo:
    """Download a YouTube video and return the path to the downloaded video."""

    import yt_dlp

    cookie_file_path = None
    logger.info("Loading cookies from environment variable")
    print(f"YOUTUBE_COOKIES: {YOUTUBE_COOKIES}")
    logger.info(f"YOUTUBE_COOKIES: {YOUTUBE_COOKIES}")
    if YOUTUBE_COOKIES:
        write_cookies_to_file(YOUTUBE_COOKIES)
        cookie_file_path = COOKIES_FILE


    ydl_opts = {
        "format": "bestvideo*+bestaudio/best",
        "outtmpl": str(YOUTUBE_DIR / "%(id)s" / "%(id)s.%(ext)s"),
        "writedescription": True,
        "writeinfojson": True,
        "subtitlesformat": "srv3",
        "writethumbnail": True,
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": ["en.*", ".*orig"],
        "cookies": YOUTUBE_COOKIES,
        "cookiefile": cookie_file_path,
        "nopostoverwrites": True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        
        if not info:
            logger.error("Failed to extract video info")
            raise Exception("Failed to extract video info")
        
        video_id = info.get('id')
        if not video_id:
            logger.error("No video ID found")
            raise Exception("No video ID found")
        
        # Base directory for this video
        video_dir = YOUTUBE_DIR / video_id

        # glob all files in the video_dir
        downloaded_files: List[Path] = list(video_dir.glob("*"))
        
        # Log all downloaded files
        logger.info(f"All downloaded files: {downloaded_files}")
        
        # Find different file types from downloaded files
        video_files = [f for f in downloaded_files if f.name.endswith(('.mp4', '.mkv', '.webm'))]
        audio_files = [f for f in downloaded_files if f.name.endswith(('.mp3', '.m4a', '.wav'))]
        thumbnail_files = [f for f in downloaded_files if f.name.endswith(('.jpg', '.png', '.webp'))]
        subtitle_files = [f for f in downloaded_files if f.name.endswith(('.srt', '.vtt', '.srv3'))]
        info_files = [f for f in downloaded_files if f.name.endswith(('.json', '.info.json'))]
        description_files = [f for f in downloaded_files if f.name.endswith('.description')]
        
        logger.info(f"Video files: {video_files}")
        logger.info(f"Audio files: {audio_files}")
        logger.info(f"Thumbnail files: {thumbnail_files}")
        logger.info(f"Subtitle files: {subtitle_files}")
        logger.info(f"Info files: {info_files}")
        logger.info(f"Description files: {description_files}")
        
        if not video_files:
            logger.error("No video files found")
            raise Exception("No video files found")
        video_path = video_files[0]


        if subtitle_files:
            # prefer original subtitle with ".*orig" in name
            original_subtitle = next((f for f in subtitle_files if ".*orig" in f.name), None)
            if original_subtitle:
                subtitle_path = original_subtitle
            else:
                subtitle_path = subtitle_files[0]
        else:
            subtitle_path = None

        # Construct paths for different artifacts
        video_info = LocalYoutubeVideoInfo(
            video_id=video_id,
            title=info.get('title', ''),
            description=info.get('description', ''),
            duration=int(info.get('duration', 0)),
            dir_path=video_dir,
            video_path=video_path,
            thumbnail_path=Path(thumbnail_files[0]) if thumbnail_files else None,
            subtitle_path=subtitle_path,
            info_path=Path(info_files[0]) if info_files else None,
            description_path=Path(description_files[0]) if description_files else None,
        )
        
        # Verify files exist
        for key, path in video_info.items():
            if key.endswith('_path') and isinstance(path, Path):
                if path.exists():
                    logger.info(f"✓ {key}: {path}")
                else:
                    logger.warning(f"✗ {key}: {path} (not found)")
        
        return video_info

