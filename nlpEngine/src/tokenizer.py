import codecs
import jieba
import re

with codecs.open("./dict/stopwords.txt", encoding='utf-8') as stopword_file:
    stop_words = stopword_file.read().splitlines()

def tokenize(sentence):
    sentence = sentence.lower()
    # replace space into signle space 
    sentence = re.sub(r"\s+", ' ', sentence)
    tokens = jieba.lcut(sentence)
    tokens = [ token for token in tokens if token not in stop_words ]
    return tokens