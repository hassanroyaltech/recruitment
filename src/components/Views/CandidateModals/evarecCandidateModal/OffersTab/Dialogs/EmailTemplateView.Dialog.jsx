import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent, UploaderComponent } from '../../../../..';
import { ButtonBase, Chip } from '@mui/material';
import '../Offers.Style.scss';
// import {  SharedAPIAutocompleteControl } from 'pages/setups/shared';
import { useEventListener } from 'hooks';
import {
  // GetLanguagesForEmails ,
  GetEmailVariables,
} from 'services';
import Template from 'pages/recruiter-preference/EmailTemplates/EditTemplate';
import { showError } from 'helpers';
import { UploaderPageEnum } from 'enums';
import { SharedAutocompleteControl } from 'pages/setups/shared';

export const EmailTemplateDialog = ({
  isOpen,
  // candidate_uuid,
  onSave,
  onClose,
  getAllData,
  selectedEmailTemplate,
  setSelectedEmailTemplate,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const bodyRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
  });
  const [templatesList, setTemplatesList] = useState({
    results: [],
    totalCount: 0,
  });
  //   const [emailTemplateLanguage, setEmailTemplateLanguage] = useState(null);
  const [translations, setTranslations] = useState([]);
  const [variables, setVariables] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languages, setLanguages] = useState([]);

  const getTemplatesHandler = useCallback(async () => {
    if (filter.page === 1) setIsLoading(true);
    const res = await getAllData({
      ...filter,
    });
    if (res && res.status === 200)
      if (filter.page === 1)
        setTemplatesList({
          results: res.data.results.data || [],
          totalCount: res.data.results?.total || 0,
        });
      else
        setTemplatesList((items) => ({
          results: items.results.concat(res.data.results?.data || []),
          totalCount: res.data.results.total || 0,
        }));
    else setTemplatesList({ results: [], totalCount: 0 });
    if (filter.page === 1) setIsLoading(false);
  }, [filter, getAllData]);

  useEffect(() => {
    if (getAllData) getTemplatesHandler();
  }, [getTemplatesHandler, filter, getAllData]);

  const onScrollHandler = useCallback(() => {
    if (
      bodyRef.current.offsetHeight + bodyRef.current.scrollTop
        >= bodyRef.current.scrollHeight
      && templatesList.results.length < templatesList.totalCount
      && !isLoading
    )
      setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, [isLoading, templatesList.results.length, templatesList.totalCount]);

  useEventListener('scroll', onScrollHandler, bodyRef.current);

  const sendTranslation = (newTranslation) => {
    setTranslations((items) => [
      ...items.filter(
        (translation) => translation.language.id !== newTranslation.language.id,
      ),
      newTranslation,
    ]);
  };

  const getVariables = useCallback(async () => {
    const response = await GetEmailVariables();
    if (response.status === 200)
      setVariables(response.data.results.form_builder || []);
    else
      showError(
        t(`${translationPath}error-in-getting-variables`),
        response?.data?.error,
      );
  }, [t, translationPath]);

  useEffect(() => {
    getVariables();
  }, [getVariables]);

  useEffect(() => {
    if (selectedEmailTemplate?.translation) {
      setTranslations(selectedEmailTemplate.translation);
      setLanguages(selectedEmailTemplate.translation.map((item) => item.language));
      if (selectedEmailTemplate.translation[0]?.language && !selectedLanguage)
        setSelectedLanguage(selectedEmailTemplate.translation[0].language.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmailTemplate]);

  return (
    <DialogComponent
      isWithFullScreen={false}
      maxWidth="lg"
      dialogTitle={
        <div className="d-flex-h-between pt-4 px-4">
          <div className="d-flex">
            {t(`${translationPath}email-candidate`)}
            <Chip label="draft" className="mx-2" />
            {/* <ButtonBase className="btns-icon theme-transparent m-0">
              <span className="fas fa-ellipsis-h" />
            </ButtonBase> */}
          </div>
          <ButtonBase
            className="btns theme-solid mx-2"
            onClick={() => onSave(selectedEmailTemplate, selectedLanguage)}
            disabled={!selectedLanguage}
          >
            <span className="px-1">{t(`${translationPath}continue`)}</span>
            <span className="fas fa-long-arrow-alt-right" />
          </ButtonBase>
        </div>
      }
      contentClasses="px-0"
      dialogContent={
        <div className="mx-4">
          <SharedAutocompleteControl
            isHalfWidth
            stateKey="language"
            placeholder="select-language"
            editValue={selectedLanguage}
            isDisabled={isLoading}
            onValueChanged={(e) => setSelectedLanguage(e.value)}
            initValues={languages}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            initValuesTitle="title"
            initValuesKey="code"
          />
          {selectedEmailTemplate.translation?.map((item, idx) => {
            if (selectedLanguage === item.language?.code)
              return (
                <Template
                  key={item.id}
                  mail={item}
                  i={idx}
                  sendTranslation={sendTranslation}
                  variables={variables}
                  selectedTab={idx}
                  setTranslations={setTranslations}
                  translations={translations}
                />
              );
            return null;
          })}
          {selectedLanguage && (
            <div className="mt-3">
              <UploaderComponent
                uploadedFiles={
                  selectedEmailTemplate.attachment?.map(
                    (item) => item.original || item,
                  ) || []
                }
                parentTranslationPath="EmailTemplatesPage"
                translationPath={translationPath}
                uploaderPage={UploaderPageEnum.EmailTemplates}
                uploadedFileChanged={(newFiles) =>
                  setSelectedEmailTemplate((items) => ({
                    ...items,
                    attachment: newFiles,
                  }))
                }
              />
            </div>
          )}
        </div>
      }
      wrapperClasses="move-to-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      onCloseClicked={onClose}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

EmailTemplateDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  // candidate_uuid: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  selectedTemplateType: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string,
  }),
  getAllData: PropTypes.func,
  selectedEmailTemplate: PropTypes.shape({
    translation: PropTypes.array,
    attachment: PropTypes.array,
  }),
  setSelectedEmailTemplate: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
EmailTemplateDialog.defaultProps = {
  onSave: undefined,
  onClose: undefined,
  translationPath: '',
  selectedEmailTemplate: undefined,
  setSelectedEmailTemplate: undefined,
  getAllData: undefined,
};
