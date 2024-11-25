// Base paths
const domain_GET = process.env.REACT_APP_DOMIN_PHP_API_GET;
const domain_WRITE = process.env.REACT_APP_DOMIN_PHP_API;
const version = process.env.REACT_APP_VERSION_API;
const endpoint = process.env.REACT_APP_ENDPOINT_API;
const helpersEndpoint = process.env.REACT_APP_ENDPOINT_HELPER_API;
const prefix = process.env.REACT_APP_PREFIX_API;
const indexer = {
  base_GET: process.env.REACT_APP_DOMIN_PHP_API_GET,
  base_WRITE: process.env.REACT_APP_DOMIN_PHP_API,
  prefix: process.env.REACT_APP_PREFIX_INDEXER_API,
  version: process.env.REACT_APP_VERSION_INDEXER_API,
};
// const notification = process.env.REACT_APP_DOMIN_API;
// const analytics = process.env.REACT_APP_ANALYTICS_API;
// const backendEndpoint = process.env.REACT_APP_DOMIN_API;

const HMGBASEURLGET = process.env.REACT_APP_DOMIN_PHP_API_GET;
const HMGBASEURLWRITE = process.env.REACT_APP_DOMIN_PHP_API;

// Main paths
const BaseUrlGET = `${domain_GET}/${prefix}/${version}`;
const BaseUrlWRITE = `${domain_WRITE}/${prefix}/${version}`;
const AuthURLGET = `${domain_GET}/${endpoint}/${version}`;
const AuthURLWRITE = `${domain_WRITE}/${endpoint}/${version}`;
const IntegrationURL = `${domain_GET}/${endpoint}/${version}/auth/integration`;
const AssessmentURLGET = `${domain_GET}/${endpoint}/prep_assessment/${version}`;
const AssessmentURLWRITE = `${domain_WRITE}/${endpoint}/prep_assessment/${version}`;
const TeamURLGET = `${domain_GET}/${endpoint}/team/${version}`;
const UserURL = `${domain_GET}/${endpoint}/${version}`;
const CompanyURLGET = `${domain_GET}/${endpoint}/company/${version}`;
const CompanyURLWRITE = `${domain_WRITE}/${endpoint}/company/${version}`;
const CandidateURL = `${domain_GET}/${endpoint}/api/candidate/${version}`;
const BrandURLGET = `${domain_GET}/${endpoint}/career/portal/${version}`;
const BrandURLWRITE = `${domain_WRITE}/${endpoint}/career/portal/${version}`;
const HelpersURLGET = `${domain_GET}/${helpersEndpoint}/${version}`;
const HelpersURLWRITE = `${domain_WRITE}/${helpersEndpoint}/${version}`;
const RmsURLGET = `${domain_GET}/${endpoint}/rms/${version}`;
const RmsURLWRITE = `${domain_WRITE}/${endpoint}/rms/${version}`;
const RmsIndexerUrlGET = `${indexer.base_GET}/${indexer.prefix}/${indexer.version}/rms`;
const RmsIndexerUrlWRITE = `${indexer.base_WRITE}/${indexer.prefix}/${indexer.version}/rms`;
const AtsURLGET = `${domain_GET}/${endpoint}/ats/${version}`;
const AtsURLWRITE = `${domain_WRITE}/${endpoint}/ats/${version}`;
const QuestionnaireURLGET = `${domain_GET}/${endpoint}/questionnaires/${version}`;
const QuestionnaireURLWRITE = `${domain_WRITE}/${endpoint}/questionnaires/${version}`;
const EvaluationURLGET = `${domain_GET}/${endpoint}/evaluation/${version}`;
const EvaluationURLWRITE = `${domain_WRITE}/${endpoint}/evaluation/${version}`;
const InterviewURLGET = `${domain_GET}/${endpoint}/schedule/${version}/interview`;
const InterviewURLWRITE = `${domain_WRITE}/${endpoint}/schedule/${version}/interview`;
const AtsIndexerURL = `${indexer.base}/${indexer.prefix}/${indexer.version}`;
const CandidateUrl = `${BaseUrlGET}`;
const PipelineURLGET = `${domain_GET}/${endpoint}/pipelines/${version}`;
const PipelineURLWRITE = `${domain_WRITE}/${endpoint}/pipelines/${version}`;
const MeetURL = `${domain_GET}/${endpoint}/ats/${version}`;
const EMAILTEMPLATEURLGET = `${domain_GET}/${endpoint}/mail/${version}`;
const OFFERURLGET = `${domain_GET}/${endpoint}/offers/${version}`;
const OFFERURLWRITE = `${domain_WRITE}/${endpoint}/offers/${version}`;
const USERSURLGET = `${domain_GET}/${endpoint}/${version}`;
const USERSURLWRITE = `${domain_WRITE}/${endpoint}/${version}`;
// const USERSURL = `${HMGBASEURL}/api/${version}`;
const RECRUITERURL = `${domain_GET}/${endpoint}/${version}`;
const CandidateQuestionnare = `${domain_GET}/${endpoint}/ats/${version}/candidate/questionnaire`;
const NotificationGET = `${domain_GET}/api/${version}/notifications`;
const NotificationWRITE = `${domain_WRITE}/api/${version}/notifications`;
const AnalyticsGET = `${domain_GET}/${prefix}/${version}`;
const AnalyticsWRITE = `${domain_WRITE}/${prefix}/${version}`;
const ASSESSMENTTESTSGET = `${domain_GET}/${endpoint}/assessment_test/${version}/list`;
const ASSESSMENTCATEGORY = `${domain_GET}/${endpoint}/assessment_test/${version}/category`;
const ASSESSMENTTESTSINVITE = `${domain_WRITE}/${endpoint}/assessment_test/${version}/candidate/invite`;
const CANDIDATERESPONSE = `${domain_GET}/${endpoint}/assessment_test/${version}/candidate/response`;
const ServicesURL = `${domain_GET}/api/${version}/subscription/plans`;
const CurrentPlan = `${domain_GET}/api/${version}/subscription/services/current`;
const CheckAction = `${domain_WRITE}/api/${version}/subscription/check_action`;
const CheckOut = `${domain_WRITE}/api/${version}/subscription/checkout`;
const CheckOutProduct = `${domain_WRITE}/api/${version}/subscription/checkout/product`;
const Transactions = `${domain_GET}/api/${version}/subscription/transactions`;
const VerifyTransactions = `${domain_WRITE}/api/${version}/subscription/transaction/verify`;
const CancelSubscription = `${domain_WRITE}/api/${version}/subscription/cancel`;
const CancelDowngrade = `${domain_WRITE}/api/${version}/subscription/services/cancel_downgrade`;
const ReverseSubscription = `${domain_WRITE}/api/${version}/subscription/reverse`;
const NewHelpersURL = `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/${process.env.REACT_APP_VERSION_API}`;

