# # from threading import Thread
from dotenv import load_dotenv
import os
load_dotenv()
import asyncio
import lib.models.Content as Content
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
from workers.functions import process_tasks
import argparse
import sys


parser = argparse.ArgumentParser()
parser.add_argument(
    "content_type",
    type=str,
    choices=[
        CONTENT_TYPES.EXTRACT_CONTENT,
        CONTENT_TYPES.EXTRACT_KEYWORDS,
        # CONTENT_TYPES.EXTRACT_TRANSCRIPT,
        CONTENT_TYPES.EXTRACT_CONTENT.lower(),
        CONTENT_TYPES.EXTRACT_KEYWORDS.lower(),
        # CONTENT_TYPES.EXTRACT_TRANSCRIPT.lower(),
    ],
    help="input a content type to start extraction process",
)
args = parser.parse_args(args=None if sys.argv[1:] else ['--help'])

async def start_task():
    # while True:
    try:
        content_type = args.content_type
        if not content_type:
            sys.exit(0)
        else:
            content_type = content_type.upper()
        print(f"Starting task for content_type: {content_type}")
        queue_list = Content.get_rows_by_content_type(PROGRESSIVE_STATUS.QUEUED, content_type)
        print(f"Queuing {len(queue_list)} tasks")
        tasks = []
        for item in queue_list:
            print(item["id"])
            process_tasks(
                    item["id"],
                    {"transcript": item["transcript"], "keywords": item["keywords"]},
                    item["content_type"],
                    item["user_id"]
                )

        # print(f"Executing {len(tasks)} Tasks")
        # await asyncio.gather(*tasks)
    except Exception as e:
        print("ERROR: ", e)
    finally:
        print("Sleeping for 5 seconds...")
        # await asyncio.sleep(5)


async def main():
    print("Service worker started...")
    producer = asyncio.create_task(start_task())
    await asyncio.gather(producer)
    print("All tasks completed...")


asyncio.run(main())
