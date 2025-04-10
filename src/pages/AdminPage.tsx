import React, { useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';
import axios from 'axios';

interface Job {
  'Job Title': string;
  'Job Description': string;
}

function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
    fetchResumes();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchResumes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/resumes');
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post('http://localhost:5000/api/jobs/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Jobs uploaded successfully!');
        fetchJobs(); // Refresh the jobs list
      } catch (error) {
        console.error('Error uploading CSV:', error);
        alert('Error uploading CSV file');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Upload Jobs (CSV)</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
            <Upload className="w-5 h-5 mr-2" />
            Upload CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-4">Uploaded Jobs</h2>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold">{job['Job Title']}</h3>
                <p className="text-gray-600 mt-2">{job['Job Description']}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-4">Submitted Resumes</h2>
          <div className="space-y-4">
            {resumes.map((resume, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <FileText className="w-5 h-5 text-gray-500" />
                <span>{resume}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;