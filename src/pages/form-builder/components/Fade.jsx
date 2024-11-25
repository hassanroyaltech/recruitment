import React from 'react';
import { useSpring, animated } from 'react-spring';

// eslint-disable-next-line react/display-name
export default React.forwardRef(
  ({ in: open, children, onEnter, onExited, ...other }, ref) => {
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
      onStart: () => {
        if (open && onEnter) onEnter();
      },
      onRest: () => {
        if (!open && onExited) onExited();
      },
    });

    return (
      <animated.div ref={ref} style={style} {...other}>
        {children}
      </animated.div>
    );
  },
);
