# from lib.utils.index import unlinkFile
from lib.helpers.openai import get_sample_prompt

# from lib.Whisper.model import WhisperModel
import lib.models.Content as Content
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
from lib.Transcription.extract_content import generate_content

# from uuid import uuid4
# import json

from lib.helpers.constants import TRANSCRIPTION_MODELS
from lib.Transcription.index import Transcript

"""
    - This method is used by transcript_worker.py to
    start the transcript extraction from downloaded audio files
"""


def extract_transcript(path, id, **kwargs):
    try:
        user_id = kwargs.get("user_id")
        Content.update(
            id,
            {
                "status": PROGRESSIVE_STATUS.INPROGRESS,
                "transcript_model": f"{TRANSCRIPTION_MODELS.ASSEMBLYAI}",
            },
        )

        resp = transcribe_from_assembly_ai(path)
        # resp = transcribe_from_deepgram(path, False, False)

        # update extracted transcript and start keyword extraction
        # Content.update(
        #     id, {"content_type": CONTENT_TYPES.EXTRACT_KEYWORDS, "transcript": resp}
        # )

        # generate_content(
        #     id=id,
        #     user_id=user_id,
        #     prompt=get_sample_prompt(resp),
        #     fetch_from_raw_prompt=True,
        #     update_status=False,
        # )
        print("Processing completed...")

        # unlinkFile(path)
        return resp
    except Exception as e:
        print("Unable to extract transcript: ", e)
        Content.update(
            id,
            {
                "status": PROGRESSIVE_STATUS.ERROR,
                "meta": {"error": "unknown error occured"},
            },
        )


def transcribe_from_assembly_ai(path: str):
    model = Transcript(path, TRANSCRIPTION_MODELS.ASSEMBLYAI)
    return model.extract_transcript()


def transcribe_from_deepgram(path: str, premium_tier, luxury_tier):
    model = Transcript(path, TRANSCRIPTION_MODELS.DEEPGRAM, premium_tier, luxury_tier)
    return model.extract_transcript()
