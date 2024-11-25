import React, { useState, useCallback, useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../../components';
import '../Offers.Style.scss';
import { getErrorByName, showError, showSuccess } from 'helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
} from 'pages/setups/shared';
import { OffersStatusesEnum } from 'enums';
import { GetAllOffers, UpdateOfferStatus } from 'services';
import * as yup from 'yup';

export const OfferStatusManagementDialog = ({
  isOpen,
  selectedItem,
  onClose,
  parentTranslationPath,
  translationPath,
  candidate_uuid,
  job_uuid,
  next_approved,
  reloadList,
  // setIsDeletedOffer,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [completedOffersCount, setCompletedOffersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [offerStatuses] = useState(() =>
    Object.values(OffersStatusesEnum)
      .filter((item) => item.key !== OffersStatusesEnum.NotSent.key)
      .map((item) => ({
        ...item,
        status: t(`${translationPath}${item.status}`),
      })),
  );
  const stateInitRef = useRef({
    uuid: selectedItem && selectedItem.uuid,
    // upload_offer_file_uuid: null,
    status: selectedItem && selectedItem.status,
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
          status: yup
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

  const UploadOfferHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    const response = await UpdateOfferStatus(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      // setIsDeletedOffer(false);
      showSuccess(t(`${translationPath}offer-updated-successfully`));
      reloadList();
      onClose();
    } else showError(t(`${translationPath}offer-update-failed`), response);
  }, [errors, state, t, translationPath, reloadList, onClose]);

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
      titleText="form-status-management"
      contentClasses="px-0"
      dialogContent={
        <div className="px-3 mb-4">
          <SharedAutocompleteControl
            isFullWidth
            errors={errors}
            searchKey="search"
            initValuesKey="key"
            isDisabled={isLoading}
            initValuesTitle="status"
            isSubmitted={isSubmitted}
            initValues={offerStatuses}
            stateKey="status"
            errorPath="status"
            onValueChanged={onStateChanged}
            title="status"
            editValue={state.status}
            placeholder="status"
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) => option.status}
            disabledOptions={(option) =>
              (next_approved
                && OffersStatusesEnum.Completed.key === option.key
                && completedOffersCount > 0
                && selectedItem
                && selectedItem.status !== option.key)
              || (OffersStatusesEnum.CompletedAsSecondary.key === option.key
                && (!next_approved
                  || completedOffersCount === 0
                  || (selectedItem
                    && selectedItem.status === OffersStatusesEnum.Completed.key)))
            }
          />
        </div>
      }
      wrapperClasses="form-status-management-dialog-wrapper"
      isSaving={isLoading}
      saveIsDisabled={selectedItem && state.status === selectedItem.status}
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

OfferStatusManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  selectedItem: PropTypes.shape({
    uuid: PropTypes.string,
    status: PropTypes.oneOf(
      Object.values(OffersStatusesEnum).map((item) => item.key),
    ),
  }).isRequired,
  onClose: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  job_uuid: PropTypes.string.isRequired,
  candidate_uuid: PropTypes.string.isRequired,
  next_approved: PropTypes.bool,
  reloadList: PropTypes.func.isRequired,
  // setIsDeletedOffer: PropTypes.func.isRequired,
};
OfferStatusManagementDialog.defaultProps = {
  onClose: undefined,
  next_approved: undefined,
  translationPath: '',
};
