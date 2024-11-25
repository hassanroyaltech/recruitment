/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { GetAnalyticsDetailedView } from '../../../services';
import { DialogComponent } from '../../../components';
import { showError } from '../../../helpers';
import TablesComponent from '../../../components/Tables/Tables.Component';

export const DetailedViewDialog = ({
  isOpen,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
  titleText,
  filters,
  tableColumns,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState({
    ...filters,
    limit: 10,
    page: 1,
    search: '',
  });
  const [responseData, setResponseData] = useState({
    results: [],
    totalCount: 0,
  });
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  const getAnalyticsDetailedView = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAnalyticsDetailedView(filter);
    setIsLoading(false);
    if (response && response.status === 200)
      setResponseData({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setResponseData({ results: [], totalCount: 0 });
    }
  }, [filter, t]);

  useEffect(() => {
    getAnalyticsDetailedView();
  }, [getAnalyticsDetailedView]);

  return (
    <>
      <DialogComponent
        titleText={titleText}
        dialogContent={
          <div>
            <TablesComponent
              data={responseData.results}
              isLoading={isLoading}
              headerData={tableColumns}
              pageIndex={filter.page - 1}
              pageSize={filter.limit}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              totalItems={responseData.totalCount}
              isDynamicDate
              uniqueKeyInput="uuid"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isWithoutBoxWrapper
              themeClasses="theme-transparent"
            />
          </div>
        }
        isOpen={isOpen}
        onCancelClicked={isOpenChanged}
        onCloseClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        saveType="Edit"
      />
    </>
  );
};

DetailedViewDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  titleText: PropTypes.string,
  filters: PropTypes.instanceOf(Object),
  tableColumns: PropTypes.instanceOf(Array),
};

DetailedViewDialog.defaultProps = {
  isOpenChanged: undefined,
};
