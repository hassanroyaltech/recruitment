// Import APIS
import { commonAPI } from '../../api/common';
import { evassessAPI } from '../../api/evassess';

/**
 * PreloadAPIs is an asynchronous function that runs specific APIs
 * upon Login. It is meant to preload certain data and store them in
 * the appropriate storage interface in order to prevent
 * over-consumption of API requests.
 * Includes:
 *  - video_assessment_categories
 *  - video_assessment_time_limits
 *  - video_assessment_retakes
 *
 * @returns {Promise<boolean>}
 * @constructor
 */
export async function PreloadAPIs() {
  // A dictionary to store boolean state of all preload APIs
  const stateDict = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
  };

  // Run functions
  const videoAssessmentCategories = await evassessAPI.getVideoAssessmentCategories();
  const videoAssessmentTimeLimits = await evassessAPI.getVideoAssessmentTimeLimits();
  const videoAssessmentNumberOfRetakes
    = await evassessAPI.getVideoAssessmentNumberOfRetakes();

  // ATS => create jobs functions
  const jobTypes = await commonAPI.getJobTypes({});
  const jobMajors = await commonAPI.getJobMajors();
  const careerLevel = await commonAPI.getCareerLevels({});
  const industries = await commonAPI.getIndustries();
  const degreeTypes = await commonAPI.getDegrees();
  const referenceNumber = await commonAPI.getReferenceNumber();
  const countries = await commonAPI.getCountries({});
  const nationalities = await commonAPI.getNationalities({});
  const languages = await commonAPI.getLanguages({});

  // Handle retrieved data from API and store it inside localStorage
  if (videoAssessmentCategories.statusCode === 200) {
    // Save to localStorage
    localStorage.setItem(
      'video_assessment_categories',
      JSON.stringify(videoAssessmentCategories.results),
    );
    stateDict['0'] = true;
  }

  if (videoAssessmentTimeLimits.statusCode === 200) {
    // Save to localStorage
    localStorage.setItem(
      'video_assessment_time_limits',
      JSON.stringify(videoAssessmentTimeLimits.results),
    );
    stateDict['1'] = true;
  }

  if (videoAssessmentNumberOfRetakes.statusCode === 200) {
    // Save to localStorage
    localStorage.setItem(
      'video_assessment_number_of_retakes',
      JSON.stringify(videoAssessmentNumberOfRetakes.results),
    );
    stateDict['2'] = true;
  }

  if (jobTypes.status === 200) {
    // Save to localStorage
    localStorage.setItem('job_types', JSON.stringify(jobTypes.data.results));
    stateDict['3'] = true;
  }

  if (jobMajors.status === 200) {
    // Save to localStorage
    localStorage.setItem('job_Majors', JSON.stringify(jobMajors.data.results));
    stateDict['4'] = true;
  }

  if (careerLevel.status === 200) {
    // Save to localStorage
    localStorage.setItem('career_levels', JSON.stringify(careerLevel.data.results));
    stateDict['5'] = true;
  }

  if (industries.status === 200) {
    // Save to localStorage
    localStorage.setItem('industries', JSON.stringify(industries.data.results));
    stateDict['6'] = true;
  }

  if (degreeTypes.data.statusCode === 200) {
    // Save to localStorage
    localStorage.setItem('degree_types', JSON.stringify(degreeTypes.data.results));
    stateDict['7'] = true;
  }

  if (referenceNumber.data.statusCode === 200) {
    // Save to LocalStorage
    localStorage.setItem(
      'reference_number',
      JSON.stringify(referenceNumber.data.results),
    );
    stateDict['8'] = true;
  }

  if (countries.status === 200) {
    // Save to LocalStorage
    localStorage.setItem('countries', JSON.stringify(countries.data.results));
    stateDict['9'] = true;
  }
  if (nationalities.status === 200) {
    // Save to LocalStorage
    localStorage.setItem(
      'nationalities',
      JSON.stringify(nationalities.data.results),
    );
    stateDict['10'] = true;
  }
  if (languages.status === 200) {
    // Save to LocalStorage
    localStorage.setItem('languages', JSON.stringify(languages.data.results));
    stateDict['11'] = true;
  }

  // Return true of all match, false otherwise [strict]
  return Object.values(stateDict).every((item) => item === true);
}
