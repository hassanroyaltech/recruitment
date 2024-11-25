import React, { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
// noinspection ES6PreferShortImport
import { LoadableImageEnum } from '../../enums/Shared/LoadableImage.Enum';
import './LoadableImage.Style.scss';
import { TooltipsComponent } from '../Tooltips/Tooltips.Component';
import { ConvertSVGToBase64 } from '../../helpers';
import { renderToStaticMarkup } from 'react-dom/server';

export const LoadableImageComponant = memo(
  ({
    src,
    alt,
    type,
    defaultImage,
    variant,
    classes,
    withOverlay,
    overlayText,
    overlayImage,
    onFinishLoading,
    style,
    tooltipTitle,
    skeltonClasses,
  }) => {
    const [state, setState] = useState(false);
    const [localSrc, setLocalSrc] = useState(null);
    const [localImageSrc, setLocalImageSrc] = useState(src);
    const mounted = useRef(true);
    useEffect(() => {
      if (type === LoadableImageEnum.div.key) {
        const bgImg = new Image();
        bgImg.src = src;
        bgImg.onload = () => {
          if (mounted.current) {
            setState(true);
            setLocalSrc(bgImg.src);
            if (onFinishLoading) onFinishLoading();
          }
        };
        bgImg.onerror = () => {
          console.log('Error loading');
          if (mounted.current && defaultImage) {
            setState(true);
            if (defaultImage && typeof defaultImage === 'object') {
              const divElement = document.createElement('div');
              divElement.innerHTML = renderToStaticMarkup(defaultImage);
              setLocalSrc(ConvertSVGToBase64(divElement.firstChild));
            } else setLocalSrc(defaultImage);
            if (onFinishLoading) onFinishLoading();
          }
        };
      }
    }, [src, mounted, onFinishLoading, type, defaultImage]);

    useEffect(() => {
      if (type === LoadableImageEnum.image.key)
        if (src) setLocalImageSrc((item) => (item !== src ? src : item));
        else if (defaultImage)
          if (defaultImage && typeof defaultImage === 'object') {
            const divElement = document.createElement('div');
            divElement.innerHTML = renderToStaticMarkup(defaultImage);
            setLocalImageSrc(ConvertSVGToBase64(divElement.firstChild));
          } else setLocalImageSrc(defaultImage);
        else setLocalImageSrc(null);
    }, [defaultImage, src, type]);

    useEffect(
      () => () => {
        mounted.current = false;
      },
      [],
    );
    return (
      <>
        {type === LoadableImageEnum.image.key && (
          <TooltipsComponent
            contentComponent={
              <img
                src={localImageSrc}
                alt={alt}
                className={`loadable-image-wrapper ${classes} ${
                  state ? ' show' : ' hidden'
                }`}
                onLoad={() => {
                  setState(true);
                  if (onFinishLoading) onFinishLoading();
                }}
                onError={() => {
                  setState(true);
                }}
              />
            }
            title={tooltipTitle}
          />
        )}
        {type === LoadableImageEnum.div.key && state && (
          <TooltipsComponent
            contentComponent={
              <div
                className={`loadable-image-div-wrapper ${classes}`}
                aria-label={alt}
                role="img"
                style={{
                  ...(style || {}),
                  backgroundImage: `url(${localSrc})`,
                }}
              />
            }
            title={tooltipTitle}
          />
        )}
        {!state && src && (
          <div className={`loadable-skelton-wrapper ${skeltonClasses || ''}`}>
            <Skeleton variant={variant} style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        {withOverlay && (
          <div className="loadable-overlay">
            {overlayText && <span>{overlayText}</span>}
            {overlayImage && <span className={overlayImage} />}
          </div>
        )}
      </>
    );
  },
);

LoadableImageComponant.displayName = 'LoadableImageComponent';

LoadableImageComponant.propTypes = {
  src: PropTypes.string,
  defaultImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  alt: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(LoadableImageEnum).map((item) => item.key)),
  classes: PropTypes.string,
  onFinishLoading: PropTypes.func,
  withOverlay: PropTypes.bool,
  tooltipTitle: PropTypes.string,
  overlayText: PropTypes.string,
  variant: PropTypes.string,
  skeltonClasses: PropTypes.string,
  overlayImage: PropTypes.string,
  style: PropTypes.instanceOf(Object),
};
LoadableImageComponant.defaultProps = {
  src: undefined,
  type: LoadableImageEnum.div.key,
  defaultImage: undefined,
  tooltipTitle: undefined,
  withOverlay: false,
  overlayText: undefined,
  overlayImage: undefined,
  onFinishLoading: undefined,
  variant: undefined,
  skeltonClasses: undefined,
  style: undefined,
  classes: undefined,
};
