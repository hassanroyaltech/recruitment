// React and reactstrap
import React, { useEffect, useMemo, useState } from 'react';
import { CardBody, Col, Row, Tooltip } from 'reactstrap';
import { useHistory } from 'react-router-dom';

// Components
import DropzoneWrapper from 'components/Elevatus/DropzoneWrapper';
import Loader from 'components/Elevatus/Loader';

// Styles
import { evarecAPI } from 'api/evarec';
import { preferencesAPI } from 'api/preferences';
import { Uploading } from 'components/Loaders/Uploading';
import { Deleting } from 'components/Loaders/Deleting';
import { StandardButton } from 'components/Buttons/StandardButton';
import { StandardModalFrame } from 'components/Modals/StandardModalFrame';

// MUI
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MaterialSelect,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import { getIsAllowedPermissionV2, showError } from '../../../../helpers';
import { SharedAPIAutocompleteControl } from 'pages/setups/shared';
import { GetAllEvaRecPipelines } from 'services';
import { EvaRecTemplatesPermissions } from 'permissions';
import { useSelector } from 'react-redux';
import { SystemLanguagesConfig } from '../../../../configs';

const translationPath = '';
const parentTranslationPath = 'CreateJob';
/**
 * A component to choose an application template
 * @param modalTitle
 * @param isOpen
 * @param onClose
 * @param onSave
 * @param data
 * @param setData
 * @returns {JSX.Element}
 * @constructor
 */
