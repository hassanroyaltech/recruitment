import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../Dialog/Dialog.Component';
import { LoadableImageComponant } from '../LoadableImage/LoadableImage.Componant';
import { getDownloadableLink } from '../../helpers';
import { LoadableImageEnum } from '../../enums';

import './Gallery.Style.scss';

export const GalleryComponent = memo(
  ({
    data,
    titleText,
    parentTranslationPath,
    translationPath,
    imageInput,
    defaultImage,
    isOpen,
    onOpenChanged,
    keyRef,
    altInput,
    alt,
    activeImageIndex,
    activeImageTooltipComponent,
  }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const [activeImage, setActiveImage] = useState(null);
    const thumbnailWrapperRef = useRef(null);
    const scrollTimer = useRef(null);
    const [scrollCurrentItem, setScrollCurrentItem] = useState(0);
    // const [navigators, setNavigators] = useState({
    //   previous: false,
    //   next: false,
    // });
    const dataReturn = (dataItem, columnPath) => {
      if (!dataItem) return '';
      if (!columnPath) return (typeof dataItem !== 'object' && dataItem) || '';
      if (!columnPath.includes('.')) return dataItem[columnPath];
      let a = dataItem;
      columnPath.split('.').map((item) => {
        if (a) a = a[item];
        return item;
      });
      return a;
    };
    const activeImageHandler = useCallback(
      (item, index) => () => {
        setScrollCurrentItem(index);
      },
      [],
    );
    const scrollPositionHandler = useCallback(() => {
      const element = thumbnailWrapperRef.current;
      if (
        !(
          element
          && element.firstChild
          && element.firstChild.childNodes.length > scrollCurrentItem
        )
      )
        return;
      const nodeElement = element.firstChild.childNodes[scrollCurrentItem];
      const isVisible
        = (i18next.dir()
          && nodeElement.offsetLeft < element.scrollLeft
          && nodeElement.offsetLeft - nodeElement.offsetWidth
            > element.offsetWidth - element.scrollLeft)
        || (nodeElement.offsetLeft > element.scrollLeft
          && nodeElement.offsetLeft + nodeElement.offsetWidth
            < element.offsetWidth + element.scrollLeft);
      if (!isVisible)
        element.scrollTo({
          left: nodeElement.offsetLeft - 35,
          behavior: 'smooth',
        });
    }, [scrollCurrentItem]);

    const toHandler = (direction) => () => {
      // const element = thumbnailWrapperRef.current;
      // if (!getIsScrollable(direction)) return;
      setScrollCurrentItem((item) => {
        let currentItemLocal = item;
        if (direction === 'next') currentItemLocal += 1;
        else currentItemLocal -= 1;
        return currentItemLocal;
      });
    };
    useEffect(() => {
      scrollPositionHandler();
    }, [scrollPositionHandler, scrollCurrentItem]);
    useEffect(() => {
      setActiveImage(
        (data && data.length > scrollCurrentItem && data[scrollCurrentItem]) || null,
      );
    }, [data, scrollCurrentItem]);

    useEffect(() => {
      setScrollCurrentItem(0);
    }, []);
    useEffect(() => {
      if (data && data.length > activeImageIndex && data[activeImageIndex]) {
        setActiveImage(data[activeImageIndex]);
        setScrollCurrentItem(activeImageIndex);
      }
    }, [activeImageIndex, data]);
    useEffect(
      () => () => {
        if (scrollTimer.current) clearTimeout(scrollTimer.current);
      },
      [],
    );
    return (
      <DialogComponent
        titleText={titleText}
        //   maxWidth='sm'
        dialogContent={
          <div className="gallery-wrapper">
            {activeImage && (
              <div className="gallery-active-wrapper">
                <div className="gallery-active-image-wrapper">
                  <LoadableImageComponant
                    classes="gallery-active-image"
                    alt={
                      dataReturn(activeImage, altInput)
                      || t(`${translationPath}${alt}`)
                    }
                    src={
                      (dataReturn(activeImage, imageInput)
                        && getDownloadableLink(dataReturn(activeImage, imageInput)))
                      || defaultImage
                    }
                  />
                  {activeImageTooltipComponent && (
                    <div className="over-active-image-tooltip-wrapper">
                      {activeImageTooltipComponent(scrollCurrentItem)}
                    </div>
                  )}
                </div>
              </div>
            )}
            {data && data.length > 0 && (
              <div className="w-100 d-flex-center flex-wrap mb-2">
                <ButtonBase
                  className="btns-icon theme-solid mx-2 mb-2"
                  disabled={scrollCurrentItem === 0}
                  onClick={toHandler('previous')}
                >
                  <span className="fas fa-chevron-left" />
                </ButtonBase>
                <ButtonBase
                  className="btns-icon theme-solid mx-2 mb-2"
                  disabled={scrollCurrentItem >= data.length - 1}
                  onClick={toHandler('next')}
                >
                  <span className="fas fa-chevron-right" />
                </ButtonBase>
              </div>
            )}
            {data && data.length > 0 && (
              <div className="gallery-thumbnail-wrapper" ref={thumbnailWrapperRef}>
                <div className="gallery-thumbnail-items-wrapper">
                  {data.map((image, index) => (
                    <ButtonBase
                      onClick={activeImageHandler(image, index)}
                      className={`gallery-thumbnail-item${
                        (activeImage
                          && dataReturn(activeImage, imageInput)
                            === dataReturn(image, imageInput)
                          && ' active-image')
                        || ''
                      }`}
                      key={`${keyRef}${index + 1}`}
                    >
                      <LoadableImageComponant
                        classes="gallery-thumbnail-image"
                        alt={
                          dataReturn(image, altInput)
                          || t(`${translationPath}${alt}`)
                        }
                        src={
                          (dataReturn(image, imageInput)
                            && getDownloadableLink(dataReturn(image, imageInput)))
                          || defaultImage
                        }
                        type={LoadableImageEnum.image.key}
                      />
                    </ButtonBase>
                  ))}
                </div>
              </div>
            )}
          </div>
        }
        isOpen={isOpen}
        saveType="button"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onCloseClicked={onOpenChanged}
        onCancelClicked={onOpenChanged}
      />
    );
  },
);

GalleryComponent.displayName = 'GalleryComponent';

GalleryComponent.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  defaultImage: PropTypes.oneOfType([PropTypes.string]),
  onOpenChanged: PropTypes.func.isRequired,
  activeImageTooltipComponent: PropTypes.func,
  activeImageIndex: PropTypes.number,
  titleText: PropTypes.string,
  altInput: PropTypes.string,
  imageInput: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  keyRef: PropTypes.string,
  isOpen: PropTypes.bool,
  alt: PropTypes.string,
};
GalleryComponent.defaultProps = {
  defaultImage: undefined,
  activeImageIndex: 0,
  titleText: undefined,
  activeImageTooltipComponent: undefined,
  imageInput: null,
  parentTranslationPath: '',
  translationPath: '',
  keyRef: 'imageGalleryRef',
  altInput: null,
  alt: null,
  isOpen: false,
};
