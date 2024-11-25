// React and reactstrap
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Col, Label, Row } from 'reactstrap';

// Our standard loader
import Loader from 'components/Elevatus/Loader';

// API urls
import { getUniqueID } from 'shared/utils';

import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import {
  AutocompleteComponent,
  CheckboxesComponent,
  TextEditorComponent,
} from '../../../../components';
import {
  GetAllSetupsNationality,
  GetAllSetupsCountries,
  GetAllSetupsGender,
  GetAllSetupsLanguages,
  GetAllSetupsLocations,
  GPTGenerateJobDescription,
  GPTGenerateJobRequirements,
  GPTOptimizeJobRequirements,
  GPTOptimizeJobDescription,
} from '../../../../services';
import {
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../setups/shared';
import { DynamicFormTypesEnum, SystemActionsEnum } from '../../../../enums';
import { ButtonBase } from '@mui/material';
import { ChatGPTIcon } from '../../../../assets/icons';
import PopoverComponent from '../../../../components/Popover/Popover.Component';
import { showError, showSuccess } from '../../../../helpers';

const translationPath = '';
const parentTranslationPath = 'CreateJob';

/**
 * This is the advanced form
 * @param form
 * @param setForm
 * @param helpers
 * @returns {JSX.Element}
 * @constructor
 */
export default function AdvancedForm({
  form,
  setForm,
  helpers,
  job,
  isEdit,
  template,
  setActiveField,
  gptDetails,
  isTemplate,
}) {
  const { t } = useTranslation(parentTranslationPath);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const [localActiveField, setLocalActiveField] = useState({});
  // const [mapCenter, setMapCenter] = useState(
  //   (form?.address && {
  //     lat: +form?.address.split(',')[0],
  //     lng: +form?.address.split(',')[1],
  //   })
  //     || null
  // );
  /**
   * GPA mapping
   */
  const gpaDescription = [
    { id: 90, title: t(`${translationPath}excellent`) },
    { id: 80, title: t(`${translationPath}very-good`) },
    { id: 70, title: t(`${translationPath}good`) },
    { id: 60, title: t(`${translationPath}pass`) },
    { id: 50, title: t(`${translationPath}weak`) },
  ];

  /**
   * Languages Scale
   */
  const languagesScale = [
    { uuid: 1, title: t(`${translationPath}elementary-proficiency`) },
    { uuid: 2, title: t(`${translationPath}limited-working-proficiency`) },
    { uuid: 3, title: t(`${translationPath}professional-working-proficiency`) },
    { uuid: 4, title: t(`${translationPath}full-professional-proficiency`) },
    { uuid: 5, title: t(`${translationPath}native-or-bilingual-proficiency`) },
  ];

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isGPTLoading, setIsGPTLoading] = useState(false);

  /**
   * Keep state as loading while API helpers are being retrieved
   */
  useEffect(() => {
    setIsLoading(helpers.some((h) => !h));
  }, [helpers]);

  const onFormEvent = (field) => (e) => {
    const v = e.target.value;
    setForm((items) => ({ ...items, [field]: v }));
  };

  /**
   * When checking a checkbox
   * @param field
   * @returns {function(*): void}
   */
  const onCheckboxFormEvent = (field) => (e, isChecked) => {
    setForm((items) => ({ ...items, [field]: isChecked }));
  };

  /**
   * Add a language
   */
  const addLanguage = () => {
    if (!form) return;
    if (!form.languages) setForm((items) => ({ ...items, languages: [] }));

    setForm((items) => ({
      ...items,
      languages: [
        ...items.languages,
        { uuid: getUniqueID(), score: null, id: getUniqueID() },
      ],
    }));
  };

  /**
   * Remove a language by index
   * @param index
   */
  const removeLanguage = (index) => {
    if (form?.languages?.length && index < form?.languages?.length) {
      const newLangs = form.languages;
      newLangs.splice(index, 1);
      setForm((items) => ({
        ...items,
        languages: newLangs,
      }));
    }
  };

  /**
   * Get value of language helper
   * @param array
   * @param currentValue
   * @param key
   * @returns {*}
   */
  const getValue = (array, currentValue, key) =>
    array.find((item) => item[key] === currentValue) || null;
  /**
   * @param newLocation
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the new location(s)
   * from search of child google map
   */
  // const onSearchLocationsChange = (newLocation) => {
  //   const localLocation
  //     = (form?.address && {
  //       lat: +form?.address.split(',')[0],
  //       lng: +form?.address.split(',')[1],
  //     })
  //     || null;
  //   if (
  //     localLocation
  //     && newLocation
  //     && newLocation.length > 0
  //     && localLocation.lng === newLocation[0].lng
  //     && localLocation.lat === newLocation[0].lat
  //   )
  //     return;
  //   setMapCenter(
  //     (item) => (newLocation && newLocation.length > 0 && newLocation[0]) || item
  //   );
  //   if (setForm)
  //     setForm((items) => ({
  //       ...items,
  //       address:
  //         (newLocation
  //           && newLocation.length > 0
  //           && `${newLocation[0].lat},${newLocation[0].lng}`)
  //         || '',
  //     }));
  // };
  const gptGenerateJobDescriptionOrRequirements = useCallback(
    async (canRegenerate = true) => {
      if (!localActiveField?.title) return;
      setPopoverAttachedWith(null);
      try {
        setIsGPTLoading(true);
        const res = await (localActiveField?.title === 'description'
          ? GPTGenerateJobDescription
          : GPTGenerateJobRequirements)(gptDetails);
        setIsGPTLoading(false);
        setPopoverAttachedWith(null);
        if (res && res.status === 200) {
          const results = res?.data?.result;
          if (!results)
            if (canRegenerate) return gptGenerateJobDescriptionOrRequirements(false);
            else {
              showError(t('Shared:failed-to-get-saved-data'), res);
              return;
            }
          showSuccess(t(`Shared:success-get-gpt-help`));
          if (localActiveField?.title === 'description')
            setForm((items) => ({
              ...items,
              description: results?.job_description || '',
            }));
          else
            setForm((items) => ({
              ...items,
              requirements: (results || []).join('<br/>'),
            }));
        } else showError(t('Shared:failed-to-get-saved-data'), res);
      } catch (error) {
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    },
    [localActiveField?.title, gptDetails, t, setForm],
  );

  const gptOptimizeJobDescriptionOrRequirements = useCallback(
    async (canRegenerate = true) => {
      if (!localActiveField?.title) return;
      setPopoverAttachedWith(null);
      try {
        setIsGPTLoading(true);
        const res = await (localActiveField?.title === 'description'
          ? GPTOptimizeJobDescription
          : GPTOptimizeJobRequirements)({
          ...gptDetails,
          [localActiveField.title]: [localActiveField.value],
        });
        setIsGPTLoading(false);
        setPopoverAttachedWith(null);
        if (res && res.status === 200) {
          const results = res?.data?.result;
          if (!results)
            if (canRegenerate) return gptOptimizeJobDescriptionOrRequirements(false);
            else {
              showError(t('Shared:failed-to-get-saved-data'), res);
              return;
            }
          showSuccess(t(`Shared:success-get-gpt-help`));
          setForm((items) => ({
            ...items,
            [localActiveField.title]: (results || []).join('<br/>'),
          }));

          // if (!callBack) setQuestions(localeQuestions);
          // else callBack(localeQuestions);
        } else showError(t('Shared:failed-to-get-saved-data'), res);
      } catch (error) {
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    },
    [localActiveField, gptDetails, t, setForm],
  );
  const arrayCheckItem = useCallback(
    (array, item) => (array || []).includes(item),
    [],
  );
  const handleChangeHiddenItems = useCallback(
    (field, array = []) =>
      () => {
        let localeHiddenColumns = [...array];
        const idx = localeHiddenColumns.indexOf(field);
        if (idx !== -1) localeHiddenColumns.splice(idx, 1);
        else localeHiddenColumns.push(field);
        setForm((items) => ({ ...items, hidden_columns: localeHiddenColumns }));
      },
    [setForm],
  );

  return isLoading ? (
    <CardBody className="text-center" style={{ height: '300px' }}>
      <Row>
        <Col sm="12">
          <Loader width="500px" height="300px" speed={1} color="primary" />
        </Col>
      </Row>
    </CardBody>
  ) : (
    <Card className="step-card">
      <Row>
        <Col xs="12" className="d-flex flex-row">
          <h6 className="h6">{t(`${translationPath}advanced`)}</h6>
        </Col>
      </Row>
      <Row className="mt-4 mx--2 text-gray">
        <Col xs="12" sm="6" className="mb-4 px-2">
          <SharedAPIAutocompleteControl
            // isEntireObject
            fullWidth
            // errors={errors}
            title={t(`${translationPath}nationality`)}
            placeholder={t(`${translationPath}nationality`)}
            stateKey="nationality_uuid"
            errorPath="nationality_uuid"
            // isSubmitted={isSubmitted}
            editValue={form?.nationality_uuid || null}
            onValueChanged={(e) => {
              setForm((items) => ({ ...items, [e.id]: e.value }));
            }}
            idRef="Nationality"
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en || ''
            }
            type={DynamicFormTypesEnum.array.key}
            extraProps={{ with_than: form?.nationality_uuid || null }}
            getDataAPI={GetAllSetupsNationality}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            searchKey="search"
            isDisabled={!!template}
          />
        </Col>
        <Col xs="12" sm="6" className="mb-4 px-2">
          <SharedAPIAutocompleteControl
            isEntireObject
            fullWidth
            // errors={errors}
            title={t(`${translationPath}country`)}
            placeholder={t(`${translationPath}country`)}
            stateKey="country_uuid"
            errorPath="country_uuid"
            // isSubmitted={isSubmitted}
            editValue={form?.country_uuid?.uuid}
            onValueChanged={(e) => {
              setForm((items) => ({ ...items, [e.id]: e.value }));
            }}
            idRef="Country"
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            type={DynamicFormTypesEnum.select.key}
            extraProps={{
              with_than:
                (form?.country_uuid?.uuid && [form?.country_uuid?.uuid]) || null,
            }}
            getDataAPI={GetAllSetupsCountries}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            searchKey="search"
            isDisabled={!!template}
          />
        </Col>

        <Col xs="12" sm="6" className="mb-4 px-3">
          <SharedInputControl
            editValue={form?.city || ''}
            onValueChanged={(e) =>
              setForm((items) => ({ ...items, [e.id]: e.value }))
            }
            stateKey="city"
            isDisabled={!!template}
            idRef="city"
            title={t(`${translationPath}city`)}
            themeClass="theme-solid"
            placeholder={t(`${translationPath}city`)}
            // errors,
            // errorPath,
            // isSubmitted,
            isFullWidth
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            wrapperClasses="px-2 mb-0"
          />
          <CheckboxesComponent
            wrapperClasses={'px-2'}
            idRef="hideJobCityRef"
            singleChecked={arrayCheckItem(form?.hidden_columns || [], 'city')}
            onSelectedCheckboxChanged={handleChangeHiddenItems(
              'city',
              form?.hidden_columns || [],
            )}
            label={t(`${translationPath}hide-city`)}
            isDisabled={!!template}
          />
        </Col>
        {/* <Col xs="12" sm="6" className="mb-4 px-4">
          <GoogleMapPopoverComponent
            defaultZoom={16}
            locations={
              (form?.address && [
                {
                  lat: +form?.address.split(',')[0],
                  lng: +form?.address.split(',')[1],
                },
              ])
              || []
            }
            center={mapCenter}
            onSearchLocationsChange={onSearchLocationsChange}
            onMapClicked={(newLocation) => {
              if (setForm)
                setForm((items) => ({
                  ...items,
                  address:
                    (newLocation && `${newLocation.lat},${newLocation.lng}`) || '',
                }));
            }}
            value={form?.address || ''}
            isDisabledInput
            label="location"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isDisabled={!!template} // check
          />
        </Col> */}

        <Col xs="12" sm="6" className="mb-4 px-2">
          <SharedAPIAutocompleteControl
            fullWidth
            // errors={errors}
            title={t(`${translationPath}location`)}
            placeholder={t(`${translationPath}location`)}
            stateKey="location_uuid"
            errorPath="location_uuid"
            // isSubmitted={isSubmitted}
            editValue={form?.location_uuid}
            onValueChanged={(e) => {
              setForm((items) => ({ ...items, [e.id]: e.value }));
            }}
            idRef="location"
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            type={DynamicFormTypesEnum.select.key}
            extraProps={{
              with_than: (form?.location_uuid && [form?.location_uuid]) || null,
            }}
            getDataAPI={GetAllSetupsLocations}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            searchKey="search"
            wrapperClasses="mb-0"
            controlWrapperClasses="mb-0"
            // isDisabled={!!template}
          />
          <CheckboxesComponent
            wrapperClasses={'px-3'}
            idRef="hideJobLocationRef"
            singleChecked={arrayCheckItem(
              form?.hidden_columns || [],
              'location_uuid',
            )}
            onSelectedCheckboxChanged={handleChangeHiddenItems(
              'location_uuid',
              form?.hidden_columns || [],
            )}
            label={t(`${translationPath}hide-location`)}
            isDisabled={!!template}
          />
        </Col>

        <Col xs="12" sm="6" className="mb-4 px-2">
          <SharedAPIAutocompleteControl
            isEntireObject
            fullWidth
            // errors={errors}
            title={t(`${translationPath}gender`)}
            placeholder={t(`${translationPath}gender`)}
            stateKey="gender"
            errorPath="gender"
            // isSubmitted={isSubmitted}
            editValue={form?.gender?.uuid}
            onValueChanged={(e) => {
              setForm((items) => ({ ...items, [e.id]: e.value }));
            }}
            idRef="gender"
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            type={DynamicFormTypesEnum.select.key}
            extraProps={{
              with_than: (form?.gender?.uuid && [form?.gender?.uuid]) || null,
            }}
            getDataAPI={GetAllSetupsGender}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            searchKey="search"
            isDisabled={!!template}
          />
        </Col>

        <Col xs="12" sm="6" className="mb-3 px-2">
          <AutocompleteComponent
            idRef="GPA"
            getOptionLabel={(option) => (option.title ? option.title : '')}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            value={form?.gpa || null}
            data={gpaDescription}
            inputLabel={t(`${translationPath}gpa`)}
            inputPlaceholder={t(`${translationPath}gpa`)}
            isLoading={isLoading}
            themeClass="theme-solid"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(e, value) => {
              setForm((items) => ({ ...items, gpa: value }));
            }}
            autoHighlight
            wrapperClasses="px-3"
            isDisabled={!!template} //check later
          />
        </Col>
        <Col xs="12" sm="6" className="d-inline-flex mb-3 px-3">
          <SharedInputControl
            editValue={form?.min_salary || ''}
            onValueChanged={(e) =>
              setForm((items) => ({ ...items, [e.id]: e.value }))
            }
            stateKey="min_salary"
            // isDisabled,
            idRef="MinimumSalary"
            title={t(`${translationPath}minimum-salary`)}
            themeClass="theme-solid"
            placeholder={t(`${translationPath}minimum-salary`)}
            // errors,
            // errorPath,
            // isSubmitted,
            isFullWidth
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            type="number"
            wrapperClasses="px-2"
            min={0}
            isDisabled={!!template}
          />
        </Col>
        <Col xs="12" sm="6" className="d-inline-flex mb-3 px-3">
          <SharedInputControl
            editValue={form?.max_salary || ''}
            onValueChanged={(e) =>
              setForm((items) => ({ ...items, [e.id]: e.value }))
            }
            stateKey="max_salary"
            // isDisabled,
            idRef="MaximumSalary"
            title={t(`${translationPath}maximum-salary`)}
            themeClass="theme-solid"
            placeholder={t(`${translationPath}maximum-salary`)}
            // errors,
            // errorPath,
            // isSubmitted,
            isFullWidth
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            type="number"
            wrapperClasses="px-2"
            min={0}
            isDisabled={!!template}
          />
        </Col>

        <Col xs="12" sm="6" className="mb-2 px-2">
          <CheckboxesComponent
            idRef="questionPostApplicationRef"
            singleChecked={form.visa_sponsorship}
            onSelectedCheckboxChanged={onCheckboxFormEvent('visa_sponsorship')}
            label={t(`${translationPath}salary-description`)}
            isDisabled={!!template}
          />
        </Col>
        <Col xs="12" sm="6" className="d-inline-flex mb-2 px-2">
          <CheckboxesComponent
            idRef="questionWillingToTravelRef"
            singleChecked={form.willing_to_travel}
            onSelectedCheckboxChanged={onCheckboxFormEvent('willing_to_travel')}
            label={t(`${translationPath}willing-to-travel`)}
            isDisabled={!!template}
          />
        </Col>
        <Col xs="12" sm="6" className="d-inline-flex mb-2 px-2">
          <CheckboxesComponent
            idRef="questionWillingtoRelocateRef"
            singleChecked={form.willing_to_relocate}
            onSelectedCheckboxChanged={onCheckboxFormEvent('willing_to_relocate')}
            label={t(`${translationPath}willing-to-relocate`)}
            isDisabled={!!template}
          />
        </Col>
        <Col xs="12" sm="6" className="d-inline-flex mb-2 px-2">
          <CheckboxesComponent
            idRef="questionOwnsaCarRef"
            singleChecked={form.owns_a_car}
            onSelectedCheckboxChanged={onCheckboxFormEvent('owns_a_car')}
            label={t(`${translationPath}owns-a-car`)}
            isDisabled={!!template}
          />
        </Col>
      </Row>

      <hr />
      {form?.languages?.map((language, index, languages) => (
        <Row
          className="mx--2 text-gray position-relative"
          key={`languageScoreKey${index}`}
        >
          <Col xs="12" sm="6" className="mb-4 px-2">
            <SharedAPIAutocompleteControl
              isEntireObject
              fullWidth
              // errors={errors}
              title={t(`${translationPath}language`)}
              placeholder={t(`${translationPath}language`)}
              stateKey="career_level_uuid"
              errorPath="career_level_uuid"
              // isSubmitted={isSubmitted}
              editValue={language?.uuid}
              onValueChanged={(e) => {
                setForm((items) => {
                  const localLanguages = [...(items?.languages || [])];
                  localLanguages[index] = {
                    ...(localLanguages[index] || {}),
                    uuid: (e.value && e.value.uuid) || null,
                  };
                  return {
                    ...items,
                    languages: localLanguages,
                  };
                });
              }}
              idRef={`${index}__language__uuid`}
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              type={DynamicFormTypesEnum.select.key}
              extraProps={{
                with_than:
                  (getValue(languages, language?.uuid, 'uuid')?.uuid && [
                    getValue(languages, language?.uuid, 'uuid')?.uuid,
                  ])
                  || null,
              }}
              getDataAPI={GetAllSetupsLanguages}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              autoHighlight
              searchKey="search"
              isDisabled={!!template}
            />
          </Col>
          <Col xs="3" sm="5" className="mb-2 px-2">
            <AutocompleteComponent
              idRef={`${index}__languages__score`}
              getOptionLabel={(option) => (option.title ? option.title : '')}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              value={getValue(languagesScale, language?.score, 'uuid')}
              data={languagesScale}
              inputLabel={t(`${translationPath}proficiency-level`)}
              inputPlaceholder={t(`${translationPath}proficiency-level`)}
              isLoading={isLoading}
              themeClass="theme-solid"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(e, value) => {
                setForm((items) => {
                  const localLanguages = [...(items?.languages || [])];
                  localLanguages[index] = {
                    ...(localLanguages[index] || {}),
                    score: (value && value.uuid) || null,
                  };
                  return {
                    ...items,
                    languages: localLanguages,
                  };
                });
              }}
              autoHighlight
              wrapperClasses="px-3"
              isDisabled={!!template}
            />
          </Col>

          {index < form?.languages?.length - 1 ? (
            <ButtonBase
              onClick={() => removeLanguage(index)}
              disabled={!!template}
              className="btns-icon theme-transparent mx-1"
            >
              <span className={SystemActionsEnum.delete.icon} />
            </ButtonBase>
          ) : (
            <Col>
              <ButtonBase
                onClick={addLanguage}
                disabled={!!template}
                className="btns-icon theme-transparent mx-1"
              >
                <span className={SystemActionsEnum.add.icon} />
              </ButtonBase>
              {form?.languages?.length > 1 && (
                <ButtonBase
                  onClick={() => removeLanguage(index)}
                  disabled={!!template}
                  className="btns-icon theme-transparent mx-1"
                >
                  <span className={SystemActionsEnum.delete.icon} />
                </ButtonBase>
              )}
            </Col>
          )}
        </Row>
      ))}
      <hr />
      <Row className="mt-3">
        <Col xs="12">
          <div className="d-flex-v-center-h-between">
            <div className="d-inline-flex-center  mb-3">
              <Label className="d-flex align-items-center">
                {t(`${translationPath}description`)}
              </Label>
              <ButtonBase
                onClick={() =>
                  setActiveField({
                    type: 'textarea',
                    title: 'description',
                    setFunc: setForm,
                    is_with_chatGPT: true,
                    gptDetails,
                  })
                }
                disabled={!!template}
                className="btns-icon theme-transparent mx-1 mb-1"
              >
                <span className={SystemActionsEnum.add.icon} />
              </ButtonBase>
            </div>
            {isTemplate && (
              <ButtonBase
                onClick={(e) => {
                  setPopoverAttachedWith(e.target);
                  setLocalActiveField({
                    title: 'description',
                    value: form?.description,
                  });
                }}
                className="btns-icon theme-solid mx-2 mb-3"
                disabled={isGPTLoading}
              >
                {isGPTLoading && localActiveField?.title === 'description' ? (
                  <span className="fas fa-circle-notch fa-spin m-1" />
                ) : (
                  <ChatGPTIcon />
                )}
              </ButtonBase>
            )}
          </div>
          <TextEditorComponent
            idRef="editor-1"
            height={250}
            editorValue={form?.description || ''}
            onEditorChange={(content) => {
              setForm((items) => ({ ...items, description: content }));
            }}
            isDisabled={!!template}
            hideFonts
          />
        </Col>
      </Row>
      <br />
      <Row className="mt-3">
        <Col xs="12">
          <div className="d-flex-v-center-h-between">
            <div className="d-inline-flex-center  mb-3">
              <Label className="d-flex align-items-center">
                {t(`${translationPath}requirements`)}
              </Label>
              <ButtonBase
                onClick={() =>
                  setActiveField({
                    type: 'textarea',
                    title: 'requirements',
                    setFunc: setForm,
                    is_with_chatGPT: true,
                    gptDetails,
                  })
                }
                disabled={!!template}
                className="btns-icon theme-transparent mx-1 mb-1"
              >
                <span className={SystemActionsEnum.add.icon} />
              </ButtonBase>
            </div>
            {isTemplate && (
              <ButtonBase
                onClick={(e) => {
                  setPopoverAttachedWith(e.target);
                  setLocalActiveField({
                    title: 'requirements',
                    value: form?.requirements,
                  });
                }}
                className="btns-icon theme-solid mx-2 mb-3"
                disabled={isGPTLoading}
              >
                {isGPTLoading && localActiveField?.title === 'requirements' ? (
                  <span className="fas fa-circle-notch fa-spin m-1" />
                ) : (
                  <ChatGPTIcon />
                )}
              </ButtonBase>
            )}
          </div>
          <TextEditorComponent
            idRef="editor-2"
            editorValue={form?.requirements || ''}
            height={250}
            onEditorChange={(content) => {
              setForm((items) => ({ ...items, requirements: content }));
              onFormEvent('requirements');
            }}
            isDisabled={!!template}
            hideFonts
          />
        </Col>
      </Row>
      <hr />
      <Row className="mx--2 text-gray">
        {job === true && (
          <Col xs="12" sm="6" className="mb-2 px-2 mb-4">
            <AutocompleteComponent
              isDisabled={form.total_candidates}
              idRef="ProfileBuilder"
              getOptionLabel={(option) => (option.title ? option.title : '')}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              value={
                getValue(helpers[2], form?.profile_builder_uuid, 'uuid')
                || form?.profile_builder_uuid
              }
              data={helpers[2]}
              inputLabel={t(`${translationPath}profile-builder`)}
              inputPlaceholder={t(`${translationPath}profile-builder`)}
              isLoading={isLoading}
              themeClass="theme-solid"
              isRequired
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(e, value) => {
                setForm((items) => ({
                  ...items,
                  profile_builder_uuid: (value && value.uuid) || null,
                }));
              }}
              autoHighlight
            />
          </Col>
        )}
        <Col xs="12" sm="6" className="mb-2 px-2 mb-4">
          <AutocompleteComponent
            isDisabled={form.total_candidates}
            idRef="SelectEvaluation"
            getOptionLabel={(option) => (option.title ? option.title : '')}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            value={getValue(
              helpers[0],
              isEdit ? form?.evaluation_uuid?.uuid : form?.evaluation_uuid,
              'uuid',
            )}
            data={helpers[0]}
            inputLabel={t(`${translationPath}select-evaluation`)}
            inputPlaceholder={t(`${translationPath}select-evaluation`)}
            isLoading={isLoading}
            themeClass="theme-solid"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(e, value) => {
              if (isEdit)
                setForm((items) => ({
                  ...items,
                  evaluation_uuid: value || null,
                }));
              else
                setForm((items) => ({
                  ...items,
                  evaluation_uuid: (value && value.uuid) || null,
                }));
            }}
            autoHighlight
          />
        </Col>
        {job && (
          <Col xs="12" sm="6" className="mb-2 px-2">
            <AutocompleteComponent
              isDisabled={form.total_candidates}
              idRef="SelectCategory"
              getOptionLabel={(option) => (option.title ? option.title : '')}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              value={getValue(helpers[1], form?.category_uuid, 'uuid')}
              data={helpers[1]}
              inputLabel={t(`${translationPath}select-category`)}
              inputPlaceholder={t(`${translationPath}select-category`)}
              isLoading={isLoading}
              themeClass="theme-solid"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(e, value) => {
                setForm((items) => ({
                  ...items,
                  category_uuid: (value && value.uuid) || null,
                }));
              }}
              autoHighlight
            />
          </Col>
        )}
      </Row>
      {popoverAttachedWith && (
        <PopoverComponent
          idRef={`jobTemplateFormGPTHelp`}
          attachedWith={popoverAttachedWith}
          handleClose={() => {
            setPopoverAttachedWith(null);
            setLocalActiveField({});
          }}
          component={
            <div className="d-inline-flex-column gap-1 py-1">
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => gptGenerateJobDescriptionOrRequirements()}
                disabled={!localActiveField.title || isGPTLoading}
              >
                {t(`${translationPath}generate-${localActiveField?.title}`)}
              </ButtonBase>
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => gptOptimizeJobDescriptionOrRequirements()}
                disabled={!localActiveField?.value || isGPTLoading}
              >
                {t(`${translationPath}optimize-${localActiveField?.title}`)}
              </ButtonBase>
            </div>
          }
        />
      )}
    </Card>
  );
}
