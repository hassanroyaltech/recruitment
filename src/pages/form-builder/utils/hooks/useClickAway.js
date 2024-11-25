import { useCallback, useEffect } from 'react';

export default function useClickAway(ref, onClickAway) {
  const handleClickOutside = useCallback(
    (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClickAway();
    },
    [ref, onClickAway],
  );
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
}
