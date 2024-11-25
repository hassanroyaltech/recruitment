/**
 * Function that clears the Local Storage
 */
function clearLocalStorage() {
  const localStorageItems = [
    'isTrialSubscriptions',
    'user',
    'company_id',
    'permissions',
    // 'platform_language',
    'video_assessment_categories',
    'video_assessment_time_limits',
    'video_assessment_number_of_retakes',
    'job_types',
    'job_Majors',
    'career_levels',
    'industries',
    'degree_types',
    'reference_number',
    'countries',
    'nationalities',
    'languages',
    'pipeLineUuid',
    'job_uuid',
    'token',
    'isRememberMe',
    'UserSubscriptions',
    'careerPortalUrl',
    'user',
    'permissions',
    'user_device_token',
    'account',
    'userDetails',
    'permissionReducer',
    'nylasAccountInfo',
    'account_uuid',
    'permissionsReducer',
    'branches',
    'selectedBranch',
    'candidateReducer',
    'candidateReducer',
    'APIRequestsCounter',
    'isRefreshTokenInProgress',
    'opened-analytics-dashboards',
  ];
  localStorageItems.forEach((item) => {
    localStorage.removeItem(item);
  });
}

// Export service
export const storageService = {
  clearLocalStorage,
};
