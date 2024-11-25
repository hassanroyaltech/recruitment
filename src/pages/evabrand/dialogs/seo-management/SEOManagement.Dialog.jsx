// React and reactstrap
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input } from 'reactstrap';
// Input
import CreatableSelect from 'react-select/creatable';

// Components for modal
import { ModalButtons } from 'components/Buttons/ModalButtons';
import { StandardModal } from 'components/Modals/StandardModal';

// Context API
import { useTranslation } from 'react-i18next';
import { GetEvaBrandSEOByLanguageId, UpdateEvaBrandSEO } from '../../../../services';
import { showError, showSuccess } from '../../../../helpers';
import { SEOManagementUploaderControls } from './controls';

/**
 * SEO Modal component, allows us to configure keywords, title, and an image for SEO.
 * @param props
 * @returns {JSX.Element}
 */
export const SEOManagementDialog = ({
  language_uuid,
  language,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  // Required Data
  const [data, setData] = useState({});

  // Loading states
  const [isWorking, setIsWorking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  /**
   * Get data via API
   * @returns {Promise<void>}
   */
  const getData = useCallback(async () => {
    setIsWorking(true);
    const response = await GetEvaBrandSEOByLanguageId({
      language_uuid,
    });
    setIsWorking(false);
    if (response && response.status === 200) setData({ ...response.data.results });
    else {
      showError(t(`${translationPath}error-in-getting-data`), response);
      if (isOpenChanged) isOpenChanged();
    }
  }, [isOpenChanged, language_uuid, t, translationPath]);

  /**
   * Wrapper to update data
   * @returns {Promise<void>}
   */
  const saveButtonHandler = useCallback(async () => {
    setIsWorking(true);
    setIsSaving(true);
    if (!data) return;
    /**
     * Update via API
     */
    const toSaveDto = {
      language_uuid,
      ...data,
      seo_image_uuid: (data.seo_image && data.seo_image.uuid) || null,
    };
    const response = await UpdateEvaBrandSEO(toSaveDto);
    if (response && response.status === 200) {
      setIsWorking(false);
      setIsSaving(false);
      showSuccess(t(`${translationPath}successfully-updated`));
      setSaveButtonDisabled(true);
      if (isOpenChanged) isOpenChanged();
    } else {
      setIsWorking(false);
      setIsSaving(false);
      showError(t(`${translationPath}error-in-updating-your-changes`), response);
    }
  }, [data, isOpenChanged, language_uuid, t, translationPath]);

  /**
   * Handler for update data from child
   */
  const onSEOUploaderChanged = (newValue) => {
    setData((items) => ({ ...items, seo_image: newValue }));
    setSaveButtonDisabled(false);
  };
  /**
   * Effect to prepare data
   */
  useEffect(() => {
    if (language_uuid) getData();
  }, [getData, language_uuid]);

  /**
   * Render the component
   * @return {JSX.Element}
   */
  return (
    <StandardModal
      title={t(`${translationPath}search-engine-optimization`)}
      subtitle={t(`${translationPath}search-engine-subtitle`)}
      isOpen={isOpen}
      isLoading={isWorking}
      onClose={isOpenChanged}
      languageTag={(language && language.title) || ''}
      buttons={
        <ModalButtons
          cancelButton
          cancelButtonHandler={isOpenChanged}
          saveButton
          saveButtonDisabled={saveButtonDisabled}
          saveButtonHandler={saveButtonHandler}
          isSaving={isSaving}
        />
      }
    >
      {/* MODAL BODY */}
      {data && !isWorking && (
        <div className="mt-5">
          <div className="mb-3">
            <Input
              className="form-control-alternative"
              type="text"
              placeholder={t(`${translationPath}website-title`)}
              value={data.seo_title}
              onChange={(e) => {
                const { value } = e.currentTarget;
                setData((items) => ({ ...items, seo_title: value }));
                setSaveButtonDisabled(false);
              }}
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control form-control-alternative"
              rows="3"
              placeholder={t(`${translationPath}website-description`)}
              value={data.seo_description}
              onChange={(e) => {
                const { value } = e.currentTarget;
                setData((items) => ({ ...items, seo_description: value }));
                setSaveButtonDisabled(false);
              }}
            />
          </div>

          <div className="mb-3">
            <FormGroup>
              <label
                className="form-control-label text-gray font-weight-400"
                htmlFor="seoKeywords"
              >
                {t(`${translationPath}keywords`)}
              </label>
              <CreatableSelect
                isMulti
                name="seoKeywords"
                isClearable={false}
                noOptionsMessage={() => null}
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                onChange={(newValues) => {
                  if (newValues === null)
                    setData((items) => ({
                      ...items,
                      seo_keywords: null,
                    }));
                  else
                    setData((items) => ({
                      ...items,
                      seo_keywords: newValues.map((k) => k.value).join(','),
                    }));

                  setSaveButtonDisabled(false);
                }}
                value={
                  data.seo_keywords
                    ? data.seo_keywords.split(',').map((k) => ({
                      label: k,
                      value: k,
                    }))
                    : null
                }
                placeholder={t(`${translationPath}keywords`)}
              />
            </FormGroup>
          </div>
          <SEOManagementUploaderControls
            mediaItem={(data && data.seo_image) || {}}
            onValueChanged={onSEOUploaderChanged}
            parentId="seo_image"
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            urlStateKey="url"
            uuidStateKey="uuid"
            labelValue="upload-your-seo-image"
          />
        </div>
      )}
    </StandardModal>
  );
};
SEOManagementDialog.propTypes = {
  language_uuid: PropTypes.string,
  language: PropTypes.instanceOf(Object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
SEOManagementDialog.defaultProps = {
  language_uuid: undefined,
};
