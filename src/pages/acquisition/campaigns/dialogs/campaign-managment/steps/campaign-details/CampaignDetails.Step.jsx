import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import './CampaignDetails.Style.scss';
import { ReviewTypesEnum } from 'enums';
import { ReviewDynamicForm } from '../../../../../shared/Forms';
import { LoaderComponent } from '../../../../../../../components';

export const CampaignDetailsStep = ({
  state,
  schema,
  onSchemaChanged,
  onStateChanged,
  activeItem,
  isSubmitted,
  isRequired,
  errors,
  nextHandler,
  parentTranslationPath,
  translationPath,
  globalIsLoading,
  payAndStartCampaignHandler,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="campaign-details-step-wrapper childs-wrapper">
      {(state?.errors?.length > 0
        && state.errors.map((error) => (
          <div key={error} className={'text-capitalize mb-1 c-error'}>
            {error}{' '}
          </div>
        )))
        || ''}
      <div className="campaign-details-step-body-wrapper">
        <div className="campaign-details-step-body">
          <div className="mb-2">
            <span className="texts-header c-primary">
              {t(`${translationPath}campaign-details`)}
            </span>
          </div>
          <ReviewDynamicForm
            state={state}
            schema={schema}
            onSchemaChanged={onSchemaChanged}
            onStateChanged={onStateChanged}
            isSubmitted={isSubmitted}
            isRequired={isRequired}
            errors={errors}
            campaignUuid={activeItem.uuid}
            reviewType={ReviewTypesEnum.campaignDetails.key}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
      </div>
      <div className="d-flex-v-center-h-end mt-3">
        <ButtonBase
          className="btns theme-outline mb-2 mx-2"
          disabled={globalIsLoading}
          type="submit"
        >
          <LoaderComponent
            isLoading={globalIsLoading}
            isSkeleton
            wrapperClasses="position-absolute w-100 h-100"
            skeletonStyle={{ width: '100%', height: '100%' }}
          />
          <span>{t('Shared:save-and-exit')}</span>
        </ButtonBase>
        {state.totalCost === 0 && (
          <ButtonBase
            className="btns theme-solid bg-green-primary mb-2 mx-2"
            onClick={payAndStartCampaignHandler}
            disabled={globalIsLoading || !state.canStartCampaign}
          >
            <LoaderComponent
              isLoading={globalIsLoading}
              isSkeleton
              wrapperClasses="position-absolute w-100 h-100"
              skeletonStyle={{ width: '100%', height: '100%' }}
            />
            <span>{t(`start-campaign`)}</span>
          </ButtonBase>
        )}
        {state.totalCost > 0 && (
          <ButtonBase
            className="btns theme-solid bg-green-primary mb-2 mx-2"
            onClick={nextHandler}
            disabled={globalIsLoading}
          >
            <span>{t('Shared:next')}</span>
          </ButtonBase>
        )}
      </div>
    </div>
  );
};

CampaignDetailsStep.propTypes = {
  errors: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired, // this is a reference
  onSchemaChanged: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  globalIsLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired,
  nextHandler: PropTypes.func.isRequired,
  translationPath: PropTypes.string,
};
CampaignDetailsStep.defaultProps = {
  translationPath: '',
};
