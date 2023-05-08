from lib.helpers.constants import PERSONA, TONE
from lib.models.Content import get_by_user_id, update
from lib.helpers.constants import CONTENT_TYPES, PROGRESSIVE_STATUS
from lib.helpers.constants import CONTENT_TYPE_LIST
from lib.Logging.logger import logger
from flask import Blueprint, make_response, request
from controller import transcript_controller as Transcription
from lib.Auth.index import login_required

ai_service = Blueprint("ai_service", __name__)


"""
    @route /ai/transcribe:

    Queue YouTube audio url to download and extract transcript.
    A service worker reads from the 'QUEUED' rows and starts the process.
"""
@ai_service.route("/transcribe", methods={"POST"})
@login_required
def load_transcription():
    try:
        data = request.json
        if not request.user or not request.user["id"]:
            logger.debug("Request user details not found")
            return "Unauthorized", 401
        if not data["url"]:
            return "Expected 'url' property in JSON body", 422

        persona = data.get("persona", "") or PERSONA.CONTENT_CREATOR
        tone = data.get("tone", "") or TONE.PASSIVE

        result = Transcription.queue_audio_download_from_url(data["url"], request.user["id"], persona, tone)
        logger.info("lib.routes.ai.load_transcription: result", result)
        return result, 200
    except Exception as e:
        print(e)
        logger.error("lib.routes.ai.load_transcription: ERROR", e)
        return "Invalid JSON body", 400

@ai_service.route("/generate_content", methods=["POST"])
@login_required
def get_content_from_keywords():
    try:
        data = request.json
        prompt = data.get("prompt", "")
        id = data.get("id", "")
        persona = data.get("persona", "") or PERSONA.CONTENT_CREATOR
        tone = data.get("tone", "") or TONE.PASSIVE

        if not request.user or not request.user["id"]:
            return "Unauthorized", 401
        if not prompt:
            return "Expected 'prompt' property in JSON body", 422
        if not id:
            return "Expected 'id' property in JSON body", 422

        # Read @docs to see all available ChatGPT Models
        # 
        model_engine = "text-davinci-003" #

        # if request.user["is_premium"] == True:
        #     model_engine = "text-davinci-003" # Top model available
        
        is_priority = data.get("is_priority", "") or False
        fetch_from_raw_prompt = data.get("fetch_from_raw_prompt", "") or False


        resp = get_by_user_id(request.user["id"], id=id)
        if len(resp) <= 0:
            return "You are not permitted to perform this action", 403

        params = resp[0]["args"]
        params["persona"] = persona
        params["tone"] = tone
        update(id, {"status": PROGRESSIVE_STATUS.INPROGRESS, "args": params})
        """
            TODO - Enhance the method to also accomodate for premium users
            'is_priority' param tells the controller to generate content on run time


            Note: Choose a better model engine based on user premium
        """
        Transcription.generate_content(
            id=id,
            prompt=prompt,
            user_id=request.user["id"],
            fetch_from_raw_prompt=fetch_from_raw_prompt,
            is_priority=is_priority,
            engine=model_engine
        )
        return {"id": id}, 200
    except Exception as e:
        print(e)
        logger.error("lib.routes.ai.get_content_from_keywords: ERROR", e)
        return "Unable to generate content", 500


@ai_service.route("/fetch_by_userid", methods=["GET"])
@login_required
def fetch_by_email():
    try:
        params = request.args.to_dict()
        content_type = params.get("content_type")
        print(content_type, "fetch content by userid")
        if not request.user or not request.user["id"]:
            return "Unauthorized", 401
        if not content_type:
            return "Expected 'content_type' proprety in query params", 422
        elif content_type not in CONTENT_TYPE_LIST:
            return f"'content_type' must be one of {CONTENT_TYPE_LIST}", 422
        result = Transcription.get_by_user(
            user_id=request.user["id"],
            content_type=content_type,
            status=PROGRESSIVE_STATUS.COMPLETED,
        )
        return result, 200
    except Exception as e:
        print(e)
        return "Unable to fetch data", 500


@ai_service.route("/retrieve_transcript", methods=["GET"])
@login_required
def retrieve_transcript():
    try:
        data = request.args.to_dict()
        if not data["id"]:
            return "Expected 'id' property in json body", 422
        if not request.user or not request.user["id"]:
            return "Unauthorized", 401

        _result = Transcription.get_by_user(id=data["id"], user_id=request.user["id"])
        result = _result[0]
        return result, 200
    except Exception as e:
        print(e)
        logger.error("lib.routes.ai.get_content_from_keywords: ERROR", e)
        return "Unable to generate content", 500


@ai_service.route("/preview_transcript", methods=["GET"])
def preview_trnascript():
    try:
        data = request.args.to_dict()
        if not data["id"]:
            return "Expected 'id' property in JSON body", 422

        result = Transcription.retrieve_transcript(data["id"], False)
        return result, 200
    except Exception as e:
        print(e)
        return "Unable to fetch content", 500


# @ai_service.route("/remove_transcript", methods=["POST"])
# @login_required
# def remove_transcript():
#     try:
#         data = request.json
#         if not data["id"]:
#             return "Expected 'id' property in JSON body", 422

#         Transcription.remove_transcript(data["id"])
#         return "Data removed", 200
#     except Exception as e:
#         print(e)
#         return "Unable to remove data", 500
