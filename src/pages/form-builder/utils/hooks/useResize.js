import { useState, useLayoutEffect } from 'react';

const cursor = {
  both: 'nwse-resize',
  vertical: 'ns-resize',
  horizontal: 'ew-resize',
};

export default function useResize(ref, options) {
  const elRef = ref || {};
  const { step = 1, axis = 'both' } = options || {};
  const [coords, setCoords] = useState({ x: Infinity, y: Infinity });
  const [dims, setDims] = useState({ width: Infinity, height: Infinity });
  const [size, setSize] = useState({ width: Infinity, height: Infinity });

  const initResize = (event) => {
    if (!elRef.current) return;
    setCoords({ x: event.clientX, y: event.clientY });
    const { width, height } = window.getComputedStyle(elRef.current);
    setDims({ width: parseInt(width, 10), height: parseInt(height, 10) });
  };

  useLayoutEffect(() => {
    // Round the size based to `props.step`.
    const getValue = (input) => Math.ceil(input / step) * step;

    const doDrag = (event) => {
      if (!elRef.current) return;

      // Calculate the box size.
      const width = getValue(dims.width + event.clientX - coords.x);
      const height = getValue(dims.height + event.clientY - coords.y);

      // Set the box asize.
      if (axis === 'both') {
        elRef.current.style.width = `${width}px`;
        elRef.current.style.height = `${height}px`;
      }
      if (axis === 'horizontal') elRef.current.style.width = `${width}px`;
      if (axis === 'vertical') elRef.current.style.height = `${height}px`;
      setSize({ width, height });
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag, false);
      document.removeEventListener('mouseup', stopDrag, false);
    };

    document.addEventListener('mousemove', doDrag, false);
    document.addEventListener('mouseup', stopDrag, false);

    return () => {
      document.removeEventListener('mousemove', doDrag, false);
      document.removeEventListener('mouseup', stopDrag, false);
    };
  }, [dims, coords, step, elRef, axis]);

  return { initResize, size, cursor: cursor[axis] };
}
