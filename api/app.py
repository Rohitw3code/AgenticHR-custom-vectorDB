from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import csv
import json
import sqlite3
from werkzeug.utils import secure_filename
from datetime import datetime
import io
from langchain.document_loaders import PyMuPDFLoader 
from utils import job_summurizer


app = Flask(__name__)
CORS(app)

# Configure upload folders
UPLOAD_FOLDER = 'uploads'
JOBS_FOLDER = os.path.join(UPLOAD_FOLDER, 'jobs')
RESUMES_FOLDER = os.path.join(UPLOAD_FOLDER, 'resumes')
APPLICATIONS_FILE = os.path.join(UPLOAD_FOLDER, 'applications.json')
DATABASE_FILE = os.path.join(UPLOAD_FOLDER, 'applications.db')

# Create upload folders if they don't exist
os.makedirs(JOBS_FOLDER, exist_ok=True)
os.makedirs(RESUMES_FOLDER, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize applications.json if it doesn't exist
if not os.path.exists(APPLICATIONS_FILE):
    with open(APPLICATIONS_FILE, 'w') as f:
        json.dump([], f)




def init_db():
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            username TEXT PRIMARY KEY,
            resume_text TEXT,
            job_title TEXT,
            applied_at TEXT,
            extracted_data TEXT
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/jobs/upload', methods=['POST'])
def upload_jobs():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file.filename.endswith('.csv'):
        try:
            # Attempt to decode with utf-8, fallback to cp1252 if it fails
            try:
                csv_content = file.read().decode('utf-8')
            except UnicodeDecodeError:
                file.seek(0)
                csv_content = file.read().decode('cp1252')  # fallback encoding

            csv_file = io.StringIO(csv_content)
            csv_reader = csv.DictReader(csv_file)

            # Connect to SQLite
            conn = sqlite3.connect(DATABASE_FILE)
            c = conn.cursor()

            # Clear existing jobs
            c.execute('DELETE FROM jobs')

            # Insert new jobs
            for row in csv_reader:
                c.execute('''
                    INSERT INTO jobs (title, description)
                    VALUES (?, ?)
                ''', (row['Job Title'], row['Job Description']))

            conn.commit()
            conn.close()

            return jsonify({'message': 'Jobs uploaded successfully'}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        c = conn.cursor()
        c.execute('SELECT title, description FROM jobs')
        jobs = c.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        jobs_list = [{'Job Title': job[0], 'Job Description': job[1]} for job in jobs]
        return jsonify(jobs_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/apply', methods=['POST'])
def apply_job():
    data = request.json
    if not data or 'jobTitle' not in data or 'applicantName' not in data or 'resumeFile' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Ensure applications.json exists and is valid
        if not os.path.exists(APPLICATIONS_FILE):
            with open(APPLICATIONS_FILE, 'w') as f:
                json.dump([], f)

        # Read existing applications
        try:
            with open(APPLICATIONS_FILE, 'r') as f:
                applications = json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            applications = []
        
        # Add new application
        applications.append({
            'jobTitle': data['jobTitle'],
            'applicantName': data['applicantName'],
            'resumeFile': data['resumeFile'],
            'appliedAt': datetime.now().isoformat()
        })
        
        # Write back to file
        with open(APPLICATIONS_FILE, 'w') as f:
            json.dump(applications, f)
        
        return jsonify({'message': 'Application submitted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/applications', methods=['GET'])
def get_applications():
    try:
        if not os.path.exists(APPLICATIONS_FILE):
            return jsonify([])
            
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

@app.route('/api/extract-pdf-data', methods=['POST'])
def extract_pdf_data():
    try:
        if not os.path.exists(APPLICATIONS_FILE):
            return jsonify({'extracted_data': []})

        with open(APPLICATIONS_FILE, 'r') as f:
            applications = json.load(f)

        extracted_data = []

        for application in applications:
            resume_path = os.path.join(RESUMES_FOLDER, application['resumeFile'])

            if os.path.exists(resume_path):
                # Use LangChain to load and extract text
                loader = PyMuPDFLoader(resume_path)
                docs = loader.load()
                resume_text = "\n".join([doc.page_content for doc in docs])

                extracted_data.append({
                    'username': application['applicantName'],
                    'resume_text': resume_text,
                    'job_title': application['jobTitle'],
                    'applied_at': application['appliedAt']
                })

        return jsonify({
            'message': 'PDF data extracted successfully',
            'extracted_data': extracted_data
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/start-ai-selection', methods=['POST'])
def start_ai_selection():
    try:
        data = request.json
        if not data or 'extracted_data' not in data:
            return jsonify({'error': 'No extracted data provided'}), 400
            
        conn = sqlite3.connect(DATABASE_FILE)
        c = conn.cursor()
        
        for entry in data['extracted_data']:
            c.execute('''
                INSERT OR REPLACE INTO applications 
                (username, resume_text, job_title, applied_at, extracted_data) 
                VALUES (?, ?, ?, ?, ?)
            ''', (
                entry['username'],
                entry['resume_text'],
                entry['job_title'],
                entry['applied_at'],
                json.dumps(entry)
            ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'AI selection completed',
            'processed': len(data['extracted_data'])
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)