import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import './ContractDetails.Style.scss';
import { ReviewTypesEnum } from 'enums';
import { ReviewDynamicForm } from '../../../../../shared/Forms';
import { LoaderComponent } from '../../../../../../../components';

export const ContractDetailsStep = ({
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
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="job-details-step-wrapper childs-wrapper">
      <div className="job-details-step-body-wrapper">
        <div className="job-details-step-body">
          <div className="mb-2">
            <span className="texts-header c-primary">
              {t(`${translationPath}contract-details`)}
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
            reviewType={ReviewTypesEnum.contract.key}
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
        <ButtonBase
          className="btns theme-solid bg-green-primary mb-2 mx-2"
          onClick={nextHandler}
          disabled={globalIsLoading}
        >
          <span>{t('Shared:next')}</span>
        </ButtonBase>
      </div>
    </div>
  );
};

ContractDetailsStep.propTypes = {
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
ContractDetailsStep.defaultProps = {
  translationPath: 'ContractDetailsStep.',
};
