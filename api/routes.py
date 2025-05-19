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
from ai_agent import summarize_chain, match_chain, summarize_resume_chain
from ai_agent import match_score_structured_llm, match_prompt
from ai_agent import filter_prompt_structured_llm, filter_prompt
import json
import re
from sentence_transformers import SentenceTransformer
import numpy as np

# Initialize the embedding model (using a lightweight transformer model)
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

def register_routes(app):

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
                        float(row.get('Threshold', 10)),
                        int(row.get('Max Candidates', 5))
                    ))

                conn.commit()
                conn.close()

                return jsonify({'message': 'Jobs uploaded successfully'}), 200

            except Exception as e:
                return jsonify({'error': str(e)}), 500

        return jsonify({'error': 'Invalid file type'}), 400

    @app.route('/api/apply', methods=['POST'])
    def apply_job():
        data = request.json
        if not data or 'jobId' not in data or 'applicantName' not in data or 'email' not in data or 'resumeFile' not in data:
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
                    email,
                    resume_text,
                    job_id,
                    applied_at
                ) VALUES (?, ?, ?, ?, ?)
            ''', (
                data['applicantName'],
                data['email'],
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
                'maxCandidatest': job[4],
                'summary': job[5]
            } for job in jobs]
            return jsonify(jobs_list)
        except Exception as e:
            return jsonify({'error': str(e)}), 500 

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
                    # Run resume summarization chain
                    resume_summarize = summarize_resume_chain.run(resume=resume_text)
                    # Generate embedding for resume summary
                    resume_embedding = embedding_model.encode(resume_summarize)
                    # Store embedding as JSON string
                    embedding_json = json.dumps(resume_embedding.tolist())
                    c.execute('''
                        UPDATE applications 
                        SET extracted_data = ?, embedding = ?
                        WHERE id = ?
                    ''', (resume_summarize, embedding_json, app_id))
                    
                    extracted_data.append({
                        'username': username,
                        'resume_text': resume_summarize,
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

    @app.route('/api/summarize-job', methods=['POST'])
    def summarize_job():
        try:
            conn = sqlite3.connect(Config.DATABASE_FILE)
            c = conn.cursor()
            
            c.execute('SELECT id, description FROM jobs WHERE summary IS NULL')
            jobs = c.fetchall()
            
            for job_id, description in jobs:
                summary = summarize_chain.run(job_description=description).strip()
                # Generate embedding for job summary
                job_embedding = embedding_model.encode(summary)
                # Store embedding as JSON string
                embedding_json = json.dumps(job_embedding.tolist())
                c.execute('UPDATE jobs SET summary = ?, embedding = ? WHERE id = ?', (summary, embedding_json, job_id))
            
            conn.commit()
            conn.close()
            
            return jsonify({'message': 'Jobs summarized successfully'}), 200
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
                # Run structured LLM with prompt
                prompt = match_prompt.format(job_description=job_description, resume_text=extracted_data)
                match_score = match_score_structured_llm.invoke(prompt)            
                match_score_json = json.dumps(match_score)
                c.execute('''
                    UPDATE applications
                    SET match_score = ?
                    WHERE id = ?
                ''', (match_score_json, app_id))
        
            conn.commit()
            conn.close()
            return jsonify({'message': 'Match scores computed successfully'}), 200
            
        except Exception as e:
            if 'conn' in locals():
                conn.close()
            return jsonify({'error': str(e)}), 500

    @app.route('/api/select-candidates', methods=['POST'])
    def select_candidates():
        try:
            # Connect to SQLite database
            conn = sqlite3.connect(Config.DATABASE_FILE)
            c = conn.cursor()

            # Clear existing selected candidates
            c.execute('DELETE FROM selected_candidates')

            # Reset selection status in applications
            c.execute('UPDATE applications SET selected = FALSE')

            # Query all job IDs and embeddings from jobs table
            c.execute('SELECT id, summary, embedding FROM jobs')
            jobs = c.fetchall()

            if not jobs:
                conn.close()
                return jsonify({"error": "No jobs found in the jobs table"}), 404

            # Process each job
            for job_id, job_summary, job_embedding_json in jobs:
                if not job_summary or not job_embedding_json:
                    continue  # Skip jobs without summaries or embeddings

                # Load job embedding
                try:
                    job_embedding = np.array(json.loads(job_embedding_json), dtype=np.float32)
                except json.JSONDecodeError:
                    continue  # Skip if embedding is invalid

                # Normalize job embedding
                job_embedding = job_embedding / np.linalg.norm(job_embedding)

                # Query all candidates for the current job_id
                c.execute('''
                    SELECT id, username, email, resume_text, job_id, applied_at, extracted_data,
                           match_score, selected, invitation_sent, embedding
                    FROM applications
                    WHERE job_id = ?
                ''', (job_id,))
                rows = c.fetchall()

                if not rows:
                    continue  # Skip if no applications for this job

                # Compute similarity scores for candidates
                candidates = []
                for row in rows:
                    embedding_json = row[10]  # embedding is the 11th column
                    if not embedding_json:
                        continue
                    try:
                        resume_embedding = np.array(json.loads(embedding_json), dtype=np.float32)
                        # Normalize resume embedding
                        resume_embedding = resume_embedding / np.linalg.norm(resume_embedding)
                        # Compute cosine similarity
                        similarity = float(np.dot(job_embedding, resume_embedding))
                        candidates.append({
                            'id': str(row[0]),
                            'similarity': similarity
                        })
                    except json.JSONDecodeError:
                        continue  # Skip invalid embeddings

                if not candidates:
                    continue  # Skip if no valid embeddings

                # Sort candidates by similarity and select top 2
                candidates.sort(key=lambda x: x['similarity'], reverse=True)
                selected_ids = [c['id'] for c in candidates[:2]]  # Max 2 candidates

                if not selected_ids:
                    continue  # Skip if no candidates selected

                # Update database for selected candidates
                for row in rows:
                    app_id = str(row[0])
                    if app_id in selected_ids:
                        # Mark application as selected
                        c.execute('''
                            UPDATE applications
                            SET selected = TRUE
                            WHERE id = ?
                        ''', (app_id,))
                        
                        # Find similarity score for this candidate
                        similarity = next(c['similarity'] for c in candidates if c['id'] == app_id)
                        # Store similarity as match_score
                        match_score = {'similarity': similarity}
                        c.execute('''
                            INSERT INTO selected_candidates (application_id, job_id, match_score)
                            VALUES (?, ?, ?)
                        ''', (row[0], row[4], json.dumps(match_score)))

            conn.commit()
            conn.close()

            return jsonify({'message': 'Candidates filtered and selected successfully for all jobs'}), 200

        except Exception as e:
            if 'conn' in locals():
                conn.close()
            return jsonify({'error': f"Failed to select candidates: {str(e)}"}), 500
    
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
                ORDER BY a.applied_at DESC
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

    @app.route('/api/selected-candidates', methods=['GET'])
    def get_selected_candidates():
        try:
            conn = sqlite3.connect(Config.DATABASE_FILE)
            c = conn.cursor()
            
            c.execute('''
                SELECT 
                    sc.id,
                    a.username,
                    j.title as job_title,
                    sc.match_score,
                    sc.selected_at,
                    a.invitation_sent
                FROM selected_candidates sc
                JOIN applications a ON sc.application_id = a.id
                JOIN jobs j ON sc.job_id = j.id
                ORDER BY sc.selected_at DESC
            ''')
            
            candidates = c.fetchall()
            conn.close()
            
            candidates_list = [{
                'id': candidate[0],
                'username': candidate[1],
                'jobTitle': candidate[2],
                'matchScore': candidate[3],
                'selectedAt': candidate[4],
                'invitationSent': candidate[5]
            } for candidate in candidates]
            
            return jsonify(candidates_list)
        except Exception as e:
            if 'conn' in locals():
                conn.close()
            return jsonify({'error': str(e)}), 500