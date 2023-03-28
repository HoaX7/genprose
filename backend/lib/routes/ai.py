from lib.helpers.constants import CONTENT_TYPES, PROGRESSIVE_STATUS
from lib.helpers.constants import CONTENT_TYPE_LIST
from lib.Logging.logger import logger
from flask import Blueprint, make_response, request
from controller import transcript_controller as Transcription
from lib.Auth.index import login_required
import json

ai_service = Blueprint("ai_service", __name__)


@ai_service.route("/transcribe", methods={"POST"})
@login_required
def load_transcription():
    try:
        data = request.json
        if not request.user or not request.user["email"]:
            logger.debug("Request user details not found")
            return "Unauthorized", 401
        if not data["url"]:
            return "Expected 'url' property in JSON body", 422

        result = Transcription.get_yt_video_from_url(data["url"], request.user["email"])
        logger.info("lib.routes.ai.load_transcription: result", result)
        return result, 200
    except Exception as e:
        print(e)
        logger.error("lib.routes.ai.load_transcription: ERROR", e)
        return "Invalid JSON body", 400


@ai_service.route("/extract_keywords", methods=["POST"])
@login_required
def extract_keywords():
    try:
        data = request.json
        if not request.user or not request.user["email"]:
            return "Unauthorized", 401
        if not data["text"]:
            return "Expected 'text' property in JSON body", 422

        use_chatgpt_for_keywords = False
        if data.get("use_chatgpt_for_keywords", "") == True:
            use_chatgpt_for_keywords = True

        result = Transcription.extract_keywords(
            data["text"], use_chatgpt_for_keywords, request.user["email"]
        )
        logger.info("lib.routes.ai.extract_keywords: result", result)
        return result, 200
    except Exception as e:
        print(e)
        logger.error("lib.routes.ai.extract_keywords: ERROR", e)
        return "Invalid JSON body", 400


"""
    This route is currently being used to
    generate transcript from video & generate keywords.

    @Route has been deprecated
"""


@ai_service.route("/get_transcript", methods=["POST"])
@login_required
def get_transcript_and_keywords():
    try:
        data = request.json
        if not data["url"]:
            return "Expected 'url' property in JSON body", 422

        use_chatgpt_for_keywords = False
        if data.get("use_chatgpt_for_keywords", "") == True:
            use_chatgpt_for_keywords = True

        result = Transcription.get_yt_video_from_url(data["url"])
        text = result["text"]
        keywords = Transcription.extract_keywords(text, use_chatgpt_for_keywords)

        resp = {"keywords": keywords, "transcript": text}
        logger.info("lib.routes.ai.get_transcript_and_keywords: result", resp)
        return resp, 200
    except Exception as e:
        print(e)
        logger.error("lib.routes.ai.get_transcript_and_keywords: ERROR", e)
        return "Unable to generate transcript", 500


@ai_service.route("/generate_content", methods=["POST"])
@login_required
def get_content_from_keywords():
    try:
        data = request.json
        if not request.user or not request.user["email"]:
            return "Unauthorized", 401
        if not data["prompt"]:
            return "Expected 'prompt' property in JSON body", 422

        model_engine = data.get("engine", "")
        is_priority = data.get("is_priority", "") or False
        result = Transcription.get_content_from_keywords(
            data["prompt"], engine=model_engine, email=request.user["email"], is_priority=is_priority
        )
        return result, 200
    except Exception as e:
        print(e)
        logger.error("lib.routes.ai.get_content_from_keywords: ERROR", e)
        return "Unable to generate content", 500


@ai_service.route("/fetch_by_email", methods=["GET"])
@login_required
def fetch_by_email():
    try:
        params = request.args.to_dict()
        content_type = params.get("content_type")
        print(request.user)
        if not request.user or not request.user["email"]:
            return "Unauthorized", 401
        if not content_type:
            return "Expected 'content_type' proprety in query params", 422
        elif content_type not in CONTENT_TYPE_LIST:
            return f"'content_type' must be one of {CONTENT_TYPE_LIST}", 422
        result = Transcription.get_by_email(
            email=request.user["email"], content_type=content_type
        )
        for entry in result:
            if entry["content"] and entry["content_type"] in [
                CONTENT_TYPES.EXTRACT_KEYWORDS,
                CONTENT_TYPES.EXTRACT_CONTENT,
            ] and entry["status"] == PROGRESSIVE_STATUS.COMPLETED:
                entry["content"] = json.loads(entry["content"])
        return result, 200
    except Exception as e:
        print(e)
        return "Unable to fetch data", 500


@ai_service.route("/retrieve_transcript", methods=["POST"])
@login_required
def retrieve_transcript():
    try:
        data = request.json
        if not data["unique_id"]:
            return "Expected 'unique_id' property in json body", 422
        if not request.user or not request.user["email"]:
            return "Unauthorized", 401

        _result = Transcription.get_by_email(
            unique_id=data["unique_id"], email=request.user["email"]
        )
        result = _result[0]
        if (
            result["content_type"]
            in [CONTENT_TYPES.EXTRACT_CONTENT, CONTENT_TYPES.EXTRACT_KEYWORDS]
            and result["status"] == PROGRESSIVE_STATUS.COMPLETED
        ):
            result["content"] = json.loads(result["content"])
        return result, 200
    except Exception as e:
        print(e)
        logger.error("lib.routes.ai.get_content_from_keywords: ERROR", e)
        return "Unable to generate content", 500


@ai_service.route("/preview_transcript", methods=["POST"])
def preview_trnascript():
    try:
        data = request.json
        if not data["unique_id"]:
            return "Expected 'unique_id' property in JSON body", 422

        result = Transcription.retrieve_transcript(data["unique_id"])
        return result, 200
    except Exception as e:
        print(e)
        return "Unable to fetch content", 500


@ai_service.route("/remove_transcript", methods=["POST"])
@login_required
def remove_transcript():
    try:
        data = request.json
        if not data["unique_id"]:
            return "Expected 'unique_id' property in JSON body", 422

        Transcription.remove_transcript(data["unique_id"])
        return "Data removed", 200
    except Exception as e:
        print(e)
        return "Unable to remove data", 500


@ai_service.route("/remove_transcript_by_email", methods=["POST"])
@login_required
def remove_by_email():
    try:
        if not request.user or not request.user["email"]:
            return "Unauthorized", 401

        Transcription.remove_data_by_email(request.user["email"])
        return "Data removed", 200
    except Exception as e:
        print(e)
        return "Unable to remove data", 500