export default function ChooseJobTemplate({
  modalTitle,
  isOpen,
  onClose,
  onSave,
  data,
  setData,
  setForm,
  gpaDescription,
  position_title_uuid,
  setTranslations,
}) {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts();
  /**
   * The user object needs to be refactored to access only items necessary
   */
  // const user = JSON.parse(localStorage.getItem('user'))?.results;

  /**
   * Hook to use the history and redirect as needed
   */
  const history = useHistory();

  /**
   * Define states and constants
   */
  const [file, setFile] = useState({});
  const [templateData, setTemplateData] = useState();
  const [isUpload, setIsUpload] = useState(false);
  const [templateSelect, setTemplateSelect] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadTemplateFlag, setUploadTemplateFlag] = useState(false);
  const [templates, setTemplates] = useState(null);
  const [pipeline, setPipeline] = useState(false);
  const [jobParser, setJobParser] = useState('');
  const [jobParserList, setJobParserList] = useState([]);
  const [languageUuid, setLanguageUuid] = useState('');
  // Tool tip states
  const [tooltipOpenPipeline, setTooltipOpenPipeline] = useState(false);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const handleParserChange = (event) => {
    setJobParser(event.target.value);
    setUploading(false);
    setUploaded(false);
  };

  /**
   * @param languages - list of languages
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to return the english language UUID by code
   */
  const getEnglishLanguageUUID = useMemo(
    () =>
      (languages = []) =>
        languages.find((item) => item.code === SystemLanguagesConfig.en.key)?.id,
    [],
  );

  useEffect(() => {
    const loginDto = JSON.parse(localStorage.getItem('user'))?.results;
    const parsers
      = (
        localStorage.getItem('userDetails')
        && JSON.parse(localStorage.getItem('userDetails'))
      )?.parsers || [];
    const parser
      = (parsers
        && parsers.length
        && parsers?.find((item) => item.title === 'Elevatus job parser'))
      || '';

    if (loginDto) {
      setJobParserList(parsers);
      setJobParser(parser?.uuid);
      setLanguageUuid(getEnglishLanguageUUID(loginDto?.language));
    }
  }, [getEnglishLanguageUUID]);

  /**
   * Function to fill data in form fields if user select template or upload template
   */
  const fillTemplateData = () => {
    setTranslations(templateData?.translations);
    const experience = {
      id: templateData?.years_of_experience?.[0]
        ? `${templateData?.years_of_experience?.[0]}`
        : null,
      title: templateData?.years_of_experience?.[0]
        ? `${templateData?.years_of_experience?.[0]}`
        : null,
    };
    if (setForm && setForm.length > 0)
      setForm[0]((items) => ({
        ...items,
        title: templateData?.title,
        major_uuid: templateData?.major_uuid?.map((a) => a.id || a.uuid),
        department_id:templateData?.department?.uuid,
        type_uuid: templateData?.type_uuid?.[0] && {
          ...templateData?.type_uuid?.[0],
          uuid: templateData?.type_uuid?.[0].id || templateData?.type_uuid?.[0].uuid,
        },
        career_level_uuid: templateData?.career_level_uuid
          ? templateData?.career_level_uuid[0]
          : null,
        years_of_experience: experience,
        industry_uuid: templateData?.industry_uuid
          ? templateData?.industry_uuid[0]
          : null,
        degree_type: templateData?.degree_type ? templateData?.degree_type[0] : null,
        skills: templateData?.skills,
        reference_number: templateData.reference_number || items.reference_number,
      }));

    setForm[1]((items) => ({
      ...items,
      nationality_uuid: templateData?.nationality_uuid?.map((a) => a.id || a.uuid),
      country_uuid: templateData?.country_uuid,
      city: templateData?.city,
      gender: templateData?.gender || '',
      gpa: gpaDescription?.filter((ele) => ele.id === templateData?.gpa)?.[0],
      min_salary: templateData?.min_salary,
      max_salary: templateData?.max_salary,
      visa_sponsorship: templateData?.visa_sponsorship,
      willing_to_travel: templateData?.willing_to_travel,
      willing_to_relocate: templateData?.willing_to_relocate,
      owns_a_car: templateData?.owns_a_car,
      languages:
        templateData?.language_proficiency
        && templateData?.language_proficiency?.length > 0
          ? templateData?.language_proficiency
          : [{ name: null, score: null, uuid: null }],
      description: templateData?.description,
      address: templateData?.address
        ? templateData?.address
        : `${templateData?.lat || ''}, ${templateData?.long || ''}`,
      requirements: templateData?.requirements || templateData?.requirements,
      profile_builder_uuid: templateData?.profile_builder_uuid,
      evaluation_uuid:
        templateData?.evaluation_uuid
        && Array.isArray(templateData?.evaluation_uuid)
        && templateData?.evaluation_uuid.length === 0
          ? null
          : templateData?.evaluation_uuid?.uuid,
      lat: templateData?.lat,
      long: templateData?.long,
      location_uuid: templateData?.location_uuid,
      hidden_columns: templateData?.hidden_columns || [],
    }));
    setUploadTemplateFlag(false);
  };

  // const onCheckboxFormEvent = () => (e, isChecked) => {
  //   setPortalFlag(isChecked);
  // };

  useEffect(() => {
    if (
      (window.location.href.includes('&position_title_uuid=')
        && position_title_uuid)
      || !window.location.href.includes('&position_title_uuid=')
    ) {
      setLoading(true);
      /**
       * Get the list of pipelines for this application
       * @returns {Promise<any>}
       */

      /**
       * Get list of templates for the application
       */
      preferencesAPI
        .getTemplates({ position_title_uuid })
        .then((response) => {
          if (response?.data?.statusCode === 200)
            setTemplates(response?.data?.results);
        })
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
          setLoading(false);
        });
    }
  }, [position_title_uuid, t]);

  const createPipeline = () => {
    history.push('/recruiter/recruiter-preference/pipeline');
  };

  /**
   * Upload a template
   *
   * This should be modularized and placed under:
   * 'services/apis/*'
   *
   * @returns {Promise<any>}
   */
  const uploadTemplate = async (files) => {
    if (files.length) {
      setTemplateData();
      // Set the file
      setFile({ uploading: true, uploaded: false });

      // Set uploading and uploaded states
      setUploading(true);
      setUploaded(false);

      // Create the form data object to send via API
      const formData = new FormData();
      formData.append('file', files?.[0]);
      formData.append('type', 'parser');
      formData.append('from_feature', 'ats'); // Replace the preset name with your own
      formData.append('language_uuid', languageUuid);
      // Replace the preset name with your own
      formData.append('job_parser_uuid', jobParser);

      // Parse the job template
      const parsedJobTemplate = evarecAPI.parseJobTemplate(formData);

      parsedJobTemplate
        .then((res) => {
          setIsUpload(true);
          setTemplateSelect(null);
          setFile({ file: res?.data?.results });
          // Set uploading and uploaded states
          setUploading(false);
          setUploaded(true);
          // Set the data from the parsed job to pass to the stepper.
          setTemplateData({
            ...res?.data?.results,
            language_proficiency:
              res?.data?.results?.language_proficiency?.map((item) => ({
                ...item,
                score: item.score ? +item.score : '',
              })) || [],
            gpa: res?.data?.results?.gpa ? +res?.data?.results?.gpa : '',
            address: res?.data?.results?.lat
              ? `${+res?.data?.results?.lat},${+res?.data?.results?.long}`
              : null,
          });
          setUploadTemplateFlag(true);
          addToast(t(`${translationPath}template-uploaded-successfully`), {
            appearance: 'success',
            autoDismissTimeout: 7000,
            autoDismiss: true,
          });
        })
        .catch((error) => {
          setFile({});
          // Set uploading and uploaded states
          setUploading(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    }
  };
  /**
   * Effect to fill forms if user upload template file
   */
  useEffect(() => {
    if (uploadTemplateFlag) fillTemplateData();
  }, [uploadTemplateFlag]);

  /**
   * Return JSX
   */
  return (
    <StandardModalFrame
      isOpen={isOpen}
      toggle={onClose}
      size="md"
      closeOnClick={onClose}
      modalTitle={modalTitle}
    >
      <div className="px-5 pb-3">
        {loading ? (
          <CardBody className="text-center" style={{ height: '300px' }}>
            <Row>
              <Col sm="12">
                <Loader width="500px" height="300px" speed={1} color="primary" />
              </Col>
            </Row>
          </CardBody>
        ) : (
          <>
            <div className="h6 font-weight-normal text-gray">
              {t(`${translationPath}create-application-description-one`)}{' '}
              <a
                download
                target="_blank"
                href=" https://storage.googleapis.com/elevatus-staging-public-resources/jdt.docx"
              >
                {t(`${translationPath}download`)}
              </a>{' '}
              {t(`${translationPath}create-application-description-two`)}.
            </div>

            <Row className="mt-4 text-gray">
              <Col sm="12" md="5">
                {jobParserList && jobParserList.length > 1 && (
                  <div className="template-dropdown-parser-wrapper w-100 mb-3">
                    <FormControl variant="outlined" className="w-100">
                      <InputLabel>{t(`${translationPath}select-parser`)}</InputLabel>
                      <MaterialSelect
                        size="small"
                        value={jobParser}
                        label="Select parser"
                        onChange={handleParserChange}
                      >
                        {jobParserList
                          && jobParserList.map((item, index) => (
                            <MenuItem key={`${index + 1}-parser`} value={item.uuid}>
                              {item.title}
                            </MenuItem>
                          ))}
                      </MaterialSelect>
                    </FormControl>
                  </div>
                )}
                <DropzoneWrapper
                  multiple={false}
                  onUpload={uploadTemplate}
                  accept=".doc,.docx"
                  className="custom-file-input csv-custom-file-input form-control-alternative"
                >
                  <div className="d-flex flex-row align-items-center">
                    {uploading ? (
                      <Uploading />
                    ) : file?.deleting ? (
                      <Deleting />
                    ) : (
                      <>
                        <i
                          className="fas fa-cloud-upload-alt px-2"
                          style={{ fontSize: '2rem' }}
                        />
                        <span className="h6 text-gray ml-2 mb-0">
                          {t(`${translationPath}upload-template`)}
                        </span>
                      </>
                    )}
                  </div>
                </DropzoneWrapper>
                {!uploaded ? (
                  <p> </p>
                ) : (
                  <p className="text-center pt-2">
                    {t(`${translationPath}file-uploaded-successfully`)}
                    <IconButton
                      size="small"
                      onClick={() => {
                        setUploaded(false);
                        setIsUpload(false);
                        setTemplateData();
                      }}
                    >
                      <i className="fas fa-trash text-danger pl-2-reversed mt--2" />
                    </IconButton>
                  </p>
                )}
              </Col>
              <Col
                sm="12"
                md="2"
                className="d-inline-flex-center"
                style={{ marginTop: '-25px' }}
              >
                {t(`${translationPath}or`)}
              </Col>
              <Col sm="12" md="5">
                <Autocomplete
                  fullWidth
                  autoHighlight
                  options={templates || []}
                  disabled={
                    isUpload
                    || !getIsAllowedPermissionV2({
                      permissions,
                      defaultPermissions: EvaRecTemplatesPermissions,
                    })
                  }
                  getOptionLabel={(option) => (option.title ? option.title : '')}
                  isOptionEqualToValue={(option, value) =>
                    option?.uuid === value?.uuid
                  }
                  id="template_field"
                  name="template_field"
                  label={t(`${translationPath}template`)}
                  variant="outlined"
                  value={templateSelect}
                  onChange={(e, value) => {
                    setTemplateSelect(value);
                    setTemplateData();
                    setData((_data) => ({ ..._data, template_uuid: value }));
                    setTooltipOpen(!tooltipOpen);
                    if (value === null) setTemplateData();
                    else {
                      setIsFetching(true);
                      evarecAPI
                        .viewJobTemplate(value?.uuid)
                        .then((response) => {
                          setTemplateData(response?.data?.results);
                          setUploadTemplateFlag(true);
                          setIsFetching(false);
                        })
                        .catch((err) => {
                          showError(t('Shared:failed-to-get-saved-data'), err);
                          setTemplateSelect(null);
                          setIsFetching(false);
                        });
                    }
                    if (setForm && setForm.length > 0)
                      setForm[0]((items) => ({
                        ...items,
                        title: null,
                        major_uuid: null,
                        type_uuid: null,
                        career_level_uuid: null,
                        years_of_experience: null,
                        industry_uuid: null,
                        degree_type: null,
                        skills: null,
                      }));
                    if (setForm && setForm.length > 1)
                      setForm[1]((items) => ({
                        ...items,
                        gender: '',
                        min_salary: 0,
                      }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t(`${translationPath}template`)}
                      variant={isUpload ? 'filled' : 'outlined'}
                      inputProps={{
                        ...params.inputProps,
                      }}
                      value={data?.template_uuid || undefined}
                    />
                  )}
                />
                {/* <Select
                  id="template_field"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      ...selectColors,
                    },
                  })}
                  styles={customSelectStyles}
                  placeholder="Template"
                  getOptionLabel={({ title }) => title}
                  getOptionValue={({ uuid }) => uuid}
                  value={data?.template_uuid || undefined}
                  onChange={onSelectTemplate('template_uuid')}
                  options={templates}
                  isClearable
                /> */}
                {/* <StandardMappedDropdown */}
                {/*  purpose="template" */}
                {/*  dataArray={templates} */}
                {/*  dataKey="uuid" */}
                {/*  dataValue="title" */}
                {/*  onChange={onSelectTemplate('template_uuid')} */}
                {/* /> */}
                <Tooltip
                  placement="left"
                  isOpen={tooltipOpen}
                  target="template_field"
                  toggle={toggle}
                >
                  <span>{t(`${translationPath}please-select-a-template`)}</span>
                </Tooltip>
              </Col>
            </Row>
            <hr className="mb-4" />

            <Row className="mt-4 text-gray">
              <Col sm="12">
                {t(`${translationPath}how-would-you-like-to-post-this-vacancy?`)}
              </Col>

              <Col sm="12" className="mt-4">
                <TextField
                  fullWidth
                  className="form-control-alternative"
                  id="external"
                  name="external"
                  label={t(`${translationPath}post-vacancy`)}
                  variant="outlined"
                  defaultValue={data?.isExternal}
                  SelectProps={{
                    native: true,
                  }}
                  select
                  onChange={(event) => {
                    const { value } = event.target;

                    if (value.toLowerCase() === 'external')
                      setData((items) => ({
                        ...items,
                        isExternal: true,
                        isInternal: false,
                      }));

                    if (value.toLowerCase() === 'internal')
                      setData((items) => ({
                        ...items,
                        isExternal: false,
                        isInternal: true,
                      }));

                    if (value.toLowerCase() === 'both')
                      setData((items) => ({
                        ...items,
                        isExternal: true,
                        isInternal: true,
                      }));
                  }}
                >
                  <option value="external">
                    {t(`${translationPath}external-only`)}
                  </option>
                  <option value="internal">
                    {t(`${translationPath}internal-only`)}
                  </option>
                  {/* <option value="both">
                    {t(`${translationPath}external-and-internal`)}
                  </option> */}
                </TextField>
              </Col>
            </Row>

            <Row className="mt-5 text-gray">
              <Col sm="12">
                {t(`${translationPath}select-a-pipeline-or-create-a-new-one`)}
              </Col>
              <Col sm="12" className="mt-3 mb-0">
                <Row>
                  <Col sm="12" md="5">
                    <SharedAPIAutocompleteControl
                      isFullWidth
                      title={t(`${translationPath}pipeline`)}
                      stateKey="pipeline_field"
                      errorPath="pipeline_field"
                      searchKey="search"
                      placeholder={t(`${translationPath}pipeline`)}
                      isRequired
                      isDisabled={isFetching}
                      editValue={data?.pipeline_uuid || undefined}
                      onValueChanged={(e) => {
                        setPipeline(true);
                        setData((_data) => ({ ..._data, pipeline_uuid: e.value }));
                        setTooltipOpenPipeline(!tooltipOpenPipeline);
                      }}
                      getDataAPI={GetAllEvaRecPipelines}
                      parentTranslationPath={parentTranslationPath}
                    />
                  </Col>
                  <Col
                    sm="12"
                    md="2"
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{ marginTop: '7px' }}
                  >
                    {t(`${translationPath}or`)}
                  </Col>
                  <Col sm="12" md="5" style={{ marginTop: '8px' }}>
                    <StandardButton
                      color="secondary"
                      onClick={createPipeline}
                      label={t(`${translationPath}create-a-new-pipeline`)}
                      className="w-100"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* <hr /> */}
            {/* <Col xs="14" sm="7" className="mb-2 px-3"> */}
            {/*  <CheckboxesComponent */}
            {/*    idRef="questionPostYourJobKey" */}
            {/*    singleChecked={form.visa_sponsorship} */}
            {/*    onSelectedCheckboxChanged={onCheckboxFormEvent} */}
            {/*    label={t( */}
            {/*      `${translationPath}would-you-like-to-post-your-job-on-premium-portals`, */}
            {/*    )} */}
            {/*  /> */}
            {/* </Col> */}

            <div className="mt-5 d-flex justify-content-center">
              <StandardButton
                color="primary"
                onClick={onSave}
                disabled={!pipeline || isFetching}
                label={t(`${translationPath}proceed`)}
                loading={isFetching}
                keepLabelOnLoading
              />
            </div>
          </>
        )}
      </div>
    </StandardModalFrame>
    //   </ModalBody>
    // </Modal>
  );
}
