import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LoaderComponent, PopoverComponent } from '../../../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import { SharedInputControl } from '../../../../setups/shared';
import PropTypes from 'prop-types';
import { showError } from '../../../../../helpers';

export const SharedApiPopoverComponent = ({
  translationPath,
  parentTranslationPath,
  getDataAPI,
  popoverAttachedWith,
  setPopoverAttachedWith,
  onClose,
  editValue,
  onEditValueChange,
  // isLoading,
  placeholder,
  uniqueKey = 'uuid',
  getOptionLabel,
  extraProps,
  isEntireObject,
  data_key,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [dataList, setDataList] = useState({
    results: [],
    totalCount: 0,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    query: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const getDataAPIHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await getDataAPI({
      ...filters,
      ...extraProps,
      params: { ...filters, ...(extraProps?.params || {}) },
    });
    setIsLoading(false);
    if (response && response.status === 200)
      if (filters.page === 1)
        setDataList({
          results: data_key
            ? response.data.results[data_key] || []
            : response.data.results || [],
          totalCount: response.data.paginate?.total || 0,
        });
      else
        setDataList((items) => ({
          results: items.results.concat(
            data_key
              ? response.data.results[data_key] || []
              : response.data.results || [],
          ),
          totalCount: response.data.paginate.total || 0,
        }));
    else {
      setDataList({ results: [], totalCount: 0 });
      showError(t('Shared:failed-to-get-saved-data'), response);
      setPopoverAttachedWith(null);
      onClose();
    }
  }, [
    setPopoverAttachedWith,
    onClose,
    t,
    extraProps,
    filters,
    getDataAPI,
    data_key,
  ]);

  useEffect(() => {
    getDataAPIHandler();
  }, [filters, getDataAPIHandler]);

  return (
    <PopoverComponent
      idRef="apiPopoverRef"
      attachedWith={popoverAttachedWith}
      handleClose={() => {
        setPopoverAttachedWith(null);
        if (onClose) onClose();
      }}
      popoverClasses=""
      component={
        <div className="min-width-200px max-height-500px">
          <div>
            <SharedInputControl
              isFullWidth
              stateKey="search"
              placeholder="search-dot"
              errorPath="search"
              // isSubmitted={isSubmitted}
              // errors={errors}
              editValue={filters.query}
              // isDisabled={isLoading}
              onValueChanged={() => {}}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              themeClass="theme-transparent"
              textFieldWrapperClasses="w-100 pt-3 px-3"
            />
          </div>
          <div>
            {placeholder && (
              <div className="mt-3 mx-3 fz-12px c-gray">
                {t(`${translationPath}${placeholder}`)}
              </div>
            )}
            <div className="d-flex-column">
              {dataList.results.map((item, idx) => (
                <ButtonBase
                  key={`${idx}-${item[uniqueKey]}`}
                  onClick={() => {
                    onEditValueChange(
                      isEntireObject
                        ? editValue?.[uniqueKey] === item?.[uniqueKey]
                          ? null
                          : item
                        : editValue === item[uniqueKey]
                          ? null
                          : item[uniqueKey],
                    );
                  }}
                  className="popover-item-justify btns theme-transparent m-2"
                >
                  {editValue?.[uniqueKey] === item?.[uniqueKey] ? (
                    <span className="fas fa-check-square c-accent-secondary" />
                  ) : (
                    <span className="far fa-square c-gray-lighter" />
                  )}
                  <span className="mx-2">{getOptionLabel(item)}</span>
                </ButtonBase>
              ))}
              {isLoading && (
                <div className="mx-2 mb-4">
                  <LoaderComponent
                    isLoading={isLoading}
                    isSkeleton
                    skeletonItems={[
                      {
                        variant: 'rectangular',
                        style: { minHeight: 5, marginTop: 5, marginBotton: 5 },
                      },
                    ]}
                    numberOfRepeat={3}
                  />
                </div>
              )}
              {dataList.totalCount > dataList.results.length && (
                <ButtonBase
                  onClick={() =>
                    setFilters((items) => ({ ...items, page: items.page + 1 }))
                  }
                >
                  {t(`${translationPath}load-more`)}
                </ButtonBase>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
};

SharedApiPopoverComponent.propTypes = {
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  getDataAPI: PropTypes.func.isRequired,
  popoverAttachedWith: PropTypes.shape({}),
  setPopoverAttachedWith: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  editValue: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  onEditValueChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  placeholder: PropTypes.string,
  uniqueKey: PropTypes.string,
  getOptionLabel: PropTypes.func.isRequired,
  extraProps: PropTypes.shape({
    params: PropTypes.string,
  }),
  isEntireObject: PropTypes.bool,
  data_key: PropTypes.string,
};
