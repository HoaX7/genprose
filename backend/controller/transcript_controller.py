"""

    File is used to convert / translate YT video audio
    into transcripts

"""
from lib.Transcription.transcribe import Transcribe
from lib.logging.logger import logger
from typing import List

transcribe = Transcribe()

"""
    @parameters: url -> valid youtube url link

    @returns audio transcript
"""
def get_yt_video_from_url(url: str) -> str:
    return transcribe.get_transcription(url)

def extract_keywords(text: str) -> str:
    return transcribe.extract_keywords(text)

def get_content_from_keywords(prompt: str) -> str:
    return transcribe.get_content_from_keywords(prompt)