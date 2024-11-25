import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { getErrorByName, showError, showSuccess } from '../../../../helpers';
import { DialogComponent } from '../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
} from '../../../setups/shared';
import {
  VisaAllocationRequestMoreInfo,
  VisaReservationRequestMoreInfo,
} from '../../../../services';
import {
  VisaRequestsCallLocationsEnum,
  VisaRequestsTypesEnum,
} from '../../../../enums';
import { extendLayout } from 'plotly.js/src/plots/plots';

export const VisaRequestMoreInfoManagementDialog = ({
  request_uuid,
  callLocation,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [state, setState] = useReducer(
    SetupsReducer,
    {
      request_uuid,
      more_info: null,
    },
    SetupsReset,
  );

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
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          request_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          more_info: yup
            .string()
            .nullable()
            .min(
              3,
              `${t('Shared:this-field-must-be-more-than-or-equal')} ${3} ${t(
                'Shared:characters',
              )}`,
            )
            .required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    );
    setErrors(result);
  }, [state, t]);

  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving the stages & pipeline template
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    const response = await ((getCurrentCallLocationEnum().requestType.key
      === VisaRequestsTypesEnum.Reservation.key
      && VisaReservationRequestMoreInfo(state))
      || VisaAllocationRequestMoreInfo(state));
    setIsLoading(false);
    if (response && response.status === 200) {
      window?.ChurnZero?.push([
        'trackEvent',
        (getCurrentCallLocationEnum().requestType.key
          === VisaRequestsTypesEnum.Reservation.key
          && 'EVA-VISA - Reservation Action')
          || 'EVA-VISA - Allocation Action',
        (getCurrentCallLocationEnum().requestType.key
          === VisaRequestsTypesEnum.Reservation.key
          && 'EVA-VISA - Reservation Action')
          || 'EVA-VISA - Allocation Action',
        1,
        {},
      ]);

      showSuccess(t(`${translationPath}request-more-info-saved-successfully`));
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}request-more-info-save-failed`), response);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <DialogComponent
      isWithFullScreen
      titleText="request-more-information"
      maxWidth="sm"
      contentFooterClasses="px-0 pb-0"
      contentClasses="px-3 pb-0"
      wrapperClasses="visa-request-more-info-management-dialog-wrapper"
      dialogContent={
        <div className="visa-request-more-info-management-dialog-content-wrapper px-3">
          <SharedInputControl
            labelValue="comment"
            placeholder="more-info-description"
            errors={errors}
            stateKey="more_info"
            errorPath="more_info"
            editValue={state.more_info}
            multiline
            rows={4}
            isSubmitted={isSubmitted}
            onValueChanged={(newValue) => {
              setState(newValue);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isFullWidth
          />
        </div>
      }
      isOpen={isOpen}
      isSaving={isLoading}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

VisaRequestMoreInfoManagementDialog.propTypes = {
  request_uuid: PropTypes.string.isRequired,
  callLocation: PropTypes.oneOf(
    Object.values(VisaRequestsCallLocationsEnum).map((item) => item.key),
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onSave: PropTypes.func,
};
