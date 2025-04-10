import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';

interface Job {
  'Job Title': string;
  'Job Description': string;
}

function UserPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        const formData = new FormData();
        formData.append('file', file);

        try {
          await axios.post('http://localhost:5000/api/resume/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          alert('Resume uploaded successfully!');
        } catch (error) {
          console.error('Error uploading resume:', error);
          alert('Error uploading resume');
        }
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
            <Upload className="w-5 h-5 mr-2" />
            Choose PDF
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {selectedFile && (
            <span className="text-sm text-gray-600">
              Selected: {selectedFile.name}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
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
    </div>
  );
}

export default UserPage;