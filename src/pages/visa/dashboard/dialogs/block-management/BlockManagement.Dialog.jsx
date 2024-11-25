/* eslint-disable no-param-reassign */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent, SwitchComponent } from '../../../../../components';
import {
  ConfirmDeleteDialog,
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../../setups/shared';
import {
  getErrorByName,
  GlobalDateFormat,
  GlobalHijriDateFormat,
  showError,
  showSuccess,
} from '../../../../../helpers';
import * as yup from 'yup';
import {
  CreateVisaBlock,
  DeleteVisaTypes,
  GetAllVisaBlockIssuePlaces,
  GetAllVisaSponsors,
  GetAllVisaTypes,
  GetVisaBlockById,
  GetVisaBlockIssuePlaceById,
  GetVisaSponsorById,
  UpdateVisaBlock,
} from '../../../../../services';
import './BlockManagement.Style.scss';
import { SystemActionsEnum } from '../../../../../enums';
import i18next from 'i18next';
import TablesComponent from '../../../../../components/Tables/Tables.Component';
import ButtonBase from '@mui/material/ButtonBase';
import moment from 'moment-hijri';
import DatePickerComponent from '../../../../../components/Datepicker/DatePicker.Component';
import { VisaTypeManagementDialog } from './dialogs';

export const BlockManagementDialog = ({
  isOpen,
  blockUUID,
  onSave,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    visaTypeManagement: false,
    visaDelete: false,
  });
  const [activeItem, setActiveItem] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
  });
  const [visaTypesList, setVisaTypesList] = useState({
    results: [],
    totalCount: 0,
  });
  const stateInitRef = useRef({
    uuid: blockUUID,
    block_number: null,
    sponsor: null,
    is_hijri: false,
    issue_date: null,
    expiry_date: null,
    block_place_of_issue: null,
    total_visas: 0,
    visas: [],
  });
  const [errors, setErrors] = useState(() => ({}));
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const [tableColumns] = useState([
    {
      id: 1,
      isSortable: false,
      label: '#',
      isCounter: true,
      isSticky: true,
    },
    {
      id: 2,
      isSortable: true,
      label: 'occupation',
      component: (row) => (
        <span>
          {row.occupationText
            || (row.occupation
              && (row.occupation[i18next.language] || row.occupation.en))
            || 'N/A'}
        </span>
      ),
      isSticky: true,
    },
    {
      id: 3,
      isSortable: true,
      label: 'gender',
      component: (row) => (
        <span>
          {row.genderText
            || (row.gender && (row.gender[i18next.language] || row.gender.en))
            || 'N/A'}
        </span>
      ),
      isSticky: true,
    },
    {
      id: 4,
      isSortable: true,
      label: 'religion',
      component: (row) => (
        <span>
          {row.religionText
            || (row.religion && (row.religion[i18next.language] || row.religion.en))
            || 'N/A'}
        </span>
      ),
      isSticky: true,
    },
    {
      id: 5,
      isSortable: true,
      label: 'arriving-from',
      component: (row) => (
        <span>
          {row.issue_placeText
            || (row.issue_place
              && (row.issue_place[i18next.language] || row.issue_place.en))
            || 'N/A'}
        </span>
      ),
      isSticky: true,
    },
    {
      id: 6,
      isSortable: true,
      label: 'count',
      input: 'head_count',
      isSticky: true,
    },
  ]);

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the validations of the form
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          uuid: yup.string().nullable(),
          block_number: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          sponsor: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          is_hijri: yup.boolean().nullable(),
          issue_date: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          expiry_date: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          block_place_of_issue: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          visas: yup
            .array()
            .of(
              yup.object().shape({
                occupation: yup
                  .string()
                  .nullable()
                  .required(t('Shared:this-field-is-required')),
                nationality: yup
                  .string()
                  .nullable()
                  .required(t('Shared:this-field-is-required')),
                gender: yup
                  .string()
                  .nullable()
                  .required(t('Shared:this-field-is-required')),
                religion: yup
                  .string()
                  .nullable()
                  .required(t('Shared:this-field-is-required')),
                issue_place: yup
                  .string()
                  .nullable()
                  .required(t('Shared:this-field-is-required')),
                head_count: yup
                  .number()
                  .nullable()
                  .required(t('Shared:this-field-is-required')),
              }),
            )
            .test(
              'isRequiredAndMin',
              `${t('Shared:please-add-at-least')} ${1} ${t(
                `${translationPath}visa-type`,
              )}`,
              (value) => (value && value.length > 0) || visaTypesList.totalCount > 0,
            ),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t, translationPath, visaTypesList.totalCount]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change active page and send it to parent
   */
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change page size and send it to parent
   */
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the saved values on edit
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetVisaBlockById({
      block_uuid: blockUUID,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setState({
        id: 'edit',
        value: { ...response.data.results, visas: [] },
      });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }
  }, [blockUUID, isOpenChanged, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the saved values on edit for visa types
   */
  const getAllVisaTypes = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllVisaTypes({
      block_uuid: blockUUID,
      ...filter,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      if (filter.page === 1)
        setVisaTypesList((items) => {
          const unsavedVisaTypes = items.results.filter((item) => !item.uuid);
          return {
            results: [...unsavedVisaTypes, ...response.data.results],
            totalCount: response.data.paginate.total + unsavedVisaTypes.length || 0,
          };
        });
      else
        setVisaTypesList((items) => {
          const unsavedVisaTypes = items.results.filter((item) => !item.uuid);
          return {
            results: [...items.results, ...response.data.results],
            totalCount: response.data.paginate.total + unsavedVisaTypes.length || 0,
          };
        });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setVisaTypesList({ results: [], totalCount: 0 });
    }
  }, [blockUUID, filter, t]);

  /**
   * @param actionKey - string same as the attribute name
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle open or close the dialogs in the page
   */
  const dialogsStatusHandler = useCallback(
    (actionKey, isClosed = false) =>
      () => {
        if (isClosed) {
          setActiveItem((item) => (item ? null : item));
          setActiveItemIndex((item) => (item || item === 0 ? null : item));
        }
        setIsOpenDialogs((items) => ({ ...items, [actionKey]: !items[actionKey] }));
      },
    [],
  );

  /**
   * @param { visaTypeForTable } - the new value for table & the state changed values
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the save of new visa type in table json
   */
  const onVisaDialogSaveHandler = useCallback(
    ({ visaTypeForTable, isReloading }) => {
      if (isReloading) setFilter((items) => ({ ...items, page: 1 }));
      if (visaTypeForTable)
        setVisaTypesList((items) => {
          if (activeItemIndex || activeItemIndex === 0)
            items.results.splice(activeItemIndex, 1, visaTypeForTable);
          else {
            items.results.splice(1, 0, visaTypeForTable);
            items.totalCount = items.totalCount + 1;
          }
          return { ...items };
        });
    },
    [activeItemIndex],
  );

  /**
   * @param action
   * @param row
   * @param rowIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open dialog of management or delete
   */
  const onActionClicked = (action, row, rowIndex) => {
    let localRow = { ...row };
    // this condition to make sure that localRow is text & uuid not only uuids (happen when edit saved block )
    if (localRow.uuid) {
      const localStateVisaItem = state.visas.find(
        (item) => item.uuid === localRow.uuid,
      );
      if (localStateVisaItem)
        localRow = {
          ...localStateVisaItem,
          occupationText: localRow.occupationText || localRow.occupation,
          religionText: localRow.religionText || localRow.religion,
          nationalityText: localRow.nationalityText || localRow.nationality,
          genderText: localRow.genderText || localRow.gender,
          issue_placeText: localRow.issue_placeText || localRow.issue_place,
        };
    } else if (action.key === SystemActionsEnum.delete.key) {
      setVisaTypesList((items) => {
        items.results.splice(rowIndex, 1);
        return {
          ...items,
          results: items.results,
          totalCount: items.totalCount - 1,
        };
      });
      return;
    }
    setActiveItemIndex(rowIndex);
    setActiveItem(localRow);
    if (action.key === SystemActionsEnum.edit.key)
      dialogsStatusHandler('visaTypeManagement')();
    else if (action.key === SystemActionsEnum.delete.key)
      dialogsStatusHandler('visaDelete')();
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.visas) showError(errors.visas.message);
      return;
    }
    setIsLoading(true);
    const localState = { ...state };
    const unsavedVisaTypes = visaTypesList.results.filter((item) => !item.uuid);
    localState.visas.push(...unsavedVisaTypes);
    let response;
    if (blockUUID) response = await UpdateVisaBlock(localState);
    else response = await CreateVisaBlock(localState);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      if (!blockUUID)
        window?.ChurnZero?.push([
          'trackEvent',
          'EVA-VISA - Adding Visa Block',
          'Adding Visa Block',
          1,
          {},
        ]);

      showSuccess(
        t(
          `${translationPath}${
            (blockUUID && 'block-updated-successfully')
            || 'block-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (blockUUID && 'block-update-failed') || 'block-create-failed'
          }`,
        ),
        response,
      );
  };

  const getTotalVisas = useMemo(
    () => () =>
      visaTypesList.results.reduce(
        (total, item) => total + (item.head_count ? +item.head_count : 0),
        0,
      ),
    [visaTypesList.results],
  );

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (blockUUID) getEditInit();
  }, [blockUUID, getEditInit]);

  // this to get the saved visa types details for table with pagination
  useEffect(() => {
    if (blockUUID) getAllVisaTypes();
  }, [filter, blockUUID, getAllVisaTypes]);

  return (
    <>
      <DialogComponent
        titleText={(blockUUID && 'edit-block') || 'new-block'}
        titleIcon="fas fa-cube"
        dialogContent={
          <div className="block-management-content-dialog-wrapper">
            <div className="header-text my-1">
              <span>
                {t(
                  `${translationPath}${
                    (blockUUID && 'editing-block') || 'adding-new-block'
                  }`,
                )}
              </span>
            </div>
            <div className="c-gray-primary mb-4">
              <span>{t(`${translationPath}block-management-description`)}</span>
            </div>
            <div className="mb-3">
              <span>{t(`${translationPath}block-details`)}</span>
            </div>
            <div className="d-flex px-2">
              <SwitchComponent
                idRef="StatusSwitchRef"
                label="hijri-date"
                isChecked={state.is_hijri}
                isReversedLabel
                isFlexEnd
                onChange={(e, isChecked) => {
                  setState({ id: 'is_hijri', value: isChecked });
                }}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </div>
            <div>
              <SharedInputControl
                isHalfWidth
                inlineLabel="block-id"
                stateKey="block_number"
                placeholder="block-id"
                errorPath="block_number"
                isSubmitted={isSubmitted}
                errors={errors}
                editValue={state.block_number}
                onValueChanged={onStateChanged}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
              <SharedAPIAutocompleteControl
                isHalfWidth
                inlineLabel="block-issue-place"
                errors={errors}
                isSubmitted={isSubmitted}
                stateKey="block_place_of_issue"
                errorPath="block_place_of_issue"
                searchKey="search"
                placeholder="select-block-issue-place"
                onValueChanged={onStateChanged}
                // editValue={
                //   (IsUUID(state.block_place_of_issue)
                //     && state.block_place_of_issue)
                //   || undefined
                // }
                editValue={state.block_place_of_issue}
                getOptionLabel={(option) =>
                  (option.name
                    && (option.name[i18next.language] || option.name.en || 'N/A'))
                  || 'N/A'
                }
                getDataAPI={GetAllVisaBlockIssuePlaces}
                getItemByIdAPI={GetVisaBlockIssuePlaceById}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                isLoading={isLoading}
                // inputValue={
                //   (!IsUUID(state.block_place_of_issue)
                //     && state.block_place_of_issue)
                //   || ''
                // }
                // onInputChange={
                //   (!IsUUID(state.block_place_of_issue)
                //     && ((event) => {
                //       const {
                //         target: { value },
                //       } = event;
                //       onStateChanged({ id: 'block_place_of_issue', value });
                //     }))
                //   || undefined
                // }
                extraProps={
                  activeItem
                  && activeItem.uuid
                  // && IsUUID(state.block_place_of_issue)
                  && state.block_place_of_issue && {
                    with_than: [state.block_place_of_issue],
                  }
                }
              />
              <DatePickerComponent
                isHalfWidth
                inlineLabel="date-of-issue"
                inputPlaceholder={`${t('Shared:eg')} ${moment()
                  .locale(i18next.language)
                  .format((state.is_hijri && 'iDD iMMM iYYYY') || 'DD MMM YYYY')}`}
                value={state.issue_date || ''}
                errors={errors}
                isHijri={state.is_hijri}
                isSubmitted={isSubmitted}
                displayFormat={GlobalDateFormat}
                hijriDisplayFormat={GlobalHijriDateFormat}
                disableMaskedInput
                errorPath="issue_date"
                stateKey="issue_date"
                maxDate={
                  (state.expiry_date
                    && moment(
                      state.expiry_date,
                      (state.is_hijri && 'iYYYY-iMM-iDD') || 'YYYY-MM-DD',
                    ))
                  || undefined
                }
                onDelayedChange={onStateChanged}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
              <DatePickerComponent
                isHalfWidth
                inlineLabel="expiry-date"
                inputPlaceholder={`${t('Shared:eg')} ${moment()
                  .locale(i18next.language)
                  .format((state.is_hijri && 'iDD iMMM iYYYY') || 'DD MMM YYYY')}`}
                value={state.expiry_date || ''}
                errors={errors}
                isHijri={state.is_hijri}
                isSubmitted={isSubmitted}
                displayFormat={GlobalDateFormat}
                hijriDisplayFormat={GlobalHijriDateFormat}
                disableMaskedInput
                errorPath="expiry_date"
                stateKey="expiry_date"
                minDate={
                  (state.issue_date
                    && moment(
                      state.issue_date,
                      (state.is_hijri && 'iYYYY-iMM-iDD') || 'YYYY-MM-DD',
                    ))
                  || undefined
                }
                onDelayedChange={onStateChanged}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
              <SharedAPIAutocompleteControl
                isHalfWidth
                inlineLabel="sponsor"
                errors={errors}
                isSubmitted={isSubmitted}
                stateKey="sponsor"
                errorPath="sponsor"
                searchKey="search"
                placeholder="select-sponsor"
                onValueChanged={onStateChanged}
                editValue={state.sponsor}
                translationPath={translationPath}
                getDataAPI={GetAllVisaSponsors}
                getItemByIdAPI={GetVisaSponsorById}
                parentTranslationPath={parentTranslationPath}
                isLoading={isLoading}
                getOptionLabel={(option) =>
                  option.name[i18next.language] || option.name.en
                }
                extraProps={{
                  status: true,
                  ...(blockUUID && state.sponsor && { with_than: [state.sponsor] }),
                }}
              />
              <SharedInputControl
                isHalfWidth
                inlineLabel="visas"
                stateKey="block_place_of_issue"
                placeholder="total-visas"
                editValue={getTotalVisas()}
                isDisabled
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </div>
            <div className="mb-3">
              <span>{t(`${translationPath}visas-in-block`)}</span>
              <span className="px-1 c-gray-primary">
                <span>&bull;</span>
                <span className="px-1">{getTotalVisas()}</span>
              </span>
            </div>
            <TablesComponent
              data={visaTypesList.results}
              isLoading={isLoading}
              headerData={tableColumns}
              pageIndex={filter.page - 1}
              pageSize={filter.limit}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              totalItems={visaTypesList.totalCount}
              isDynamicDate
              uniqueKeyInput="uuid"
              getIsDisabledRow={(row) => row.can_delete === false}
              isWithTableActions
              isPopoverActions
              onActionClicked={onActionClicked}
              tableActions={[SystemActionsEnum.edit, SystemActionsEnum.delete]}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isWithoutBoxWrapper
              themeClasses="theme-transparent"
              tableActionsOptions={{
                getTooltipTitle: ({ row, actionEnum }) =>
                  (actionEnum.key === SystemActionsEnum.delete.key
                    && row.can_delete === false
                    && t('Shared:can-delete-description'))
                  || '',
                getDisabledAction: (item, rowIndex, actionEnum) =>
                  actionEnum.key === SystemActionsEnum.delete.key
                  && item.can_delete === false,
              }}
            />
            <ButtonBase
              className="btns theme-transparent mx-0"
              onClick={dialogsStatusHandler('visaTypeManagement')}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}add-visa-type`)}</span>
            </ButtonBase>
          </div>
        }
        wrapperClasses="block-management-dialog-wrapper"
        isOpen={isOpen}
        onSubmit={saveHandler}
        saveText="save-block"
        onCancelClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {isOpenDialogs.visaTypeManagement && (
        <VisaTypeManagementDialog
          isOpen={isOpenDialogs.visaTypeManagement}
          activeItem={activeItem}
          blockErrors={errors}
          onBlockStateChanged={onStateChanged}
          blockState={state}
          onSave={onVisaDialogSaveHandler}
          isOpenChanged={dialogsStatusHandler('visaTypeManagement', true)}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isOpenDialogs.visaDelete && (
        <ConfirmDeleteDialog
          activeItem={activeItem}
          successMessage="visa-type-deleted-successfully"
          onSave={() => {
            const localStateVisas = [...state.visas];
            const localTotalStateVisas = state.total_visas - 1;
            setState({ id: 'total_visas', value: localTotalStateVisas });
            const stateVisaTypeIndex = localStateVisas.findIndex(
              (item) => item.uuid === activeItem.uuid,
            );
            if (stateVisaTypeIndex !== -1) {
              localStateVisas.splice(stateVisaTypeIndex, 1);
              setState({ id: 'visas', value: localStateVisas });
            }
            setFilter((items) => ({ ...items, page: 1 }));
          }}
          isOpenChanged={dialogsStatusHandler('visaDelete', true)}
          descriptionMessage="visa-type-delete-description"
          deleteApi={DeleteVisaTypes}
          apiProps={{
            uuid: activeItem && [activeItem.uuid],
          }}
          errorMessage="visa-type-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenDialogs.visaDelete}
        />
      )}
    </>
  );
};

BlockManagementDialog.propTypes = {
  blockUUID: PropTypes.string, // this is block uuid
  isOpen: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};

BlockManagementDialog.defaultProps = {
  blockUUID: undefined,
  isOpenChanged: undefined,
  translationPath: 'BlockManagementDialog.',
};
