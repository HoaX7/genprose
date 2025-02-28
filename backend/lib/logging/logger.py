from lib.Logging.gcp import GCPLogger
import time

logger_instance = GCPLogger

"""
    Improvement:- Seperate string and dict log
    for easy lookup on log explorer
"""
class Logger:
    def __init__(self):
        self.logger = logger_instance()

    def prepare_log_dict(self, *params):
        return {("param" + str(idx + 1)): param for idx,param in enumerate(params)}

    def info(self, *params, **kwargs):
        print(*params, **kwargs)
        # self.logger.info(self.prepare_log_dict(*params))
    
    def warn(self, *params, **kwargs):
        pass
        # self.logger.warn(self.prepare_log_dict(*params))

    def error(self, *params, **kwargs):
        pass
        # self.logger.error(self.prepare_log_dict(*params))

    def debug(self, *params, **kwargs):
        self.logger.debug(*params, **kwargs)

    def start_timer(self):
        return time.time()

    def end_timer(self, func_name: str, start_time: int):
        pass
        # self.logger.info(f"function_name {func_name} took {time.time() - start_time} seconds")

logger = Logger()