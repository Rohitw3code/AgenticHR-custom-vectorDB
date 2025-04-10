import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Job {
  'Job Title': string;
  'Job Description': string;
}

export const uploadCSV = async (file: File): Promise<Job[]> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.jobs;
};

export const getJobs = async (): Promise<Job[]> => {
  const response = await axios.get(`${API_URL}/jobs`);
  return response.data.jobs;
};