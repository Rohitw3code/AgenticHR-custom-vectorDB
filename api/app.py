from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import csv
import json
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure upload folders
UPLOAD_FOLDER = 'uploads'
JOBS_FOLDER = os.path.join(UPLOAD_FOLDER, 'jobs')
RESUMES_FOLDER = os.path.join(UPLOAD_FOLDER, 'resumes')
APPLICATIONS_FILE = os.path.join(UPLOAD_FOLDER, 'applications.json')

# Create upload folders if they don't exist
os.makedirs(JOBS_FOLDER, exist_ok=True)
os.makedirs(RESUMES_FOLDER, exist_ok=True)

# Store the current jobs CSV filename
current_jobs_file = None

# Initialize applications file if it doesn't exist
if not os.path.exists(APPLICATIONS_FILE):
    with open(APPLICATIONS_FILE, 'w') as f:
        json.dump([], f)

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

@app.route('/api/apply', methods=['POST'])
def apply_job():
    data = request.json
    if not data or 'jobTitle' not in data or 'applicantName' not in data or 'resumeFile' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        with open(APPLICATIONS_FILE, 'r') as f:
            applications = json.load(f)
        
        applications.append({
            'jobTitle': data['jobTitle'],
            'applicantName': data['applicantName'],
            'resumeFile': data['resumeFile'],
            'appliedAt': datetime.now().isoformat()
        })
        
        with open(APPLICATIONS_FILE, 'w') as f:
            json.dump(applications, f)
        
        return jsonify({'message': 'Application submitted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/applications', methods=['GET'])
def get_applications():
    try:
        with open(APPLICATIONS_FILE, 'r') as f:
            applications = json.load(f)
        return jsonify(applications)
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
        return jsonify({'message': 'Resume uploaded successfully', 'filename': filename}), 200
    
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)