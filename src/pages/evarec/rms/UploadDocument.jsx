// React and reactstrap
import React, { useEffect, useMemo, useState } from 'react';

// APIs and routes
import axios from 'axios';
import urls from '../../../api/urls';
import { evarecAPI } from '../../../api/evarec';
import { generateHeaders } from '../../../api/headers';

// Components (dropzone, modal, button and uploading spinner)
import DropzoneWrapper from '../../../components/Elevatus/DropzoneWrapper';
import { StandardModalFrame } from '../../../components/Modals/StandardModalFrame';
import { StandardButton } from '../../../components/Buttons/StandardButton';
import { Uploading } from '../../../components/Loaders/Uploading';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SystemLanguagesConfig } from '../../../configs';

const translationPath = '';
const parentTranslationPath = 'EvarecRecRms';

/**
 * Returns the Upload document component
 * @param isOpen
 * @param onClose
 * @param onUpload
 * @param setHasRecentUploads
 * @returns {JSX.Element}
 * @constructor
 */
const UploadDocument = ({ isOpen, onClose, onUpload, setHasRecentUploads }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [recentUploads, setRecentUploads] = useState([]);
  const [files, setFiles] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  const [fileAdded, setFileAdded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [errors, setErrors] = useState([]);
  const [message, setMessageErrors] = useState('');
  const [loader, setLoader] = useState(false);
  const [jobParser, setJobParser] = useState('');
  const [jobParserList, setJobParserList] = useState([]);
  const [languageUuid, setLanguageUuid] = useState('');

  const handleParserChange = (event) => {
    setJobParser(event.target.value);
    setUploading(false);
    setUploaded(false);
    setMessageErrors(null);
    setUploadData(null);
    onUpload(null);
    setFiles(null);
    setHasRecentUploads(false);
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
    if (localStorage.getItem('userDetails')) {
      const userDetails = JSON.parse(localStorage.getItem('userDetails')) || null;

      if (userDetails && userDetails.parsers) {
        setJobParserList(userDetails.parsers);
        setJobParser(userDetails.parsers[0].uuid);
        setLanguageUuid(getEnglishLanguageUUID(userDetails.language));
      }
    }
  }, [getEnglishLanguageUUID]);

  useEffect(() => {
    // Add subscription variable
    let isSubscribed = true;
    setLoader(true);
    evarecAPI.getRecentUploads(8).then((res) => {
      if (isSubscribed) setRecentUploads(res.jobs);
    });

    // Add cleanup closure
    return () => {
      setLoader(false);
      isSubscribed = false;
    };
  }, []);

  const resolveAreaText = () => {
    if (uploading) return <Uploading />;

    return (
      // When a file has not been added, is not uploading and has not been uploaded
      <>
        <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem' }} />
        <span className="h6 text-gray ml-2 mb-0">
          {t(`${translationPath}upload-template`)}
        </span>
      </>
    );
  };

  /**
   * Handler when adding a file to the dropzone
   * @param uploadingFiles
   */
  const handleFileChange = (uploadingFiles) => {
    setUploading(true);
    setUploaded(false);

    // Construct form to send
    const formData = new FormData();
    formData.append('file', uploadingFiles[0]);
    formData.append('type', 'parser');
    // Replace the preset name with your own
    formData.append('from_feature', 'rms--job_parser');
    // Replace the preset name with your own
    formData.append('language_uuid', languageUuid);
    // Replace the preset name with your own
    formData.append('job_parser_uuid', jobParser);

    // Set as added
    setFileAdded(true);

    // Make API request
    axios
      .post(urls.evarec.rms.PARSER, formData, {
        headers: generateHeaders(),
      })
      .then(({ data }) => {
        // Set as no longer uploading
        setUploading(false);
        // Set as uploaded
        setUploaded(true);
        setMessageErrors(data?.message);
        setUploadData(data.results);
        onUpload(data.results);
        setFiles(data.results);
        setHasRecentUploads(true);
      })
      .catch((error) => {
        setErrors(error?.response?.data?.errors);
        setMessageErrors(error?.response?.data?.message);
        // Set as no longer uploading
        setUploading(false);
      });
  };

  /**
   * Return the JSX component
   */
  return (
    <StandardModalFrame
      className="modal-dialog-centered share-candidate-modal"
      isOpen={isOpen}
      closeOnClick={onClose}
      modalTitle={t(`${translationPath}upload-a-document`)}
    >
      <div className="pb-3 p-3">
        <div className="h6 font-weight-normal text-gray">
          <span className="text-primary">
            <a
              download
              target="_blank"
              href=" https://storage.googleapis.com/elevatus-staging-public-resources/jdt.docx"
            >
              {t(`${translationPath}download`)}
            </a>
          </span>{' '}
          {t(`${translationPath}our-pre-made-template-or-upload-your-own`)}
        </div>
        {jobParserList && jobParserList.length > 1 && (
          <div className="template-dropdown-parser-wrapper w-100 mt-1">
            <FormControl variant="outlined" fullWidth>
              <InputLabel>{t(`${translationPath}select-parser`)}</InputLabel>
              <Select
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
              </Select>
            </FormControl>
          </div>
        )}
        <div className="mt-3">
          <DropzoneWrapper
            multiple={false}
            onUpload={handleFileChange}
            accept=".doc,.docx"
            maxSize={5123967}
            className="custom-file-input csv-custom-file-input"
          >
            <div className="d-flex flex-row align-items-center">
              {resolveAreaText()}
            </div>
          </DropzoneWrapper>
        </div>
        {uploaded && (
          <div>
            <br />
            <div className="h6 font-weight-normal text-gray">
              {t(`${translationPath}file-uploaded-successfully`)}.
            </div>
            <div className="my-4 d-flex justify-content-center">
              <StandardButton
                disabled={!fileAdded}
                onClick={onClose}
                // onClick={setTimeout(onClickUpload, 3000)}
                label="Close"
              />
            </div>
          </div>
        )}
        {message && <p className="mb-0 mt-1 text-xs text-danger">{message}</p>}
        {errors && errors.file ? (
          errors.file.length > 1 ? (
            errors.file.map((error, index) => (
              <p className="mb-0 mt-1 text-xs text-danger" key={index}>
                {error}
              </p>
            ))
          ) : (
            <p className="mb-0 mt-1 text-xs text-danger">{errors.file}</p>
          )
        ) : (
          ''
        )}
      </div>
    </StandardModalFrame>
  );
};

export default UploadDocument;
