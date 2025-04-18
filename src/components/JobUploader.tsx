import React from 'react';
import { FileUp } from 'lucide-react';
import axios from 'axios';

interface JobUploaderProps {
  onUploadSuccess: () => void;
}

function JobUploader({ onUploadSuccess }: JobUploaderProps) {
  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post('http://localhost:5000/api/jobs/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        onUploadSuccess();
      } catch (error) {
        console.error('Error uploading CSV:', error);
      }
    }
  };

  return (
    <div className="relative group">
      <label
        htmlFor="csv-upload"
        className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600/50 to-indigo-600/50 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 border border-purple-500/20 hover:border-purple-500/40 shadow-lg hover:shadow-purple-500/25"
      >
        <div className="relative">
          <FileUp className="w-5 h-5 mr-2 group-hover:animate-bounce" />
        </div>
        Upload Jobs CSV
      </label>

      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
        className="hidden"
      />

      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300 blur pointer-events-none" />
    </div>
  );
}

export default JobUploader;