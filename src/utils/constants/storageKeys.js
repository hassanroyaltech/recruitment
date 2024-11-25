/**
 * It is smart to keep track of all storage keys so that they are cleared
 * from the browser as necessary.
 * @type {{
 *  session: [string, string, string, string, string, string, string],
 *  local: [string, string, string, string]
 * }}
 */
export const storageKeys = {
  local: [
    'user',
    'company_id',
    'permissions',
    'platform_language',

    // Preloaded keys
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
    'responsibility',
    'gateway_urls',
    'exp_time',
    'redirect_to',
    'redirect_url',
    'userDetails',

    // For tracing
    'debug',
  ],
  session: ['user', 'permissions'],
};
