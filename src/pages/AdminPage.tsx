import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobUploader from '../components/JobUploader';
import WorkflowStatus from '../components/WorkflowStatus';
import JobList from '../components/JobList';
import { FileText, Brain, Star, Mail, UserCheck, Award, Calendar, CheckCircle } from 'lucide-react';

interface Job {
  id: number;
  'Job Title': string;
  'Job Description': string;
  threshold: number;
  maxCandidates: number;
  summary?: string;
}

interface Application {
  id: number;
  jobTitle: string;
  applicantName: string;
  resumeFile: string;
  appliedAt: string;
  matchScore: number;
  selected: boolean;
  invitationSent: boolean;
}

interface SelectedCandidate {
  id: number;
  username: string;
  jobTitle: string;
  matchScore: number;
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
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { title: 'Extracting Resumes', status: 'pending', icon: <FileText className="w-6 h-6" /> },
    { title: 'Summarizing Jobs', status: 'pending', icon: <Brain className="w-6 h-6" /> },
    { title: 'Computing Match Scores', status: 'pending', icon: <Star className="w-6 h-6" /> },
    { title: 'Selecting Candidates', status: 'pending', icon: <UserCheck className="w-6 h-6" /> },
    { title: 'Sending Invitations', status: 'pending', icon: <Mail className="w-6 h-6" /> }
  ]);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchSelectedCandidates();
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
      return true;
    } catch (error) {
      console.error('Error extracting PDF data:', error);
      throw error;
    }
  };

  const summarizeJobs = async () => {
    try {
      updateStepStatus(1, 'processing');
      await axios.post('http://localhost:5000/api/summarize-job');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(1, 'completed');
    } catch (error) {
      console.error('Error summarizing jobs:', error);
      throw error;
    }
  };

  const computeMatchScores = async () => {
    try {
      updateStepStatus(2, 'processing');
      await axios.post('http://localhost:5000/api/compute-matches');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(2, 'completed');
    } catch (error) {
      console.error('Error computing match scores:', error);
      throw error;
    }
  };

  const selectCandidates = async () => {
    try {
      updateStepStatus(3, 'processing');
      await axios.post('http://localhost:5000/api/select-candidates');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(3, 'completed');
    } catch (error) {
      console.error('Error selecting candidates:', error);
      throw error;
    }
  };

  const sendInvitations = async () => {
    try {
      updateStepStatus(4, 'processing');
      await axios.post('http://localhost:5000/api/send-invitations');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(4, 'completed');
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

  const formatMatchScore = (score: number) => {
    return `${(score * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-4">AI Recruitment Dashboard</h1>
        <p className="text-lg opacity-90">Streamline your hiring process with AI-powered candidate selection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-4">
            <JobUploader onUploadSuccess={fetchJobs} />
            <button
              onClick={startAISelection}
              disabled={processing}
              className={`flex items-center px-6 py-3 rounded-xl text-white transition-all duration-300 transform hover:scale-105 ${
                processing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700'
              }`}
            >
              {processing 
                ? `Processing (${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')})` 
                : 'Start AI Selection'}
            </button>
          </div>

          <WorkflowStatus 
            steps={workflowSteps} 
            selectedCount={selectedCount}
            invitationsSent={invitationsSent}
          />
        </div>

        <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <Award className="w-6 h-6 mr-2 text-purple-500" />
            Selected Candidates
          </h2>
          <div className="space-y-4">
            {selectedCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-purple-900">{candidate.username}</h3>
                    <p className="text-sm text-gray-600">{candidate.jobTitle}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(candidate.selectedAt)}
                      </span>
                      <span className="flex items-center text-purple-600">
                        <Star className="w-4 h-4 mr-1" />
                        {formatMatchScore(candidate.matchScore)}
                      </span>
                      {candidate.invitationSent && (
                        <span className="flex items-center text-green-600">
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
              <p className="text-gray-500 italic text-center py-4">
                No candidates selected yet
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-xl border border-gray-100">
        <JobList jobs={jobs} applications={applications} />
      </div>
    </div>
  );
}

export default AdminPage;