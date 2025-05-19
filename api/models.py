import sqlite3
from config import Config

def init_db():
    conn = sqlite3.connect(Config.DATABASE_FILE)
    c = conn.cursor()

    # Create jobs table with embedding column
    c.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            threshold REAL DEFAULT 0.1,
            max_candidates INTEGER DEFAULT 5,
            summary TEXT,
            embedding TEXT  -- Store JSON-serialized embedding
        )
    ''')

    # Create applications table with email and embedding fields
    c.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL,
            resume_text TEXT,
            job_id INTEGER NOT NULL,
            applied_at TEXT,
            extracted_data TEXT,
            match_score TEXT DEFAULT '{}',
            selected BOOLEAN DEFAULT FALSE,
            invitation_sent BOOLEAN DEFAULT FALSE,
            embedding TEXT,  -- Store JSON-serialized embedding
            FOREIGN KEY (job_id) REFERENCES jobs(id)
        )
    ''')

    # Create selected_candidates table with application_id
    c.execute('''
        CREATE TABLE IF NOT EXISTS selected_candidates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            application_id INTEGER NOT NULL,
            job_id INTEGER NOT NULL,
            match_score TEXT DEFAULT '{}',
            selected_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (application_id) REFERENCES applications(id),
            FOREIGN KEY (job_id) REFERENCES jobs(id)
        )
    ''')

    # Create indexes for performance
    c.execute('CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_selected_candidates_job_id ON selected_candidates(job_id)')

    conn.commit()
    conn.close()