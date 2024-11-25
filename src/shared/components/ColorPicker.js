import React, { useState } from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';

const ColorPicker = ({ color, onChange, label }) => {
  const styles = reactCSS({
    default: {
      color: {
        width: '50px',
        height: '50px',
        borderRadius: '999px',
        background: `${color}`,
      },
      swatch: {
        borderRadius: '1px',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <React.Fragment>
      <div
        role="button"
        tabIndex={0}
        onKeyUp={() => {}}
        className="color-picker__container"
        onClick={handleClick}
      >
        <div className="mr-2" style={styles.swatch}>
          <div style={styles.color} />
        </div>
        <div className="d-flex flex-column">
          {label && <span className="mb-0">{label}</span>}
          <span>{color}</span>
        </div>
      </div>
      {isOpen && (
        <div style={styles.popover}>
          <div
            role="button"
            tabIndex={0}
            onKeyUp={() => {}}
            style={styles.cover}
            onClick={handleClose}
          />
          <SketchPicker color={color} onChange={onChange} />
        </div>
      )}
    </React.Fragment>
  );
};

export default ColorPicker;
