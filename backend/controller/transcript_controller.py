"""

    File is used to convert / translate YT video audio
    into transcripts

"""
from lib.Transcription.transcribe import Transcribe
from lib.Logging.logger import logger
from typing import List

transcribe = Transcribe()

"""
    @parameters: url -> valid youtube url link

    @returns audio transcript
"""
def get_yt_video_from_url(url: str) -> str:
    return transcribe.get_transcription(url)

def extract_keywords(text: str, use_chatgpt_for_keywords: bool) -> str:
    return transcribe.extract_keywords(text, use_chatgpt_for_keywords)

def get_content_from_keywords(prompt: str, **kwargs) -> str:
    return transcribe.get_content_from_keywords(prompt, **kwargs)

def retrieve_transcript(unique_id: str):
    return transcribe.retrieve_transcript(unique_id)

def remove_transcript(unique_id: str):
    return transcribe.remove_transcript(unique_id)