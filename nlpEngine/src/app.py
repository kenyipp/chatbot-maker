from flask import Flask, request, jsonify
from classifier import Classifier
import os

app = Flask(__name__)
classifier = Classifier()
path = './output/model.pkl'

isFit = False

if os.path.isfile(path):
    classifier.load(path)
    
@app.route('/train', methods=['POST'])
def train():
    intents = request.json['intents']
    samples = []
    labels = []

    for intent in intents:
        for sample in intent['utterances']:
            samples.append(sample)
            labels.append(intent['intent'])

    classifier.fit( samples, labels )
    classifier.save()
    return jsonify({})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        text = request.json['text']
        results = classifier.predict(text)
        return jsonify({'error': False, 'data': results})
    except:
        return jsonify({'error': True, 'message':'please train before predict'})

PORT = int(os.getenv("PORT", 8000))
app.run(host='0.0.0.0', port=PORT, debug=True)
print( "nlp Engine is listen at port {}".format(PORT))