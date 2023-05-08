from dotenv import load_dotenv
import os

load_dotenv()
from lib.Transcription.extract_transcript import extract_transcript
from lib.Transcription.extract_keywords import start_keyword_extraction
from lib.Transcription.extract_content import generate_content
from lib.helpers.openai import get_sample_prompt
import asyncio
import lib.models.Content as Content
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
from lib.Logging.logger import logger


# https://www.youtube.com/watch?v=Xc6G3oV24yE
# sample youtube links
def process(item):
    id = item["id"]
    try:
        params = item["args"]
        user_id = item["user_id"]
        transcript = extract_transcript(
            params["path"], id, args=params, user_id=user_id
        )

        logger.info(
            f"transcript extraction completed. Starting keyword extraction with transcript:",
            transcript,
        )
        Content.update(
            id,
            {"content_type": CONTENT_TYPES.EXTRACT_KEYWORDS, "transcript": transcript},
        )

        keywords = start_keyword_extraction(item["id"], transcript, False)
        logger.info(f"keyword extraction completed, Starting content generation")
        Content.update(
            id, {"content_type": CONTENT_TYPES.EXTRACT_CONTENT, "keywords": keywords}
        )

        persona = params.get("persona", "")
        tone = params.get("tone", "")
        prompt = get_sample_prompt(keywords, persona, tone)
        result = generate_content(
            id=id,
            user_id=user_id,
            prompt=prompt,
            send_mail=True
        )
        Content.update_content(id, result, True)
        logger.info(f"content generation completed. Lifecycle completed")
    except Exception as e:
        print("worker.py: Extraction Failed", e)
        Content.update(
            id,
            {
                "status": PROGRESSIVE_STATUS.ERROR,
                "meta": {"error": "Unknown error occured"},
            },
        )


async def start_task():
    while True:
        try:
            print(
                f"Starting tasks for content_type: {CONTENT_TYPES.EXTRACT_TRANSCRIPT}"
            )
            queue_list = Content.get_rows_by_content_type(
                PROGRESSIVE_STATUS.QUEUED, CONTENT_TYPES.EXTRACT_TRANSCRIPT
            )
            print(f"Queuing {len(queue_list)} tasks")
            for item in queue_list:
                process(item)
        except Exception as e:
            print("ERROR: ", e)
        finally:
            print("Sleeping for 5 seconds...")
            # break
            await asyncio.sleep(5)
            # break


async def main():
    print("Service worker started...")
    producer = asyncio.create_task(start_task())
    await asyncio.gather(producer)
    print("All tasks completed...")


if __name__ == "__main__":
    asyncio.run(main())
