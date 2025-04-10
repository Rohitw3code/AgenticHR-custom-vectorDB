import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  const extractDataFromPDF = async () => {
    try {
      // Step 1: Organizing Resumes
      updateStepStatus(0, 'processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(0, 'completed');

      // Step 2: Extracting Data
      updateStepStatus(1, 'processing');
      const response = await axios.post('http://localhost:5000/api/extract-pdf-data');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(1, 'completed');
      
      return response.data;
    } catch (error) {
      console.error('Error extracting PDF data:', error);
      throw error;
    }
  };

  const saveToDatabase = async (extractedData: any) => {
    try {
      // Step 3: Storing in Database
      updateStepStatus(2, 'processing');
      const response = await axios.post('http://localhost:5000/api/start-ai-selection', extractedData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(2, 'completed');
      
      return response.data;
    } catch (error) {
      console.error('Error saving to database:', error);
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
      const extractedData = await extractDataFromPDF();
      await saveToDatabase(extractedData);
      fetchApplications(); // Refresh the applications list
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

        {processing && <WorkflowStatus steps={workflowSteps} />}
      </div>

      <JobList jobs={jobs} applications={applications} />
    </div>
  );
}

export default AdminPage;