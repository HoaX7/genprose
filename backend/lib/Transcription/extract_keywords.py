
"""
    - Extract keywords from audio Transcript
"""

import lib.models.Content as Content
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
from lib.Extractor.KeywordExtractor.model import KeywordExtractorModel
from lib.Logging.logger import logger

"""
    - This method is used by service_worker.py
    to start keyword extraction in the queue.
"""
def start_keyword_extraction(
    id: str, text: str, use_chatgpt_for_keywords: bool, **kwargs
):
    try:
        if not text:
            raise Exception("No transcript available")
        # Content.update(id, {"status": PROGRESSIVE_STATUS.INPROGRESS})
        result = __get_keywords(text, use_chatgpt_for_keywords)
        # Content.update(
        #     id,
        #     {
        #         "keywords": result
        #     },
        # )

        return result
    except Exception as e:
        print(e)
        raise Exception(e)
        # Content.update(id, {"status": PROGRESSIVE_STATUS.ERROR, "meta": {"error": "unknown error occured"}})

def __get_keywords(text: str, use_chatgpt_for_keywords: bool):
    keyword_extractor_model = KeywordExtractorModel(
            use_chatgpt_for_keywords=use_chatgpt_for_keywords
        )
    return keyword_extractor_model.extract_keywords(text)