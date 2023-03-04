# from threading import Thread
import asyncio
import lib.models.Extractor as Extractor
from concurrent.futures import ThreadPoolExecutor
from lib.Transcription.transcribe import Transcribe
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
import json

Transcript = Transcribe()

async def async_wrapper(func, *args):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, func, *args)
    print("All tasks completed....")

def process_tasks(unique_id, args, content_type):
    try:
        print(f"Processing task for unique_id: {unique_id}")
        params = json.loads(args)
        if content_type == CONTENT_TYPES.EXTRACT_TRANSCRIPT:
            return Transcript.extract_transcript(params["path"], unique_id)
        elif content_type == CONTENT_TYPES.EXTRACT_KEYWORDS:
            return Transcript.start_keyword_extraction(params["text"], 
                params["use_chatgpt_for_keywords"], unique_id)
        elif content_type == CONTENT_TYPES.EXTRACT_CONTENT:
            return Transcript.start_content_generation(params["prompt"], params["engine"], unique_id)
        print(f"Content type did not match for: {content_type}")
        return
    except Exception as e:
        print("ERROR: ", e)
        return

async def start_task():
    while True:
        try:
            print("Starting task...")
            queue_list = Extractor.get_rows_by_status(PROGRESSIVE_STATUS.INPROGRESS)
            tasks = []
            for item in queue_list:
                print(item)
                tasks.append(async_wrapper(process_tasks, item["unique_id"], item["args"] or "", item["content_type"]))

            print(f"Executing {len(tasks)} Tasks")
            await asyncio.gather(*tasks)
        except Exception as e:
            print("ERROR: ", e)
        finally:
            print("Sleeping for 5 seconds...")
            await asyncio.sleep(5)

async def main():
    print("Service worker started...")
    producer = asyncio.create_task(start_task())
    await asyncio.gather(producer)
    print("All tasks completed...")

asyncio.run(main())