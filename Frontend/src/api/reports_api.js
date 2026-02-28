import api from "./axios";

/**
 * Submit an anonymous TFGBV report.
 * Accepts a FormData object so screenshots (files) can be sent alongside text fields.
 *
 * Expected FormData fields:
 *   incidentType  {string}  - e.g. "doxxing"
 *   platform      {string}  - e.g. "Facebook"
 *   description   {string}
 *   offenderLink  {string}  - optional URL to offender profile / post
 *   screenshots   {File[]}  - optional, up to 5 image files
 *
 * @param {FormData} formData
 * @returns {Promise<{ success: boolean, caseCode: string }>}
 */
export const submitReport = async (formData) => {
  const res = await api.post("/incidents/report", formData, {
    headers: {
      // Let the browser set the correct multipart boundary automatically
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/**
 * Check the status of an existing case using the anonymous code.
 * @param {string} caseCode - The unique CASE-XXXX code
 * @returns {Promise<{ data: object }>}
 */
export const getReportStatus = async (caseCode) => {
  const res = await api.get(`/incidents/status/${caseCode}`);
  return res.data;
};
