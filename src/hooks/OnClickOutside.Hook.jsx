import { useEffect } from 'react';

/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this custom hook is to get click outside
 */
export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      const el = ref.current;
      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target || null)) return;

      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
    // Reload only if ref or handler changes
  }, [ref, handler]);
};
