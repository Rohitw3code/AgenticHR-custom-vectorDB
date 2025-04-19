import React, { useState } from 'react';
import { FileText, Star, Mail, UserCheck } from 'lucide-react';

interface Job {
  id: number;
  'Job Title': string;
  'Job Description': string;
  threshold: number;
  maxCandidates: number;
  summary?: string;
}

interface MatchScore {
  experience_score: number;
  skills_score: number;
  education_score: number;
  other_score: number;
}

interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  applicantName: string;
  resumeFile: string;
  appliedAt: string;
  matchScore: string;
  selected: boolean;
  invitationSent: boolean;
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

  const calculateAverageScore = (matchScore: string): number => {
    try {
      const scores: MatchScore = JSON.parse(matchScore);
      return (
        (scores.experience_score + 
         scores.skills_score + 
         scores.education_score + 
         scores.other_score) / 4
      );
    } catch (e) {
      return 0;
    }
  };

  const getMatchScoreColor = (matchScore: string, threshold: number) => {
    const avgScore = calculateAverageScore(matchScore);
    if (avgScore >= threshold) return 'text-green-600';
    if (avgScore >= threshold - 20) return 'text-blue-600';
    if (avgScore >= threshold - 40) return 'text-yellow-600';
    return 'text-gray-500';
  };

  const formatMatchScore = (matchScore: string): string => {
    try {
      const scores: MatchScore = JSON.parse(matchScore);
      return `${Math.round((
        scores.experience_score + 
        scores.skills_score + 
        scores.education_score + 
        scores.other_score
      ) / 4)}%`;
    } catch (e) {
      return '0%';
    }
  };

  const getDetailedScores = (matchScore: string) => {
    try {
      const scores: MatchScore = JSON.parse(matchScore);
      return [
        { label: 'Experience', score: scores.experience_score },
        { label: 'Skills', score: scores.skills_score },
        { label: 'Education', score: scores.education_score },
        { label: 'Other', score: scores.other_score }
      ];
    } catch (e) {
      return [];
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold mb-4">Job Applications</h2>
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {job['Job Title']}
                  </h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="inline-flex items-center mr-4">
                      <Star className="w-4 h-4 mr-1" />
                      Threshold: {job.threshold}%
                    </span>
                    <span className="inline-flex items-center">
                      <UserCheck className="w-4 h-4 mr-1" />
                      Max Candidates: {job.maxCandidates}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleJobExpansion(job.id)}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  {expandedJobs[job.id] ? 'Show Less' : 'Learn More'}
                </button>
              </div>
              
              {expandedJobs[job.id] && (
                <div className="mb-4 space-y-4">
                  {job.summary && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Job Summary</h4>
                      <p className="text-blue-800">{job.summary}</p>
                    </div>
                  )}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Full Description</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {job['Job Description']}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {applications
                  .filter(app => app.jobId === job.id)
                  .sort((a, b) => calculateAverageScore(b.matchScore) - calculateAverageScore(a.matchScore))
                  .map((application) => (
                    <div
                      key={application.id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {application.applicantName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Applied: {formatDate(application.appliedAt)}
                          </p>
                          <div className="mt-2 flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-500">
                              <FileText className="w-4 h-4 mr-1" />
                              {application.resumeFile}
                            </span>
                            {application.selected && (
                              <span className="flex items-center text-green-600">
                                <UserCheck className="w-4 h-4 mr-1" />
                                Selected
                              </span>
                            )}
                            {application.invitationSent && (
                              <span className="flex items-center text-blue-600">
                                <Mail className="w-4 h-4 mr-1" />
                                Invited
                              </span>
                            )}
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {getDetailedScores(application.matchScore).map((score, index) => (
                              <div key={index} className="text-xs">
                                <span className="text-gray-500">{score.label}: </span>
                                <span className={getMatchScoreColor(application.matchScore, job.threshold)}>
                                  {score.score}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className={`w-5 h-5 ${getMatchScoreColor(application.matchScore, job.threshold)}`} />
                          <span className={`font-medium ${getMatchScoreColor(application.matchScore, job.threshold)}`}>
                            {formatMatchScore(application.matchScore)}
                          </span>
                        </div>
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