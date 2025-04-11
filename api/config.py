import os

class Config:
    UPLOAD_FOLDER = 'uploads'
    JOBS_FOLDER = os.path.join(UPLOAD_FOLDER, 'jobs')
    RESUMES_FOLDER = os.path.join(UPLOAD_FOLDER, 'resumes')
    APPLICATIONS_FILE = os.path.join(UPLOAD_FOLDER, 'applications.json')
    DATABASE_FILE = os.path.join(UPLOAD_FOLDER, 'applications.db')
    
    @staticmethod
    def create_directories():
        os.makedirs(Config.JOBS_FOLDER, exist_ok=True)
        os.makedirs(Config.RESUMES_FOLDER, exist_ok=True)
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        
        if not os.path.exists(Config.APPLICATIONS_FILE):
            with open(Config.APPLICATIONS_FILE, 'w') as f:
                import json
                json.dump([], f)