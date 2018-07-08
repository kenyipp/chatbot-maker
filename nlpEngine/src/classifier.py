import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.externals import joblib
from tokenizer import tokenize

class NotTrainedError(Exception):
    pass

class Classifier():

    def __init__( self):
        vectorizer = TfidfVectorizer(tokenizer=tokenize)
        self.model = Pipeline([
            ('vtr', vectorizer),
            ('cls', MultinomialNB())
        ])
        self.isFit  = False

    def fit( self, utterances, intent):
        self.isFit = True
        self.model.fit( utterances, intent )
        
    def save( self, path="./output/model.pkl"):
        if not self.isFit:
            raise NotTrainedError("Need to fit model before save. ")
        joblib.dump( self.model, path )
    
    def load( self, path="./output/model.pkl"):
        if ( not os.path.isfile(path) ):
            raise NotTrainedError("Need to fit model before load. ")
        self.isFit = True
        self.model = joblib.load(path)
        

    def predict( self, sentence ):
        if not self.isFit :
            raise NotTrainedError("Need to fit model before predict. ")
        proba = self.model.predict_proba([sentence])[0]
        prediction = [ { "intent": intent, "score": score } for intent, score in zip( self.model.classes_, proba ) ]
        prediction = sorted( prediction, key=lambda obj: obj['score'], reverse=True )
        return prediction

    