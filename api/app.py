from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and file.filename.endswith('.csv'):
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        
        try:
            df = pd.read_csv(filepath)
            if 'Job Title' not in df.columns or 'Job Description' not in df.columns:
                return jsonify({'error': 'CSV must contain Job Title and Job Description columns'}), 400
            
            jobs = df[['Job Title', 'Job Description']].to_dict('records')
            return jsonify({'jobs': jobs}), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file format'}), 400

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith('.csv')]
        if not files:
            return jsonify({'jobs': []}), 200
        
        latest_file = max([os.path.join(UPLOAD_FOLDER, f) for f in files], key=os.path.getmtime)
        df = pd.read_csv(latest_file)
        jobs = df[['Job Title', 'Job Description']].to_dict('records')
        return jsonify({'jobs': jobs}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)