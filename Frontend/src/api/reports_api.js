import api from './axios';

/**
 * Submit an anonymous TFGBV report to the database
 * @param {Object} data - { incidentType, platform, description }
 * @returns {Promise<Object>} - Contains success status and the unique caseCode
 */
export const submitReport = async (data) => {
  const res = await api.post('/incidents/report', data);
  return res.data;
};

/**
 * Check the status of an existing case using the anonymous code
 * @param {string} caseCode - The unique CASE-XXXX code
 * @returns {Promise<Object>} - The status and details of the report
 */
export const getReportStatus = async (caseCode) => {
  const res = await api.get(`/incidents/status/${caseCode}`);
  return res.data;
};