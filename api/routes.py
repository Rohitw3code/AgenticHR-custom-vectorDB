from flask import request, jsonify
import sqlite3
from datetime import datetime
import csv
import io
from werkzeug.utils import secure_filename
import os
from langchain.document_loaders import PyMuPDFLoader
from config import Config
from utils import compute_match_score, job_summurizer

def register_routes(app):
    @app.route('/api/apply', methods=['POST'])
    def apply_job():
        data = request.json
        if not data or 'jobId' not in data or 'applicantName' not in data or 'resumeFile' not in data:
            return jsonify({'error': 'Missing required fields'}), 400

        try:
            conn = sqlite3.connect(Config.DATABASE_FILE)
            c = conn.cursor()
            
            # Check if job exists
            c.execute('SELECT id FROM jobs WHERE id = ?', (data['jobId'],))
            job = c.fetchone()
            if not job:
                conn.close()
                return jsonify({'error': 'Job not found'}), 404
            
            # Insert new application
            c.execute('''
                INSERT INTO applications (
                    username,
                    resume_text,
                    job_id,
                    applied_at
                ) VALUES (?, ?, ?, ?)
            ''', (
                data['applicantName'],
                data['resumeFile'],
                data['jobId'],
                datetime.now().isoformat()
            ))
            
            conn.commit()
            conn.close()
            
            return jsonify({'message': 'Application submitted successfully'}), 200
        except Exception as e:
            if 'conn' in locals():
                conn.close()
            return jsonify({'error': str(e)}), 500

    @app.route('/api/summarize-job', methods=['POST'])
    def summarize_job():
        try:
            conn = sqlite3.connect(Config.DATABASE_FILE)
            c = conn.cursor()
            
            c.execute('SELECT id, description FROM jobs WHERE summary IS NULL')
            jobs = c.fetchall()
            
            for job_id, description in jobs:
                summary = job_summurizer(description)
                c.execute('UPDATE jobs SET summary = ? WHERE id = ?', (summary, job_id))
            
            conn.commit()
            conn.close()
            
            return jsonify({'message': 'Jobs summarized successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/select-candidates', methods=['POST'])
    def select_candidates():
        try:
            conn = sqlite3.connect(Config.DATABASE_FILE)
            c = conn.cursor()
            
            c.execute('SELECT id, threshold, max_candidates FROM jobs')
            jobs = c.fetchall()
            
            for job_id, threshold, max_candidates in jobs:
                c.execute('''
                    SELECT id, username, match_score
                    FROM applications
                    WHERE job_id = ? AND match_score >= ?
                    ORDER BY match_score DESC
                    LIMIT ?
                ''', (job_id, threshold, max_candidates))
                
                selected = c.fetchall()
                
                for app_id, username, score in selected:
                    c.execute('''
                        UPDATE applications
                        SET selected = TRUE
                        WHERE id = ?
                    ''', (app_id,))
            
            conn.commit()
            conn.close()
            
            return jsonify({'message': 'Candidates selected successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/send-invitations', methods=['POST'])
    def send_invitations():
        try:
            conn = sqlite3.connect(Config.DATABASE_FILE)
            c = conn.cursor()
            
            c.execute('''
                SELECT a.id, a.username, j.title
                FROM applications a
                JOIN jobs j ON a.job_id = j.id
                WHERE a.selected = TRUE AND a.invitation_sent = FALSE
            ''')
            
            candidates = c.fetchall()
            
            for app_id, username, job_title in candidates:
                print(f"Sending invitation to {username} for {job_title}")
                
                c.execute('''
                    UPDATE applications
                    SET invitation_sent = TRUE
                    WHERE id = ?
                ''', (app_id,))
            
            conn.commit()
            conn.close()
            
            return jsonify({'message': 'Invitations sent successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/compute-matches', methods=['POST'])
    def compute_matches():
        try:
            conn = sqlite3.connect(Config.DATABASE_FILE)
            c = conn.cursor()
            
            c.execute('''
                SELECT a.id, a.extracted_data, j.description
                FROM applications a
                JOIN jobs j ON a.job_id = j.id
                WHERE a.extracted_data IS NOT NULL
            ''')
            applications = c.fetchall()
            
            for app_id, extracted_data, job_description in applications:
                match_score = compute_match_score(extracted_data, job_description)
                
                c.execute('''
                    UPDATE applications
                    SET match_score = ?
                    WHERE id = ?
                ''', (match_score, app_id))
            
            conn.commit()
            conn.close()
            
            return jsonify({'message': 'Match scores computed successfully'}), 200
            
        except Exception as e:
            if 'conn' in locals():
                conn.close()
            return jsonify({'error': str(e)}), 500

    @app.route('/api/jobs/upload', methods=['POST'])
    def upload_jobs():
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file and file.filename.endswith('.csv'):
            try:
                try:
                    csv_content = file.read().decode('utf-8')
                except UnicodeDecodeError:
                    file.seek(0)
                    csv_content = file.read().decode('cp1252')

                csv_file = io.StringIO(csv_content)
                csv_reader = csv.DictReader(csv_file)

                conn = sqlite3.connect(Config.DATABASE_FILE)
                c = conn.cursor()

                c.execute('DELETE FROM jobs')

                for row in csv_reader:
                    c.execute('''
                        INSERT INTO jobs (title, description, threshold, max_candidates)
                        VALUES (?, ?, ?, ?)
                    ''', (
                        row['Job Title'],
                        row['Job Description'],
                        float(row.get('Threshold', 0.1)),
                        int(row.get('Max Candidates', 5))
                    ))

                conn.commit()
                conn.close()

                return jsonify({'message': 'Jobs uploaded successfully'}), 200

            except Exception as e:
                return jsonify({'error': str(e)}), 500

        return jsonify({'error': 'Invalid file type'}), 400

    @app.route('/api/jobs', methods=['GET'])
    def get_jobs():
        try:
            conn = sqlite3.connect(Config.DATABASE_FILE)
            c = conn.cursor()
            c.execute('''
                SELECT id, title, description, threshold, max_candidates, summary
                FROM jobs
            ''')
            jobs = c.fetchall()
            conn.close()
            
            jobs_list = [{
                'id': job[0],
                'Job Title': job[1],
                'Job Description': job[2],
                'threshold': job[3],
                'maxCandidates': job[4],
                'summary': job[5]
            } for job in jobs]
            return jsonify(jobs_list)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/applications', methods=['GET'])
    def get_applications():
        try:
            conn = sqlite3.connect(Config.DATABASE_FILE)
            c = conn.cursor()
            
            c.execute('''
                SELECT 
                    a.id, a.username, a.resume_text, j.title, 
                    a.applied_at, a.job_id, a.extracted_data, 
                    a.match_score, a.selected, a.invitation_sent
                FROM applications a
                JOIN jobs j ON a.job_id = j.id
            ''')
            
            applications = c.fetchall()
            conn.close()
            
            applications_list = [{
                'id': app[0],
                'applicantName': app[1],
                'resumeFile': app[2],
                'jobTitle': app[3],
                'appliedAt': app[4],
                'jobId': app[5],
                'extractedData': app[6],
                'matchScore': app[7],
                'selected': app[8],
                'invitationSent': app[9]
            } for app in applications]
            
            return jsonify(applications_list)
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
            filepath = os.path.join(Config.RESUMES_FOLDER, filename)
            file.save(filepath)
            return jsonify({'message': 'Resume uploaded successfully', 'filename': filename}), 200
        
        return jsonify({'error': 'Invalid file type'}), 400

    @app.route('/api/extract-pdf-data', methods=['POST'])
    def extract_pdf_data():
        try:
            conn = sqlite3.connect(Config.DATABASE_FILE)
            c = conn.cursor()
            
            c.execute('''
                SELECT a.id, a.username, a.resume_text, j.title, a.applied_at, a.job_id
                FROM applications a
                JOIN jobs j ON a.job_id = j.id
                WHERE a.extracted_data IS NULL
            ''')
            applications = c.fetchall()
            
            extracted_data = []
            
            for app in applications:
                app_id, username, resume_filename, job_title, applied_at, job_id = app
                resume_path = os.path.join(Config.RESUMES_FOLDER, resume_filename)
                
                if os.path.exists(resume_path):
                    loader = PyMuPDFLoader(resume_path)
                    docs = loader.load()
                    resume_text = "\n".join([doc.page_content for doc in docs])
                    
                    c.execute('''
                        UPDATE applications 
                        SET extracted_data = ? 
                        WHERE id = ?
                    ''', (resume_text, app_id))
                    
                    extracted_data.append({
                        'username': username,
                        'resume_text': resume_text,
                        'job_title': job_title,
                        'applied_at': applied_at,
                        'job_id': job_id
                    })
            
            conn.commit()
            conn.close()
            
            return jsonify({
                'message': 'PDF data extracted successfully',
                'extracted_data': extracted_data
            }), 200
            
        except Exception as e:
            if 'conn' in locals():
                conn.close()
            return jsonify({'error': str(e)}), 500