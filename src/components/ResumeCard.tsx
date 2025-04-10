import React from 'react';
import { Users, CheckCircle, AlertCircle, Clock, Star } from 'lucide-react';

interface Resume {
  id: number;
  username: string;
  jobId: number;
  status: 'pending' | 'processing' | 'selected' | 'rejected';
  submittedAt: string;
  matchScore?: number;
  education?: string[];
  experience?: string[];
  skills?: string[];
}

interface ResumeCardProps {
  resume: Resume;
  matchThreshold: number;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, matchThreshold }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'selected':
        return <CheckCircle className="h-5 w-5 text-green-500 animate-success" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500 animate-fade-in" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (score: number = 0) => {
    if (score >= matchThreshold) return 'text-green-500 bg-green-50';
    if (score >= matchThreshold - 10) return 'text-yellow-500 bg-yellow-50';
    return 'text-red-500 bg-red-50';
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'selected':
        return 'bg-gradient-to-r from-green-50 to-white border-green-200';
      case 'rejected':
        return 'bg-gradient-to-r from-red-50 to-white border-red-200';
      case 'processing':
        return 'bg-gradient-to-r from-blue-50 to-white border-blue-200';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-6 transition-all duration-500 ease-in-out transform hover:scale-102 hover:shadow-lg ${getStatusBackground(resume.status)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 text-lg">{resume.username}</h5>
            <p className="text-sm text-gray-500">Applied: {resume.submittedAt}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {resume.matchScore && (
            <div className={`px-4 py-2 rounded-full font-medium flex items-center space-x-2 ${getStatusColor(resume.matchScore)}`}>
              <Star className="h-4 w-4" />
              <span>{resume.matchScore}% Match</span>
            </div>
          )}
          {getStatusIcon(resume.status)}
        </div>
      </div>
      {resume.status !== 'pending' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Education', items: resume.education },
            { title: 'Experience', items: resume.experience },
            { title: 'Skills', items: resume.skills }
          ].map((section, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
              <h6 className="font-medium text-gray-900 mb-3 flex items-center">
                {section.title}
              </h6>
              <ul className="space-y-2">
                {section.items?.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeCard;