const URL = `${process.env.REACT_APP_DOMIN_PHP_API_GET}/${process.env.REACT_APP_ENDPOINT_HELPER_API}/${process.env.REACT_APP_VERSION_API}`;
// Helpers.
export default {
  GET_COUNTRIES: `${URL}/service/country`,
  GENDER: `${URL}/account_gender`,
  NATIONALITY: `${URL}/service/nationality`,
  COMPANY_EMPLOYEES: `${URL}/company-employees`,
  INDUSTRY: `${URL}/service/industry`,
  LANGUAGES: `${URL}/languages`,
  LANGUAGES_PROFICIENCY: `${URL}/service/language_proficiency`,
  KEYWORD: `${URL}/keyword`,
  CAREER_LEVEL: `${URL}/service/career`,
  JOB_TYPES: `${URL}/service/job_type`,
  DEGREE_TYPES: `${URL}/degree-types`,
  EXPERIENCE: `${URL}/experience`,
  JOB_MAJORS: `${URL}/service/job_major`,
  ABOUT_US: `${URL}/hear-about-us`,
  TIMEZONE: `${URL}/timezone`,
  DOWNLOAD: `${process.env.REACT_APP_DOMIN_PHP_API_GET}/${process.env.REACT_APP_PREFIX_API}/download`,
};
