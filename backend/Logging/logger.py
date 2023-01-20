from Logging.gcp import GCPLogger

logger_instance = GCPLogger

class Logger:
    def __init__(self):
        self.logger = logger_instance()

    def info(self, *args, **kwargs):
        self.logger.info(*args, **kwargs)
    
    def warn(self, *args, **kwargs):
        self.logger.warn(*args, **kwargs)

    def error(self, *args, **kwargs):
        self.logger.error(*args, **kwargs)

logger = Logger()