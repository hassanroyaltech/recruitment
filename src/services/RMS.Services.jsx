import { HttpServices } from '../helpers';

export const GetAllRmsResumes = async ({
  limit,
  page,
  filters,
  job_uuid,
  company_uuid,
}) => {
  let rms_filters = {};
  filters?.rms_filters?.forEach((item) => {
    if (['company_uuid'].includes(item.key?.slug))
      rms_filters[item.key?.slug] = item.value?.map((item) => item.uuid);
    else rms_filters[item.key?.slug] = item.value;
  });

  return await HttpServices.post(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dynamic-analytics/rms/index`,
    {
      limit,
      page,
      job_uuid,
      // work_year: [],
      ...(filters?.skills?.length && { skills: filters.skills }),
      ...(filters?.job_position?.length && {
        emp_pos_job_title: filters.job_position,
      }),
      ...(filters?.major?.length && {
        edu_major: filters?.major.map((item) => item.uuid),
      }),
      ...(filters?.gender?.uuid && { gender: [filters.gender.uuid] }),
      ...(filters?.job_type?.length && {
        emp_pos_job_type: filters?.job_type.map((item) => item.uuid),
      }),
      ...(filters?.country?.length && {
        country: filters?.country.map((item) => item.uuid),
      }),
      ...(filters?.industry?.length && {
        emp_pos_taxon_name: filters?.industry.map((item) => item.uuid),
      }),
      ...(filters?.nationality?.length && {
        nationality: filters?.nationality.map((item) => item.uuid),
      }),
      ...(filters?.language?.length && {
        language_proficiency: filters?.language.map((item) => item.uuid),
      }),
      ...(filters?.career_level?.length && {
        emp_pos_job_level: filters?.career_level.map((item) => item.uuid),
      }),
      ...rms_filters,
      company_uuid:
        (rms_filters?.company_uuid?.length && rms_filters.company_uuid)
        || company_uuid,
      // ...(filters?.is_include === 'true'
      //   ? { included_text: filters?.query || [] }
      //   : { excluded_text: filters?.query || [] }),
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
};

export const GetAllRmsFiltersDropdown = async ({ slug }) =>
  await HttpServices.get(
    `${process.env.REACT_APP_ANALYTICS_SDB_API}/dropdown/filters`,
    {
      params: {
        slug,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);

export const GetAllRmsDropdownData = async ({ slug }) =>
  await HttpServices.get(`${process.env.REACT_APP_ANALYTICS_SDB_API}/dropdown/rms`, {
    params: {
      slug,
    },
  })
    .then((data) => data)
    .catch((error) => error.response);

export const DynamicRMSServices = async ({
  limit,
  page,
  search,
  status = true,
  has_access,
  use_for = 'dropdown',
  other_than,
  with_than,
  company_uuid,
  end_point,
}) => {
  const queryList = [];
  if (limit || limit === 0) queryList.push(`limit=${limit}`);
  if (page || page === 0) queryList.push(`page=${page}`);
  if (search) queryList.push(`query=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (use_for) queryList.push(`use_for=${use_for}`);
  if (has_access) queryList.push(`has_access=${has_access}`);

  const result = await HttpServices.get(`${end_point}${queryList.join('&')}`, {
    params: { with_than, other_than },
    headers:
      (company_uuid && {
        'Accept-Company': company_uuid,
      })
      || undefined,
  })
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetRMSConfig = async () => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_DOMIN_PHP_API_GET}/api/recruiter/rms/${process.env.REACT_APP_VERSION_API}/config`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
