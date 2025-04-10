import React, { useState } from 'react';
import { Upload, FileUp, AlertCircle } from 'lucide-react';
import { uploadCSV } from '../services/api';

interface CSVUploaderProps {
  onUploadSuccess: (jobs: any[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const jobs = await uploadCSV(file);
      onUploadSuccess(jobs);
    } catch (err) {
      setError('Error uploading file. Please ensure it contains Job Title and Job Description columns.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-purple-600/30 dark:from-neon-blue/20 dark:to-neon-purple/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
        <div className="relative bg-white dark:bg-cyber-700/80 backdrop-blur-xl rounded-lg shadow-xl p-6 border border-gray-200/50 dark:border-cyber-600/50">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <div className="p-3 bg-blue-100 dark:bg-cyber-600 rounded-full">
                <Upload className="h-6 w-6 text-blue-600 dark:text-neon-blue" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload CSV File
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
              Upload a CSV file containing Job Title and Job Description columns
            </p>
            
            <label className="relative cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <div className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isUploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-neon-blue dark:to-neon-purple hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-neon-blue/20'
              } text-white`}>
                <FileUp className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Choose CSV File'}
              </div>
            </label>

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVUploader;