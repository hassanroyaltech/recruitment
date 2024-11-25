import { useEffect } from 'react';

/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this custom hook is to change the page title on init
 */
export const useTitle = (title) => {
  useEffect(() => {
    document.title = title;
  });
};
