import React, { useState, useEffect } from 'react';
import { Upload, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

interface Job {
  'Job Title': string;
  'Job Description': string;
}

function UserPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expandedJobs, setExpandedJobs] = useState<{ [key: string]: boolean }>({});
  const [applicantName, setApplicantName] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

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

  const toggleJobExpansion = (jobTitle: string) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobTitle]: !prev[jobTitle]
    }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axios.post('http://localhost:5000/api/resume/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setUploadedFileName(response.data.filename);
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

  const handleApply = async (jobTitle: string) => {
    if (!applicantName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!uploadedFileName) {
      alert('Please upload your resume first');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/apply', {
        jobTitle,
        applicantName,
        resumeFile: uploadedFileName
      });
      alert('Application submitted successfully!');
      setApplicantName('');
      setSelectedFile(null);
      setUploadedFileName(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application');
    }
  };

  const truncateDescription = (description: string) => {
    return description.length > 150 ? `${description.substring(0, 150)}...` : description;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Your Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume
            </label>
            <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 w-fit">
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
              <span className="text-sm text-gray-600 mt-2 block">
                Selected: {selectedFile.name}
              </span>
            )}
          </div>
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
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{job['Job Title']}</h3>
                  <button
                    onClick={() => toggleJobExpansion(job['Job Title'])}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedJobs[job['Job Title']] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-gray-600 mt-2">
                  {expandedJobs[job['Job Title']]
                    ? job['Job Description']
                    : truncateDescription(job['Job Description'])}
                </p>
                <button
                  onClick={() => handleApply(job['Job Title'])}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;