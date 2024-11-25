import React, { useCallback, useState } from 'react';
import { ToastProvider } from 'react-toast-notifications';
import CreateJobTemplate from './CreateJobTemplate';
import { useTranslation } from 'react-i18next';
import { TranslationsDialog } from '../create/forms/Translations.Dialog';

const translationPath = '';
const parentTranslationPath = 'EvaRecTemplate';

/**
 * A wrapper function component for the CreateJob component
 * @returns {JSX.Element}
 * @constructor
 */
export default function EditTemplateWrapper() {
  const { t } = useTranslation(parentTranslationPath);
  const [activeField, setActiveField] = useState(null);
  const [translations, setTranslations] = useState({});

  const saveTranslations = useCallback(
    (translations) => {
      setTranslations((items) => ({ ...items, ...translations }));
    },
    [setTranslations],
  );

  /**
   * Return JSX
   */
  return (
    <ToastProvider placement="top-center">
      <CreateJobTemplate
        modalTitle={t(`${translationPath}edit-template`)}
        edit={true}
        activeField={activeField}
        setActiveField={setActiveField}
        translations={translations}
        setTranslations={setTranslations}
      />
      {!!activeField && (
        <TranslationsDialog
          isOpen={activeField}
          isOpenChanged={() => {
            if (activeField) setActiveField(null);
          }}
          activeField={activeField}
          saveTranslations={saveTranslations}
          translations={translations}
        />
      )}
    </ToastProvider>
  );
}
