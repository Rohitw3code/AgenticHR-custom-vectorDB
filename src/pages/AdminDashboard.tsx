import React, { useState, useEffect } from 'react';
import CSVUploader from '../components/CSVUploader';
import JobList from '../components/JobList';
import { getJobs, Job } from '../services/api';

const AdminDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const fetchedJobs = await getJobs();
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const handleUploadSuccess = (newJobs: Job[]) => {
    setJobs(newJobs);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Upload and manage job listings</p>
      </div>

      <CSVUploader onUploadSuccess={handleUploadSuccess} />
      <JobList jobs={jobs} />
    </div>
  );
};

export default AdminDashboard;