import React from 'react';
import { Briefcase } from 'lucide-react';
import { Job } from '../services/api';

interface JobListProps {
  jobs: Job[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  return (
    <div className="mt-8 space-y-6">
      {jobs.map((job, index) => (
        <div
          key={index}
          className="relative group transform transition-all duration-200 hover:scale-102"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-purple-600/30 dark:from-neon-blue/20 dark:to-neon-purple/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
          <div className="relative bg-white dark:bg-cyber-700/80 backdrop-blur-xl rounded-lg shadow-xl p-6 border border-gray-200/50 dark:border-cyber-600/50">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 dark:bg-cyber-600 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-neon-blue" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {job['Job Title']}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {job['Job Description']}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobList;