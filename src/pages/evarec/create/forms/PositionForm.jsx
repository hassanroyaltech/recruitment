// React and reactstrap
import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Input, Row } from 'reactstrap';
import i18next from 'i18next';

// Chips
import ChipsInput from 'components/Elevatus/ChipsInput';

// Loader
import Loader from 'components/Elevatus/Loader';
// MUI
import { useTranslation } from 'react-i18next';

// Dropdown
import { ChainerDialog } from './ChainerDialog';
import {
  DynamicFormTypesEnum,
  SystemActionsEnum,
  TablesNameEnum,
} from '../../../../enums';
import {
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../setups/shared';
import {
  GetAllSetupsJobTypes,
  GetAllSetupsCareerLevels,
  GetAllSetupsIndustries,
  GetAllSetupsJobMajors,
  GetAllSetupsDegreeTypes,
  GetSetupsJobMajorsById,
  GetAllSetupsPositionsTitle,
  getSetupsPositionTitleById,
  GetAllSetupsJobDepartments,
} from '../../../../services';
import { AutocompleteComponent } from '../../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import { Divider } from '@mui/material';
import DatePickerComponent from '../../../../components/Datepicker/DatePicker.Component';
import { GlobalSavingDateFormat } from '../../../../helpers';
import { ChatGPTIcon } from '../../../../assets/icons';
import PopoverComponent from '../../../../components/Popover/Popover.Component';

const translationPath = '';
const parentTranslationPath = 'CreateJob';

/**
 * This is where you begin filling out the main details of the application/vacancy
 * The first step in creating/editing an application form
 * @param form
 * @param setForm
 * @returns {JSX.Element}
 * @constructor
 */
export default function PositionForm({
  form,
  setForm,
  template,
  showPositionTitle,
  setActiveField,
  gptDetails,
  handleSelectLang,
  isTemplate,
  handleOpenGPTDialog,
  isLoadingParent,
  handleGPTGenerateSkills,
}) {
  const { t } = useTranslation(parentTranslationPath);
  /**
   * Set various states and constants
   */
  const [activeKeywordChainer] = useState(false);
  const [activeKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  useEffect(() => {
    setIsLoading(false);
  }, []);
  const Experience = [
    { id: 0, title: '0' },
    { id: 1, title: '1' },
    { id: 2, title: '2' },
    { id: 3, title: '3' },
    { id: 4, title: '4' },
    { id: 5, title: '5' },
    { id: 6, title: '6' },
    { id: 7, title: '7' },
    { id: 8, title: '8' },
    { id: 9, title: '9' },
    { id: 10, title: '10' },
  ];

  /**
   * Setting a field value in the form
   * @param field
   * @returns {function(*): void}
   */
  const onSetFormField = (field) => (value) => {
    setForm((items) => ({ ...items, [field]: value }));
  };

  /**
   * Return JSX
   */
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
        <Col xs="12" className="d-flex flex-row justify-content-between">
          <div className="d-flex-v-center-h-between">
            <h6 className="h6">{t(`${translationPath}position`)}</h6>
            {isTemplate && (
              <ButtonBase
                onClick={() => {
                  handleOpenGPTDialog && handleOpenGPTDialog();
                }}
                className="btns theme-solid py-1 mb-2"
                disabled={isLoading || isLoadingParent}
              >
                {isLoading || isLoadingParent ? (
                  <>
                    {t(`${translationPath}generating`)}
                    <span className="fas fa-circle-notch fa-spin m-1" />
                  </>
                ) : (
                  <>
                    {t(`${translationPath}generate-using-ChatGPT`)}
                    <span className="m-1">
                      <ChatGPTIcon />
                    </span>
                  </>
                )}
              </ButtonBase>
            )}
          </div>

          <div className="d-inline-flex flex-row text-gray font-14 align-items-center">
            <ChainerDialog />
          </div>
        </Col>
      </Row>

      <div className="mt-4">
        <Row className="mx--2">
          <Col xs="12" sm="6" className="mb-4 px-2">
            <div className="d-flex-center">
              <SharedInputControl
                editValue={form?.title || ''}
                onValueChanged={(e) =>
                  setForm((items) => ({ ...items, [e.id]: e.value }))
                }
                stateKey="title"
                isDisabled={!!template}
                idRef="title"
                title={t(`${translationPath}job-title`)}
                themeClass="theme-solid"
                placeholder={t(`${translationPath}job-title`)}
                // errors,
                // errorPath,
                // isSubmitted,
                isFullWidth
                isRequired
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                wrapperClasses="px-3 mb-0"
              />
              <ButtonBase
                onClick={() =>
                  setActiveField({ type: 'text', title: 'title', setFunc: setForm })
                }
                disabled={!!template}
                className="btns-icon theme-transparent mx-1"
              >
                <span className={SystemActionsEnum.add.icon} />
              </ButtonBase>
            </div>
          </Col>
          <Col xs="12" sm="6" className="mb-4 px-2">
            <SharedAPIAutocompleteControl
              title={'job-department'}
              placeholder={'select-job-department'}
              editValue={form?.department_id}
              idRef="jobDepartmentAutocompleteRef"
              getOptionLabel={(option) =>
                (option.name
                  && (option.name[i18next.language] || option.name.en || 'N/A'))
                || 'N/A'
              }
              // errors={errors}
              searchKey="search"
              stateKey="department_id"
              // isDisabled={isLoading || isDisabledSaving}
              // isSubmitted={isSubmitted}
              errorPath="department_id"
              getDataAPI={GetAllSetupsJobDepartments}
              onValueChanged={(e) => {
                setForm((items) => ({ ...items, department_id: e.value }));
              }}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              isDisabled={!!template}
              extraProps={{
                lookup: TablesNameEnum.JobDepartments.key,
                ...(form?.department_id && { with_than: [form?.department_id] }),
              }}
            />
          </Col>
        </Row>
        <Divider />
      </div>

      <Row className="mt-4 mx--2 text-gray">
        {showPositionTitle && (
          <Col xs="12" sm="6" className="mb-4 px-2">
            {/* position title */}
            <SharedAPIAutocompleteControl
              fullWidth
              idRef="positionTitleAutocompleteRef"
              editValue={form.position_title_uuid}
              title="position-title"
              placeholder="select-position-title"
              stateKey="position_title_uuid"
              getDataAPI={GetAllSetupsPositionsTitle}
              errorPath="position_title_uuid"
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              searchKey="search"
              getItemByIdAPI={getSetupsPositionTitleById}
              onValueChanged={(e) =>
                setForm((items) => ({ ...items, [e.id]: e.value }))
              }
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              extraProps={{
                ...(form.position_title_uuid && {
                  with_than: [form.position_title_uuid],
                }),
              }}
            />
          </Col>
        )}
        {isTemplate && (
          <Col xs="12" sm="6" className="mb-4 px-2">
            <DatePickerComponent
              idRef="reviewDateRef"
              // datePickerWrapperClasses="px-0"
              inputPlaceholder="YYYY-MM-DD"
              value={form?.review_date || ''}
              maxDate={undefined}
              // minDate={moment().toDate()}
              onDelayedChange={(date) => {
                if (date.value !== 'Invalid date')
                  setForm((items) => ({ ...items, review_date: date.value }));
                else setForm((items) => ({ ...items, review_date: null }));
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              label={t(`${translationPath}review-date`)}
              displayFormat={GlobalSavingDateFormat}
            />
          </Col>
        )}

        <Col xs="12" sm="6" className="mb-4 px-2">
          <SharedAPIAutocompleteControl
            isEntireObject
            fullWidth
            // errors={errors}
            title={t(`${translationPath}job-type`)}
            placeholder={t(`${translationPath}job-type`)}
            stateKey="type_uuid"
            errorPath="type_uuid"
            // isSubmitted={isSubmitted}
            editValue={form?.type_uuid?.uuid}
            onValueChanged={(e) => {
              setForm((items) => ({ ...items, [e.id]: e.value }));
            }}
            idRef="JobType"
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            type={DynamicFormTypesEnum.select.key}
            extraProps={{
              with_than: (form?.type_uuid?.uuid && [form?.type_uuid?.uuid]) || null,
            }}
            getDataAPI={GetAllSetupsJobTypes}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            searchKey="search"
            isDisabled={!!template}
          />
        </Col>
        <Col xs="12" sm="6" className="mb-4 px-2">
          <SharedAPIAutocompleteControl
            fullWidth
            title={t(`${translationPath}job-major`)}
            placeholder={t(`${translationPath}job-major`)}
            stateKey="major_uuid"
            errorPath="major_uuid"
            editValue={form?.major_uuid}
            onValueChanged={(newValue) => {
              setForm((items) => ({ ...items, major_uuid: newValue.value }));
            }}
            idRef="JobMajor"
            getOptionLabel={(option) =>
              option.name ? option.name[i18next.language] || option.name.en : ''
            }
            type={DynamicFormTypesEnum.array.key}
            extraProps={{
              ...(form?.major_uuid?.length && { with_than: form?.major_uuid }),
            }}
            getDataAPI={GetAllSetupsJobMajors}
            getItemByIdAPI={GetSetupsJobMajorsById}
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
            title={t(`${translationPath}career-level`)}
            placeholder={t(`${translationPath}career-level`)}
            stateKey="career_level_uuid"
            errorPath="career_level_uuid"
            // isSubmitted={isSubmitted}
            editValue={form?.career_level_uuid?.uuid}
            onValueChanged={(e) => {
              setForm((items) => ({ ...items, [e.id]: e.value }));
            }}
            idRef="CareerLevel"
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            type={DynamicFormTypesEnum.select.key}
            extraProps={{
              with_than:
                (form?.career_level_uuid?.uuid && [form?.career_level_uuid?.uuid])
                || null,
            }}
            getDataAPI={GetAllSetupsCareerLevels}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            autoHighlight
            searchKey="search"
            isDisabled={!!template}
          />
        </Col>
        <Col xs="12" sm="6" className="mb-4 px-2">
          <AutocompleteComponent
            idRef="YearsofExperience"
            getOptionLabel={(option) => (option.title ? option.title : '')}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            value={form?.years_of_experience || null}
            data={Experience}
            inputLabel={t(`${translationPath}years-of-experience`)}
            inputPlaceholder={t(`${translationPath}years-of-experience`)}
            isLoading={isLoading}
            themeClass="theme-solid"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(e, value) => {
              setForm((items) => ({ ...items, years_of_experience: value }));
            }}
            autoHighlight
            wrapperClasses="px-3"
            isDisabled={!!template}
          />
        </Col>
        <Col xs="12" sm="6" className="mb-4 px-2">
          <SharedAPIAutocompleteControl
            isEntireObject
            fullWidth
            // errors={errors}
            title={t(`${translationPath}industry`)}
            placeholder={t(`${translationPath}industry`)}
            stateKey="industry_uuid"
            errorPath="industry_uuid"
            // isSubmitted={isSubmitted}
            editValue={form?.industry_uuid?.uuid}
            onValueChanged={(e) => {
              setForm((items) => ({ ...items, [e.id]: e.value }));
            }}
            idRef="Industry"
            getOptionLabel={(option) =>
              option.name ? option.name[i18next.language] || option.name.en : ''
            }
            type={DynamicFormTypesEnum.select.key}
            extraProps={{
              with_than:
                (form?.industry_uuid?.uuid && [form?.industry_uuid?.uuid]) || null,
            }}
            getDataAPI={GetAllSetupsIndustries}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            autoHighlight
            searchKey="search"
            isDisabled={!!template}
          />
        </Col>

        <Col xs="12" sm="6" className="mb-4 px-2">
          <SharedAPIAutocompleteControl
            isEntireObject
            fullWidth
            // errors={errors}
            title={t(`${translationPath}degree-type`)}
            placeholder={t(`${translationPath}degree-type`)}
            stateKey="degree_type"
            errorPath="degree_type"
            // isSubmitted={isSubmitted}
            editValue={form?.degree_type?.uuid}
            onValueChanged={(e) => {
              setForm((items) => ({ ...items, [e.id]: e.value }));
            }}
            idRef="DegreeType"
            getOptionLabel={(option) =>
              option.name ? option.name[i18next.language] || option.name.en : ''
            }
            type={DynamicFormTypesEnum.select.key}
            extraProps={{
              with_than:
                (form?.degree_type?.uuid && [form?.degree_type?.uuid]) || null,
            }}
            getDataAPI={GetAllSetupsDegreeTypes}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            searchKey="search"
            isDisabled={!!template}
          />
        </Col>
        {isTemplate && (
          <Col xs="12" sm="6" className="mb-4 px-2">
            <DatePickerComponent
              idRef="expiryDateRef"
              // datePickerWrapperClasses="px-0"
              inputPlaceholder="YYYY-MM-DD"
              value={form?.expiry_date || ''}
              maxDate={undefined}
              // minDate={moment().toDate()}
              onDelayedChange={(date) => {
                if (date.value !== 'Invalid date')
                  setForm((items) => ({ ...items, expiry_date: date.value }));
                else setForm((items) => ({ ...items, expiry_date: null }));
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isRequired
              label={t(`${translationPath}expiry-date`)}
              displayFormat={GlobalSavingDateFormat}
            />
          </Col>
        )}
      </Row>

      <Card className="mt-4 py-3 px-2">
        <div className="d-flex-v-center-h-between">
          <div className="text-gray mx-1 font-14">
            {t(`${translationPath}skills-description`)}
          </div>
          {isTemplate && (
            <ButtonBase
              onClick={(e) => {
                setPopoverAttachedWith(e.target);
                // setLocalActiveField({
                //   title: 'description',
                //   value: form?.description,
                // });
              }}
              className="btns-icon theme-solid mx-2 mb-3"
              disabled={isLoading || isLoadingParent}
            >
              {isLoading || isLoadingParent ? (
                <span className="fas fa-circle-notch fa-spin m-1" />
              ) : (
                <ChatGPTIcon />
              )}
            </ButtonBase>
          )}
        </div>

        <div className="mt-4 mb-3 mx-1">
          <ChipsInput
            onChange={onSetFormField('skills')}
            chips={form?.skills || []}
            isChipsDisabled={!!template}
            InputComp={(props) => (
              <Input
                placeholder={t(`${translationPath}chip-placeholder`)}
                {...props}
                disabled={!!template}
              />
            )}
          />
        </div>
      </Card>
      {isTemplate && (
        <Row>
          <Col xs="12" sm="12" className="px-0">
            <SharedInputControl
              labelValue="notes"
              isFullWidth
              editValue={form.note}
              stateKey="note"
              onValueChanged={(e) => {
                setForm((items) => ({ ...items, note: e.value }));
              }}
              multiline
              rows={3}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </Col>
        </Row>
      )}
      {activeKeywordChainer && (
        <div className="mt-3 mx-2 d-flex flex-row flex-wrap">
          <div className="chip-item mr-2 mb-2">
            {t(`${translationPath}suggestions`)}:
          </div>
          {activeKeywords?.map((keyword, index) =>
            form?.skills.include(keyword) ? (
              <div
                className="chip-item mr-2 mb-2 text-gray"
                key={`activeKeywords${index + 1}`}
              >
                {keyword}
              </div>
            ) : (
              <div
                className="chip-item mr-2 mb-2 text-primary"
                key={`activeKeywords${index + 1}`}
                role="button"
                onKeyUp={() => {}}
                tabIndex={0}
                onClick={() => {
                  onSetFormField('skills')([...(form?.skills || []), keyword]);
                }}
              >
                + {keyword}
              </div>
            ),
          )}
        </div>
      )}
      {popoverAttachedWith && (
        <PopoverComponent
          idRef={`jobTemplateFormGPTHelp`}
          attachedWith={popoverAttachedWith}
          handleClose={() => {
            setPopoverAttachedWith(null);
          }}
          component={
            <div className="d-inline-flex-column gap-1 py-1">
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  handleGPTGenerateSkills();
                  setPopoverAttachedWith(null);
                }}
              >
                {t(`${translationPath}generate-only-skills`)}
              </ButtonBase>
            </div>
          }
        />
      )}
    </Card>
  );
}
