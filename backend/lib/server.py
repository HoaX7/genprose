from flask import Flask, request, jsonify, make_response
from lib.routes.service import backend_service
from lib.routes.ai import ai_service
from lib.logging.logger import logger
import traceback
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

cors_whitelist = os.getenv("CORS_WHITELIST")
CORS(app, supports_credentials=True, origins="*", expose_headers=["Set-Cookie", "Authorization"])

app.register_blueprint(backend_service)
app.register_blueprint(ai_service, url_prefix="/ai")

# @app.before_request
# def log_request_info():
#     logger.info("Inbound request", request.remote_addr, request.method, request.scheme, request.full_path)

@app.after_request
def log_response_info(response):
    """
        response.data seems to be returning 'byte' class,
        need to add response decorators to return appropriate format.
    """
    # resp_data = str(response.get_data(), 'utf-8')
    response.headers["Content-type"] = "application/json"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

    # Logging outbound request
    # logger.info("Outbound response", request.remote_addr, request.method, request.scheme, request.full_path,
    # response.status, { "data": resp_data })
    # response = make_response({
    #     "success": True,
    #     "data": response.get_data()
    # })
    return response

@app.errorhandler(Exception)
def handle_exceptions(e):
    tb = traceback.format_exc()
    logger.error("INTERNAL SERVER ERROR", request.remote_addr, request.method, request.scheme, request.full_path, tb)

@app.errorhandler(404)
def handle_no_endpoint(e):
    logger.error("Route does not exist", request.remote_addr, request.method, request.scheme, request.full_path)
    return "Route not found", 404

