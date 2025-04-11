import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Briefcase, FileText, Brain, RefreshCw } from 'lucide-react';
import JobUploader from '../components/JobUploader';
import WorkflowStatus from '../components/WorkflowStatus';
import JobList from '../components/JobList';

interface Job {
  'Job Title': string;
  'Job Description': string;
}

interface Application {
  jobTitle: string;
  applicantName: string;
  resumeFile: string;
  appliedAt: string;
}

interface WorkflowStep {
  title: string;
  status: 'pending' | 'processing' | 'completed';
}

function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [processing, setProcessing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { title: 'Organizing Resumes', status: 'pending' },
    { title: 'Extracting Data', status: 'pending' },
    { title: 'Summarizing Job Descriptions', status: 'pending' },
    { title: 'Storing in Database', status: 'pending' }
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

  const updateStepStatus = (stepIndex: number, status: 'pending' | 'processing' | 'completed') => {
    setWorkflowSteps(steps => steps.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
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
      // Step 1: Organizing Resumes
      updateStepStatus(0, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus(0, 'completed');

      // Step 2: Extracting Data
      updateStepStatus(1, 'processing');
      const extractResponse = await axios.post('http://localhost:5000/api/extract-pdf-data');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus(1, 'completed');

      // Step 3: Summarizing Job Descriptions
      updateStepStatus(2, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateStepStatus(2, 'completed');

      // Step 4: Storing in Database
      updateStepStatus(3, 'processing');
      await axios.post('http://localhost:5000/api/start-ai-selection', extractResponse.data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus(3, 'completed');

      fetchApplications();
    } catch (error) {
      console.error('Error during AI selection process:', error);
      setWorkflowSteps(steps => steps.map(step => ({ ...step, status: 'pending' })));
    } finally {
      setProcessing(false);
      setTimerActive(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Total Jobs</h3>
              <Briefcase className="w-6 h-6 opacity-75" />
            </div>
            <p className="text-3xl font-bold">{jobs.length}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Applications</h3>
              <FileText className="w-6 h-6 opacity-75" />
            </div>
            <p className="text-3xl font-bold">{applications.length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Processing</h3>
              <Brain className="w-6 h-6 opacity-75" />
            </div>
            <p className="text-xl">
              {processing ? 'Active' : 'Ready'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-xl p-6 transform hover:shadow-2xl transition-all duration-300">
          <JobUploader onUploadSuccess={fetchJobs} />
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 transform hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col space-y-4">
            <button
              onClick={startAISelection}
              disabled={processing}
              className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 ${
                processing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              }`}
            >
              {processing ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Processing ({Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')})
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Start AI Selection
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {processing && <WorkflowStatus steps={workflowSteps} />}

      <JobList jobs={jobs} applications={applications} />
    </div>
  );
}

export default AdminPage;