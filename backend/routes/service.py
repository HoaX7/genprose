from flask import Blueprint, make_response

backend_service = Blueprint("backend_service", __name__)

@backend_service.route("/", methods=["GET"])
def main() -> str:
    return "Backend service"