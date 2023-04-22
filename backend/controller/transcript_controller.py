"""

    File is used to convert / translate YT video audio
    into transcripts

"""
from lib.Transcription.transcribe import Transcribe
import lib.Transcription.content as content_extractor
import lib.Transcription.keywords as keyword_extractor
from lib.Logging.logger import logger
from typing import List

transcribe = Transcribe()

"""
    @parameters: url -> valid youtube url link

    @returns audio transcript
"""
def get_yt_video_from_url(url: str, email: str) -> str:
    return transcribe.get_transcription(url, email)

def extract_keywords(text: str, email: str, use_chatgpt_for_keywords: bool) -> str:
    return keyword_extractor.extract_keywords(text, email, use_chatgpt_for_keywords)

def get_content_from_keywords(prompt: str, **kwargs) -> str:
    return content_extractor.get_content_from_prompt(prompt, **kwargs)

def retrieve_transcript(id: str):
    return transcribe.retrieve_transcript(id)

def get_by_user(**kwargs):
    return transcribe.get_by_user(**kwargs)

def remove_transcript(id: str):
    return transcribe.remove_transcript(id)

def remove_data_by_email(email: str):
    return "None"