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
import * as yup from 'yup';
import {
  getErrorByName,
  GlobalSavingDateFormat,
  GlobalSavingHijriDateFormat,
  showError,
  showSuccess,
} from '../../../../helpers';
import { DialogComponent, TabsComponent } from '../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
} from '../../../setups/shared';
import { ButtonBase } from '@mui/material';
import {
  GetAllVisaMedias,
  GetAllVisaStagesDropdown,
  GetVisaAllocationById,
  GetVisaReservationById,
  UpdateVisaAllocation,
  UpdateVisaReservation,
  VisaAllocationConfirm,
  VisaAllocationSubmit,
  VisaReservationConfirm,
  VisaReservationSubmit,
} from '../../../../services';
import { useSelector } from 'react-redux';
import {
  NavigationSourcesEnum,
  SetupsUsersTypesEnums,
  VisaDefaultStagesEnum,
  VisaRequestsCallLocationsEnum,
  VisaRequestsStatusesEnum,
  VisaRequestsTypesEnum,
} from '../../../../enums';
import { RequestsManagementTabs } from '../../tabs-data';
import './VisaRequestsManagement.Style.scss';
import { VisaCountsManagementDialog } from '../visa-counts-management/VisaCountsManagement.Dialog';
import moment from 'moment-hijri';
import Alert from '@mui/material/Alert';
import { MassAllocateVisa } from '../../../../services/VisaMassAllocation.Services';

