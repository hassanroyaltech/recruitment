import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toBase64 } from '../../../form-builder/utils/helpers/toBase64';
import { IsBase64, showError } from '../../../../helpers';
export const ImageForPDF = memo(({ alt, url, imgClasses, setIsGlobalLoading }) => {
  const { t } = useTranslation('Shared');
  const stateRef = useRef({
    bgImage: '',
    bgImageOriginal: '',
  });
  const [state, setState] = React.useState(stateRef.current);

  const getBase64 = useCallback(
    async (url, key = 'bgImage') => {
      if (
        IsBase64(stateRef.current[key])
        && url === stateRef.current[`${key}Original`]
      )
        return;
      if (IsBase64(url)) {
        setState((item) => (item[key] === url ? item : { ...item, [key]: url }));
        return;
      }
      if (setIsGlobalLoading)
        setIsGlobalLoading((items) => {
          items.push('getImage');
          return [...items];
        });
      fetch(url)
        .then((response) => response.blob())
        .then(async (myBlob) => {
          const objectURL = await toBase64(myBlob);
          setState((item) => ({
            ...item,
            [key]: objectURL,
            [`${key}Original`]: url,
          }));
          if (setIsGlobalLoading)
            setIsGlobalLoading((items) => {
              items.pop();
              return [...items];
            });
        })
        .catch((error) => {
          if (setIsGlobalLoading)
            setIsGlobalLoading((items) => {
              items.pop();
              return [...items];
            });
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );
  useEffect(() => {
    if (url) getBase64(url);
  }, [url, getBase64]);
  return (
    <img
      alt={alt}
      src={state.bgImage}
      data-form-image={url}
      loading="lazy"
      className={imgClasses}
    />
  );
});
ImageForPDF.displayName = 'ImageForPDF';
ImageForPDF.propTypes = {
  alt: PropTypes.string,
  url: PropTypes.string,
  setIsGlobalLoading: PropTypes.func,
  imgClasses: PropTypes.string,
};
ImageForPDF.defaultProps = {};
