import React from 'react';
import { Upload } from 'lucide-react';
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
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Jobs (CSV)</h2>
      <div className="flex items-center space-x-4">
        <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
          <Upload className="w-5 h-5 mr-2" />
          Upload CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}

export default JobUploader;