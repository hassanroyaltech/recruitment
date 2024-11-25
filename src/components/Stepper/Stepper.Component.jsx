import React, { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Stepper, Step, StepButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './Stepper.Style.scss';

export const StepperComponent = memo(
  ({
    activeStep,
    steps,
    onStepperClick,
    wrapperClasses,
    stepClasses,
    // stepLabelClasses,
    stepButtonClasses,
    // progressTextClasses,
    // progressValueInput,
    labelInput,
    completed,
    completedAll,
    hasError,
    isValidateOnlyActiveIndex,
    isSubmitted,
    isDisabledAll,
    isDisabled,
    parentTranslationPath,
    translationPath,
    dynamicComponentProps,
    componentInput,
    withDynamicComponents,
    dynamicComponentLocationChanger,
    alternativeLabel,
    nonLinear,
    connector,
    icon,
    isWithControlledCompleted,
  }) => {
    const { t } = useTranslation([parentTranslationPath]);
    const [localDynamicProps, setLocalDynamicProps] = useState(
      () => dynamicComponentProps,
    );
    const [localDynamicComponent, setLocalDynamicComponent] = useState(null);
    const stepperClickHandler = useCallback(
      (index, item) => () => {
        if (onStepperClick) onStepperClick(index, item);
      },
      [onStepperClick],
    );
    const dynamicComponentInit = useCallback(() => {
      const localActiveStep = steps.find(
        (item, index) => index === activeStep && item[componentInput],
      );
      if (!localActiveStep) return;
      const Component = localActiveStep[componentInput];
      const toDrowComponent = (
        <Component
          key={`dynamicComponentRef${localActiveStep[labelInput] || ''}`}
          {...(localDynamicProps || {})}
          {...(localActiveStep.props || {})}
        />
      );
      if (dynamicComponentLocationChanger)
        dynamicComponentLocationChanger(toDrowComponent);
      else setLocalDynamicComponent(toDrowComponent);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [steps, componentInput, labelInput, localDynamicProps, activeStep]);
    const getIsCompleted = useCallback(
      (index, item) => completedAll || (completed && completed(index, item)),
      [completed, completedAll],
    );
    const getIsInvalid = useCallback(
      (index, item) =>
        hasError
        && !getIsCompleted(index, item)
        && ((isSubmitted && !isValidateOnlyActiveIndex)
          || activeStep > index
          || (isValidateOnlyActiveIndex && activeStep === index)),
      [activeStep, getIsCompleted, hasError, isSubmitted, isValidateOnlyActiveIndex],
    );
    useEffect(() => {
      if (localDynamicProps || withDynamicComponents) dynamicComponentInit();
    }, [activeStep, dynamicComponentInit, localDynamicProps, withDynamicComponents]);
    useEffect(() => {
      if (
        dynamicComponentProps
        && Object.entries(dynamicComponentProps).findIndex(
          (item) =>
            !localDynamicProps
            || (typeof localDynamicProps[item[0]] !== 'boolean'
              && !localDynamicProps[item[0]])
            || (typeof localDynamicProps[item[0]] !== 'function'
              && localDynamicProps[item[0]] !== item[1]),
        ) !== -1
      )
        setLocalDynamicProps(dynamicComponentProps);
    }, [dynamicComponentProps, localDynamicProps]);
    return (
      <>
        <Stepper
          alternativeLabel={alternativeLabel}
          nonLinear={nonLinear}
          activeStep={activeStep}
          className={`stepper-wrapper ${wrapperClasses}`}
          connector={connector}
        >
          {steps
            && steps.map((item, index) => (
              <Step
                className={`step-wrapper ${stepClasses}${
                  (getIsInvalid(index, item) && ' has-error-step') || ''
                }
              ${(isWithControlledCompleted && ' is-with-completed') || ''}${
                (activeStep === index && ' active-step') || ''
              }`}
                key={`${item[labelInput]}${index + 1}`}
                completed={
                  (isWithControlledCompleted
                    && !getIsInvalid(index, item)
                    && getIsCompleted(index, item))
                  || undefined
                }
              >
                <StepButton
                  className={`step-button-wrapper ${stepButtonClasses}`}
                  completed={
                    (isWithControlledCompleted
                      && !getIsInvalid(index, item)
                      && getIsCompleted(index, item))
                    || undefined
                  }
                  onClick={stepperClickHandler(index, item)}
                  disabled={isDisabledAll || (isDisabled && isDisabled(index, item))}
                  icon={
                    (icon
                      && icon(
                        index,
                        getIsCompleted(index, item),
                        getIsInvalid(index, item),
                        isDisabledAll || (isDisabled && isDisabled(index, item)),
                      ))
                    || undefined
                  }
                >
                  {(translationPath !== undefined
                    && t(`${translationPath}${item[labelInput]}`))
                    || item[labelInput]}
                </StepButton>
              </Step>
            ))}
        </Stepper>
        {localDynamicComponent || null}
      </>
    );
  },
);

StepperComponent.displayName = 'StepperComponent';

StepperComponent.propTypes = {
  activeStep: PropTypes.number.isRequired,
  steps: PropTypes.instanceOf(Array).isRequired,
  labelInput: PropTypes.string,
  dynamicComponentProps: PropTypes.instanceOf(Object),
  completedAll: PropTypes.bool,
  alternativeLabel: PropTypes.bool,
  nonLinear: PropTypes.bool,
  isValidateOnlyActiveIndex: PropTypes.bool,
  isDisabledAll: PropTypes.bool,
  isDisabled: PropTypes.func,
  hasError: PropTypes.bool,
  isWithControlledCompleted: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  completed: PropTypes.func,
  onStepperClick: PropTypes.func,
  wrapperClasses: PropTypes.string,
  stepClasses: PropTypes.string,
  // stepLabelClasses: PropTypes.string,
  stepButtonClasses: PropTypes.string,
  // progressTextClasses: PropTypes.string,
  // progressValueInput: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  componentInput: PropTypes.string,
  withDynamicComponents: PropTypes.bool,
  dynamicComponentLocationChanger: PropTypes.func,
  connector: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
};
StepperComponent.defaultProps = {
  onStepperClick: undefined,
  labelInput: 'label',
  // progressValueInput: undefined,
  dynamicComponentProps: undefined,
  completedAll: undefined,
  completed: undefined,
  isDisabled: undefined,
  isDisabledAll: false,
  isSubmitted: false,
  hasError: false,
  isWithControlledCompleted: false,
  isValidateOnlyActiveIndex: false,
  nonLinear: false,
  alternativeLabel: undefined,
  wrapperClasses: '',
  stepClasses: '',
  // stepLabelClasses: 'step-label-wrapper',
  stepButtonClasses: '',
  // progressTextClasses: 'step-progress-text-wrapper',
  parentTranslationPath: '',
  translationPath: undefined,
  componentInput: 'component',
  withDynamicComponents: undefined,
  dynamicComponentLocationChanger: undefined,
  connector: undefined,
  icon: undefined,
};
