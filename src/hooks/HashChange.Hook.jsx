import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this custom hook is to execute a method on route change
 */
export const useHashChange = (hashChangeHandler) => {
  const history = useHistory();
  useEffect(() => {
    history.listen(() => {
      hashChangeHandler();
    });
  }, [hashChangeHandler, history]);
};
