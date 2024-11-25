const BASEURL = `${process.env.REACT_APP_DOMIN_PHP_API}`;
const VERSION = `${process.env.REACT_APP_VERSION_API}`;
const COMPANYURL = `${BASEURL}/api/recruiter/company/${VERSION}`;

export default {
  profile_builder: `${COMPANYURL}/profile-builder`,
};
