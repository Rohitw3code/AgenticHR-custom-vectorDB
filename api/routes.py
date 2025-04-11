from flask import jsonify, request
from werkzeug.utils import secure_filename
import csv
import json
import io
from datetime import datetime
from .config import Config
from .models import get_all_jobs, save_jobs, save_application_to_db
import os

def register_routes(app):
    @app.route('/api/jobs/upload', methods=['POST'])
    def upload_jobs():
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '' or not file.filename.endswith('.csv'):
            return jsonify({'error': 'Invalid file'}), 400

        try:
            # Try UTF-8 first, fallback to CP1252
            try:
                csv_content = file.read().decode('utf-8')
            except UnicodeDecodeError:
                file.seek(0)
                csv_content = file.read().decode('cp1252')

            csv_file = io.StringIO(csv_content)
            jobs_data = list(csv.DictReader(csv_file))
            save_jobs(jobs_data)
            
            return jsonify({'message': 'Jobs uploaded successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/jobs', methods=['GET'])
    def get_jobs():
        try:
            jobs = get_all_jobs()
            return jsonify(jobs)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/apply', methods=['POST'])
    def apply_job():
        data = request.json
        if not data or 'jobTitle' not in data or 'applicantName' not in data or 'resumeFile' not in data:
            return jsonify({'error': 'Missing required fields'}), 400

        try:
            # Ensure applications.json exists
            if not os.path.exists(Config.APPLICATIONS_FILE):
                with open(Config.APPLICATIONS_FILE, 'w') as f:
                    json.dump([], f)

            # Read existing applications
            try:
                with open(Config.APPLICATIONS_FILE, 'r') as f:
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
            
            # Save to file
            with open(Config.APPLICATIONS_FILE, 'w') as f:
                json.dump(applications, f)
            
            return jsonify({'message': 'Application submitted successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/applications', methods=['GET'])
    def get_applications():
        try:
            if not os.path.exists(Config.APPLICATIONS_FILE):
                return jsonify([])
                
            with open(Config.APPLICATIONS_FILE, 'r') as f:
                applications = json.load(f)
            return jsonify(applications)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/resume/upload', methods=['POST'])
    def upload_resume():
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '' or not file.filename.endswith('.pdf'):
            return jsonify({'error': 'Invalid file type'}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.RESUMES_FOLDER, filename)
        file.save(filepath)
        return jsonify({'message': 'Resume uploaded successfully', 'filename': filename}), 200

    @app.route('/api/extract-pdf-data', methods=['POST'])
    def extract_pdf_data():
        try:
            if not os.path.exists(Config.APPLICATIONS_FILE):
                return jsonify({'extracted_data': []})

            with open(Config.APPLICATIONS_FILE, 'r') as f:
                applications = json.load(f)
            
            extracted_data = []
            for application in applications:
                resume_path = os.path.join(Config.RESUMES_FOLDER, application['resumeFile'])
                if os.path.exists(resume_path):
                    extracted_data.append({
                        'username': application['applicantName'],
                        'resume_text': f"Extracted text from {application['resumeFile']}",
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
                
            for entry in data['extracted_data']:
                save_application_to_db(entry)
            
            return jsonify({
                'message': 'AI selection completed',
                'processed': len(data['extracted_data'])
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500