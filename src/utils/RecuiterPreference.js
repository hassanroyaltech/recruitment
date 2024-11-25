// the URLs are moved to api/urls

const BASEURL_GET = `${process.env.REACT_APP_DOMIN_PHP_API_GET}`;
const BASEURL_WRITE = `${process.env.REACT_APP_DOMIN_PHP_API}`;

const VERSION = `${process.env.REACT_APP_VERSION_API}`;
const PIPELINEURL_GET = `${BASEURL_GET}/api/recruiter/pipelines/${VERSION}`;
const PIPELINEURL_WRITE = `${BASEURL_WRITE}/api/recruiter/pipelines/${VERSION}`;
const EMAILTEMPLATEURL_GET = `${BASEURL_GET}/api/recruiter/mail/${VERSION}`;
const EMAILTEMPLATEURL_WRITE = `${BASEURL_WRITE}/api/recruiter/mail/${VERSION}`;
const TEAMURL_GET = `${BASEURL_GET}/api/recruiter/team/${VERSION}`;
const TEAMURL_WRITE = `${BASEURL_WRITE}/api/recruiter/team/${VERSION}`;
const EVALUATIONURL_GET = `${BASEURL_GET}/api/recruiter/evaluation/${VERSION}`;
const EVALUATIONURL_WRITE = `${BASEURL_WRITE}/api/recruiter/evaluation/${VERSION}`;
const OFFERURL_GET = `${BASEURL_GET}/api/recruiter/offers/${VERSION}`;
const OFFERURL_WRITE = `${BASEURL_WRITE}/api/recruiter/offers/${VERSION}`;
const USERSURL_GET = `${BASEURL_GET}/api/recruiter/${VERSION}`;
const USERSURL_WRITE = `${BASEURL_WRITE}/api/recruiter/${VERSION}`;
// const USERSURL = `${HMGBASEURL}/api/${VERSION}`;
const RECRUITERURL = `${BASEURL_GET}/api/recruiter/${VERSION}`;
// RecuiterPreference
export default {
  pipelines_GET: `${PIPELINEURL_GET}/pipeline`,
  pipelines_WRITE: `${PIPELINEURL_WRITE}/pipeline`,
  STAGES_REORDER: `${PIPELINEURL_WRITE}/stage/reorder`,
  PIPELINES_LIST: `${PIPELINEURL_GET}/pipeline/list`,
  stages_GET: `${PIPELINEURL_GET}/stage`,
  stages_WRITE: `${PIPELINEURL_WRITE}/stage`,
  emailtemplates_GET: `${EMAILTEMPLATEURL_GET}/template`,
  emailtemplates_WRITE: `${EMAILTEMPLATEURL_WRITE}/template`,
  TEMPLATE_BY_SLUG: `${EMAILTEMPLATEURL_GET}/template/slug`,
  SYSTEM_TEMPLATES: `${EMAILTEMPLATEURL_GET}/template/system`,
  TEMPLATES_COLLECTION: `${EMAILTEMPLATEURL_GET}/template/collection`,
  MailTemplateBySlug: `${EMAILTEMPLATEURL_GET}/template`,
  ASSESSMENT_PIPELINE: `${PIPELINEURL_GET}/pipeline/assessment`,
  TEAM_GET: `${TEAMURL_GET}/team`,
  TEAM_WRITE: `${TEAMURL_WRITE}/team`,
  USERSVIEW: `${USERSURL_GET}/user/view`,
  USERS: `${USERSURL_GET}/users`,
  USERSLIST: `${USERSURL_GET}/users/list`,
  UPDATE_PERMISSION: `${USERSURL_WRITE}/users/permissions`,
  TOGGLE_USER_STATUS: `${USERSURL_WRITE}/user/status-toggle`,
  RESPONSIBILITY: `${RECRUITERURL}/responsibility`,
  EVALUATION_GET: `${EVALUATIONURL_GET}/evaluation`,
  EVALUATION_WRITE: `${EVALUATIONURL_WRITE}/evaluation`,
  OFFER_GET: `${OFFERURL_GET}/offer`,
  OFFER_WRITE: `${OFFERURL_WRITE}/offer`,
  OFFER_REFERENCE_NUMBER: `${OFFERURL_GET}/offer/reference-number`,
  OFFERS_COLLECTION: `${OFFERURL_GET}/offer/collection`,
};
