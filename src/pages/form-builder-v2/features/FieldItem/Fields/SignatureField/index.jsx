import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, SvgIcon, CardMedia } from '@mui/material';
import Popover from '../../../../components/Popover';
import SignatureMenu from './SignatureMenu';
import { toBase64 } from '../../../../../form-builder/utils/helpers/toBase64';

const SignatureField = memo(
  ({
    handleSetValue,
    initialValue,
    signatureMethod,
    isDrawAllowed,
    isWriteAllowed,
    isUploadAllowed,
    disabled,
    isRequired,
    isSubmitted,
  }) => {
    // TODO figure out disabled and encryption
    const handleSignature = useCallback(
      async (file, method) => {
        if (file instanceof File) {
          const base64File = await toBase64(file);
          handleSetValue(base64File, undefined, undefined, {
            signatureMethod: method,
          });
        } else
          handleSetValue(file, undefined, undefined, { signatureMethod: method });
      },
      [handleSetValue],
    );

    return (
      <Popover
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        className="signature-popover-wrapper"
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        title=""
      >
        <Box
          sx={{
            mt: 4,
            maxHeight: signatureMethod === 'write' ? 'unset' : 170,
            minHeight: signatureMethod === 'write' ? 'unset' : 150,
            maxWidth: 270,
            minWidth: 270,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: disabled ? 'none' : '',
            cursor: disabled ? 'not-allowed' : 'pointer',
            borderRadius: 1.5,
            outline: (theme) => `1px solid ${theme.palette.dark.$a8}`,
            '&:hover': {
              outline: (theme) => `2px solid ${theme.palette.secondary.$80}`,
            },
          }}
          className={`signature-display-box${
            (!disabled
              && isSubmitted
              && isRequired
              && !initialValue
              && ' is-required')
            || ''
          }
            `}
          onClick={handleSignature}
        >
          {!initialValue ? (
            <SvgIcon sx={{ fontSize: 84 }} inheritViewBox>
              <svg
                width="82"
                height="74"
                viewBox="0 0 82 74"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.47443 36.9999C7.91572 -2.87086 10.8436 -2.87086 10.258 36.9999C9.76489 64.2799 12.6928 64.2799 19.0416 36.9999C25.4829 9.71991 28.4107 9.71991 27.8252 36.9999C27.0267 84.1199 29.9545 84.1199 36.6087 36.9999C43.05 -10.1201 45.9779 -10.1201 45.3923 36.9999C44.9537 60.4645 47.8816 60.4645 54.1759 36.9999C60.6172 13.5353 63.5451 13.5353 62.9595 36.9999C62.343 62.9445 65.2708 62.9445 71.7431 36.9999C78.1844 11.0553 81.1122 11.0553 80.5267 36.9999"
                  stroke="#242533"
                  strokeOpacity="0.2"
                  strokeWidth="1.5"
                />
              </svg>
            </SvgIcon>
          ) : signatureMethod === 'write' ? (
            <Box
              sx={{
                // height: 340,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 762,
                my: 5.5,
                fontSize: 25,
                fontWeight: 900,
              }}
            >
              {initialValue}
            </Box>
          ) : (
            <CardMedia
              sx={{ width: 284, height: 124 }}
              component="img"
              src={initialValue}
            />
          )}
        </Box>
        <SignatureMenu
          isDrawAllowed={isDrawAllowed}
          isWriteAllowed={isWriteAllowed}
          isUploadAllowed={isUploadAllowed}
          signature={initialValue}
          signatureMethod={signatureMethod}
          handleSignature={handleSignature}
        />
      </Popover>
    );
  },
);

SignatureField.displayName = 'SignatureField';

export default SignatureField;

SignatureField.propTypes = {
  handleSetValue: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
  signatureMethod: PropTypes.oneOf(['', 'write', 'file', 'drawing']),
  isDrawAllowed: PropTypes.bool,
  isWriteAllowed: PropTypes.bool,
  isUploadAllowed: PropTypes.bool,
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isSubmitted: PropTypes.bool,
};
SignatureField.defaultProps = {
  signatureMethod: '',
  isDrawAllowed: undefined,
  isWriteAllowed: undefined,
  isUploadAllowed: undefined,
  disabled: false,
  isRequired: false,
  isSubmitted: false,
};
