from lib.Extractor.KeywordExtractor.tfidf import TFIdfModel
from lib.Openai.model import ChatGPTModel
from lib.utils.index import divide_chunks
from lib.logging.logger import logger

gpt_model = ChatGPTModel()
tfidf_model = TFIdfModel()

class KeywordExtractorModel:
    def __init__(self, **kwargs):
        self.use_chatgpt_for_keywords = kwargs.get('use_chatgpt_for_keywords', '') or False

    def extract_keywords(self, text: str):
        print(self.use_chatgpt_for_keywords)
        if self.use_chatgpt_for_keywords == True:
            logger.info("Using chat-gpt model to extract keywords")
            prompt = f'fetch 50 keywords from this transcript. give me the response in sentences without numerics. end each keyword with a full stop. script: {text}'
            result = gpt_model.generate_content(prompt, 'text-davinci-003')
            text = result["choices"][0]["text"]
            keyword_list = divide_chunks(text.replace("\n", "").split("."), 5)

            return list(keyword_list)

        logger.info("Using TF-IDF model to extract keywords")
        return tfidf_model.extract_keywords(text)
