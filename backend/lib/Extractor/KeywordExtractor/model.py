from lib.Extractor.KeywordExtractor.tfidf import TFIdfModel
from lib.Openai.model import ChatGPTModel
from lib.utils.index import divide_chunks
from lib.Logging.logger import logger

gpt_model = ChatGPTModel()
tfidf_model = TFIdfModel()


class KeywordExtractorModel:
    def __init__(self, **kwargs):
        self.use_chatgpt_for_keywords = (
            kwargs.get("use_chatgpt_for_keywords", "") or False
        )

        # README
        # fetch 50 keywords for non premium users and 100 for premium users
        self.number_of_keywords = 50  # 100 - premium

    def extract_keywords(self, text: str) -> list[str]:
        keyword_timer = logger.start_timer()
        if self.use_chatgpt_for_keywords == True:
            logger.info("Using chat-gpt model to extract keywords")

            # setting the context to generate content from
            prompt = f"""fetch {self.number_of_keywords} keywords from this transcript. 
            give me the response in sentences without numerics. 
            end each keyword with a full stop. remove extra spaces.
            consider this transcript as the context for all of the new prompt. 
            the context changes when a new transcript is provided. script: {text}"""
            

            text = gpt_model.generate_content(prompt, "text-davinci-003")
            keyword_list = text.replace("\n", "").split(".")
            keyword_list = list(filter(None, keyword_list))
            logger.end_timer("keyword_extracted_by_chatgpt", keyword_timer)
            return keyword_list

        logger.info("Using TF-IDF model to extract keywords")
        logger.end_timer("keyword_extracted_by_tfidf", keyword_timer)
        result = tfidf_model.extract_keywords(text, self.number_of_keywords)
        return result
