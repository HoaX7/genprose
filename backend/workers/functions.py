from lib.helpers.openai import get_sample_prompt
import lib.Transcription.extract_content as content_extractor
import lib.Transcription.extract_keywords as keyword_extractor
from lib.Transcription.transcribe import Transcribe
from lib.helpers.constants import CONTENT_TYPES

Transcript = Transcribe()

def process_tasks(id, args, content_type, user_id, **kwargs):
    try:
        print(f"Processing task for id: {id}")
        if content_type == CONTENT_TYPES.EXTRACT_KEYWORDS:
            return keyword_extractor.start_keyword_extraction(
                id,
                args["transcript"],
                False
            )
        elif content_type == CONTENT_TYPES.EXTRACT_CONTENT:
            return content_extractor.generate_content(
                user_id=user_id,
                id=id,
                prompt=get_sample_prompt(args["keywords"])
            )
        print(f"Content type did not match for: {content_type}")
        return
    except Exception as e:
        print("ERROR: ", e)
        return
