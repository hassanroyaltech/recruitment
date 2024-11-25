import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this custom hook is to get the query params
 */
export const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};
