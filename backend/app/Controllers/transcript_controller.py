"""

    File is used to convert / translate YT video audio
    into transcripts

"""
from app.Modules.Transcription.transcribe import Transcribe
from Logging.logger import logger

transcribe = Transcribe()

"""
    @parameters: url -> valid youtube url link

    @returns audio transcript
"""
def get_yt_video_from_url(url: str) -> str:
    return transcribe.get_transcription(url)