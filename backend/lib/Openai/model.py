import openai
import os
from lib.logging.logger import logger

openai.api_key = os.getenv("OPENAI_API_KEY")
accepted_models = ["text-davinci-003", "text-curie-001", "text-babbage-001", "text-ada-001"]

class ChatGPTModel:
    def __init__(self):
        pass

    def generate_content(self, prompt: str, model_engine: str) -> str:
        if not model_engine or model_engine not in accepted_models:
            model_engine = accepted_models[0]
        
        if len(prompt) > 4010:
            prompt = prompt[:4010]
        logger.info("Openai.model.generate_content: generating content using model engine: ", model_engine)
        logger.info("with prompt: ", prompt)
        return openai.Completion.create(
            engine=model_engine,
            prompt=prompt,
            max_tokens=1024,
            n=1,
            stop=None,
            temperature=0.5
            )
