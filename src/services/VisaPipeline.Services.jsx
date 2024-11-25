import { HttpServices } from '../helpers';

export const GetAllVisaPipelineStages = async ({
  limit,
  page,
  search,
  start_date,
  end_date,
  order_type,
  order_by,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/pipeline/visas`,
    {
      params: {
        limit,
        page,
        query: search,
        start_date,
        end_date,
        order_type,
        order_by,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllVisaStageCandidates = async ({
  limit,
  page,
  stage_uuid,
  search,
  start_date,
  end_date,
  order_type,
  order_by,
}) => {
  const result = await HttpServices.get(
    `${process.env.REACT_APP_VISA_API}/pipeline/visas/stage`,
    {
      params: {
        limit,
        page,
        stage_uuid,
        query: search,
        start_date,
        end_date,
        order_type,
        order_by,
      },
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const VisaCandidateMoveTo = async ({
  candidate_visa_uuid,
  stage_uuid,
  border_number,
}) => {
  const result = await HttpServices.put(
    `${process.env.REACT_APP_VISA_API}/move-visa`,
    {
      candidate_visa_uuid,
      stage_uuid,
      border_number,
    },
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
