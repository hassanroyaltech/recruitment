import { HttpServices } from '../helpers';
import { EmployeeStatusesEnum } from '../enums';

const HMGBASEURLGET = `${process.env.REACT_APP_DOMIN_PHP_API_GET}`;
const HMGBASEURLWRITE = `${process.env.REACT_APP_DOMIN_PHP_API}`;
const VERSION = `${process.env.REACT_APP_VERSION_API}`;
const EMPLOYEESURLGET = `${HMGBASEURLGET}/api/employees/${VERSION}`;
const EMPLOYEESURLWRITE = `${HMGBASEURLWRITE}/api/employees/${VERSION}`;

export const GetAllSetupsEmployees = async ({
  limit,
  page,
  search,
  status = EmployeeStatusesEnum.Active.key,
  use_for = 'dropdown',
  other_than,
  type,
  hierarchy_uuid,
  position_uuid,
  with_than,
  company_uuid,
  all_employee = 0,
  custom_header = null,
  forCandidate = false,
  with_than_users,
  verification_status,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (hierarchy_uuid) queryList.push(`hierarchy_uuid=${hierarchy_uuid}`);
  if (position_uuid) queryList.push(`position_uuid=${position_uuid}`);
  if (type) queryList.push(`type=${type}`);
  if (verification_status)
    queryList.push(`verification_status=${verification_status}`);

  const result = await HttpServices.get(
    `${EMPLOYEESURLGET}/employee${forCandidate ? '/recipient' : ''}?${queryList.join(
      '&',
    )}`,
    {
      params: { with_than, other_than, all_employee, with_than_users },
      headers:
        {
          ...(company_uuid && {
            'Accept-Company': company_uuid,
          }),
          ...(custom_header && custom_header),
        } || undefined,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const getSetupsEmployeesById = async ({ uuid }) => {
  const queryList = [];
  if (uuid) queryList.push(`uuid=${uuid}`);

  const result = await HttpServices.get(
    `${EMPLOYEESURLGET}/employee/view?${queryList.join('&')}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetSetupsEmployeesTotal = async (body) => {
  const result = await HttpServices.post(
    `${HMGBASEURLWRITE}/api/${VERSION}/team/total/employee`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateSetupsEmployees = async (body) => {
  const result = await HttpServices.post(`${EMPLOYEESURLWRITE}/employee`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateSetupsEmployees = async (body) => {
  const result = await HttpServices.put(`${EMPLOYEESURLWRITE}/employee`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteSetupsEmployee = async (params) => {
  const result = await HttpServices.delete(`${EMPLOYEESURLWRITE}/employee`, {
    params,
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
