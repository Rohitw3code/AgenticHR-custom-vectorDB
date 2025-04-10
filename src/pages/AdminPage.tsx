import React, { useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';
import axios from 'axios';

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

function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

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
        fetchJobs();
      } catch (error) {
        console.error('Error uploading CSV:', error);
        alert('Error uploading CSV file');
      }
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
          <h2 className="text-2xl font-bold mb-4">Job Applications</h2>
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {job['Job Title']}
                </h3>
                <div className="space-y-4">
                  {applications
                    .filter(app => app.jobTitle === job['Job Title'])
                    .map((application, appIndex) => (
                      <div
                        key={appIndex}
                        className="bg-gray-50 rounded-lg p-4 flex items-start justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {application.applicantName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Applied: {formatDate(application.appliedAt)}
                          </p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FileText className="w-4 h-4 mr-2" />
                            {application.resumeFile}
                          </div>
                        </div>
                      </div>
                    ))}
                  {applications.filter(app => app.jobTitle === job['Job Title']).length === 0 && (
                    <p className="text-gray-500 italic">No applications yet</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;