/**
 * Constructed paths object
 */
export default {
  // Common URLs, to perform various requests
  common: {
    media: `${BaseUrlWRITE}/media`,
    mediaRecipient: `${BaseUrlWRITE}/recipient/media`,
    CREATE_MEDIA: `${BaseUrlWRITE}/attachments`,
    CHECK_PROVIDERS: `${HelpersURLGET}/check-company-providers`,
  },

  /**
   * Company URls
   */
  company: {
    profileBuilderGET: `${CompanyURLGET}/profile-builder`,
    profileBuilderWRITE: `${CompanyURLWRITE}/profile-builder`,
    profileBuilderOptions: `${CompanyURLGET}/profile-builder/options`,
    SignUpProfileBuilder: `${CompanyURLGET}/profile-builder/signup`,
    profileBuilderList: `${CompanyURLGET}/profile-builder/list`,
  },

  /**
   * Preferences URLs
   */

  preferences: {
    pipelineList: `${PipelineURLGET}/pipeline/list`,
    pipelineDropdown: `${PipelineURLGET}/pipeline/dropdown`,
    pipelines: `${PipelineURLGET}/pipeline`,
    STAGES_REORDER: `${PipelineURLWRITE}/stage/reorder`,
    PIPELINES_LIST: `${PipelineURLGET}/pipeline/list`,
    stages: `${PipelineURLGET}/stage`,
    STAGES_DROPDOWN: `${PipelineURLGET}/stage/dropdown`,
    emailtemplates: `${EMAILTEMPLATEURLGET}/template`,
    EMAIL_TEMPLATES_DROPDOWN: `${EMAILTEMPLATEURLGET}/template/dropdown`,
    TEMPLATE_BY_SLUG: `${EMAILTEMPLATEURLGET}/template/slug`,
    SYSTEM_TEMPLATES: `${EMAILTEMPLATEURLGET}/template/system`,
    TEMPLATES_COLLECTION: `${EMAILTEMPLATEURLGET}/template/collection`,
    MailTemplateBySlug: `${EMAILTEMPLATEURLGET}/template`,
    ASSESSMENT_PIPELINE: `${PipelineURLGET}/pipeline/assessment`,
    TEAM: `${TeamURLGET}/team`,
    USERS: `${USERSURLGET}/users`,
    USERSLIST: `${USERSURLGET}/users/list`,
    USERS_DROPDOWN: `${USERSURLGET}/users/dropdown`,
    UPDATE_PERMISSION: `${USERSURLWRITE}/users/permissions`,
    TOGGLE_USER_STATUS: `${USERSURLWRITE}/user/status-toggle`,
    RESPONSIBILITY: `${RECRUITERURL}/responsibility`,
    EVALUATION_GET: `${EvaluationURLGET}/evaluation`,
    EVALUATION_WRITE: `${EvaluationURLWRITE}/evaluation`,
    OFFER: `${OFFERURLGET}/offer`,
    OFFER_DROPDOWN: `${OFFERURLGET}/offer/dropdown`,
    OFFER_REFERENCE_NUMBER: `${OFFERURLGET}/offer/reference-number`,
    OFFERS_COLLECTION: `${OFFERURLGET}/offer/collection`,
    SEND_OFFER: `${OFFERURLWRITE}/offer/send`,
  },
  /**
   * Auth URLs, to perform authentication actions
   */
  auth: {
    login: `${AuthURLWRITE}/login`,
    logout: `${AuthURLWRITE}/logout`,
    resetPassword: {
      resetPassword: `${AuthURLWRITE}/reset-password`,
      setPassword: `${AuthURLWRITE}/set-password`,
      changePassword: `${AuthURLWRITE}/change-password`,
      verify_link: `${AuthURLWRITE}/verify-link`,
    },
    register: `${AuthURLWRITE}/register`,
    tokenValidation: `${AuthURLWRITE}/verification`,
    access: `${AuthURLWRITE}/register/access`,
    SET_COMPANY_DETAILS: `${AuthURLWRITE}/detail`,
    REFRESH_TOKEN: `${AuthURLGET}/refresh/token`,
  },

  administration: {
    integrations: IntegrationURL,
    services: ServicesURL,
    checkAction: CheckAction,
    checkOut: CheckOut,
    checkOutProduct: CheckOutProduct,
    transactions: Transactions,
    verifyTransactions: VerifyTransactions,
    currentPlan: CurrentPlan,
    cancelSubscription: CancelSubscription,
    cancelDowngrade: CancelDowngrade,
    reverseSubscription: ReverseSubscription,
  },

  /**
   * Overview URLs
   */
  overview: {
    interviews_GET: `${InterviewURLGET}`,
    interviews_WRITE: `${InterviewURLWRITE}`,
    statistics: `${HelpersURLGET}/overview`,
    CHART_STATISTICS: `${HelpersURLGET}/candidates-report`,
    CANDIDATE_LIST: `${InterviewURLGET}/get_candidates`,
    COMPANY_REPORT: `${CompanyURLGET}/company-report`,
  },
  /**
   * Questionnaire URLs.
   */
  questionnaire: {
    questionnaire_GET: `${QuestionnaireURLGET}/questionnaire`,
    questionnaire_WRITE: `${QuestionnaireURLWRITE}/questionnaire`,
    LIST_BY_PIPELINE: `${QuestionnaireURLGET}/list`,
    question: `${QuestionnaireURLWRITE}/question`,
    SIGNUP_GET: `${QuestionnaireURLGET}/questionnaire/sign_up`,
    SIGNUP_WRITE: `${QuestionnaireURLWRITE}/questionnaire/sign_up`,
  },

  /**
   * Evaluation URLs.
   */
  evaluation: `${EvaluationURLGET}/evaluation`,
  evaluation_dropdown: `${EvaluationURLGET}/evaluation/dropdown`,

  /**
   * Helper URLs, to get various data such as the list of countries and nationalities
   */
  helpers: {
    GET_COUNTRIES: `${NewHelpersURL}/service/country`,
    GENDER: `${HelpersURLGET}/account_gender`,
    nationality: `${NewHelpersURL}/service/nationality`,
    COMPANY_EMPLOYEES: `${HelpersURLGET}/company-employees`,
    INDUSTRY: `${NewHelpersURL}/service/industry`,
    LANGUAGES: `${HelpersURLGET}/languages`,
    LANGUAGES_PROFICIENCY: `${NewHelpersURL}/service/language_proficiency`,
    KEYWORD: `${HelpersURLGET}/keyword`,
    CAREER_LEVEL: `${NewHelpersURL}/service/career`,
    JOB_TYPES: `${NewHelpersURL}/service/job_type`,
    DEGREE_TYPES: `${HelpersURLGET}/degree-types`,
    EXPERIENCE: `${HelpersURLGET}/experience`,
    JOB_MAJORS: `${NewHelpersURL}/service/job_major`,
    ABOUT_US: `${HelpersURLGET}/hear-about-us`,
    TIMEZONE: `${HelpersURLGET}/timezone`,
    DOWNLOAD: `${domain_GET}/${prefix}/download`,
    ELEVATUS_ADS: `${HelpersURLGET}/elevatus-ads`,
    FILE_TYPES: `${HelpersURLGET}/file-types`,
    FILE_SIZES: `${HelpersURLGET}/file-sizes`,
    DEVICE_TOKEN: `${HelpersURLWRITE}/user-device`,
  },

  /**
   * EVA-form-builder API
   */
  formBuilder: {
    GET_TEMPLATE: `${HMGBASEURLGET}/api/formbuilder/v1/template/show`,
    CREATE_TEMPLATE: `${HMGBASEURLWRITE}/api/formbuilder/v1/template/create`,
    DELETE_TEMPLATE: `${HMGBASEURLWRITE}/api/formbuilder/v1/template/delete`,
    UPDATE_TEMPLATE: `${HMGBASEURLWRITE}/api/formbuilder/v1/template/update`,
    GET_CUSTOM_FIELDS: `${HMGBASEURLGET}/api/formbuilder/v1/fields/list`,
  },
  offer: {
    GET_OFFER: `${HMGBASEURLGET}/api/formbuilder/v1/offer/show`,
    CREATE_OFFER: `${HMGBASEURLWRITE}/api/formbuilder/v1/offer/create`,
    DELETE_OFFER: `${HMGBASEURLWRITE}/api/formbuilder/v1/offer/delete`,
    UPDATE_OFFER: `${HMGBASEURLWRITE}/api/formbuilder/v1/offer/update`,
  },
  /**
   * EVA-MEET URLs to create elevatus-native intervies
   */
  evameet: {
    UPCOMING: `${MeetURL}/meetings/upcoming`,
    PREVIOUS: `${MeetURL}/meetings/previous`,
  },

  /**
   * EVA-REC URLs related to the ATS and RMS
   */
  evarec: {
    ats: {
      reference_number: `${AtsURLGET}/job/reference-number`,
      job: `${AtsURLWRITE}/job`,
      viewJob: `${AtsURLGET}/job/view`,
      MANAGE_WEIGHTS: `${AtsURLWRITE}/job/weight`,
      ARCHIVED: `${AtsURLGET}/job/archived`,
      // JOB BOARD END POINTS
      ARCHIVE: `${AtsURLWRITE}/job/archive`,
      ACTIVE: `${AtsURLGET}/job/dropdown`,
      ACTIVE_JOB: `${AtsURLGET}/job/active`,
      JOB_SEARCH: `${AtsURLGET}/job/search`,
      ACTIVATE: `${AtsURLWRITE}/job/activate`,
      NOTES_GET: `${AtsURLGET}/notes`,
      NOTES_WRITE: `${AtsURLWRITE}/notes`,
      NOTES_MEMBERS: `${AtsURLGET}/notes/members`,
      JOB: `${AtsURLGET}/job`,
      TEAMS: `${TeamURLGET}/recruiter`,
      INVITE_TEAM: `${AtsURLWRITE}/recruiter/invite`,
      GET_INVITED_TEAM: `${AtsURLGET}/recruiter`,
      TEAM_SEARCH: `${TeamURLGET}/team/search`,
      TEMPLATES_GET: `${AtsURLGET}/template`,
      TEMPLATES_WRITE: `${AtsURLWRITE}/template`,
      TEMPLATES_DROPDOWN: `${AtsURLGET}/template/dropdown`,
      PIPELINE: `${AtsURLGET}/job/pipeline`,
      PIPELINE_STAGE: `${AtsURLGET}/job/pipeline/stage`,
      JOB_STAGES: `${AtsURLGET}/stage/list`,
      TIME_LIMITS: `${AtsURLGET}/job/time_limits`,
      NUMBER_OF_RETAKE: `${AtsURLGET}/job/number_of_retake`,
      LOGS: `${AtsURLGET}/job/log`,
      // Does not exist in API docs
      GET_CANDIDATES: `${AtsURLGET}/job/candidates`,
      // Does not exist in API docs
      FIND_CANDIDATE: `${AtsURLGET}/job/video`,
      ADD_TO_ATS: `${AtsURLWRITE}/candidate/add-ats`,
      DISCUSSION_GET: `${AtsURLGET}/discussion`,
      DISCUSSION_WRITE: `${AtsURLWRITE}/discussion`,
      DISCUSSION_Filter: `${AtsURLGET}/discussion/filter`,
      DISCUSSION_REPLY_GET: `${AtsURLGET}/discussion/reply`,
      DISCUSSION_REPLY_WRITE: `${AtsURLWRITE}/discussion/reply`,
      COMMENTS: `${AtsURLGET}/comments`,
      COMMENTS_REPLY: `${AtsURLWRITE}/comments/reply`,
      SEND_QUESTIONNAIRE: `${AtsURLWRITE}/candidate/send-questionnaire`,
      VIEW_QUESTIONNAIRE: `${AtsURLGET}/job/questionnaire/view`,
      RECENT_UPLOADS: `${AtsURLGET}/job/rms`,
      RMS_JOBS_LIST: `${AtsURLGET}/job/list`,
      CANDIDATE_EVALUATION_GET: `${AtsURLGET}/evaluation`,
      CANDIDATE_EVALUATION_WRITE: `${AtsURLWRITE}/evaluation`,
      GET_PIPELINE: `${AtsIndexerURL}/jobs/candidates`,
      GET_PIPELINE_STAGE: `${AtsIndexerURL}/jobs/stage-candidates`,
      ADD_STAGE: `${AtsURLWRITE}/stage`,
      MOVE_STAGE: `${AtsURLWRITE}/candidate/move-stage`,
      UPDATE_STAGE: `${AtsURLWRITE}/stage`,
      REORDER_STAGE: `${AtsURLWRITE}/stage/reorder`,
      PARSE_JOB_TEMPLATE: `${AtsURLWRITE}/job/parser`,
      PARSE_JOB_OFFER: `${AtsURLWRITE}/job/parser`,
      SEND_VIDEO_ASSESSMENT: `${AtsURLWRITE}/job/assessment/invite`,
      INVITED_VIDEO_ASSESSMENT_LIST: `${AtsURLGET}/job/assessment/invited`,
      ATTACHMENTS_GET: `${BaseUrlGET}/attachments`,
      ATTACHMENTS_WRITE: `${BaseUrlWRITE}/attachments`,
      CANDIDATE_PROFILE: `${CandidateUrl}/candidate/profile`,
      CANDIDATE_RATING_LIST_GET: `${AtsURLGET}/rates`,
      CANDIDATE_RATING_LIST_WRITE: `${AtsURLWRITE}/rates`,
      // Questionnaire Tab Popup Modal
      QUESTIONNAIRE_LIST: `${CandidateQuestionnare}`,
      QUESTIONNAIRE_VIEW: `${CandidateQuestionnare}/details`,
      SHARE_PROFILE: `${AtsURLWRITE}/candidate/share-profile`,
      VIEW_PROFILE: `${AtsURLGET}/view-profile`,
      // Search Database
      CANDIDATE_SEARCH_DATABASE: `${AtsIndexerURL}/candidate/search`,
      FAVOURITE_CANDIDATE: `${AtsURLWRITE}/candidate/favorite`,
      SHARE_CANDIDATE_SEARCH_DATABASE: `${AtsURLWRITE}/candidate/share-database-candidates`,
      GET_SHARED_CANDIDATE_SEARCH: `${AtsURLGET}/candidate-database-profile`,
      COMPARE_PROFILE: `${BaseUrlGET}/candidate/compare`,
      TOGGLE_PUBLISH: `${AtsURLWRITE}/job/togglePublished`,
      TOGGLE_External: `${AtsURLWRITE}/job/toggle/external`,
      APPLICANT_PROFILE: `${indexer.base_GET}/${indexer.prefix}/${process.env.REACT_APP_VERSION_API_V2}/candidate/view`,
      CATEGORY_DROPDOWN: `${AtsURLGET}/category/dropdown`,
      CATEGORY_LIST: `${AtsURLGET}/category/list`,
      CATEGORY_GET: `${AtsURLWRITE}/category`,
      CATEGORY_WRITE: `${AtsURLWRITE}/category`,
      assessment_test: `${ASSESSMENTTESTSGET}`,
      assessment_test_invite: `${ASSESSMENTTESTSINVITE}`,
      assessment_test_category: `${ASSESSMENTCATEGORY}`,
      candidate_response: `${CANDIDATERESPONSE}`,
      candidate_offers: `${OFFERURLWRITE}/candidate/list`,
    },
    rms: {
      RMS_LIST: `${RmsURLGET}/list`,
      RMS_CREATE: `${RmsURLWRITE}/add`,
      BALANCE: `${RmsURLWRITE}/balance`,
      ADD_TO_ATS: `${RmsURLWRITE}/add-ats`,
      SHARE_PROFILE: `${RmsURLWRITE}/share-profile`,
      VIEW_PROFILE: `${RmsURLGET}/view-profile`,
      PARSER: `${RmsURLWRITE}/parser`,
      STATUS: `${RmsURLGET}/status`,
      SEND_OFFER: `${RmsURLWRITE}/send-offer`,
    },
    rmsindexer: {
      RMS: `${RmsIndexerUrlWRITE}`,
      GET_COUNTRIES: `${RmsIndexerUrlGET}/service/country`,
      GENDER: `${RmsIndexerUrlGET}/gender`,
      SKILLS: `${RmsIndexerUrlGET}/skills`,
      NATIONALITY: `${RmsIndexerUrlGET}/service/nationality`,
      COMPANY_EMPLOYEES: `${RmsIndexerUrlGET}/company-employees`,
      INDUSTRY: `${RmsIndexerUrlGET}/industry`,
      LANGUAGES: `${RmsIndexerUrlGET}/languages`,
      LANGUAGES_PROFICIENCY: `${RmsIndexerUrlGET}/service/language_proficiency`,
      KEYWORD: `${RmsIndexerUrlGET}/keyword`,
      CAREER_LEVEL: `${RmsIndexerUrlGET}/service/career`,
      JOB_TYPES: `${RmsIndexerUrlGET}/service/job_type`,
      DEGREE_TYPES: `${RmsIndexerUrlGET}/degree-types`,
      EXPERIENCE: `${RmsIndexerUrlGET}/experience`,
      JOB_MAJORS: `${RmsIndexerUrlGET}/service/job_major`,
      ABOUT_US: `${RmsIndexerUrlGET}/hear-about-us`,
      TIMEZONE: `${RmsIndexerUrlGET}/timezone`,
      DOWNLOAD: `${RmsIndexerUrlGET}/${prefix}/download`,
      MAJOR: `${RmsIndexerUrlGET}/major`,
    },
  },

  /**
   * EVA-BRAND URLs to make use of the career branding page and actions
   */
  evabrand: {
    appearance_GET: `${BrandURLGET}/appearance`,
    appearance_WRITE: `${BrandURLWRITE}/appearance`,
    messaging: `${BrandURLGET}/messaging`,
    social_GET: `${BrandURLGET}/website_and_social`,
    social_WRITE: `${BrandURLWRITE}/website_and_social`,
    information_social: `${BrandURLWRITE}/information/website_and_social`,
    perks_GET: `${BrandURLGET}/perk`,
    perks_WRITE: `${BrandURLWRITE}/perk`,
    information_perks: `${BrandURLWRITE}/information/perk`,
    testimonial_GET: `${BrandURLGET}/testimonial`,
    testimonial_WRITE: `${BrandURLWRITE}/testimonial`,
    information_testimonial: `${BrandURLWRITE}/information/testimonial`,
    employee_GET: `${BrandURLWRITE}/employee`,
    employee_WRITE: `${BrandURLWRITE}/employee`,
    information_employee: `${BrandURLWRITE}/information/employee`,
    marketing_photo_video: `${BrandURLWRITE}/marketing_photo_video`,
    gallery_GET: `${BrandURLGET}/gallery`,
    gallery_WRITE: `${BrandURLWRITE}/gallery`,
    information_gallery: `${BrandURLWRITE}/information/gallery`,
    about_us_GET: `${BrandURLGET}/about_us`,
    about_us_WRITE: `${BrandURLWRITE}/about_us`,
    seo_homepage_GET: `${BrandURLGET}/seo_home_page`,
    seo_homepage_WRITE: `${BrandURLWRITE}/seo_home_page`,
    information_about_us: `${BrandURLWRITE}/information/about_us`,
    client_GET: `${BrandURLGET}/client`,
    client_WRITE: `${BrandURLWRITE}/client`,
    information_client: `${BrandURLWRITE}/information/client`,
    publish: `${BrandURLWRITE}/publish`,
    preview: `${BrandURLGET}/preview`,
    content_layout_order_GET: `${BrandURLGET}/content_layout_order`,
    content_layout_order_WRITE: `${BrandURLWRITE}/content_layout_order`,
  },

  /**
   * EVA-SSESS URLs, everything that has to do with video assessments.
   */
  evassess: {
    template_GET: `${AssessmentURLGET}/template`,
    template_WRITE: `${AssessmentURLWRITE}/template`,
    template_dropdown: `${AssessmentURLGET}/template/dropdown`,
    GET_CATEGORIES: `${AssessmentURLGET}/assessment/categories`,
    time_limits: `${AssessmentURLGET}/assessment/time_limits`,
    number_of_retake: `${AssessmentURLGET}/assessment/number_of_retake`,
    Responsibility: `${UserURL}/responsibility`,
    TEAM_LIST: `${TeamURLGET}/team`,
    MEMBERS: `${AssessmentURLGET}/notes/members`,
    TEAM_SEARCH: `${TeamURLGET}/team/search`,
    SUB_USERS: `${UserURL}/users`,
    ASSESSMENT_GET: `${AssessmentURLGET}/assessment`,
    ASSESSMENT_WRITE: `${AssessmentURLWRITE}/assessment`,
    ASSESSMENT_BY_PIPELINE: `${AssessmentURLGET}/assessment/by-pipeline`,
    ASSESSMENT_LIST: `${AssessmentURLGET}/assessment/list`,
    ASSESSMENT_RATE: `${CandidateURL}/assessment/rate`,
    ARCHIVED: `${AssessmentURLGET}/assessment/archive`,
    ACTIVE: `${AssessmentURLWRITE}/assessment/active`,
    NOTES_GET: `${AssessmentURLGET}/notes`,
    NOTES_WRITE: `${AssessmentURLWRITE}/notes`,
    NOTES_LIST: `${AssessmentURLGET}/notes/list`,
    INVITETEAM: `${AssessmentURLWRITE}/assessment/invite`,
    INVITE_CANDIDATE: `${AssessmentURLWRITE}/assessment/invite/candidate`,
    SHARE_CANDIDATE: `${AssessmentURLWRITE}/candidate/share-candidates`,
    VIEW_SHARED_CANDIDATE_GET: `${AssessmentURLGET}/candidate/list`,
    VIEW_SHARED_CANDIDATE_WRITE: `${AssessmentURLWRITE}/candidate/list`,
    GET_INVITED_CANDIDATES: `${AssessmentURLGET}/assessment/invited`,
    SEND_QUESTIONNAIRE: `${AssessmentURLWRITE}/candidate/send-questionnaire`,
    VIEW_QUESTIONNAIRE: `${AssessmentURLGET}/assessment/questionnaire/view`,
    getCandidates: `${AssessmentURLGET}/assessment/candidates`,
    VIDEOS_LIST: `${AssessmentURLGET}/assessment/videos_list`,
    findCandidate: `${AssessmentURLGET}/assessment/video`,
    getComments_GET: `${AssessmentURLGET}/comments`,
    getComments_WRITE: `${AssessmentURLWRITE}/comments`,
    getDiscussion_GET: `${AssessmentURLGET}/discussion`,
    getDiscussion_WRITE: `${AssessmentURLWRITE}/discussion`,
    DISCUSSION_Filter: `${AssessmentURLGET}/discussion/filter`,
    EXPORT_ALL_ASSESSMENTS: `${AssessmentURLGET}/export/all`,
    DELETE_INVITED_STATUS: `${AssessmentURLWRITE}/candidate/invited/cancel`,
    SUBSCRIPTION: `${AssessmentURLGET}/subscription`,
    getReplies: `${AssessmentURLGET}/comments/reply`,
    getDiscussionReplies_GET: `${AssessmentURLGET}/discussion/reply`,
    getDiscussionReplies_WRITE: `${AssessmentURLWRITE}/discussion/reply`,
    Rating_GET: `${AssessmentURLGET}/rates`,
    Rating_WRITE: `${AssessmentURLWRITE}/rates`,
    RATE_CANDIDATE_GET: `${AssessmentURLGET}/recruiter_rate`,
    RATE_CANDIDATE_WRITE: `${AssessmentURLWRITE}/recruiter_rate`,
    PIPELINE: `${AssessmentURLGET}/assessment/pipeline`,
    PIPELINE_STAGE: `${AssessmentURLGET}/assessment/pipeline/stage`,
    PIPELINE_ADD_STAGE: `${AssessmentURLWRITE}/stage`,
    MOVE_STAGE: `${AssessmentURLWRITE}/candidate/move-stage`,
    STAGE_ORDER: `${AssessmentURLWRITE}/stage/reorder`,
    InvitedMembers: `${AssessmentURLGET}/assessment/invited`,
    InvitedRecruiters: `${AssessmentURLGET}/assessment/recruiter`,
    InviteRecruiters: `${AssessmentURLWRITE}/assessment/recruiter/invite`,
    LOGS: `${AssessmentURLGET}/assessment/recruiter/log`,
    CANDIDATE_SEARCH: `${CompanyURLGET}/candidate/search`,
    CANDIDATE_EVALUATION_GET: `${AssessmentURLGET}/assessment/evaluation`,
    CANDIDATE_EVALUATION_WRITE: `${AssessmentURLWRITE}/assessment/evaluation`,
    GET_VIDEO_ASSESSMENTS: `${AssessmentURLGET}/assessment/list`,
    EXPORTS_ASSESSMENTS_SAP: `${AssessmentURLGET}/assessment/export-sap-packages`,
    GET_WEIGHTS_GET: `${AssessmentURLGET}/assessment/question-weights`,
    GET_WEIGHTS_WRITE: `${AssessmentURLWRITE}/assessment/question-weights`,
    CANDIDATE_SUMMARY_GET: `${AssessmentURLGET}/candidate/invited/summary`,
    CANDIDATE_SUMMARY_WRITE: `${AssessmentURLWRITE}/candidate/invited/summary`,
    EXPORT_CANDIDATES_RATES: `${AssessmentURLGET}/rates/export`,
    CANDIDATES_QUESTIONNAIRES_LIST: `${AssessmentURLGET}/candidate/questionnaire`,
  },
  /**
   * Notifications API
   */
  notification: {
    NOTIFY: `${NotificationGET}/notify`,
    READ: `${NotificationWRITE}/read`,
  },
  /**
   * Analytics APIs End points.
   */
  Analytics: {
    DASHBOARD_GET: `${AnalyticsGET}/dashboard`,
    DASHBOARD_WRITE: `${AnalyticsWRITE}/dashboard`,
    DASHBOARD_DROPDOWN: `${AnalyticsGET}/dashboard/dropdown`,
    REPORT: `${AnalyticsWRITE}/report`,
    TEMPLATES: `${AnalyticsGET}/template`,
    INDEX: `${AnalyticsGET}/dashboard/index`,
  },
};
