from lib.logging.log_abstract import LogAbstract
import logging
import sys
import google.cloud.logging
from google.cloud.logging_v2.handlers import CloudLoggingHandler
from google.cloud.logging_v2.resource import Resource

"""
    This file serves as a logging instance to log
    'info', 'warn', 'error', 'debug' levels to GCP
    using abstract methods.
"""
# Create a stream handler to log messages to the console.
stream_handler = logging.StreamHandler(sys.stdout)

service_key_path = "cloud-logging.json"

# Create a resource for Google Cloud Logging.
res = Resource(type="service_account", labels={})

# Create a handler for Google Cloud Logging.
gcloud_logging_client = google.cloud.logging.Client.from_service_account_json(service_key_path)
gcloud_logging_handler = CloudLoggingHandler(
    gcloud_logging_client, name=__name__, resource=res
)
gcloud_logging_client.setup_logging()
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(gcloud_logging_handler)
logger.addHandler(stream_handler)

class GCPLogger(LogAbstract):
    def __init__(self):
        print("Initialize GCP logger...")

    def info(self, params):
        """
            Labels can be used in 'extra' to set a context
        """
        print(params)
        logger.info("info log", extra={"json_fields": { "params": params }})

    def warn(self, params):
        print(params)
        logger.warn("warn log", extra={"json_fields": { "params": params }})

    def error(self, params):
        print(params)
        logger.error("error log", extra={"json_fields": { "params": params }})
