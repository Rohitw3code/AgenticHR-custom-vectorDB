import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobUploader from '../components/JobUploader';
import WorkflowStatus from '../components/WorkflowStatus';
import JobList from '../components/JobList';
import { FileText, Brain, Star, Mail, UserCheck } from 'lucide-react';

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

interface WorkflowStep {
  title: string;
  status: 'pending' | 'processing' | 'completed';
  icon: React.ReactNode;
}

function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
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

  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <JobUploader onUploadSuccess={fetchJobs} />
          <button
            onClick={startAISelection}
            disabled={processing}
            className={`flex items-center px-4 py-2 rounded-md text-white ${
              processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {processing ? `Processing (${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')})` : 'Start AI Selection'}
          </button>
        </div>

        <WorkflowStatus 
          steps={workflowSteps} 
          selectedCount={selectedCount}
          invitationsSent={invitationsSent}
        />
      </div>

      <JobList jobs={jobs} applications={applications} />
    </div>
  );
}

export default AdminPage;