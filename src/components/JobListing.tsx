import React, { useState } from 'react';
import { FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  description: string;
}

interface JobListingProps {
  job: Job;
}

const JobListing: React.FC<JobListingProps> = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const wordLimit = 30;
  const words = job.description.split(' ');
  const isLongDescription = words.length > wordLimit;
  const truncatedDescription = isLongDescription 
    ? words.slice(0, wordLimit).join(' ') + '...'
    : job.description;

  return (
    <div className="border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-lg bg-white dark:bg-gradient-to-r dark:from-gray-50 dark:to-white dark:bg-opacity-5 border-gray-200 dark:border-cyber-600">
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-purple-100 dark:to-purple-200 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <FileSpreadsheet className="h-4 w-4 text-blue-600 dark:text-purple-600" />
          </div>
          <h4 className="font-medium text-gray-800 dark:text-gray-900 group-hover:text-blue-600 dark:group-hover:text-purple-600 transition-colors duration-300">
            {job.title}
          </h4>
        </div>
        <div className="transform transition-transform duration-300 hover:scale-110">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-blue-500 dark:text-purple-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-blue-500 dark:text-purple-500" />
          )}
        </div>
      </div>
      <div
        className={`mt-4 overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-none opacity-100' : isLongDescription ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm text-gray-600 dark:text-gray-700 leading-relaxed pl-8">
          {isExpanded ? job.description : truncatedDescription}
        </p>
        {isLongDescription && !isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="mt-2 text-sm text-blue-600 dark:text-purple-600 hover:text-blue-700 dark:hover:text-purple-700 font-medium pl-8"
          >
            Read More
          </button>
        )}
      </div>
    </div>
  );
};

export default JobListing;