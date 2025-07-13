from pathlib import Path

from .config import get_logger

logger = get_logger(__name__)

def extract_audio_from_video(video_path: Path, output_path: Path) -> bool:
    """Extract audio from video file as MP3."""
    
    import ffmpeg
    
    try:
        # Create output directory if it doesn't exist
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"Extracting audio from {video_path} to {output_path}")
        
        (
            ffmpeg
            .input(str(video_path))
            .output(
                str(output_path),
                acodec='mp3',
                audio_bitrate='192k',
                ac=1,  # Convert to mono for better transcription
                ar='16000'  # 16kHz sample rate for speech recognition
            )
            .overwrite_output()
            .run(quiet=True)
        )
        
        logger.info(f"Successfully extracted audio to: {output_path}")
        return True
    except Exception as e:
        logger.error(f"Error extracting audio: {e}")
        return False

def transcode_video_to_1080p(video_path: Path, output_path: Path) -> bool:
    """Transcode a video to 1080p. Automatically scale to the original aspect ratio."""

    import ffmpeg

    try:
        # Get video info first
        probe = ffmpeg.probe(str(video_path))
        video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
        
        if not video_stream:
            raise Exception("No video stream found")
        
        original_width = int(video_stream['width'])
        original_height = int(video_stream['height'])
        
        logger.info(f"Original resolution: {original_width}x{original_height}")
        
        # If already 1080p or smaller, return False
        if original_height <= 1080:
            logger.info("Video is already 1080p or smaller, no need to transcode...")
            return False
        
        # Calculate scaling to maintain aspect ratio
        # Scale to 1080p height, adjust width proportionally
        target_height = 1080
        target_width = int((original_width * target_height) / original_height)
        
        # Make sure width is even (required for some codecs)
        if target_width % 2 != 0:
            target_width += 1
            
        logger.info(f"Transcoding to: {target_width}x{target_height}")
        
        # Create output directory if it doesn't exist
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Transcode with high quality settings
        (
            ffmpeg
            .input(str(video_path))
            .filter('scale', target_width, target_height)
            .output(
                str(output_path),
                vcodec='libx264',
                acodec='aac',
                preset='medium',
                crf=23,  # High quality
                movflags='faststart',  # Optimize for web streaming
                pix_fmt='yuv420p'  # Ensure compatibility
            )
            .overwrite_output()
            .run(quiet=False)
        )
        
        logger.info(f"Successfully transcoded to 1080p: {output_path}")
        return True
    except Exception as e:
        logger.error(f"Error transcoding video: {e}")
        raise

def transcode_video_to_4k(video_path: Path, output_path: Path):
    """Transcode a video to 4K (2160p). Automatically scale to the original aspect ratio."""
    
    import ffmpeg
    
    try:
        # Get video info first
        probe = ffmpeg.probe(str(video_path))
        video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
        
        if not video_stream:
            raise Exception("No video stream found")
        
        original_width = int(video_stream['width'])
        original_height = int(video_stream['height'])
        
        logger.info(f"Original resolution: {original_width}x{original_height}")
        
        # If already 4K or smaller, just copy
        if original_height <= 2160:
            logger.info("Video is already 4K or smaller, copying...")
            (
                ffmpeg
                .input(str(video_path))
                .output(str(output_path), vcodec='copy', acodec='copy')
                .overwrite_output()
                .run(quiet=True)
            )
            return
        
        # Calculate scaling to maintain aspect ratio
        # Scale to 4K height, adjust width proportionally
        target_height = 2160
        target_width = int((original_width * target_height) / original_height)
        
        # Make sure width is even (required for some codecs)
        if target_width % 2 != 0:
            target_width += 1
            
        logger.info(f"Transcoding to: {target_width}x{target_height}")
        
        # Create output directory if it doesn't exist
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Transcode with high quality settings for 4K
        (
            ffmpeg
            .input(str(video_path))
            .filter('scale', target_width, target_height)
            .output(
                str(output_path),
                vcodec='libx264',
                acodec='aac',
                preset='slow',  # Slower preset for better quality at 4K
                crf=20,  # Higher quality for 4K
                movflags='faststart',  # Optimize for web streaming
                pix_fmt='yuv420p'  # Ensure compatibility
            )
            .overwrite_output()
            .run(quiet=True)
        )
        
        logger.info(f"Successfully transcoded to 4K: {output_path}")
        
    except Exception as e:
        logger.error(f"Error transcoding video to 4K: {e}")
        raise

def get_video_info(video_path: Path) -> dict:
    """Get video information using ffprobe."""
    
    import ffmpeg
    
    try:
        probe = ffmpeg.probe(str(video_path))
        video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
        audio_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'audio'), None)
        
        if not video_stream:
            raise Exception("No video stream found")
        
        info = {
            'width': int(video_stream['width']),
            'height': int(video_stream['height']),
            'duration': float(probe['format']['duration']),
            'fps': eval(video_stream['r_frame_rate']),  # Convert fraction to float
            'video_codec': video_stream['codec_name'],
            'audio_codec': audio_stream['codec_name'] if audio_stream else None,
            'file_size': int(probe['format']['size']) if 'size' in probe['format'] else None,
            'bitrate': int(probe['format']['bit_rate']) if 'bit_rate' in probe['format'] else None,
        }
        
        logger.info(f"Video info: {info}")
        return info
        
    except Exception as e:
        logger.error(f"Error getting video info: {e}")
        raise
