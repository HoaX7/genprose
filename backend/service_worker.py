# from threading import Thread
import asyncio
import lib.models.Extractor as Extractor
from concurrent.futures import ThreadPoolExecutor
from lib.Transcription.transcribe import Transcribe

Transcript = Transcribe()

async def async_wrapper(func, *args):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, func, *args)
    print("All tasks completed....")

def process_tasks(unique_id, args, content_type):
    try:
        print(f"Processing task for unique_id: {unique_id}")
        params = args.split(",")
        if content_type == "TRANSCRIPT":
            return Transcript.extract_audio(*params, unique_id)
        elif content_type == "KEYWORDS":
            return Transcript.start_keyword_extraction(*params, unique_id)
        elif content_type == "GENERATED_CONTENT":
            return Transcript.start_content_generation(*params, unique_id)
        print(f"Content type did not match for: {content_type}")
        return
    except Exception as e:
        print("ERROR: ", e)
        return

async def start_task():
    while True:
        try:
            print("Starting task...")
            queue_list = Extractor.get_by_in_progress_rows()
            tasks = []
            for item in queue_list:
                tasks.append(async_wrapper(process_tasks, item["unique_id"], item["args"], item["content_type"]))

            print(f"Executing {len(tasks)} Tasks")
            await asyncio.gather(*tasks)
        except Exception as e:
            print("ERROR: ", e)
        finally:
            print("Sleeping for 2 second...")
            await asyncio.sleep(2)

async def main():
    print("Service worker started...")
    producer = asyncio.create_task(start_task())
    await asyncio.gather(producer)
    print("All tasks completed...")

asyncio.run(main())