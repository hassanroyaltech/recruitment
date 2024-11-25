import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { MemberCard } from '../../../components/member-card/MemberCard';
import i18next from 'i18next';
import { GetAllSetupsEmployees } from '../../../../../services';
import { showError } from '../../../../../helpers';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FormsForTypesEnum } from '../../../../../enums';
const parentTranslationPath = 'FormBuilderPage';
const filter = {
  limit: 1,
  page: 1,
  search: '',
  status: 1,
  use_for: 'list',
  all_employee: 1,
};
const DirectManager = React.memo(
  ({
    placeholder,
    handleSetValue,
    initialValue,
    disabled,
    isSubmitted,
    id,
    wrapperClasses,
    preview,
    role,
    fillBy,
    templateData,
    systemUserRecipient,
  }) => {
    const [localValue, setLocalValue] = useState([]);
    const { t } = useTranslation(parentTranslationPath);
    const candidateReducer = useSelector((state) => state?.candidateReducer);
    const getAllEmployees = useCallback(async () => {
      if (Array.isArray(initialValue) && initialValue.length) {
        const response = await GetAllSetupsEmployees({
          ...filter,
          with_than: initialValue,
          ...(candidateReducer?.token
            && templateData.extraQueries.for === FormsForTypesEnum.Candidate.key && {
            company_uuid: candidateReducer?.company?.uuid,
            forCandidate: true,
            custom_header: {
              customHeaders: true,
              'recipient-token': candidateReducer?.token,
              'Accept-Account': candidateReducer?.account?.uuid,
              Authorization: null,
            },
          }),
          ...(templateData.extraQueries.for !== FormsForTypesEnum.Candidate.key
            && systemUserRecipient
            && systemUserRecipient.company && {
            company_uuid: systemUserRecipient.company.uuid,
          }),
        });
        if (response && response?.data?.results) {
          const item = response?.data?.results.find(
            (item) => item.uuid === initialValue[0],
          );
          if (item) setLocalValue(item);
        } else showError(t('Shared:failed-to-get-saved-data'), response);
      }
    }, [t]);
    useEffect(() => {
      getAllEmployees();
    }, [getAllEmployees]);
    return (
      <div className="meet-team-field-parent">
        <div className="meet-teams-cards-cont">
          {localValue?.uuid && (
            <MemberCard
              key={localValue.uuid}
              // removeItem={localValue}
              preview={preview.isActive}
              role={role}
              email={localValue.email}
              name={
                `${
                  localValue.first_name
                  && (localValue.first_name[i18next.language]
                    || localValue.first_name.en)
                }${
                  localValue.last_name
                  && ` ${
                    localValue.last_name[i18next.language] || localValue.last_name.en
                  }`
                }` || 'N/A'
              }
              parentTranslationPath={parentTranslationPath}
            />
          )}
        </div>
      </div>
    );
  },
);
DirectManager.displayName = 'DirectManager';
export default DirectManager;