export const VisaRequestsManagementDialog = ({
  request_uuid,
  status,
  candidate_uuid,
  job_uuid,
  first_name,
  last_name,
  position_name,
  callLocation,
  isOpen,
  onSave,
  isOpenChanged,
  formSource,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeRow, setActiveRow] = useState(null);
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    visaCountsManagement: false,
  });
  const [usersTypes] = useState(() =>
    Object.values(SetupsUsersTypesEnums).map((item) => ({
      ...item,
      valueSingle: t(item.valueSingle),
    })),
  );
  // setIsConfirmed
  const [isConfirmed] = useState(false);
  const userReducer = useSelector((reducerState) => reducerState?.userReducer);
  const [stagesList, setStagesList] = useState([]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get current call location enum object (must exist)
   */
  const getCurrentCallLocationEnum = useMemo(
    () => () =>
      Object.values(VisaRequestsCallLocationsEnum).find(
        (item) => item.key === callLocation,
      ),
    [callLocation],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get if the current location type is from a confirmation types
   */
  const getIsConfirmType = useMemo(
    () => () =>
      getCurrentCallLocationEnum().requestType.key
        === VisaRequestsTypesEnum.ConfirmReservation.key
      || getCurrentCallLocationEnum().requestType.key
        === VisaRequestsTypesEnum.ConfirmAllocation.key,
    [getCurrentCallLocationEnum],
  );

  const getIsAllocation = useMemo(
    () => () =>
      getCurrentCallLocationEnum().requestType.key
      === VisaRequestsTypesEnum.Allocation.key,
    [getCurrentCallLocationEnum],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if the current location is from view type
   */
  const getIsViewTypes = useMemo(
    () => () =>
      getCurrentCallLocationEnum().requestType.key
        === VisaRequestsTypesEnum.ViewAllocation.key
      || getCurrentCallLocationEnum().requestType.key
        === VisaRequestsTypesEnum.ViewReservation.key,
    [getCurrentCallLocationEnum],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if the current location has a reservation types
   */
  const getIsReservationTypes = useMemo(
    () => () =>
      getCurrentCallLocationEnum().requestType.key
        === VisaRequestsTypesEnum.Reservation.key
      || getCurrentCallLocationEnum().requestType.key
        === VisaRequestsTypesEnum.ConfirmReservation.key
      || getCurrentCallLocationEnum().requestType.key
        === VisaRequestsTypesEnum.EditReservation.key
      || getCurrentCallLocationEnum().requestType.key
        === VisaRequestsTypesEnum.ViewReservation.key,
    [getCurrentCallLocationEnum],
  );

  const [requestsManagementTabsData] = useState(() =>
    RequestsManagementTabs.filter(
      (item) =>
        (item.key === 5 && !getIsReservationTypes())
        || (item.key === 4
          && (getIsConfirmType()
            || (getIsViewTypes()
              && status === VisaRequestsStatusesEnum.Approved.key)))
        || (item.key !== 4 && item.key !== 5),
    ),
  );

  const stateInitRef = useRef({
    requested_from_type:
      (!getIsReservationTypes() && userReducer.results.user.user_type) || null,
    requested_from:
      (!getIsReservationTypes() && userReducer.results.user.uuid) || null,
    employee_uuid: userReducer.results.user?.employee_uuid || null,
    reserve_for_type:
      (getIsReservationTypes() && userReducer.results.user.user_type) || null,
    reserve_for: (getIsReservationTypes() && userReducer.results.user.uuid) || null,
    job_uuid,
    candidate_uuid,
    first_name,
    last_name,
    position_name,
    nationality: null,
    gender: null,
    religion: null,
    issue_place: null,
    occupation: null, // not exists
    note: null,
    count: null,
    form_templates: [],
    attachments: [],
    attachmentsDetails: [], // for frontend only
    stage: null, // only for the dropdown
    // confirm keys
    selectedVisas: [], // on open the dialog for confirm for frontOnly
    visa_uuid: null, // on select visa for allocation
    is_reserved: false, // on select visa for allocation from reserved tab
    request_uuid: null, // for confirm allocation or reservation request uuid
    visa_uuids: [], // for reservation save uuid & count
    expiry_date: null, // for reservation on (selected visa)
  });
  const stateRef = useRef(stateInitRef.current);
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if the current location is from edit type
   */
  const getIsEditTypes = useMemo(
    () => () =>
      getCurrentCallLocationEnum().requestType.key
        === VisaRequestsTypesEnum.EditAllocation.key
      || getCurrentCallLocationEnum().requestType.key
        === VisaRequestsTypesEnum.EditReservation.key,
    [getCurrentCallLocationEnum],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the total visas of all selected visas (types)
   */
  const getTotalSelectedVisas = useMemo(
    () =>
      (visas = state.selectedVisas || []) =>
        visas.reduce((total, item) => total + item.count, 0),
    [state.selectedVisas],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          job_uuid: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || getIsReservationTypes(),
            ),
          candidate_uuid: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || getIsReservationTypes(),
            ),
          requested_from_type: yup
            .number()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || getIsReservationTypes(),
            ),
          requested_from: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || getIsReservationTypes(),
            ),

          reserve_for_type: yup
            .number()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || !getIsReservationTypes(),
            ),
          reserve_for: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || !getIsReservationTypes(),
            ),
          first_name: yup.string().nullable(),
          last_name: yup.string().nullable(),
          position_name: yup.string().nullable(),
          nationality: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || getIsReservationTypes(),
            ),
          gender: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || getIsReservationTypes(),
            ),
          religion: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || getIsReservationTypes(),
            ),
          issue_place: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || getIsReservationTypes(),
            ),
          occupation: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          note: yup.string().nullable(),
          form_templates: yup.array().nullable(),
          selectedVisas: yup
            .array()
            .nullable()
            .test(
              'isRequired',
              t(
                `${t('Shared:please-select-at-least')} ${1} ${t(
                  `${translationPath}visa`,
                )}`,
              ),
              (value) => !getIsConfirmType() || (value && value.length > 0),
            ),
          visa_uuid: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t(
                `${t('Shared:please-select-at-least')} ${1} ${t(
                  `${translationPath}visa`,
                )}`,
              ),
              (value) =>
                value
                || !getIsConfirmType()
                || (getIsConfirmType() && getIsReservationTypes()),
            ),
          is_reserved: yup.boolean().nullable(),
          count: yup
            .number()
            .nullable()
            .min(1, `${t('Shared:this-field-must-be-more-than-or-equal')} ${1}`)
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => !getIsReservationTypes() || value,
            ),
          request_uuid: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => !getIsConfirmType() || value,
            ), // for confirm allocation request uuid
          visa_uuids: yup.array().of(
            yup
              .object()
              .nullable()
              .shape({
                uuid: yup.string().nullable().required(t('this-field-is-required')),
                count: yup
                  .number()
                  .nullable()
                  .min(
                    1,
                    `${t('Shared:this-field-must-be-more-than-or-equal')} ${1}`,
                  )
                  .required(t('this-field-is-required')),
              }),
          ),
          // .test(
          //   'isSameAsRequestedCount',
          //   `${t(`${translationPath}number-of-selected-visas-description`)} (${
          //     state.count
          //   })`,
          //   (value) =>
          //     !getIsReservationTypes()
          //     || !getIsConfirmType()
          //     || (value && getTotalSelectedVisas(value) === state.count)
          // ), // for reservation save uuid & count
          expiry_date: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsConfirmType()
                || (getIsConfirmType() && !getIsReservationTypes()),
            ), // for reservation on (selected visa)
        }),
      },
      state,
    );
    setErrors(result);
  }, [getIsConfirmType, getIsReservationTypes, state, t, translationPath]);

  /**
   * @param key
   * @param newValue - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of is open dialog from child
   */
  const onIsOpenDialogsChanged = useCallback((key, newValue) => {
    setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
  }, []);

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
   * @Description this method is to get all stages for dropdown move to
   */
  const getAllVisaStages = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllVisaStagesDropdown();
    setIsLoading(false);
    if (response && response.status === 200) setStagesList(response.data.results);
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      if (isOpenChanged) isOpenChanged();
    }
  }, [isOpenChanged, t]);

  const getIsDisabledFieldsOrActions = useMemo(
    () => () =>
      isConfirmed
      || getIsViewTypes()
      || (activeTab === 0 && getIsConfirmType())
      || (activeTab === 1 && getIsConfirmType()),
    // || (activeTab === 2
    //   && getCurrentCallLocationEnum().requestType.key
    //     !== VisaRequestsTypesEnum.ConfirmAllocation.key),
    [
      activeTab,
      // getCurrentCallLocationEnum,
      getIsConfirmType,
      getIsViewTypes,
      isConfirmed,
    ],
  );

  const onSelectCheckboxChanged = useCallback(
    (selectedVisas, blockItem = {}) =>
      ({ selectedRow }) => {
        const localSelectedRow = { ...blockItem, ...selectedRow };
        const localSelectedVisas = [...selectedVisas];
        const localSelectedVisaIndex = localSelectedVisas.findIndex(
          (item) => item.uuid === localSelectedRow.uuid,
        );

        if (localSelectedVisaIndex > -1) {
          if (getIsReservationTypes()) {
            const localSavingVisas = [...stateRef.current.visa_uuids];
            if (localSavingVisas.length === 1) {
              onStateChanged({ id: 'visa_uuids', value: [] });
              onStateChanged({ id: 'expiry_date', value: null });
            } else {
              // be careful the index that exist in the upper level for visaDetails not for saving visa_uuids
              const localSavingVisasIndex = localSavingVisas.findIndex(
                (item) => item.uuid === localSelectedRow.uuid,
              );
              if (localSavingVisasIndex > -1) {
                localSavingVisas.splice(localSavingVisasIndex, 1);
                onStateChanged({ id: 'visa_uuids', value: localSavingVisas });
              }
            }
          } else {
            onStateChanged({ id: 'visa_uuid', value: null });
            onStateChanged({ id: 'count', value: null });
            onStateChanged({ id: 'is_reserved', value: false });
          }
          localSelectedVisas.splice(localSelectedVisaIndex, 1);
        } else {
          if (getIsReservationTypes()) {
            setActiveRow(localSelectedRow);
            onIsOpenDialogsChanged('visaCountsManagement', true);
            return;
          }
          onStateChanged({ id: 'visa_uuid', value: localSelectedRow.uuid });
          onStateChanged({ id: 'count', value: 1 });
          onStateChanged({
            id: 'is_reserved',
            value: !getIsReservationTypes() && activeTab === 2,
          });
          localSelectedRow.count = 1;
          localSelectedVisas.push(localSelectedRow);
        }
        onStateChanged({ id: 'selectedVisas', value: localSelectedVisas });
      },
    [activeTab, getIsReservationTypes, onIsOpenDialogsChanged],
  );

  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving the stages & pipeline template
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    console.log({ event });
    setIsSubmitted(true);

    // Allocate visa directly
    if (getIsAllocation() && !!state.selectedVisas?.length) {
      const response = await MassAllocateVisa({
        reserve_for: state?.requested_from,
        job_uuid: state.job_uuid,
        candidate_uuid: state.candidate_uuid,
        visa_uuid: state.selectedVisas?.[0]?.reserved_visa_uuid,
        request_uuid: state.selectedVisas?.[0]?.request_uuid,
        note: state.note,
        form_templates: state.form_templates,
        attachments: state.attachments,
        is_mass_allocated: false,
      });
      if (response?.status === 200) {
        showSuccess(t(`${translationPath}visa-allocated-successfully`));
        if (onSave) onSave();
        if (isOpenChanged) isOpenChanged();
        return;
      } else showError(t('Shared:failed-to-get-saved-data'), response);
      return;
    }

    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);

    const response = await ((getIsConfirmType()
      && ((getIsReservationTypes() && VisaReservationConfirm(state))
        || VisaAllocationConfirm({
          ...state,
          ...(state.is_reserved
            ? { visa_uuid: state.selectedVisas?.[0]?.reserved_visa_uuid }
            : { visa_uuid: state.selectedVisas?.[0]?.uuid }),
        })))
      || (getIsReservationTypes()
        && ((getIsEditTypes() && UpdateVisaReservation(state))
          || VisaReservationSubmit(state)))
      || (getIsEditTypes() && UpdateVisaAllocation(state))
      || VisaAllocationSubmit(state));
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      if (!getIsConfirmType() && !getIsEditTypes())
        window?.ChurnZero?.push([
          'trackEvent',
          getIsReservationTypes()
            ? 'EVA-VISA - Reservation request'
            : 'EVA-VISA - Allocation request',
          getIsReservationTypes()
            ? 'EVA-VISA - Reservation request'
            : 'EVA-VISA - Allocation request',
          1,
          {},
        ]);
      if (getIsConfirmType())
        window?.ChurnZero?.push([
          'trackEvent',
          getIsReservationTypes()
            ? 'EVA-VISA - Reservation Action'
            : 'EVA-VISA - Allocation Action',
          getIsReservationTypes()
            ? 'EVA-VISA - Reservation Action'
            : 'EVA-VISA - Allocation Action',
          1,
          {},
        ]);
      showSuccess(
        t(
          `${translationPath}${
            (getIsConfirmType()
              && ((getIsReservationTypes() && 'reservation-confirmed-successfully')
                || 'allocation-confirmed-successfully'))
            || (getIsReservationTypes()
              && ((getIsEditTypes() && 'reserve-updated-successfully')
                || 'reserve-submitted-successfully'))
            || (getIsEditTypes() && 'allocate-updated-successfully')
            || 'allocate-submitted-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      // if (
      //   callLocation
      //   === VisaRequestsCallLocationsEnum.AllRequestsReservationNewRequest.key
      // )
      //   setIsConfirmed(true);
      // else
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (getIsConfirmType()
              && ((getIsReservationTypes() && 'reservation-confirm-failed')
                || 'allocation-confirm-failed'))
            || (getIsReservationTypes()
              && ((getIsEditTypes() && 'reserve-update-failed')
                || 'reserve-submit-failed'))
            || (getIsEditTypes() && 'allocate-update-failed')
            || 'allocate-submit-failed'
          }`,
        ),
        response,
      );
  };

  const deselectVisasHandler = useCallback(({ row }) => {
    if (row && stateRef.current.selectedVisas.length > 1) {
      const localSelectedVisas = [...stateRef.current.selectedVisas];
      const localSavingVisas = [...stateRef.current.visa_uuids];
      const localSelectedVisaIndex = localSelectedVisas.findIndex(
        (item) => item.uuid === row.uuid,
      );
      const localSavingVisaIndex = localSavingVisas.findIndex(
        (item) => item.uuid === row.uuid,
      );
      if (localSelectedVisaIndex > -1) {
        localSelectedVisas.splice(localSelectedVisaIndex);
        setState({ id: 'selectedVisas', value: localSelectedVisas });
      }
      if (localSavingVisaIndex > -1) {
        localSavingVisas.splice(localSavingVisaIndex);
        setState({ id: 'visa_uuids', value: localSavingVisas });
      }
      return;
    }
    setState({ id: 'selectedVisas', value: [] });
    if (stateRef.current.is_reserved) setState({ id: 'is_reserved', value: false });
    if (stateRef.current.visa_uuid) setState({ id: 'visa_uuid', value: null });
    if (stateRef.current.visa_uuids.length > 0)
      setState({ id: 'visa_uuids', value: [] });
    if (stateRef.current.expiry_date) setState({ id: 'expiry_date', value: null });
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return stage by key
   */
  const getStageDetails = useMemo(
    () => (stages, defaultStageKey) =>
      stages.find((item) => item.value === defaultStageKey),
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return max available visas to be selected
   */
  const getMaxAvailableVisas = useMemo(
    () =>
      (
        stages = (activeRow && activeRow.stages) || [],
        stageKey = VisaDefaultStagesEnum.Available.key,
      ) =>
        state.count > 0 && getStageDetails(stages, stageKey).count > state.count
          ? state.count - getTotalSelectedVisas()
          : getStageDetails(stages, stageKey).count - getTotalSelectedVisas(),
    [activeRow, getStageDetails, getTotalSelectedVisas, state.count],
  );

  const getIsDisabledRow = useMemo(
    () =>
      (row, isReservation = false) =>
        getIsViewTypes()
        || (!state.selectedVisas.some((visa) => visa.uuid === row.uuid)
          && ((!getIsReservationTypes() && state.selectedVisas.length > 0)
            || (row.stages && row.stages.length > 0
              ? getMaxAvailableVisas(
                row.stages,
                (isReservation && VisaDefaultStagesEnum.Reserved.key) || undefined,
              )
              : row.available || row.count || 0) <= 0)),
    [
      getIsReservationTypes,
      getIsViewTypes,
      getMaxAvailableVisas,
      state.selectedVisas,
    ],
  );

  const getMaxExpiryDate = useMemo(
    () => () =>
      state.selectedVisas.reduce(
        (total, item) =>
          !total
            ? { expiry_date: item.expiry_date, is_hijri: item.is_hijri }
            : (moment(
              moment(
                item.expiry_date,
                (item.is_hijri && GlobalSavingHijriDateFormat)
                    || GlobalSavingDateFormat,
              )
                .locale('en')
                .format(GlobalSavingDateFormat),
              GlobalSavingDateFormat,
            ).isAfter(
              moment(
                total.expiry_date,
                (total.is_hijri && GlobalSavingHijriDateFormat)
                    || GlobalSavingDateFormat,
              )
                .locale('en')
                .format(GlobalSavingDateFormat),
            )
                && total) || { expiry_date: item.expiry_date, is_hijri: item.is_hijri },
        (activeRow && {
          expiry_date: activeRow.expiry_date,
          is_hijri: activeRow.is_hijri,
        })
          || null,
      ),
    [activeRow, state.selectedVisas],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the data on edit
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await ((getIsReservationTypes()
      && GetVisaReservationById({ uuid: request_uuid }))
      || GetVisaAllocationById({ uuid: request_uuid }));
    if (response && response.status === 200) {
      const { results } = response.data;
      const localAttachments = results.attachments;
      const localState = {
        ...stateInitRef.current,
        ...results,
        request_uuid: results.uuid,
        // TODO: Check effect later
        selectedVisas: [],
        selected_visas: [],
        visa_uuids: [],
      };
      if (localAttachments && localAttachments.length > 0) {
        const mediaResponse = await GetAllVisaMedias({
          media_uuid: localAttachments.map((item) => item.uuid),
        });
        if (mediaResponse && mediaResponse.status === 200) {
          localState.attachmentsDetails = mediaResponse.data.results;
          localState.attachmentsDetails = localState.attachmentsDetails.map(
            (item) => {
              const attachmentItem = localState.attachments.find(
                (element) => element.uuid === item.uuid,
              );
              if (attachmentItem) item.comment = attachmentItem.comment;
              return item;
            },
          );
        } else showError(t('Shared:failed-to-get-saved-data'), mediaResponse);
      }
      setState({
        id: 'edit',
        value: localState,
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [getIsReservationTypes, request_uuid, t]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    getAllVisaStages();
  }, [getAllVisaStages]);

  useEffect(() => {
    if (request_uuid) getEditInit();
  }, [request_uuid, getEditInit]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return (
    <>
      <DialogComponent
        dialogTitle={
          <span className="header-text px-4 pt-2">
            <span className="fas fa-ticket-alt" />
            {(getIsReservationTypes() && (
              <span className="px-1">{t(`${translationPath}reserve-visa`)}</span>
            )) || (
              <>
                <span className="px-1">
                  {t(`${translationPath}allocate-visa-for`)}
                </span>
                <span className="c-gray-primary">
                  {`${first_name || ''}${(last_name && ` ${last_name}`) || ''}`}
                </span>
              </>
            )}
          </span>
        }
        maxWidth="lg"
        contentFooterClasses="px-0 pb-0"
        contentClasses="px-3 pb-0"
        wrapperClasses="visa-requests-management-dialog-wrapper"
        dialogContent={
          <div className="visa-requests-management-dialog-content-wrapper px-3">
            <div className="description-text mb-3">
              <span>
                {t(
                  `${translationPath}${
                    (getIsReservationTypes()
                      && ((!getIsConfirmType() && 'reservation')
                        || 'confirm-reservation'))
                    || (!getIsReservationTypes()
                      && !getIsConfirmType()
                      && 'allocation')
                    || 'confirm-allocation'
                  }-description`,
                )}
              </span>
            </div>
            <TabsComponent
              isPrimary
              isWithLine
              labelInput="label"
              idRef="requestsTabsRef"
              tabsContentClasses="pt-3"
              data={requestsManagementTabsData}
              currentTab={activeTab}
              translationPath={translationPath}
              onTabChanged={(event, currentTab) => {
                setActiveTab(currentTab);
              }}
              parentTranslationPath={parentTranslationPath}
              dynamicComponentProps={{
                state,
                errors,
                onStateChanged,
                usersTypes,
                isSubmitted,
                isLoading,
                getTotalSelectedVisas,
                // callLocation,
                getIsConfirmType,
                getIsAllocation,
                getIsViewTypes,
                getIsReservationTypes,
                isBlankPage: true,
                formSource,
                candidate_uuid: state.candidate_uuid,
                job_uuid: state.job_uuid,
                deselectVisasHandler,
                getIsDisabledRow,
                onSelectCheckboxChanged,
                getIsDisabledFieldsOrActions,
                parentTranslationPath,
                translationPath,
                hideFilters: true,
              }}
            />
            {/*{isSubmitted && errors['visa_uuids'] && (*/}
            {/*  <Alert severity="warning">{errors['visa_uuids'].message}</Alert>*/}
            {/*)}*/}
            {isSubmitted && errors['visa_uuid'] && (
              <Alert severity="warning">{errors['visa_uuid'].message}</Alert>
            )}
          </div>
        }
        isOpen={isOpen}
        dialogActions={
          <div className="save-cancel-wrapper">
            <ButtonBase className="btns theme-outline mx-2" onClick={isOpenChanged}>
              <span>{t('Shared:cancel')}</span>
            </ButtonBase>
            {isConfirmed && (
              <SharedAutocompleteControl
                editValue={(state.stage && state.stage.uuid) || null}
                placeholder="move-to"
                inlineLabel="move-to"
                stateKey="new_stage"
                isEntireObject
                isPopoverTheme
                isDisabled={isLoading}
                onValueChanged={onStateChanged}
                initValues={stagesList}
                errors={errors}
                errorPath="timezone"
                isSubmitted={isSubmitted}
              />
            )}
            {!getIsConfirmType() && !getIsViewTypes() && (
              <ButtonBase
                className={`btns theme-solid${
                  (getIsEditTypes() && ' bg-secondary') || ''
                } mx-2`}
                disabled={isLoading || state.selectedVisas.length}
                onClick={
                  ((activeTab === 4
                    || (activeTab === 3
                      && requestsManagementTabsData.length === 4
                      && !getIsReservationTypes()))
                    && saveHandler)
                  || undefined
                }
                type={
                  ((activeTab === 4
                    || (activeTab === 3
                      && requestsManagementTabsData.length === 4
                      && !getIsReservationTypes()))
                    && 'button')
                  || 'submit'
                }
              >
                <span>
                  {t(
                    `${translationPath}${
                      (getIsEditTypes() && 'update') || 'submit'
                    }-a-request`,
                  )}
                </span>
              </ButtonBase>
            )}
            {(getCurrentCallLocationEnum().requestType.key
              === VisaRequestsTypesEnum.ConfirmAllocation.key
              || (getIsAllocation() && !!state.selectedVisas?.length)) && (
              <ButtonBase
                className="btns theme-solid mx-2"
                disabled={isLoading || isConfirmed}
                onClick={
                  ((activeTab === 4
                    || (activeTab === 3 && requestsManagementTabsData.length === 4))
                    && saveHandler)
                  || undefined
                }
                type={
                  ((activeTab === 4
                    || (activeTab === 3 && requestsManagementTabsData.length === 4))
                    && 'button')
                  || 'submit'
                }
              >
                <span>{t(`${translationPath}confirm-allocation`)}</span>
              </ButtonBase>
            )}
            {getCurrentCallLocationEnum().requestType.key
              === VisaRequestsTypesEnum.ConfirmReservation.key && (
              <ButtonBase
                className="btns theme-solid mx-2"
                disabled={isLoading || isConfirmed}
                type="submit"
              >
                <span>{t(`${translationPath}confirm-reservation`)}</span>
              </ButtonBase>
            )}
          </div>
        }
        saveType={
          ((activeTab === 4
            || (activeTab === 3
              && requestsManagementTabsData.length === 4
              && !getIsReservationTypes()))
            && 'button')
          || 'submit'
        }
        onSubmit={
          (!(
            activeTab === 4
            || (activeTab === 3
              && requestsManagementTabsData.length === 4
              && !getIsReservationTypes())
          )
            && saveHandler)
          || undefined
        }
        onCloseClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
      />
      {isOpenDialogs.visaCountsManagement && (
        <VisaCountsManagementDialog
          getMaxExpiryDate={getMaxExpiryDate}
          selectedVisa={activeRow}
          expiry_date={state.expiry_date}
          available_visas={getMaxAvailableVisas()}
          isOpen={isOpenDialogs.visaCountsManagement}
          onSave={({ expiry_date, count }) => {
            const localSavingVisas = [...state.visa_uuids];
            const localSelectedVisas = [...state.selectedVisas];
            activeRow.count = count;
            localSelectedVisas.push(activeRow);
            localSavingVisas.push({
              uuid: activeRow.uuid,
              count,
            });
            onStateChanged({ id: 'selectedVisas', value: localSelectedVisas });
            onStateChanged({ id: 'visa_uuids', value: localSavingVisas });
            onStateChanged({ id: 'expiry_date', value: expiry_date });
            onIsOpenDialogsChanged('visaCountsManagement', false);
          }}
          isOpenChanged={() => {
            setActiveRow(null);
            onIsOpenDialogsChanged('visaCountsManagement', false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </>
  );
};

VisaRequestsManagementDialog.propTypes = {
  candidate_uuid: PropTypes.string,
  job_uuid: PropTypes.string,
  request_uuid: PropTypes.string,
  status: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  position_name: PropTypes.string,
  formSource: PropTypes.oneOf(
    Object.values(NavigationSourcesEnum).map((item) => item.key),
  ),
  callLocation: PropTypes.oneOf(
    Object.values(VisaRequestsCallLocationsEnum).map((item) => item.key),
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onSave: PropTypes.func,
};
