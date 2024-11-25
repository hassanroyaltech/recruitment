const BASEURL = `${process.env.REACT_APP_DOMIN_PHP_API}`;
const VERSION = `${process.env.REACT_APP_VERSION_API}`;
const TEAMURL = `${BASEURL}/api/recruiter/team/${VERSION}`;

export default {
  TEAM: `${TEAMURL}/team`,
};
