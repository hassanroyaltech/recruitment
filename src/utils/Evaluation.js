const BASEURL = `${process.env.REACT_APP_DOMIN_PHP_API}`;
const VERSION = `${process.env.REACT_APP_VERSION_API}`;
const EVALUATIONURL = `${BASEURL}/api/recruiter/evaluation/${VERSION}`;

export default {
  EVALUATION: `${EVALUATIONURL}/evaluation`,
};
