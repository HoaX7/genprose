from crypt import methods
from lib.utils.index import check_filepath
from flask import Blueprint, request
from lib.Auth.index import login_required
from module.AssemblyAi.index import Model

test_service = Blueprint("test_service", __name__)

"""
    This is a test route to extract Transcript
    from 'Deepgram' and 'Assembly Ai'
    to compare the results for accuracy.
"""
@test_service.route("/extract_transcript", methods=["GET"])
@login_required
def load_transcript_test():
    try:
        params = request.args.to_dict()
        filename = params.get("filename")
        # filepath = params.get("filepath")
        
        if not filename:
            return "Please provide a valid audio filename", 422

        filepath = f"../downloads/{filename}"
        if not check_filepath(filepath):
            return "Please provide a valid audio filename", 422
        model = Model(filepath, False, False)
        result = model.extract_transcript()
        return result, 200
    except Exception as e:
        print(e)
        return "Unable to transcribe file", 500

@test_service.route("/fetch_transcript_by_id", methods=["GET"])
@login_required
def fetch_transcript_test():
    try:
        params = request.args.to_dict()
        id = params.get("id")
        if not id:
            return "Invalid id provided", 422

        model = Model("dummy", False, False)
        result = model.fetch_transcript(id)
        return result, 200
    except Exception as e:
        print(e)
        return "Unable to fetch transcript", 500

"""
It is required to upload audio file to Assembly Ai directly
before you can transcribe the audio.

Note: Once the audio file is transribed the file is removed
from assembly ai storage. 
"""
@test_service.route("/upload_audio_file", methods=["POST"])
@login_required
def upload_audio_file():
    try:
        params = request.args.to_dict()
        # url = params.get("url")
        filename = params.get("filename")
        
        if not filename:
            return "Please provide a valid audio filename", 422

        filepath = f"../downloads/{filename}"
        model = Model(filepath, False, False)
        result = model.upload()
        return result, 200
    except Exception as e:
        print(e)
        return "Unable to transcribe file", 500 
