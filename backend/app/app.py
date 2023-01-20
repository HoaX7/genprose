from flask import Flask, request, jsonify, make_response
from routes.service import backend_service
from Logging.logger import logger
import traceback

app = Flask(__name__)
app.register_blueprint(backend_service)

@app.before_request
def log_request_info():
    logger.info("Inbound request", request.remote_addr, request.method, request.scheme, request.full_path)

@app.after_request
def log_response_info(response):
    """
        response.data seems to be returning 'byte' class,
        need to add response decorators to return appropriate format.
    """
    resp_data = str(response.get_data(), 'utf-8')
    response.headers["Content-type"] = "application/json"

    # Logging outbound request
    logger.info("Outbound response", request.remote_addr, request.method, request.scheme, request.full_path,
    response.status, data=resp_data)

    return response

@app.errorhandler(Exception)
def handle_exceptions(e):
    tb = traceback.format_exc()
    logger.error("INTERNAL SERVER ERROR", request.remote_addr, request.method, request.scheme, request.full_path, tb)
