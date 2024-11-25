import { HttpServices } from '../helpers';

const filterBodyObject = (obj) =>
  Object.entries(obj).reduce((a, currentValue) => {
    if (
      currentValue[0] === 'has_allocation'
      && (currentValue[1] === 'yes' || currentValue[1] === 'no')
    )
      return { ...a, [currentValue[0]]: currentValue[1] === 'yes' };
    else if (
      (Array.isArray(currentValue[1]) && currentValue[1]?.length)
      || (!Array.isArray(currentValue[1]) && currentValue[1])
    )
      return { ...a, [currentValue[0]]: currentValue[1] };
    else return { ...a };
  }, {});

export const GetAllApplicantsForVisaMassAllocation = async ({
  limit = 10,
  page = 0,
  first_name,
  last_name,
  email,
  job_uuid,
  nationality,
  offer_status,
  gender,
  applicant_number,
  source_type,
  source_uuid,
  company_uuid,
  category_uuid,
  position_title_uuid,
  job_title_uuid,
  position_uuid,
  reference_number,
  has_allocation,
  assigned_user_uuid,
}) => {
  const body = filterBodyObject({
    first_name,
    last_name,
    email,
    job_uuid,
    nationality,
    offer_status,
    gender,
    applicant_number,
    source_type,
    source_uuid,
    company_uuid,
    category_uuid,
    position_title_uuid,
    job_title_uuid,
    position_uuid,
    reference_number,
    has_allocation,
    assigned_user_uuid,
  });
  return await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/mass-allocation/applicants`,
    {
      ...body,
      limit,
      page,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
};

export const GetAllMassAllocationVisas = async ({
  limit = 10,
  page = 0,
  block_number,
  occupation,
  gender,
  religion,
  nationality,
  issue_place,
  reserve_for,
  order_by,
  order_type,
}) => {
  const body = filterBodyObject({
    block_number,
    occupation,
    gender,
    religion,
    nationality,
    issue_place,
    reserve_for,
    order_by,
    order_type,
  });
  return await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/mass-allocation/visas`,
    {
      limit,
      page,
      ...body,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
};

export const MassAllocateVisa = async (body) =>
  await HttpServices.post(
    `${process.env.REACT_APP_VISA_API}/mass-allocation/allocate`,
    body,
  )
    .then((data) => data)
    .catch((error) => error.response);
