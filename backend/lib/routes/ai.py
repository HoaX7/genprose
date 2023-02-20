from lib.logging.logger import logger
from flask import Blueprint, make_response, request
from controller import transcript_controller as Transcription
from controller.session_controller import set_session
from lib.Auth.index import login_required

ai_service = Blueprint("ai_service", __name__)

@ai_service.route("/transcribe", methods={"POST"})
@login_required
def load_transcription():
    try:
        data = request.json
        if not data["url"]:
            return "Expected 'url' property in JSON body", 422

        result = Transcription.get_yt_video_from_url(data["url"])
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
        if not data["text"]:
            return "Expected 'text' property in JSON body", 422

        use_chatgpt_for_keywords = False
        if data.get('use_chatgpt_for_keywords', '') == True:
            use_chatgpt_for_keywords = True 

        result = Transcription.extract_keywords(data["text"], use_chatgpt_for_keywords)
        logger.info("lib.routes.ai.extract_keywords: result", result)
        return result, 200
    except Exception as e:
        print(e)
        logger.error("lib.routes.ai.extract_keywords: ERROR", e)
        return "Invalid JSON body", 400 

"""
    This route is currently being used to
    generate transcript from video & generate keywords.
"""
@ai_service.route("/get_transcript", methods=["POST"])
@login_required
def get_transcript_and_keywords():
    try:
        data = request.json
        if not data["url"]:
            return "Expected 'url' property in JSON body", 422

        use_chatgpt_for_keywords = False
        if data.get('use_chatgpt_for_keywords', '') == True:
            use_chatgpt_for_keywords = True

        result = Transcription.get_yt_video_from_url(data["url"]) 
        text = result["text"]
        keywords = Transcription.extract_keywords(text, use_chatgpt_for_keywords)

        resp = {
            "keywords": keywords,
            "transcript": text
        }
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
        if not data["prompt"]:
            return "Expected 'prompt' property in json body", 422

        model_engine = data.get('engine', '')
        result = Transcription.get_content_from_keywords(data["prompt"], engine=model_engine)
        return result, 200
    except Exception as e:
        print(e)
        logger.error("lib.routes.ai.get_content_from_keywords: ERROR", e)
        return "Unable to generate content", 500

@ai_service.route("/retrieve_transcript", methods=["POST"])
@login_required
def retrieve_transcript():
    try:
        data = request.json
        if not data["unique_id"]:
            return "Expected 'unique_id' property in json body", 422

        result = Transcription.retrieve_transcript(data["unique_id"])
        return result, 200
    except Exception as e:
        print(e)
        logger.error("lib.routes.ai.get_content_from_keywords: ERROR", e)
        return "Unable to generate content", 500 

@ai_service.route("/remove_transcript", methods=["POST"])
@login_required
def remove_transcript():
    try:
        data = request.json
        if not data["unique_id"]:
            return "Expected 'unique_id' property in json body", 422

        Transcription.remove_transcript(data["unique_id"])
        return "Data removed", 200
    except Exception as e:
        print(e)
        return "Unable to remove data", 500