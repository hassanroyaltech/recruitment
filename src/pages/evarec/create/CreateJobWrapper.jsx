import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreateJob } from './index';

const translationPath = '';
const parentTranslationPath = 'CreateJob';

/**
 * A wrapper function component for the CreateJob component
 * @returns {JSX.Element}
 * @constructor
 */
export const CreateJobWrapper = () => {
  const { t } = useTranslation(parentTranslationPath);

  /**
   * Return JSX
   */
  return <CreateJob modalTitle={t(`${translationPath}create-a-new-application`)} />;
};
export default CreateJobWrapper;
