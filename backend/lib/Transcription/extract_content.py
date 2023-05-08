import lib.models.Content as Content
from lib.helpers.constants import PROGRESSIVE_STATUS, CONTENT_TYPES
from lib.Logging.logger import logger
from lib.utils.mail_service import mailer
import os
import importlib
import multiprocessing

WEB_APP_URL = os.getenv("WEB_APP_URL")

"""
    This function is used by router.
"""


def generate_content(**kwargs):
    try:
        user_id = kwargs.get("user_id")
        id = kwargs.get("id")
        prompt = kwargs.get("prompt")
        fetch_from_raw_prompt = kwargs.get("fetch_from_raw_prompt")
        engine = kwargs.get("engine")
        update_status = kwargs.get("update_status") or True
        send_mail = kwargs.get("send_mail") or False
        is_priority = kwargs.get("is_priority")

        if is_priority == True:
            start_process(id, prompt, engine, send_mail)
            return id
        # if not id or not user_id:
        #     raise Exception("Expected 'user_id' and 'id'")
        # result = Content.get_by_user_id(user_id, id=id)
        # result = result[0]
        # if not result:
        #     raise Exception("No data available for id: ", id)

        # if not fetch_from_raw_prompt:
        #     keywords = result["keywords"]
        #     prompt += f"keywords: {','.join(keywords)}"

        text = __get_content(prompt, engine)
        # if not text:
        #     raise Exception("No content was geneerated")
        # Content.update_content(id, text.strip(), True)

        return text
    except Exception as e:
        print(e)
        # Content.update(
        #     id,
        #     {
        #         "status": PROGRESSIVE_STATUS.ERROR,
        #         "meta": {"error": "Unknown error occured"}
        #     }
        # )
        # return "Unable to generate content"
        raise Exception(e)


def start_process(id, prompt: str, engine: str, send_mail: bool):
    background_process = multiprocessing.Process(
        target=__start_priority_func, args=(id, prompt, engine, send_mail)
    )
    background_process.daemon = True
    background_process.start()
    print(f"Spawned daemon process: {background_process.pid}")


def __start_priority_func(id, prompt: str, engine: str, send_mail: bool):
    result = __get_content(prompt, engine)
    logger.info("__start_priority_func: daemon task completed")

    Content.update_content(id, result, True)

    # if send_mail == True:
    #     mailer.send_mail()
    # current_process = multiprocessing.current_process()
    # if current_process:
    #     current_process.terminate()


def __get_content(prompt: str, engine: str):
    module = importlib.import_module("lib.Openai.model")

    content_model = module.ChatGPTModel()
    logger.info(
        "lib.Transcription.transcribe.get_content_from_keywords: generating content from prompt - ",
        prompt,
    )
    content_timer = logger.start_timer()
    result = content_model.generate_content(prompt, engine)
    logger.end_timer("get_content_from_keywords", content_timer)
    return result


def __prepare_email_body(id: str) -> str:
    msg = f"""
        <html>
            <body>
                <h1>We have generated a sample content for you. Click on the link below to view.</h1>
                <a target="_blank" href={WEB_APP_URL}/content/{id}>view generated content</a>
                <br />
                <p>Want to get private content? Become a premium user now!</p>
        </body>
        </html>
    """
    return msg
