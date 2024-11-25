import { DialogComponent } from '../../../components';
import { SharedAPIAutocompleteControl } from '../../setups/shared';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  GenerateReport,
  GetAllSetupsEmployees,
  GetAllSetupsUsers,
} from '../../../services';
import { DynamicFormTypesEnum } from '../../../enums';
import i18next from 'i18next';
import { showError, showSuccess } from '../../../helpers';
import { useSelector } from 'react-redux';
import useVitally from '../../../hooks/useVitally.Hook';

export const ExportDialog = ({
  isOpen,
  setIsOpen,
  isLoading,
  setFilters,
  filters,
  parentTranslationPath,
  defaultProjections,
  FeaturesListObject,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [reportUsers, setReportUsers] = useState([]);
  const [reportEmployees, setReportEmployees] = useState([]);

  const userReducer = useSelector((state) => state?.userReducer);
  const { VitallyTrack } = useVitally();
  const GenerateReportHandler = useCallback(async () => {
    // setIsLoading(true);
    let filtersObj = {};
    filters.filterItems.forEach((it) => {
      filtersObj = {
        ...filtersObj,
        [it.slug]: it.value,
      };
    });

    let formattedContentFilter = {};
    filters.contentFilter.forEach((item) => {
      formattedContentFilter = {
        ...formattedContentFilter,
        [item.slug]: {
          type: item.type,
          operation: item.operation,
          value: item.value,
        },
      };
    });

    const response = await GenerateReport({
      reportType: FeaturesListObject[filters.feature].path,
      uuids: [...reportUsers, ...reportEmployees, userReducer?.results?.user?.uuid],
      filters: {
        ...filters,
        summarize: filters.summarize.length > 0 ? filters.summarize : null,
        ...(filters.sort && {
          sort: filters.sort,
        }),
        projection: filters.projection?.length
          ? filters.projection
          : defaultProjections.map((item) => item.slug),
        ...filtersObj,
        from_date: filters.from_date || null,
        to_date: filters.to_date || null,
        content:
          Object.keys(formattedContentFilter).length > 0
            ? formattedContentFilter
            : null,
        ...(filters.pipeline_division && {
          dividend_stage_uuid: filters.pipeline_division.dividend_stage_uuid,
          divisor_stage_uuid: filters.pipeline_division.divisor_stage_uuid,
        }),
        ...(filters.pipeline_origin_uuid && {
          pipeline_origin_uuid: filters.pipeline_origin_uuid,
        }),
        ...(filters.pipeline_company_uuid && {
          pipeline_company_uuid: filters.pipeline_company_uuid,
        }),
      },
    });
    // setIsLoading(false);
    if (response && response.status === 200) {
      VitallyTrack('Analytics - Export Reports');
      window?.ChurnZero?.push([
        'trackEvent',
        `Analytics - Export Reports`,
        `Export Reports`,
        1,
        {},
      ]);
      showSuccess('report generated successfully');
      setFilters((items) => ({ ...items }));
      setReportUsers([]);
      setReportEmployees([]);
      setIsOpen(false);
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [
    filters,
    setFilters,
    reportUsers,
    t,
    userReducer,
    setIsOpen,
    defaultProjections,
    FeaturesListObject,
    reportEmployees,
  ]);

  return (
    <DialogComponent
      titleText="export"
      maxWidth="sm"
      dialogContent={
        <div>
          <SharedAPIAutocompleteControl
            isFullWidth
            title="users"
            placeholder="select-users"
            stateKey="source"
            onValueChanged={(newValue) => setReportUsers(newValue.value)}
            getOptionLabel={(option) =>
              `${
                option.first_name
                && (option.first_name[i18next.language] || option.first_name.en)
              }${
                option.last_name
                && ` ${option.last_name[i18next.language] || option.last_name.en}`
              }` || 'N/A'
            }
            getDataAPI={GetAllSetupsUsers}
            parentTranslationPath={parentTranslationPath}
            searchKey="search"
            editValue={reportUsers}
            // extraProps={{
            //   committeeType: 'all',
            // }}
            type={DynamicFormTypesEnum.array.key}
          />
          <SharedAPIAutocompleteControl
            isFullWidth
            title="employees"
            placeholder="select-employees"
            stateKey="employees"
            onValueChanged={(newValue) => setReportEmployees(newValue.value)}
            getOptionLabel={(option) =>
              `${
                option.first_name
                && (option.first_name[i18next.language] || option.first_name.en)
              }${
                option.last_name
                && ` ${option.last_name[i18next.language] || option.last_name.en}`
              }` || 'N/A'
            }
            getDataAPI={GetAllSetupsEmployees}
            parentTranslationPath={parentTranslationPath}
            searchKey="search"
            editValue={reportEmployees}
            extraProps={{
              all_employee: 1,
            }}
            type={DynamicFormTypesEnum.array.key}
            uniqueKey="user_uuid"
          />
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      isOldTheme
      onSubmit={(e) => {
        e.preventDefault();
        GenerateReportHandler();
      }}
      onCloseClicked={() => setIsOpen(false)}
      onCancelClicked={() => setIsOpen(false)}
      parentTranslationPath={parentTranslationPath}
    />
  );
};

ExportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setFilters: PropTypes.func,
  filters: PropTypes.shape({
    feature: PropTypes.string,
    projection: PropTypes.array,
    summarize: PropTypes.array,
    sort: PropTypes.oneOf(['ASC', 'DESC']),
    from_date: PropTypes.string,
    to_date: PropTypes.string,
    filterItems: PropTypes.array,
    contentFilter: PropTypes.array,
    pipeline_division: PropTypes.shape({
      dividend_stage_uuid: PropTypes.string,
      divisor_stage_uuid: PropTypes.string,
    }),
    pipeline_origin_uuid: PropTypes.string,
    pipeline_company_uuid: PropTypes.string,
  }),
  parentTranslationPath: PropTypes.string.isRequired,
  defaultProjections: PropTypes.array.isRequired,
  FeaturesListObject: PropTypes.shape({}),
};
