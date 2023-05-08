"""

    File is used to convert / translate YT video audio
    into transcripts

"""
from lib.Transcription.transcribe import Transcribe
import lib.Transcription.extract_content as content_extractor
from lib.Logging.logger import logger
from typing import List

transcribe = Transcribe()

"""
    @parameters: url -> valid youtube url link

    @returns audio transcript
"""
def queue_audio_download_from_url(url: str, email: str, persona: str, tone: str) -> str:
    return transcribe.queue_audio_download_from_url(url, email, persona, tone)

def retrieve_transcript(id: str, is_private: bool):
    return transcribe.retrieve_transcript(id, is_private)

def get_by_user(**kwargs):
    return transcribe.get_by_user(**kwargs)

def remove_transcript(id: str):
    return transcribe.remove_transcript(id)

def remove_data_by_email(email: str):
    return "None"

def generate_content(**kwargs):
    return content_extractor.generate_content(**kwargs)