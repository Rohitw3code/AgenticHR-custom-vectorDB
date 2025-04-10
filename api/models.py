import sqlite3
from .config import Config

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(Config.DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database tables"""
    conn = get_db()
    c = conn.cursor()
    
    # Create applications table
    c.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            username TEXT PRIMARY KEY,
            resume_text TEXT,
            job_title TEXT,
            applied_at TEXT,
            extracted_data TEXT
        )
    ''')
    
    # Create jobs table
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

def get_all_jobs():
    """Get all jobs from database"""
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT title, description FROM jobs')
    jobs = c.fetchall()
    conn.close()
    return [{'Job Title': job[0], 'Job Description': job[1]} for job in jobs]

def save_jobs(jobs_data):
    """Save jobs to database"""
    conn = get_db()
    c = conn.cursor()
    
    # Clear existing jobs
    c.execute('DELETE FROM jobs')
    
    # Insert new jobs
    for job in jobs_data:
        c.execute('''
            INSERT INTO jobs (title, description)
            VALUES (?, ?)
        ''', (job['Job Title'], job['Job Description']))
    
    conn.commit()
    conn.close()

def save_application_to_db(data):
    """Save application data to database"""
    conn = get_db()
    c = conn.cursor()
    
    c.execute('''
        INSERT OR REPLACE INTO applications 
        (username, resume_text, job_title, applied_at, extracted_data) 
        VALUES (?, ?, ?, ?, ?)
    ''', (
        data['username'],
        data['resume_text'],
        data['job_title'],
        data['applied_at'],
        data
    ))
    
    conn.commit()
    conn.close()