import React, { useState } from 'react';
import { FileText, Star } from 'lucide-react';

interface Job {
  id: number;
  'Job Title': string;
  'Job Description': string;
}

interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  applicantName: string;
  resumeFile: string;
  appliedAt: string;
  matchScore: number;
}

interface JobListProps {
  jobs: Job[];
  applications: Application[];
}

function JobList({ jobs, applications }: JobListProps) {
  const [expandedJobs, setExpandedJobs] = useState<{ [key: number]: boolean }>({});

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
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

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-blue-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const formatMatchScore = (score: number) => {
    return `${(score * 100).toFixed(1)}%`;
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold mb-4">Job Applications</h2>
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {job['Job Title']}
                </h3>
                <button
                  onClick={() => toggleJobExpansion(job.id)}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  {expandedJobs[job.id] ? 'Show Less' : 'Learn More'}
                </button>
              </div>
              
              {expandedJobs[job.id] && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {job['Job Description']}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {applications
                  .filter(app => app.jobId === job.id)
                  .sort((a, b) => b.matchScore - a.matchScore)
                  .map((application) => (
                    <div
                      key={application.id}
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
                      <div className="flex items-center space-x-2">
                        <Star className={`w-5 h-5 ${getMatchScoreColor(application.matchScore)}`} />
                        <span className={`font-medium ${getMatchScoreColor(application.matchScore)}`}>
                          {formatMatchScore(application.matchScore)}
                        </span>
                      </div>
                    </div>
                  ))}
                {applications.filter(app => app.jobId === job.id).length === 0 && (
                  <p className="text-gray-500 italic">No applications yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobList;