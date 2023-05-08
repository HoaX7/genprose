import openai
import os
from lib.Logging.logger import logger
from lib.utils.index import divide_chunks
import math

openai.api_key = os.getenv("OPENAI_API_KEY")
accepted_models = ["text-davinci-003", "text-curie-001", "text-davinci-002"]

class ChatGPTModel:
    def __init__(self):
        print("Initializing open ai")

    def __get_max_tokens(self, engine: str):
        #
        # read @docs for better understanding of max_tokens
        # https://platform.openai.com/docs/models/gpt-3-5
        #
        tokens = {
            "text-davinci-003": 4097,
            "text-curie-001": 2049,
            "text-davinci-002": 4097
        }
        return tokens[engine]

    def generate_content(self, prompt: str, model_engine: str) -> str:
        try:
            if not model_engine or model_engine not in accepted_models:
                model_engine = accepted_models[0]
        
            logger.info("Openai.model.generate_content: generating content using model engine: ", model_engine)
            prompt = prompt[:2000]

            # chunk_size = 1000
            # total_chunks = math.ceil(len(prompt) / chunk_size)
            # chunks = divide_chunks(prompt, chunk_size)
            
            # for index, chunk in enumerate(chunks):
            #     idx = index + 1
            #     pre_prompt = ""
            #     if index == 0:
            #         pre_prompt = f"""
            #         the total length of the content i want to send is too large.
            #         For sending you the content, i will follow this rule:
            #         [start part 1/10]
            #         this is the actual content
            #         [end part 1/10]
            #         then you must only acknowledge and only reply 'received 1/10'
            #         And when all parts are sent, i.e [end part 10/10], you will process
            #         and respond to the original request stated in part 1/10.
            #         here's the first part
            #         """
            #     chunk = pre_prompt + f"""
            #     [start part {idx} / {total_chunks}]
            #     {chunk}
            #     [end part {idx} / {total_chunks}]
            #     """
            #     resp = self.__get_content(chunk, model_engine)
            #     print("resp received: ", resp, idx)
            # the max tokens should be calculated based on prompt
            # len as well.
            # split the prompt into multiple prompts with context
            # return self.__get_content(prompt, model_engine)
            return self.__get_content(prompt, model_engine)
        except Exception as e:
            raise Exception(e)
        
    
    def __get_content(self, prompt: str, model_engine: str):
        max_tokens = self.__get_max_tokens(model_engine)
        max_tokens = max_tokens - len(prompt)
        print("sending prompt to gpt", len(prompt), max_tokens)
        if max_tokens <= 0:
            raise Exception(f"max_tokens cannot be negative number: {max_tokens}")
        logger.info("openai fetching data with prompt: ", prompt)
        
        # use the chat model to main context
        result = openai.Completion.create(
                    engine=model_engine,
                    prompt=prompt,
                    max_tokens=max_tokens,
                    n=1,
                    stop=None,
                    temperature=0.5
                    )
        return result["choices"][0]["text"]
