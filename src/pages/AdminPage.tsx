import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobUploader from '../components/JobUploader';
import WorkflowStatus from '../components/WorkflowStatus';
import JobList from '../components/JobList';
import { FileText, Brain, Star, Mail, UserCheck, Award, Calendar, CheckCircle, Bot, FileSearch } from 'lucide-react';

interface Job {
  id: number;
  'Job Title': string;
  'Job Description': string;
  threshold: number;
  maxCandidates: number;
  summary?: string;
}

interface MatchScore {
  experience_score: number;
  skills_score: number;
  education_score: number;
  other_score: number;
}

interface Application {
  id: number;
  jobTitle: string;
  applicantName: string;
  resumeFile: string;
  appliedAt: string;
  matchScore: string;
  selected: boolean;
  invitationSent: boolean;
}

interface SelectedCandidate {
  id: number;
  username: string;
  jobTitle: string;
  matchScore: string;
  selectedAt: string;
  invitationSent: boolean;
}

interface WorkflowStep {
  title: string;
  status: 'pending' | 'processing' | 'completed';
  icon: React.ReactNode;
}

function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<SelectedCandidate[]>([]);
  const [processing, setProcessing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [invitationsSent, setInvitationsSent] = useState(0);
  const [workflowSteps, setWorkflowSteps] = useState([
    { 
      title: 'Extracting Data',
      status: 'pending',
      icon: <FileText className="w-6 h-6" />,
      aiDescription: 'Parsing PDF resumes using advanced document processing'
    },
    {
      title: 'Analyzing Resumes',
      status: 'pending',
      icon: <FileSearch className="w-6 h-6" />,
      aiDescription: 'Extracting key skills, experience, and qualifications'
    },
    {
      title: 'Processing Jobs',
      status: 'pending',
      icon: <Brain className="w-6 h-6" />,
      aiDescription: 'Generating comprehensive job requirement analysis'
    },
    {
      title: 'Computing Match',
      status: 'pending',
      icon: <Star className="w-6 h-6" />,
      aiDescription: 'AI-powered candidate-job compatibility scoring'
    },
    {
      title: 'Selecting Top',
      status: 'pending',
      icon: <UserCheck className="w-6 h-6" />,
      aiDescription: 'Intelligent selection of best-matched candidates'
    },
    {
      title: 'Sending Invites',
      status: 'pending',
      icon: <Mail className="w-6 h-6" />,
      aiDescription: 'Automated interview invitation dispatch'
    }
  ]);

  const calculateAverageScore = (matchScore: string): number => {
    try {
      const scores: MatchScore = JSON.parse(matchScore);
      return (
        (scores.experience_score + 
         scores.skills_score + 
         scores.education_score + 
         scores.other_score) / 4
      );
    } catch (e) {
      return 0;
    }
  };

  const formatMatchScore = (matchScore: string): string => {
    try {
      const scores: MatchScore = JSON.parse(matchScore);
      return `${Math.round((
        scores.experience_score + 
        scores.skills_score + 
        scores.education_score + 
        scores.other_score
      ) / 4)}%`;
    } catch (e) {
      return '0%';
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchSelectedCandidates();

    // Auto-refresh selected candidates every 30 seconds
    const interval = setInterval(fetchSelectedCandidates, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    const selected = applications.filter(app => app.selected).length;
    const invited = applications.filter(app => app.invitationSent).length;
    setSelectedCount(selected);
    setInvitationsSent(invited);
  }, [applications]);

  const updateStepStatus = (stepIndex: number, status: 'pending' | 'processing' | 'completed') => {
    setWorkflowSteps(steps => steps.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  const extractDataFromPDF = async () => {
    try {
      updateStepStatus(0, 'processing');
      await axios.post('http://localhost:5000/api/extract-pdf-data');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(0, 'completed');
      updateStepStatus(1, 'processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(1, 'completed');
      return true;
    } catch (error) {
      console.error('Error extracting PDF data:', error);
      throw error;
    }
  };

  const summarizeJobs = async () => {
    try {
      updateStepStatus(2, 'processing');
      await axios.post('http://localhost:5000/api/summarize-job');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(2, 'completed');
    } catch (error) {
      console.error('Error summarizing jobs:', error);
      throw error;
    }
  };

  const computeMatchScores = async () => {
    try {
      updateStepStatus(3, 'processing');
      await axios.post('http://localhost:5000/api/compute-matches');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(3, 'completed');
    } catch (error) {
      console.error('Error computing match scores:', error);
      throw error;
    }
  };

  const selectCandidates = async () => {
    try {
      updateStepStatus(4, 'processing');
      await axios.post('http://localhost:5000/api/select-candidates');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(4, 'completed');
      await fetchSelectedCandidates(); // Refresh selected candidates after selection
    } catch (error) {
      console.error('Error selecting candidates:', error);
      throw error;
    }
  };

  const sendInvitations = async () => {
    try {
      updateStepStatus(5, 'processing');
      await axios.post('http://localhost:5000/api/send-invitations');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(5, 'completed');
      await fetchSelectedCandidates(); // Refresh selected candidates after sending invitations
    } catch (error) {
      console.error('Error sending invitations:', error);
      throw error;
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchSelectedCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/selected-candidates');
      setSelectedCandidates(response.data);
    } catch (error) {
      console.error('Error fetching selected candidates:', error);
    }
  };

  const startAISelection = async () => {
    setProcessing(true);
    setTimerActive(true);
    setTimer(0);
    setWorkflowSteps(steps => steps.map(step => ({ ...step, status: 'pending' })));
    
    try {
      await extractDataFromPDF();
      await summarizeJobs();
      await computeMatchScores();
      await selectCandidates();
      await sendInvitations();
      await fetchApplications();
    } catch (error) {
      console.error('Error during AI selection process:', error);
      setWorkflowSteps(steps => steps.map(step => ({ ...step, status: 'pending' })));
    } finally {
      setProcessing(false);
      setTimerActive(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-4">AI Recruitment Dashboard</h1>
        <p className="text-lg opacity-90">Streamline your hiring process with AI-powered candidate selection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/20 backdrop-blur-xl shadow-2xl rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-4">
            <JobUploader onUploadSuccess={fetchJobs} />
            <button
              onClick={startAISelection}
              disabled={processing}
              className={`flex items-center px-6 py-3 rounded-xl text-white transition-all duration-300 transform hover:scale-105 ${
                processing 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-500/25'
              }`}
            >
              <Bot className="w-5 h-5 mr-2" />
              {processing 
                ? `AI Processing (${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')})` 
                : 'Start AI Analysis'}
            </button>
          </div>

          <WorkflowStatus 
            steps={workflowSteps} 
            selectedCount={selectedCount}
            invitationsSent={invitationsSent}
          />
        </div>

        <div className="bg-black/20 backdrop-blur-xl shadow-2xl rounded-xl p-6 border border-purple-500/20">
          <h2 className="text-2xl font-bold mb-6 text-purple-300 flex items-center">
            <Award className="w-6 h-6 mr-2 text-purple-400" />
            Selected Candidates
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
            {selectedCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-purple-300">{candidate.username}</h3>
                    <p className="text-sm text-gray-400">{candidate.jobTitle}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="flex items-center text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(candidate.selectedAt)}
                      </span>
                      <span className="flex items-center text-purple-400">
                        <Star className="w-4 h-4 mr-1" />
                        {formatMatchScore(candidate.matchScore)}
                      </span>
                      {candidate.invitationSent && (
                        <span className="flex items-center text-green-400">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Invited
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {selectedCandidates.length === 0 && (
              <p className="text-gray-400 italic text-center py-4">
                No candidates selected yet
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-xl shadow-2xl rounded-xl border border-purple-500/20">
        <JobList jobs={jobs} applications={applications} />
      </div>
    </div>
  );
}

export default AdminPage