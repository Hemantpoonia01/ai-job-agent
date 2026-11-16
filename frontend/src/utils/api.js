import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 60000,
});

export const analyzeMatch = (resumeText, jobDescription) =>
  api.post('/api/analyze/match', { resume_text: resumeText, job_description: jobDescription });

export const optimizeResume = (resumeText, jobDescription, targetRole) =>
  api.post('/api/resume/optimize', { resume_text: resumeText, job_description: jobDescription, target_role: targetRole });

export const generateCoverLetter = (resumeText, jobDescription, companyName, applicantName, tone) =>
  api.post('/api/cover-letter/generate', {
    resume_text: resumeText, job_description: jobDescription,
    company_name: companyName, applicant_name: applicantName, tone
  });

export const findJobs = (resumeText, preferredRoles, location, experienceLevel) =>
  api.post('/api/jobs/find', {
    resume_text: resumeText,
    preferred_roles: preferredRoles,
    preferred_location: location,
    experience_level: experienceLevel
  });

export const getScrapeStatus = () => api.post('/api/jobs/scrape-status');

export default api;
