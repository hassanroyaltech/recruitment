import React, { useState, useCallback, useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../../components';
import '../Offers.Style.scss';
import { getErrorByName, GlobalHistory, showError, showSuccess } from 'helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from 'pages/setups/shared';
import {
  DefaultFormsTypesEnum,
  NavigationSourcesEnum,
  OffersActionsEnum,
  OffersStatusesEnum,
} from 'enums';
import {
  GetAllOffers,
  GetAllFormsTypes,
  CreateManualOffer,
  GetAllBuilderTemplates,
} from 'services';
import * as yup from 'yup';

export const ManualFormsManagementDialog = ({
  isOpen,
  onClose,
  reloadList,
  parentTranslationPath,
  translationPath,
  candidate_uuid,
  stage_uuid,
  job_uuid,
  next_approved,
  code,
  manualFormsTitle,
  defaultStatus,
  isBlankPage,
  formSource,
  isForm,
  // reloadList,
  // setIsDeletedOffer,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [offerStatuses] = useState(() =>
    Object.values(OffersStatusesEnum).map((item) => ({
      ...item,
      status: t(`${translationPath}${item.status}`),
    })),
  );
  const stateInitRef = useRef({
    // upload_offer_file_uuid: null,
    template_type_uuid: null,
    template_uuid: null,
    offer_status: defaultStatus,
    // file: null,
  });
  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

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
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          template_type_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          template_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          offer_status: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);
  const [completedOffersCount, setCompletedOffersCount] = useState(0);

  const UploadOfferHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    const response = await CreateManualOffer({
      ...state,
      candidate_uuid,
      job_uuid,
    });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      // setIsDeletedOffer(false);
      showSuccess(
        t(`${translationPath}${(isForm && 'form') || 'offer'}-created-successfully`),
      );
      if (
        Object.values(OffersStatusesEnum).some(
          (item) =>
            item.key === state.offer_status
            && item.actions.some((action) => action.key === OffersActionsEnum.Edit.key),
        )
      )
        if (isBlankPage) {
          window.open(
            `${process.env.REACT_APP_HEADERS}/form-builder/info?form_uuid=${response.data?.results?.uuid}&source=${formSource}&editorRole=sender&template_uuid=${state.template_uuid}&template_type_uuid=${state.template_type_uuid}&status=${state.offer_status}`,
          );
          reloadList();
          onClose();
        } else
          GlobalHistory.push(
            `/form-builder/info?form_uuid=${response.data?.results?.uuid}&source=${formSource}&editorRole=sender&template_uuid=${state.template_uuid}&template_type_uuid=${state.template_type_uuid}&status=${state.offer_status}`,
          );
      else {
        reloadList();
        onClose();
      }
    } else
      showError(
        t(`${translationPath}${(isForm && 'form') || 'offer'}-create-failed`),
        response,
      );
  }, [
    errors,
    state,
    candidate_uuid,
    job_uuid,
    t,
    translationPath,
    isForm,
    isBlankPage,
    formSource,
    reloadList,
    onClose,
  ]);

  const GetCompletedOffers = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllOffers({
      candidate_uuid,
      job_uuid,
      status: OffersStatusesEnum.Completed.key,
    });
    if (res && res.status === 200)
      setCompletedOffersCount(res.data.paginate?.total || 0);
    else {
      showError(t('Shared:failed-to-get-saved-data'), res);
      onClose();
    }
    setIsLoading(false);
  }, [candidate_uuid, job_uuid, onClose, t]);

  useEffect(() => {
    if (next_approved) GetCompletedOffers();
  }, [GetCompletedOffers, next_approved]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <DialogComponent
      maxWidth="xs"
      titleText={manualFormsTitle}
      contentClasses="px-0"
      dialogContent={
        <div className="mx-4 mb-4">
          {!code && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="template-type"
              placeholder="select-template-type"
              errors={errors}
              stateKey="template_type_uuid"
              searchKey="search"
              editValue={state.template_type_uuid}
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              onValueChanged={(newValue) => {
                if (state.template_uuid)
                  onStateChanged({ id: 'template_uuid', value: null });

                onStateChanged(newValue);
              }}
              translationPath={translationPath}
              getDataAPI={GetAllFormsTypes}
              parentTranslationPath={parentTranslationPath}
              errorPath="template_type_uuid"
              getOptionLabel={(option) => option.name || 'N/A'}
              extraProps={{
                job_stage_uuid: stage_uuid,
              }}
            />
          )}
          {(state.template_type_uuid || code) && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title="template"
              isEntireObject
              placeholder="select-template"
              errors={errors}
              stateKey="template_uuid"
              searchKey="search"
              editValue={state.template_uuid}
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              onValueChanged={(newValue) => {
                if (newValue.value)
                  onStateChanged({
                    id: 'template_type_uuid',
                    value: newValue.value.type_uuid,
                  });

                onStateChanged({
                  ...newValue,
                  value: (newValue.value && newValue.value.uuid) || null,
                });
              }}
              translationPath={translationPath}
              getDataAPI={GetAllBuilderTemplates}
              parentTranslationPath={parentTranslationPath}
              errorPath="template_uuid"
              getOptionLabel={(option) => option.title || 'N/A'}
              extraProps={{
                // is_not_shareable: code ? undefined : true,
                code,
                is_not_shareable:
                  code !== DefaultFormsTypesEnum.Visa.key ? true : null,
                form_type_uuid: state.template_type_uuid,
              }}
            />
          )}
          {/*<SharedUploaderControl*/}
          {/*  editValue={data?.file || []}*/}
          {/*  onValueChanged={(uploaded) => {*/}
          {/*    const uploadedValue = (uploaded.value?.length && uploaded.value) || [];*/}
          {/*    setData((items) => ({*/}
          {/*      ...items,*/}
          {/*      upload_offer_file_uuid: uploadedValue?.[0]?.uuid,*/}
          {/*      file: uploadedValue,*/}
          {/*    }));*/}
          {/*  }}*/}
          {/*  stateKey="file"*/}
          {/*  isSubmitted={isSubmitted}*/}
          {/*  errors={*/}
          {/*    data.upload_offer_file_uuid*/}
          {/*      ? []*/}
          {/*      : {*/}
          {/*        upload_offer_file_uuid: {*/}
          {/*          error: true,*/}
          {/*          message: 'This field is required',*/}
          {/*        },*/}
          {/*      }*/}
          {/*  }*/}
          {/*  errorPath="upload_offer_file_uuid"*/}
          {/*  labelClasses="theme-primary"*/}
          {/*  parentTranslationPath={parentTranslationPath}*/}
          {/*  translationPath={translationPath}*/}
          {/*  fileTypeText="files"*/}
          {/*  isFullWidth*/}
          {/*  uploaderPage={UploaderPageEnum.OfferUpload}*/}
          {/*  multiple*/}
          {/*/>*/}
          {code !== DefaultFormsTypesEnum.Visa.key && (
            <SharedAutocompleteControl
              isFullWidth
              errors={errors}
              searchKey="search"
              initValuesKey="key"
              isDisabled={isLoading}
              initValuesTitle="status"
              isSubmitted={isSubmitted}
              initValues={offerStatuses}
              stateKey="offer_status"
              errorPath="offer_status"
              onValueChanged={onStateChanged}
              title="status"
              editValue={state.offer_status}
              placeholder="status"
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) => option.status}
              disabledOptions={(option) =>
                (next_approved
                  && OffersStatusesEnum.Completed.key === option.key
                  && completedOffersCount > 0)
                || (OffersStatusesEnum.CompletedAsSecondary.key === option.key
                  && (!next_approved || completedOffersCount === 0))
              }
            />
          )}
        </div>
      }
      wrapperClasses="manual-offer-management-dialog-wrapper"
      isSaving={isLoading}
      onSaveClicked={(e) => {
        e.preventDefault();
        UploadOfferHandler();
      }}
      onCancelClicked={onClose}
      isOpen={isOpen}
      onCloseClicked={onClose}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ManualFormsManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  manualFormsTitle: PropTypes.string,
  job_uuid: PropTypes.string.isRequired,
  stage_uuid: PropTypes.string,
  candidate_uuid: PropTypes.string.isRequired,
  next_approved: PropTypes.bool,
  isBlankPage: PropTypes.bool,
  defaultStatus: PropTypes.oneOf(
    Object.values(OffersStatusesEnum).map((item) => item.key),
  ),
  formSource: PropTypes.oneOf(
    Object.values(NavigationSourcesEnum).map((item) => item.key),
  ).isRequired,
  code: PropTypes.oneOf(
    Object.values(DefaultFormsTypesEnum).map((item) => item.key),
  ),
  isForm: PropTypes.bool,
  reloadList: PropTypes.func.isRequired,
  // setIsDeletedOffer: PropTypes.func.isRequired,
};
ManualFormsManagementDialog.defaultProps = {
  onClose: undefined,
  next_approved: undefined,
  defaultStatus: undefined,
  isBlankPage: undefined,
  manualFormsTitle: 'manual-offer-management',
  isForm: PropTypes.bool,
  translationPath: '',
};
