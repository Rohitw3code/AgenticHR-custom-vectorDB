import React, { useState, useEffect } from 'react';
import { Upload, ChevronDown, ChevronUp, Briefcase, FileText, Clock } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredJobs = jobs.filter(job => 
    job['Job Title'].toLowerCase().includes(searchTerm.toLowerCase()) ||
    job['Job Description'].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-lg bg-opacity-90">
          <h2 className="text-3xl font-bold text-indigo-900 mb-6">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume Upload
              </label>
              <label className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-500 transition duration-200">
                <div className="flex items-center space-x-2 text-indigo-600">
                  <Upload className="w-5 h-5" />
                  <span>{selectedFile ? selectedFile.name : 'Upload PDF Resume'}</span>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Briefcase className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-indigo-900">{job['Job Title']}</h3>
                  <button
                    onClick={() => toggleJobExpansion(job['Job Title'])}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {expandedJobs[job['Job Title']] ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </button>
                </div>

                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Posted recently</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    <span>Full Description</span>
                  </div>
                </div>

                {expandedJobs[job['Job Title']] && (
                  <div className="mt-6">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {job['Job Description']}
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    onClick={() => handleApply(job['Job Title'])}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No jobs found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;