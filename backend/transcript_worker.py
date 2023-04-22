from dotenv import load_dotenv
import os
load_dotenv()
from lib.Transcription.extract_transcript import extract_transcript
import asyncio
import json
import lib.models.Content as Content
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES

async def start_task():
    while True:
        try:
            print(f"Starting tasks for content_type: {CONTENT_TYPES.EXTRACT_TRANSCRIPT}")
            queue_list = Content.get_rows_by_content_type(PROGRESSIVE_STATUS.QUEUED, CONTENT_TYPES.EXTRACT_TRANSCRIPT)
            print(f"Queuing {len(queue_list)} tasks")
            for item in queue_list:
                params = item["args"]
                extract_transcript(params["path"], item["id"], args=params, user_id=item["user_id"])
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