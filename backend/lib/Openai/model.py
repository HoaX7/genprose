import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

model_engine = "text-davinci-003" 

class ChatGPTModel:
    def __init__(self):
        pass

    def generate_content(self, prompt: str) -> str:
        return openai.Completion.create(
            engine=model_engine,
            prompt=prompt,
            max_tokens=1024,
            n=1,
            stop=None,
            temperature=0.5
            )
