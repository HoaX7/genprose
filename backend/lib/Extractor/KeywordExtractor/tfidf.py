"""
    @doc
    Extract keywords from transcription
    using the TF-IDF method
"""

import nltk
nltk.download("stopwords")
nltk.download("wordnet")
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from lib.utils.index import divide_chunks
import numpy as np
import pandas as pd

stop_words = stopwords.words("english")
# You can extend stop_words to remove common
# useless words like 'http', 'https' etc
stop_words.extend([ "ha", "ok", "okay", "see", "look", "let" ])

class TFIdfModel:
    def __init__(self):
        pass

    """
        Preprocess text by removing
        conjunction and other grammar participles
        using stop words.
    """
    def preprocess(self, text: str) -> str:
        ps = WordNetLemmatizer()
        preprocess_text = text.lower().split()
        preprocess_text = [ps.lemmatize(word) for word in preprocess_text]
        preprocess_text = [word for word in preprocess_text if not word in set(stop_words)]
        return " ".join(preprocess_text)

    """
        Logic can be improved for better results
        and keyword list can be shuffled.
    """
    def extract_keywords(self, text: str) -> str:
        if type(text) != str:
            raise Exception("Invalid text type. Expected type 'str'")

        data = self.preprocess(text)
        avg = self.vectorize(data, 3)

        # Consider top 50 results
        # and convert them into 10 lists of 5 words
        avg = avg[:50]
        keyword_list = divide_chunks(avg.tolist(), 10)

        return list(keyword_list)

    def vectorize(self, data: str, matrix_range = 1):
        cv = TfidfVectorizer(ngram_range=(matrix_range,matrix_range))

        # Need to split every sentence
        corpus = cv.fit_transform(list(data.split(".")))

        avg = corpus.mean(axis=0)
        avg = pd.DataFrame(avg, columns=cv.get_feature_names_out())
        avg = avg.T
        avg = avg.rename(columns={0: "score"})
        avg["word"] = avg.index
        avg = avg.sort_values("score", ascending=False)
        return avg["word"]

