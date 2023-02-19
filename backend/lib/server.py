from flask import Flask, request, jsonify, make_response
from lib.routes.service import backend_service
from lib.routes.ai import ai_service
from lib.logging.logger import logger
import traceback
from flask_cors import CORS
import os
import json
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

    resp_data = response.get_data(as_text=True)
    if response.mimetype == "application/json":
        resp_data = json.loads(resp_data)

    json_data = dict(success=True, data=resp_data)
    if response.status_code not in [200, 201]:
        json_data.update({"error": True, "message": resp_data})
        json_data.pop("success")
        json_data.pop("data")

    print(resp_data)
    response.set_data(json.dumps(json_data))

    response.headers["Content-type"] = "application/json"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

    # Logging outbound request
    # logger.info("Outbound response", request.remote_addr, request.method, request.scheme, request.full_path,
    return response

@app.errorhandler(Exception)
def handle_exceptions(e):
    tb = traceback.format_exc()
    logger.error("INTERNAL SERVER ERROR", request.remote_addr, request.method, request.scheme, request.full_path, tb)

@app.errorhandler(404)
def handle_no_endpoint(e):
    logger.error("Route does not exist", request.remote_addr, request.method, request.scheme, request.full_path)
    return "Route not found", 404

# main driver function
if __name__ == '__main__':
 
    # run() method of Flask class runs the application
    # on the local development server.
    app.run()