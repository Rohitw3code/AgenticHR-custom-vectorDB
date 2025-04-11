<div align="center">
  
# AgenticHR by LaperMind

![AgenticHR](https://img.shields.io/badge/AgenticHR-AI%20Powered%20Recruitment-purple?style=for-the-badge)

An AI-powered recruitment platform that revolutionizes the hiring process through intelligent candidate matching and automated screening.

[![Tech Stack](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

## 🌟 Features

### For Job Seekers
- 📝 Easy job application process
- 📄 PDF resume upload and parsing
- 🔍 Smart job search and filtering
- 💼 Real-time application status tracking

### For Recruiters
- 🤖 AI-powered candidate screening
- 📊 Intelligent match scoring
- 🎯 Automated candidate selection
- ✉️ Automated interview invitations
- 📈 Comprehensive analytics dashboard

### AI Capabilities
- 🧠 Advanced resume parsing
- 🎯 Precise job-candidate matching
- 📋 Automated job summarization
- 🔄 Smart candidate ranking

## 🏗️ Project Structure

```
AgenticHR/
├── api/                      # Backend API
│   ├── __init__.py          # API initialization
│   ├── app.py               # Main application entry
│   ├── config.py            # Configuration settings
│   ├── models.py            # Database models
│   ├── routes.py            # API endpoints
│   └── utils.py             # Utility functions
│
├── src/                     # Frontend source
│   ├── components/          # React components
│   │   ├── JobList.tsx     # Job listing component
│   │   ├── JobUploader.tsx # Job upload component
│   │   └── WorkflowStatus  # Workflow status component
│   │
│   ├── pages/              # Page components
│   │   ├── AdminPage.tsx   # Admin dashboard
│   │   ├── LandingPage.tsx # Landing page
│   │   └── UserPage.tsx    # User portal
│   │
│   ├── App.tsx             # Main React component
│   └── main.tsx            # Application entry point
│
└── public/                  # Static assets
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AgenticHR.git
   cd AgenticHR
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   pip install -r requirements.txt
   ```

3. **Start the development servers**
   ```bash
   # Start frontend
   npm run dev

   # Start backend
   npm run api
   ```

## 🛠️ Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Lucide React Icons

### Backend
- Flask
- SQLite
- LangChain
- Groq AI
- scikit-learn

## 🔄 Workflow

1. **Job Posting**
   - Recruiters upload jobs via CSV
   - AI generates job summaries
   - Jobs are stored in the database

2. **Application Process**
   - Candidates upload resumes
   - System extracts data from PDFs
   - Match scores are computed

3. **Selection Process**
   - AI ranks candidates by match score
   - System filters based on thresholds
   - Top candidates are automatically selected

4. **Communication**
   - Selected candidates receive invitations
   - Application status is updated
   - Recruiters can track progress

## 📊 Database Schema

### Jobs Table
- `id`: Primary key
- `title`: Job title
- `description`: Full job description
- `threshold`: Minimum match score
- `max_candidates`: Selection limit
- `summary`: AI-generated summary

### Applications Table
- `id`: Primary key
- `username`: Applicant name
- `resume_text`: Parsed resume
- `job_id`: Foreign key to jobs
- `match_score`: AI-computed score
- `selected`: Selection status
- `invitation_sent`: Invitation status

### Selected Candidates Table
- `id`: Primary key
- `username`: Selected candidate
- `job_id`: Related job
- `match_score`: Final match score
- `selected_at`: Selection timestamp

## 🎨 UI Features

- Dark theme with purple accents
- Responsive design
- Interactive animations
- Modern glassmorphism effects
- Progress indicators
- Real-time updates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  
### Made with 💜 by LaperMind

</div>