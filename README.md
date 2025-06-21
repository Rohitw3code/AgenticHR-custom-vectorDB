<div align="center">
  
# AgenticHR

![AgenticHR](https://img.shields.io/badge/AgenticHR-AI%20Powered%20Recruitment-purple?style=for-the-badge)

An AI-powered recruitment platform that revolutionizes the hiring process through intelligent candidate matching and automated screening.

[![Tech Stack](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

## 🌟 Features

### For Job Seekers
- 📝 Easy job application process with PDF resume upload
- 🔍 Smart job search with real-time filtering
- 💼 User-friendly application interface
- 📄 Detailed job descriptions with AI-generated summaries

### For Recruiters
- 🤖 AI-powered candidate screening and ranking
- 📊 Intelligent match scoring across multiple criteria
- 🎯 Automated candidate selection based on thresholds
- ✉️ Automated interview invitation system
- 📈 Real-time application tracking and monitoring

## 🔄 Detailed Workflow

### 1. Job Management
- **CSV Upload**: Recruiters upload jobs via CSV with fields:
  - Job Title
  - Job Description
  - Threshold (minimum match score)
  - Max Candidates (selection limit)
- **AI Processing**: System automatically generates concise summaries for each job

### 2. Application Process
- **Candidate Input**:
  - Personal details (name, email)
  - PDF resume upload
- **Resume Processing**:
  - PDF parsing and text extraction
  - Key data identification (experience, skills, education)
  - Structured data storage

### 3. AI Analysis Pipeline
1. **Data Extraction**:
   - Parse PDF resumes
   - Extract relevant information
   - Structure data for analysis

2. **Resume Analysis**:
   - Process candidate qualifications
   - Identify key skills and experience
   - Generate structured profiles

3. **Job Processing**:
   - Analyze job requirements
   - Generate comprehensive summaries
   - Define matching criteria

4. **Match Computation**:
   - Calculate scores across categories:
     - Experience (0-100)
     - Skills (0-100)
     - Education (0-100)
     - Other requirements (0-100)

5. **Candidate Selection**:
   - Filter based on threshold scores
   - Rank candidates by match quality
   - Select top matches within limits

6. **Automated Communication**:
   - Send interview invitations
   - Update application statuses
   - Track communication history

## 🏗️ Project Structure

```
AgenticHR/
├── api/                      # Backend API
│   ├── __init__.py          # API initialization
│   ├── ai_agent.py          # AI processing logic
│   ├── app.py               # Main application
│   ├── config.py            # Configuration
│   ├── models.py            # Database models
│   ├── routes.py            # API endpoints
│   └── utils.py             # Utility functions
│
├── src/                     # Frontend source
│   ├── components/          # React components
│   │   ├── JobList         # Job listing
│   │   ├── JobUploader     # CSV upload
│   │   └── WorkflowStatus  # AI pipeline status
│   │
│   ├── pages/              # Page components
│   │   ├── AdminPage       # Admin dashboard
│   │   ├── LandingPage     # Home page
│   │   └── UserPage        # Candidate portal
│   │
│   ├── App.tsx             # Main component
│   └── main.tsx            # Entry point
```

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/AgenticHR.git
   cd AgenticHR
   npm install
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   - Set up Groq API key for AI processing
   - Configure database paths
   - Set up upload directories

3. **Start Services**
   ```bash
   # Start frontend
   npm run dev

   # Start backend
   npm run api
   ```

## 📊 Database Schema

### Jobs
```sql
CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    threshold REAL DEFAULT 0.1,
    max_candidates INTEGER DEFAULT 5,
    summary TEXT
);
```

### Applications
```sql
CREATE TABLE applications (
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
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);
```

### Selected Candidates
```sql
CREATE TABLE selected_candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    match_score TEXT DEFAULT '{}',
    selected_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);
```

## 🎨 UI Features

- **Modern Design**:
  - Dark theme with purple accents
  - Glassmorphism effects
  - Responsive layouts
  - Interactive animations

- **Real-time Updates**:
  - Live status indicators
  - Progress tracking
  - Dynamic content loading

- **User Experience**:
  - Intuitive navigation
  - Clear feedback
  - Smooth transitions
  - Accessible interface

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for development
- Lucide React for icons
- React Router for navigation

### Backend
- Flask for API
- SQLite for database
- LangChain for AI processing
- Groq for language models
- scikit-learn for computations

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  
### Made with 💜 by LaperMind

</div>
