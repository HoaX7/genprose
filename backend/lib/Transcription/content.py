import json
from time import sleep
from uuid import uuid4
import lib.models.Extractor as Extractor
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
from lib.Logging.logger import logger
from lib.Openai.model import ChatGPTModel
from lib.utils.mail_service import mailer
import os
from lib.utils.index import async_wrapper
import asyncio
import multiprocessing

WEB_APP_URL = os.getenv("WEB_APP_URL")
content_model = ChatGPTModel()

"""
    - This method is used by service_worker.py
    to start content generation from the provided prompt.
"""
def start_content_generation(prompt: str, engine: str, unique_id: str, **kwargs):
    try:
        Extractor.update(unique_id, {"status": PROGRESSIVE_STATUS.INPROGRESS})
        result = __get_content(prompt, engine)
        send_mail = kwargs.get("send_mail") or False
        email = kwargs.get("email")
        if send_mail == True:
            print(f"Sending email to: {email}")
            mailer.send_mail(
                subject="Your Content is Ready",
                receiver_email=email,
                message=__prepare_email_body(unique_id),
                is_html=True
            )

        Extractor.update(
            unique_id,
            {"content": json.dumps(result), "status": PROGRESSIVE_STATUS.COMPLETED},
        )
    except Exception as e:
        print(e)
        Extractor.update(unique_id, {"status": PROGRESSIVE_STATUS.QUEUED})

"""
    @param {is_priority} - boolean
    This param is used to generate content on priority
    without adding the task to the queue
"""
def get_content_from_prompt(prompt: str, **kwargs) -> str:
    try:
        unique_id = uuid4().hex
        engine = kwargs.get("engine")
        email = kwargs.get("email")
        is_priority = kwargs.get("is_priority")
        status = PROGRESSIVE_STATUS.QUEUED
        if is_priority == True:
            start_process(unique_id, prompt)
            status = PROGRESSIVE_STATUS.PRIORITY_QUEUE

        # Extractor.create(
        #         unique_id=unique_id,
        #         content="{}",
        #         args=json.dumps(
        #             {"prompt": prompt, "engine": engine}, separators=(",", ":")
        #         ),
        #         content_type=CONTENT_TYPES.EXTRACT_CONTENT,
        #         status=status,
        #         email=email,
        #     )
        return unique_id
    except Exception as e:
        print(e)
        logger.error(
            "Transcription.content.get_content_from_keywords: ERROR", {"error": e}
        )
        return "Unable to generate content"

processes = {}
def start_process(unique_id: str, prompt: str):
    background_process = multiprocessing.Process(target=__start_priority_func, args=(unique_id, prompt))
    background_process.daemon = True
    background_process.start()
    print(f"Spawned daemon process: {background_process.pid}")
    processes[unique_id] = background_process
    print("inside same func", processes.get(unique_id))

def __start_priority_func(unique_id: str, prompt: str):
    sleep(10)
    print("After 10s")
    print("in calling func", processes.get(unique_id))
    # result = __get_content(prompt, "davinci")
    logger.info("__start_priority_func: daemon task completed")
    
    # Extractor.update(unique_id, {"content": json.dumps(result), "status": PROGRESSIVE_STATUS.COMPLETED})

def __get_content(prompt: str, engine: str):
    logger.info(
        "lib.Transcription.transcribe.get_content_from_keywords: generating content from prompt - ",
        prompt,
    )
    content_timer = logger.start_timer()
    result = content_model.generate_content(prompt, engine)
    logger.end_timer("get_content_from_keywords", content_timer)
    return result


def __prepare_email_body(unique_id: str) -> str:
    msg = f"""
        <html>
            <body>
                <h1>We have generated a sample content for you. Click on the link below to view.</h1>
                <a target="_blank" href={WEB_APP_URL}/content/{unique_id}>view generated content</a>
                <br />
                <p>Want to get private content? Become a premium user now!</p>
        </body>
        </html>
    """
    return msg
