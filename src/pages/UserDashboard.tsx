import React, { useState, useEffect } from 'react';
import { FileText, Briefcase, Upload, CheckCircle, Users } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  description: string;
}

interface Application {
  jobId: number;
  resumePath: string;
  status: 'submitted' | 'processing' | 'completed';
}

const UserDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<number | null>(null);

  useEffect(() => {
    // Simulate fetching jobs from API
    const dummyJobs: Job[] = [
      { id: 1, title: 'Senior React Developer', description: 'Experience with React, TypeScript, and modern web technologies required. Must have 5+ years of experience in web development.' },
      { id: 2, title: 'AI Engineer', description: 'Deep learning and machine learning expertise required. Experience with PyTorch or TensorFlow is a must.' },
      { id: 3, title: 'Product Manager', description: 'Lead product development and strategy. 3+ years of experience in product management for SaaS products.' },
      { id: 4, title: 'UX Designer', description: 'Create beautiful and intuitive user experiences. Proficiency in Figma and user research required.' }
    ];
    setJobs(dummyJobs);
  }, []);

  const handleResumeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedResume(file);
    }
  };

  const handleApply = (jobId: number) => {
    if (!selectedResume) {
      alert('Please select a resume first');
      return;
    }

    setApplications(prev => [...prev, {
      jobId,
      resumePath: selectedResume.name,
      status: 'submitted'
    }]);

    setUploadSuccess(jobId);
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  const isApplied = (jobId: number) => {
    return applications.some(app => app.jobId === jobId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Positions</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Find and apply for positions that match your skills</p>
      </div>

      {/* Resume Upload Section */}
      <div className="relative group mb-8">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-purple-600/30 dark:from-neon-blue/20 dark:to-neon-purple/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
        <div className="relative bg-gray-50/80 dark:bg-cyber-700/80 backdrop-blur-xl rounded-lg shadow-xl p-6 border border-gray-200/50 dark:border-cyber-600/50">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label
                htmlFor="resume-upload"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <FileText className="h-6 w-6 text-blue-600 dark:text-neon-blue" />
                <span className="text-lg font-medium text-gray-900 dark:text-white">Upload Your Resume</span>
              </label>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {selectedResume ? selectedResume.name : 'Select your resume file (PDF format)'}
              </p>
            </div>
            <input
              type="file"
              id="resume-upload"
              accept=".pdf"
              onChange={handleResumeSelect}
              className="hidden"
            />
            <label
              htmlFor="resume-upload"
              className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-neon-blue dark:to-neon-purple text-white hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-neon-blue/20 cursor-pointer transition-all duration-300 flex items-center space-x-2"
            >
              <Upload className="h-5 w-5" />
              <span>Choose File</span>
            </label>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="relative group transform transition-all duration-200 hover:scale-102"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-purple-600/30 dark:from-neon-blue/20 dark:to-neon-purple/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-gray-50/80 dark:bg-cyber-700/80 backdrop-blur-xl rounded-lg shadow-xl p-6 border border-gray-200/50 dark:border-cyber-600/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-cyber-600 rounded-lg">
                    <Briefcase className="h-6 w-6 text-blue-600 dark:text-neon-blue" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h2>
                </div>
                {uploadSuccess === job.id && (
                  <div className="flex items-center text-green-500 dark:text-green-400">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span className="text-sm">Applied!</span>
                  </div>
                )}
              </div>
              
              <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                {job.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full bg-gray-200 dark:bg-cyber-600 border-2 border-white dark:border-cyber-700 flex items-center justify-center"
                      >
                        <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Multiple openings</span>
                </div>

                <button
                  onClick={() => handleApply(job.id)}
                  disabled={!selectedResume || isApplied(job.id)}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all duration-300 ${
                    !selectedResume || isApplied(job.id)
                      ? 'bg-gray-200 dark:bg-cyber-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-neon-blue dark:to-neon-purple text-white hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-neon-blue/20'
                  }`}
                >
                  {isApplied(job.id) ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span>Apply with Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;