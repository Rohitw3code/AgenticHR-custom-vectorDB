from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import csv
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configure upload folders
UPLOAD_FOLDER = 'uploads'
JOBS_FOLDER = os.path.join(UPLOAD_FOLDER, 'jobs')
RESUMES_FOLDER = os.path.join(UPLOAD_FOLDER, 'resumes')

# Create upload folders if they don't exist
os.makedirs(JOBS_FOLDER, exist_ok=True)
os.makedirs(RESUMES_FOLDER, exist_ok=True)

# Store the current jobs CSV filename
current_jobs_file = None

@app.route('/api/jobs/upload', methods=['POST'])
def upload_jobs():
    global current_jobs_file
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and file.filename.endswith('.csv'):
        filename = secure_filename(file.filename)
        filepath = os.path.join(JOBS_FOLDER, filename)
        file.save(filepath)
        current_jobs_file = filename
        return jsonify({'message': 'File uploaded successfully'}), 200
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    if not current_jobs_file:
        return jsonify([])
    
    jobs = []
    try:
        with open(os.path.join(JOBS_FOLDER, current_jobs_file), 'r') as file:
            csv_reader = csv.DictReader(file)
            jobs = list(csv_reader)
        return jsonify(jobs)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/resume/upload', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(file.filename)
        filepath = os.path.join(RESUMES_FOLDER, filename)
        file.save(filepath)
        return jsonify({'message': 'Resume uploaded successfully'}), 200
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/resumes', methods=['GET'])
def get_resumes():
    try:
        resumes = [f for f in os.listdir(RESUMES_FOLDER) if f.endswith('.pdf')]
        return jsonify(resumes)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)