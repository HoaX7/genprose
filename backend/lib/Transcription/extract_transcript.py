from lib.utils.index import unlinkFile
from lib.helpers.constants import getSamplePrompt
from lib.Whisper.model import WhisperModel
import lib.models.Extractor as Extractor
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
from uuid import uuid4
import json

model = WhisperModel()

"""
    - This method is used by service_worker.py to
    start the transcript extraction from downloaded audio files
"""

def extract_transcript(path, unique_id, **kwargs):
    try:
        Extractor.update(unique_id, {"status": PROGRESSIVE_STATUS.INPROGRESS})
        result = model.get_transcription(path)
        unlinkFile(path)
        content_uid = uuid4().hex
        args = kwargs.get("args") or {}
        args["text"] = result["text"]
        args["use_chatgpt_for_keywords"] = True # Set True if gpt is faster
        args["generate_content_unique_id"] = content_uid
        Extractor.update(
            unique_id,
            {
                "content": result["text"],
                "args": json.dumps(args),
                "status": PROGRESSIVE_STATUS.QUEUED,
                "content_type": CONTENT_TYPES.EXTRACT_KEYWORDS,
            },
        )

        Extractor.create(
            unique_id=content_uid,
            email=kwargs.get("email"),
            args=json.dumps(
                {
                    "prompt": getSamplePrompt(result["text"]),
                    "link": args["link"] or "",
                },
                separators=(",", ":"),
            ),
            status=PROGRESSIVE_STATUS.QUEUED,
            content_type=CONTENT_TYPES.EXTRACT_CONTENT,
            content="",
        )
    except Exception as e:
        Extractor.update(unique_id, {"status": PROGRESSIVE_STATUS.QUEUED})
        print("Unable to extract transcript: ", e)