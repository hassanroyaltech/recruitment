import React, { memo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import PropTypes from 'prop-types';

export const QRCodeComponent = memo(
  ({ value, imageSettings, fgColor, bgColor, level, includeMargin, size }) => (
    <QRCodeSVG
      value={value}
      size={size}
      bgColor={bgColor}
      fgColor={fgColor}
      level={level}
      includeMargin={includeMargin}
      imageSettings={imageSettings}
    />
  ),
);
QRCodeComponent.displayName = 'QRCodeComponent';

QRCodeComponent.propTypes = {
  value: PropTypes.string,
  imageSettings: PropTypes.instanceOf(Object),
  includeMargin: PropTypes.bool,
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
  level: PropTypes.string,
  size: PropTypes.string,
};
QRCodeComponent.defaultProps = {
  value: undefined,
  imageSettings: undefined,
  includeMargin: undefined,
  bgColor: '#ffffff',
  fgColor: '#000000',
  level: 'H',
  size: 128,
};
