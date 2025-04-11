import sqlite3
from config import Config

def init_db():
    conn = sqlite3.connect(Config.DATABASE_FILE)
    c = conn.cursor()
    
    # Create jobs table
    c.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            threshold REAL DEFAULT 0.1,
            max_candidates INTEGER DEFAULT 5,
            summary TEXT
        )
    ''')
    
    # Create applications table
    c.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            resume_text TEXT,
            job_id INTEGER NOT NULL,
            applied_at TEXT,
            extracted_data TEXT,
            match_score REAL DEFAULT 0,
            selected BOOLEAN DEFAULT FALSE,
            invitation_sent BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (job_id) REFERENCES jobs(id)
        )
    ''')
    
    # Create selected_candidates table
    c.execute('''
        CREATE TABLE IF NOT EXISTS selected_candidates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            job_id INTEGER NOT NULL,
            match_score REAL NOT NULL,
            selected_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (username) REFERENCES applications(username),
            FOREIGN KEY (job_id) REFERENCES jobs(id)
        )
    ''')
    
    conn.commit()
    conn.close()