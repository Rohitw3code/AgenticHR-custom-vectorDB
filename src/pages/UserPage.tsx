import React, { useState, useEffect } from 'react';
import { Upload, ChevronDown, ChevronUp, Briefcase, FileText, Clock, Mail, Search } from 'lucide-react';
import axios from 'axios';

interface Job {
  id: number;
  'Job Title': string;
  'Job Description': string;
  summary?: string;
}

function UserPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expandedJobs, setExpandedJobs] = useState<{ [key: number]: boolean }>({});
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job => 
      job['Job Title'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      job['Job Description'].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs');
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
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

  const handleApply = async (jobId: number) => {
    if (!applicantName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }
    if (!uploadedFileName) {
      alert('Please upload your resume first');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/apply', {
        jobId,
        applicantName,
        email,
        resumeFile: uploadedFileName
      });
      alert('Application submitted successfully!');
      setApplicantName('');
      setEmail('');
      setSelectedFile(null);
      setUploadedFileName(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-purple-500/20">
              <h2 className="text-3xl font-bold text-purple-300 mb-6">Your Profile</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-500/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-500/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Resume Upload
                  </label>
                  <label className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-purple-500/20 rounded-lg cursor-pointer hover:border-purple-500/50 transition duration-200 bg-purple-900/20">
                    <div className="flex items-center space-x-2 text-purple-300">
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

            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-xl bg-purple-900/20 border border-purple-500/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center">
              <Briefcase className="w-6 h-6 mr-2" />
              Available Positions
            </h2>
            <div className="space-y-6 max-h-[800px] overflow-y-auto custom-scrollbar pr-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-purple-900/20 rounded-xl border border-purple-500/20 overflow-hidden transition-all duration-300 hover:border-purple-500/40"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-purple-300">{job['Job Title']}</h3>
                      <button
                        onClick={() => toggleJobExpansion(job.id)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {expandedJobs[job.id] ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Posted recently</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        <span>Full Description</span>
                      </div>
                    </div>

                    {expandedJobs[job.id] && (
                      <div className="mt-6">
                        {job.summary && (
                          <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
                            <h4 className="text-sm font-medium text-purple-300 mb-2">Summary</h4>
                            <p className="text-gray-300">{job.summary}</p>
                          </div>
                        )}
                        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {job['Job Description']}
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <button
                        onClick={() => handleApply(job.id)}
                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No jobs found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;