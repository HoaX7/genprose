
"""
    - Extract keywords from audio Transcript
"""

import json
from uuid import uuid4
import lib.models.Content as Extractor
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
from lib.Extractor.KeywordExtractor.model import KeywordExtractorModel
from lib.Logging.logger import logger

"""
    @api route
    '/ai/extract_keywords'
"""
def extract_keywords(
    text: str, email: str, use_chatgpt_for_keywords: bool = False
) -> str:
    try:
        return "ok"
        # unique_id = uuid4().hex
        # Extractor.create(
        #     unique_id=unique_id,
        #     content="[]",
        #     args=json.dumps(
        #         {
        #             "text": text,
        #             "use_chatgpt_for_keywords": use_chatgpt_for_keywords,
        #             "unique_id": unique_id,
        #         },
        #         separators=(",", ":"),
        #     ),
        #     content_type=CONTENT_TYPES.EXTRACT_KEYWORDS,
        #     status=PROGRESSIVE_STATUS.QUEUED,
        #     email=email,
        # )
        # return unique_id
    except Exception as e:
        print(e)
        logger.error("transcribe.extract_keywords: ERROR", {"error": e})
        return "Unable to extract keywords", 500

"""
    - This method is used by service_worker.py
    to start keyword extraction in the queue.
"""
def start_keyword_extraction(
    text: str, use_chatgpt_for_keywords: bool, unique_id: str, **kwargs
):
    try:
        return "ok"
        # Extractor.update(unique_id, {"status": PROGRESSIVE_STATUS.INPROGRESS})
        # result = __get_keywords(text, use_chatgpt_for_keywords)
        # Extractor.update(
        #     unique_id,
        #     {
        #         "content": json.dumps(result, separators=(",", ":")),
        #         "status": PROGRESSIVE_STATUS.COMPLETED,
        #     },
        # )
    except Exception as e:
        # Extractor.update(unique_id, {"status": PROGRESSIVE_STATUS.QUEUED})
        print(e)

def __get_keywords(text: str, use_chatgpt_for_keywords: bool):
    keyword_extractor_model = KeywordExtractorModel(
            use_chatgpt_for_keywords=use_chatgpt_for_keywords
        )
    return keyword_extractor_model.extract_keywords(text)