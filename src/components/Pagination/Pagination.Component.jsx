import React, { memo, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SelectComponent } from '../Select/Select.Component';
import { Inputs } from '../Inputs/Inputs.Component';
import { PaginationEnum } from '../../enums/Shared/Pagination.Enum';
import './Pagination.Style.scss';

export const PaginationComponent = memo(
  ({
    pageIndex,
    totalCount,
    pageSize,
    onPageIndexChanged,
    onPageSizeChanged,
    isButtonsNavigation,
    isRemoveTexts,
    isReversedSections,
    idRef,
    parentTranslationPath,
    translationPath,
    perPageText,
    pagesText,
    ofText,
    numberOfItemsBefore,
    numberOfItemsAfter,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [pageNumber, setPageNumber] = useState(pageIndex + 1);

    const totalNumberOfPages = useMemo(
      () => () => Math.ceil(totalCount / pageSize),
      [pageSize, totalCount],
    );
    const conditionBeforeAndAfter = useMemo(
      () => (index) =>
        index
          >= pageIndex
            - (numberOfItemsBefore
              - (pageIndex + numberOfItemsAfter >= totalNumberOfPages()
                ? totalNumberOfPages() - 1 - pageIndex - numberOfItemsAfter
                : 0))
        && index
          <= pageIndex
            + numberOfItemsAfter
            + (pageIndex < numberOfItemsBefore ? numberOfItemsBefore - pageIndex : 0),
      [numberOfItemsAfter, numberOfItemsBefore, pageIndex, totalNumberOfPages],
    );

    const pageChangeHandler = (keyValue) => () => {
      let value = pageIndex;
      if (keyValue === 'leftLast') value = 0;
      else if (keyValue === 'left') value -= 1;
      else if (keyValue === 'right') value += 1;
      else if (keyValue === 'rightLast') value = totalNumberOfPages() - 1;
      setPageNumber(value + 1);
      if (onPageIndexChanged && value !== pageIndex) onPageIndexChanged(value);
    };
    const onPageNumberChange = useMemo(
      () => (newValue) => {
        let localValue = newValue;
        if (+localValue * pageSize >= totalCount) localValue = totalNumberOfPages();
        setPageNumber(+localValue);
        if (Number.isNaN(+localValue) || +localValue < 1) return;
        if (onPageIndexChanged && localValue !== pageIndex + 1)
          onPageIndexChanged(+localValue - 1);
      },
      [onPageIndexChanged, pageIndex, pageSize, totalCount, totalNumberOfPages],
    );

    useEffect(() => {
      setPageNumber(pageIndex + 1);
    }, [pageIndex]);

    return (
      <div
        className={`pagination-component-wrapper${
          (isReversedSections && ' is-reversed-section') || ''
        }`}
      >
        <div className="pagination-section">
          {!isRemoveTexts && (
            <span className="fz-14px fw-medium pages-text">
              {t(`${translationPath}${pagesText}`)}:
            </span>
          )}
          {pageIndex > 1 && (
            <ButtonBase
              className="btns mb-1 theme-transparent c-black-light"
              disabled={pageIndex === 0}
              onClick={pageChangeHandler('leftLast')}
            >
              <span className="fas fa-angle-double-left" />
              <span className="px-1">{t(`${translationPath}first-page`)}</span>
            </ButtonBase>
          )}
          {pageIndex > 0 && (
            <ButtonBase
              className="btns mb-1 theme-transparent c-black-light"
              // disabled={pageIndex === 0}
              onClick={pageChangeHandler('left')}
            >
              <span className="fas fa-chevron-left" />
              <span className="px-1">{t(`${translationPath}previous-page`)}</span>
            </ButtonBase>
          )}
          {!isButtonsNavigation && (
            <Inputs
              idRef={`${idRef}input`}
              value={pageNumber}
              type="number"
              wrapperClasses="pagination-input"
              themeClass="theme-solid"
              onInputChanged={(event) => {
                const { value } = event.target;
                onPageNumberChange(value);
              }}
              min={1}
            />
          )}
          {isButtonsNavigation
            && Array.from(
              {
                length: totalNumberOfPages(),
              },
              (data, index) =>
                conditionBeforeAndAfter(index) && (
                  <ButtonBase
                    key={`paginationButtonsKey${idRef}${index + 1}`}
                    className={`btns-icon mb-1 mx-1 ${
                      (pageNumber === index + 1 && 'theme-solid bg-primary')
                      || 'theme-transparent'
                    }`}
                    onClick={() => onPageNumberChange(index + 1)}
                  >
                    <span>{index + 1}</span>
                  </ButtonBase>
                ),
            )}
          {pageNumber * pageSize < totalCount && (
            <ButtonBase
              className="btns mb-1 theme-transparent c-black-light"
              // disabled={pageNumber * pageSize >= totalCount}
              onClick={pageChangeHandler('right')}
            >
              <span>{t(`${translationPath}next-page`)}</span>
              <span className="fas fa-chevron-right px-1" />
            </ButtonBase>
          )}
          {pageNumber * pageSize < totalCount && totalNumberOfPages() > 2 && (
            <ButtonBase
              className="btns mb-1 theme-transparent c-black-light"
              // disabled={pageNumber * pageSize >= totalCount}
              onClick={pageChangeHandler('rightLast')}
            >
              <span>{t(`${translationPath}last-page`)}</span>
              <span className="fas fa-angle-double-right px-1" />
            </ButtonBase>
          )}
        </div>
        <div className="pagination-section">
          {!isRemoveTexts && (
            <span className="fz-14px fw-medium per-page-text">
              {t(`${translationPath}${perPageText}`)}
            </span>
          )}
          {onPageSizeChanged && (
            <SelectComponent
              idRef={`${idRef}select`}
              data={Object.values(PaginationEnum)}
              value={pageSize}
              wrapperClasses="mx-1"
              // themeClass="theme-solid"
              onSelectChanged={onPageSizeChanged}
              valueInput="key"
              textInput="value"
              //   translationPath={translationPath}
              //   translationPathForData={translationPath}
            />
          )}
          <span className="details-wrapper">
            <span className="px-1">
              {pageSize * pageIndex + 1 >= totalCount
                ? totalCount
                : pageSize * pageIndex + 1}
            </span>
            <span className="fas fa-minus" />
            <span className="px-1">
              {pageSize * pageNumber >= totalCount
                ? totalCount
                : pageSize * pageNumber}
            </span>
            <span>{t(`${translationPath}${ofText}`)}</span>
            <span className="px-1">{totalCount}</span>
          </span>
        </div>
      </div>
    );
  },
);

PaginationComponent.displayName = 'PaginationComponent';

PaginationComponent.propTypes = {
  pageIndex: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  onPageSizeChanged: PropTypes.func,
  pageSize: PropTypes.oneOf(Object.keys(PaginationEnum).map((item) => +item)),
  idRef: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  perPageText: PropTypes.string,
  ofText: PropTypes.string,
  pagesText: PropTypes.string,
  isButtonsNavigation: PropTypes.bool,
  isReversedSections: PropTypes.bool,
  isRemoveTexts: PropTypes.bool,
  numberOfItemsBefore: PropTypes.number,
  numberOfItemsAfter: PropTypes.number,
};
PaginationComponent.defaultProps = {
  idRef: 'paginationRef',
  parentTranslationPath: 'Shared',
  translationPath: 'pagination.',
  perPageText: 'item-per-page',
  pageSize: PaginationEnum[10].key,
  ofText: 'of',
  pagesText: 'pages',
  isButtonsNavigation: false,
  isReversedSections: false,
  isRemoveTexts: false,
  numberOfItemsBefore: 2,
  numberOfItemsAfter: 2,
};
