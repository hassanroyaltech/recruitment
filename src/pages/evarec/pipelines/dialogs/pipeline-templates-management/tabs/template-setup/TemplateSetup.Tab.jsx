import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './TemplateSetup.Style.scss';
import { ButtonBase } from '@mui/material';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../setups/shared';
import { DynamicFormTypesEnum } from '../../../../../../../enums';
import { LoaderComponent, SwitchComponent } from '../../../../../../../components';
import { GetAllFormsTypes } from '../../../../../../../services';
import Alert from '@mui/material/Alert';

export const TemplateSetupTab = ({
  state,
  isSubmitted,
  isLoading,
  errors,
  onStateChanged,
  parentTranslationPath,
  translationPath,
  onCancelHandler,
  saveHandler,
  activeItem,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  /**
   * @param id
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update the switch
   */
  const onSwitchChangedHandler = (id) => (event, isChecked) => {
    onStateChanged({
      id,
      value: isChecked,
    });
  };
  return (
    <div className="template-setup-tab-wrapper">
      <div className="body-content-wrapper">
        <div className="header-text-x2 mb-4">
          <span>{t(`${translationPath}template-information`)}</span>
        </div>
        <SharedInputControl
          labelValue="template-name"
          placeholder="template-name-ex"
          errors={errors}
          stateKey="title"
          errorPath="title"
          editValue={state.title}
          wrapperClasses="px-0"
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isHalfWidth
        />
        <SharedInputControl
          labelValue="description"
          placeholder="description-placeholder"
          errors={errors}
          stateKey="description"
          errorPath="description"
          editValue={state.description}
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isFullWidth
          multiline
          rows={4}
        />
        <SharedAutocompleteControl
          editValue={state.tags}
          placeholder="enter-search-labels"
          labelValue="search-labels"
          // title="condition"
          isFreeSolo
          stateKey="tags"
          errorPath="tags"
          onValueChanged={onStateChanged}
          isSubmitted={isSubmitted}
          errors={errors}
          // initValues={operations}
          // initValuesTitle="value"
          type={DynamicFormTypesEnum.array.key}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isFullWidth
        />
        <div className="d-inline-flex">
          <SwitchComponent
            idRef="isAbilityToMoveFormBuilderSwitchRef"
            label="ability-to-move-form-builder"
            isChecked={state.ability_to_move_form_builder}
            isReversedLabel
            isFlexEnd
            switchLabelClasses="fw-bold c-black-light"
            onChange={(event, isChecked) => {
              onSwitchChangedHandler('ability_to_move_form_builder')(
                event,
                isChecked,
              );
              if (
                !isChecked
                && state.form_builder_types
                && state.form_builder_types.length > 0
              )
                onStateChanged({
                  id: 'form_builder_types',
                  value: [],
                });
            }}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
        <div className="mb-2">
          <span className="description-text">
            {t(`${translationPath}ability-to-move-form-builder-description`)}
          </span>
        </div>
        {state.ability_to_move_form_builder && (
          <>
            <SharedAPIAutocompleteControl
              isHalfWidth
              inlineLabel="form-types"
              placeholder="select-form-types"
              errors={errors}
              stateKey="form_builder_types"
              searchKey="search"
              editValue={state.form_builder_types}
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              translationPath={translationPath}
              getDataAPI={GetAllFormsTypes}
              parentTranslationPath={parentTranslationPath}
              errorPath="form_builder_types"
              getOptionLabel={(option) => option.name || 'N/A'}
              type={DynamicFormTypesEnum.array.key}
              extraProps={{
                ...(state.form_builder_types && {
                  with_than: state.form_builder_types,
                }),
              }}
            />
            <Alert severity="warning">
              {t(
                `${translationPath}ability-to-move-form-builder-warning-description`,
              )}
            </Alert>
          </>
        )}
        <div className="separator-h mt-2" />
        <div className="d-inline-flex">
          <SwitchComponent
            idRef="isSamePositionSwitchRef"
            label="same-position"
            isChecked={state.is_same_position}
            isReversedLabel
            isFlexEnd
            switchLabelClasses="fw-bold c-black-light"
            onChange={onSwitchChangedHandler('is_same_position')}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
        <div className="mb-2">
          <span className="description-text">
            {t(`${translationPath}same-position-description`)}
          </span>
        </div>
        {/*<div className="separator-h mt-2" />*/}
        {/*<div className="d-inline-flex">*/}
        {/*  <SwitchComponent*/}
        {/*    idRef="visibleCandidateSwitchRef"*/}
        {/*    label="stages-visible-on-career-page"*/}
        {/*    isChecked={state.is_visible_on_candidate}*/}
        {/*    isReversedLabel*/}
        {/*    isFlexEnd*/}
        {/*    switchLabelClasses="fw-bold c-black-light"*/}
        {/*    onChange={onSwitchChangedHandler('is_visible_on_candidate')}*/}
        {/*    isDisabled*/}
        {/*    parentTranslationPath={parentTranslationPath}*/}
        {/*  />*/}
        {/*</div>*/}
        {/*<div>*/}
        {/*  <span className="description-text">*/}
        {/*    {t(`${translationPath}stages-visible-on-career-page-description`)}*/}
        {/*  </span>*/}
        {/*</div>*/}
      </div>
      <div className="separator-h mt-4" />
      <div className="d-flex-v-center-h-end flex-wrap pt-3 px-2">
        <ButtonBase
          className="btns theme-transparent mx-2 mb-3"
          onClick={onCancelHandler}
        >
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <ButtonBase
          className={`btns theme-solid mx-2 mb-3${
            (activeItem && ' bg-secondary') || ''
          }`}
          disabled={isLoading}
          onClick={saveHandler(-1)}
        >
          <LoaderComponent
            isLoading={isLoading}
            isSkeleton
            wrapperClasses="position-absolute w-100 h-100"
            skeletonStyle={{ width: '100%', height: '100%' }}
          />
          <span>
            {t(`${translationPath}${(activeItem && 'update') || 'create'}-template`)}
          </span>
        </ButtonBase>
      </div>
    </div>
  );
};

TemplateSetupTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onCancelHandler: PropTypes.func.isRequired,
  saveHandler: PropTypes.func.isRequired,
  activeItem: PropTypes.instanceOf(Object),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
TemplateSetupTab.defaultProps = {
  activeItem: null,
};
