import React, { useState } from 'react';
import { FileText, Star, Mail, UserCheck, ChevronDown, ChevronUp, Clock, Briefcase, Bot, AlertCircle } from 'lucide-react';

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
      const validScores = Object.values(scores).filter(score => score !== undefined && score !== null);
      return validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
    } catch (e) {
      return 0;
    }
  };

  const getMatchScoreColor = (matchScore: string, threshold: number) => {
    const avgScore = calculateAverageScore(matchScore);
    if (avgScore >= threshold) return 'text-green-400';
    if (avgScore >= threshold - 20) return 'text-blue-400';
    if (avgScore >= threshold - 40) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const formatMatchScore = (matchScore: string): string => {
    try {
      const scores: MatchScore = JSON.parse(matchScore);
      const validScores = Object.values(scores).filter(score => score !== undefined && score !== null);
      return validScores.length > 0 
        ? `${Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)}%`
        : 'Pending Analysis';
    } catch (e) {
      return 'Pending Analysis';
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
    <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-purple-500/20">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-purple-300 flex items-center">
          <Briefcase className="w-6 h-6 mr-2 text-purple-400" />
          Job Applications
        </h2>
        <div className="space-y-6">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-500/20 overflow-hidden transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
                      {job['Job Title']}
                    </h3>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/20">
                        <Star className="w-4 h-4 mr-1 text-purple-400" />
                        <span>Threshold: {job.threshold}%</span>
                      </div>
                      <div className="flex items-center px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/20">
                        <UserCheck className="w-4 h-4 mr-1 text-purple-400" />
                        <span>Max Candidates: {job.maxCandidates}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleJobExpansion(job.id)}
                    className="p-2 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 transition-colors"
                  >
                    {expandedJobs[job.id] ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {expandedJobs[job.id] && (
                  <div className="mt-6 space-y-4">
                    {job.summary && (
                      <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
                        <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center">
                          <Bot className="w-4 h-4 mr-2" />
                          AI Summary
                        </h4>
                        <p className="text-gray-300">{job.summary}</p>
                      </div>
                    )}
                    <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
                      <h4 className="text-sm font-medium text-purple-300 mb-2">Full Description</h4>
                      <p className="text-gray-300 whitespace-pre-wrap">
                        {job['Job Description']}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  {applications
                    .filter(app => app.jobId === job.id)
                    .sort((a, b) => calculateAverageScore(b.matchScore) - calculateAverageScore(a.matchScore))
                    .map((application) => (
                      <div
                        key={application.id}
                        className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-medium text-purple-300">
                                {application.applicantName}
                              </h4>
                              {application.selected && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-400 border border-green-500/20">
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  Selected
                                </span>
                              )}
                              {application.invitationSent && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400 border border-blue-500/20">
                                  <Mail className="w-3 h-3 mr-1" />
                                  Invited
                                </span>
                              )}
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                              <span className="flex items-center text-gray-400">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDate(application.appliedAt)}
                              </span>
                              <span className="flex items-center text-gray-400">
                                <FileText className="w-4 h-4 mr-1" />
                                {application.resumeFile}
                              </span>
                            </div>
                            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {getDetailedScores(application.matchScore).map((score, index) => (
                                <div 
                                  key={index}
                                  className="bg-purple-900/20 px-3 py-2 rounded-lg border border-purple-500/10"
                                >
                                  <div className="text-xs text-gray-400">{score.label}</div>
                                  {score.score !== undefined && score.score !== null ? (
                                    <div className={`text-sm font-medium ${getMatchScoreColor(application.matchScore, job.threshold)}`}>
                                      {score.score}%
                                    </div>
                                  ) : (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      Pending
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-500/20">
                            {formatMatchScore(application.matchScore) !== 'Pending Analysis' ? (
                              <>
                                <Star className={`w-5 h-5 ${getMatchScoreColor(application.matchScore, job.threshold)}`} />
                                <span className={`font-medium ${getMatchScoreColor(application.matchScore, job.threshold)}`}>
                                  {formatMatchScore(application.matchScore)}
                                </span>
                              </>
                            ) : (
                              <div className="flex items-center text-gray-400">
                                <Bot className="w-5 h-5 mr-2 animate-pulse" />
                                <span className="text-sm">AI Analysis Pending</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  {applications.filter(app => app.jobId === job.id).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 italic">No applications yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobList;