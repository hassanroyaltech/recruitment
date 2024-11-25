import * as React from 'react';
import { ButtonBase, Backdrop, CircularProgress } from '@mui/material';
import FormMembersPopover from '../../../popovers/FormMembers.Popover';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import {
  // FormsAssistTypesEnum,
  FormsForTypesEnum,
  FormsMembersTypesEnum,
  // FormsRolesEnum,
} from '../../../../../enums';
import { GetAllSetupsEmployees, GetAllSetupsUsers } from '../../../../../services';
import { showError } from '../../../../../helpers';
import { useTranslation } from 'react-i18next';
import { MemberCard } from '../../../components/member-card/MemberCard';
import i18next from 'i18next';
import { MeetTeamTabs } from './tabs-data/MeetTeam.TabsData';
const parentTranslationPath = 'FormBuilderPage';
const translationPath = '';
const filter = {
  limit: 1,
  page: 1,
  search: '',
  status: 1,
  use_for: 'list',
  all_employee: 1,
};
const MeetTeamField = React.memo(
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
    getIsValueDisplay,
    type,
    pdfRef,
  }) => {
    const [localValues, setLocalValues] = React.useState({
      data: initialValue || [],
      update: 'add',
    });
    const candidateReducer = useSelector((state) => state?.candidateReducer);
    const [membersData, setMembersData] = React.useState([]);
    const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation(parentTranslationPath);
    const [membersPopoverProps, setMembersPopoverProps] = useState({});
    const removeItem = useCallback(
      (index) => {
        const localItems = [...localValues.data];
        localItems.splice(index, 1);
        setLocalValues({ data: localItems, update: 'delete' });
        handleSetValue(localItems);
      },
      [localValues],
    );

    const getAllEmployees = useCallback(
      async (employees, users, allData, allMembersData) => {
        setIsLoading(true);
        const response = await Promise.allSettled([
          GetAllSetupsEmployees({
            ...filter,
            with_than: employees.map((item) => item.uuid),
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
          }),
          GetAllSetupsUsers({
            ...filter,
            with_than: users.map((item) => item.uuid),
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
          }),
        ]);
        if (response) {
          let temp = [];
          response.forEach((resItem) => {
            if (resItem.status === 'fulfilled' && resItem?.value?.status === 200)
              temp = [...temp, ...resItem.value.data.results];
            else showError(t('Shared:failed-to-get-saved-data'), response);
          });
          // setMembersData(temp.filter(item =>allData.some(member=> member.uuid=== item.uuid)))
          setMembersData(
            allData.map(
              (item) =>
                temp[temp.findIndex((obj) => obj.uuid === item.uuid)] || item,
            ),
          );
        } else showError(t('Shared:failed-to-get-saved-data'), response);
        setIsLoading(false);
      },
      [
        candidateReducer?.account?.uuid,
        candidateReducer?.company?.uuid,
        candidateReducer?.token,
        systemUserRecipient,
        t,
        templateData.extraQueries.for,
      ],
    );

    useEffect(() => {
      handleSetValue(localValues.data);
      if (localValues.data.length > 0 && localValues.update === 'add') {
        const users = localValues.data.filter(
          (item) => item.type === FormsMembersTypesEnum.Users.key,
        );
        const employees = localValues.data.filter(
          (item) => item.type === FormsMembersTypesEnum.Employees.key,
        );
        getAllEmployees(employees, users, localValues.data, membersData).catch(
          (err) => console.log(err),
        );
      } else if (localValues.update === 'delete')
        setMembersData((items) =>
          items.filter((item) =>
            localValues.data.some((member) => member.uuid === item.uuid),
          ),
        );
      else setMembersData([]);
    }, [localValues.update, localValues.data, getAllEmployees, handleSetValue]);
    const onPopoverAttachedWithChanged = useCallback((newValue) => {
      setPopoverAttachedWith(newValue);
    }, []);
    const popoverToggleHandler = useCallback(
      (event = null) => {
        onPopoverAttachedWithChanged((event && event.target) || null);
      },
      [onPopoverAttachedWithChanged],
    );

    const membersPopoverToggleHandler = useCallback(
      (membersPopoverPropsItem) => (event) => {
        setMembersPopoverProps(membersPopoverPropsItem);
        popoverToggleHandler(event);
      },
      [popoverToggleHandler],
    );
    const setLocalData = useCallback((items) => {
      setLocalValues(items);
    }, []);

    return (
      <div
        className="meet-team-field-parent"
        style={{
          ...(isLoading
            && initialValue?.length > 0 && {
            minHeight: '50px',
          }),
        }}
      >
        <Backdrop
          className="spinner-wrapper p-absolute"
          open={isLoading}
          sx={{ backgroundColor: '#7272720a' }}
        >
          <CircularProgress color="inherit" size={30} />
        </Backdrop>{' '}
        {!preview.isActive
          && !pdfRef
          && (!disabled
            || (getIsValueDisplay
              && !getIsValueDisplay({ fillBy, type, isFromField: true }))) && (
          <ButtonBase
            disabled={
              disabled
                || preview.isActive
                || isLoading
                || (getIsValueDisplay
                  && getIsValueDisplay({ fillBy, type, isFromField: true }))
            }
            className="btns theme-transparent btns-icon mb-3"
            sx={{
              '& span.fas.fa-plus': {
                fontFamily: "'Font Awesome 5 Free' !important",
              },
            }}
            onClick={membersPopoverToggleHandler({
              arrayKey: 'meetMember',
              values: localValues.data,
              popoverTabs: MeetTeamTabs,
              getListAPIProps: ({ type }) =>
                localValues
                  && localValues.data.length > 0
                  && type !== FormsMembersTypesEnum.Candidates.key && {
                  with_than: localValues.data.map((item) => item.uuid),
                },
              // isDisabled: Boolean(templateData?.formUUID),
            })}
          >
            <span className="fas fa-plus"></span>
          </ButtonBase>
        )}
        <div className="meet-teams-cards-cont">
          {membersData.map((item, index) => (
            <MemberCard
              key={item.uuid}
              removeItem={removeItem}
              index={index}
              preview={preview.isActive}
              role={role}
              isDisabled={disabled}
              email={item.email}
              isLoading={isLoading}
              name={
                item?.first_name
                  ? `${
                    item.first_name
                      && (item.first_name[i18next.language] || item.first_name.en)
                  }${
                    item.last_name
                      && ` ${item.last_name[i18next.language] || item.last_name.en}`
                  }`
                  : item?.name
              }
              positionTitle={
                item?.positionTitle
                  ? `${
                    item.positionTitle?.name
                      && (item.positionTitle.name[i18next.language] || item.name.en)
                  }`
                  : ''
              }
              phone={item?.phoneNumber || ''}
              linkedin={item.linkedin || ''}
              profile_img={item.profilePic?.[0]?.url || ''}
              parentTranslationPath={parentTranslationPath}
              headOfDepartment={item?.isHeadOfDepartment || false}
            />
          ))}
        </div>
        {popoverAttachedWith && (
          <FormMembersPopover
            {...membersPopoverProps}
            popoverAttachedWith={popoverAttachedWith}
            handleClose={() => {
              popoverToggleHandler(null);
              setMembersPopoverProps(null);
            }}
            onSave={(state) => {
              const localState = { ...state };
              setLocalData({ data: localState?.meetMember, update: 'add' });
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
      </div>
    );
  },
);
MeetTeamField.displayName = 'MeetTeamField';
export default MeetTeamField;
