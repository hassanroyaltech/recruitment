export const MutateVonqErrorsHelper = (res) => {
  if (
    res.data?.results?.errors?.length > 0
    && res.data?.results?.error_from_vendor
    && res.data?.results?.from === 'channel_posting'
  ) {
    const localErrors = {};
    res.data.results.errors.forEach((item, index) => {
      localErrors[`${index}`] = item;
    });
    return { errors: localErrors };
  }
  return null;
};
