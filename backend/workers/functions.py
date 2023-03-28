from lib.utils.index import async_wrapper
import lib.models.Extractor as Extractor
import lib.Transcription.content as content_extractor
import lib.Transcription.keywords as keyword_extractor
from lib.Transcription.transcribe import Transcribe
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
import json

Transcript = Transcribe()

# @async_wrapper
def process_tasks(unique_id, args, content_type, email, **kwargs):
    try:
        print(f"Processing task for unique_id: {unique_id}")
        params = json.loads(args)
        if content_type == CONTENT_TYPES.EXTRACT_TRANSCRIPT:
            return Transcript.extract_transcript(
                params["path"], unique_id, args=params, email=email
            )
        elif content_type == CONTENT_TYPES.EXTRACT_KEYWORDS:
            return keyword_extractor.start_keyword_extraction(
                params["text"],
                params["use_chatgpt_for_keywords"],
                unique_id,
                args=params,
            )
        elif content_type == CONTENT_TYPES.EXTRACT_CONTENT:
            return content_extractor.start_content_generation(
                params["prompt"],
                "davinci",
                unique_id,
                args=params,
                send_mail=True,
                email=email,
            )
        print(f"Content type did not match for: {content_type}")
        return
    except Exception as e:
        print("ERROR: ", e)
        return
