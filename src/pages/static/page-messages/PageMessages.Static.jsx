import React from 'react';
import PropTypes from 'prop-types';
import { LoadableImageComponant } from '../../../components';
import NoDataImage from '../../../assets/images/shared/empty-1.png';
import { useTranslation } from 'react-i18next';
import './PageMessages.Style.scss';

const PageMessagesStatic = ({
  message,
  image,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="page-messages-static-wrapper">
      <div className="page-messages-static-body">
        <LoadableImageComponant
          classes="page-messages-image-wrapper"
          alt={
            (message && t(`${translationPath}${message}`))
            || t(`${translationPath}no-data`)
          }
          src={image}
        />
        <div className="page-message-wrapper">
          <span>{t(`${translationPath}${message}`)}</span>
        </div>
      </div>
    </div>
  );
};

PageMessagesStatic.propTypes = {
  message: PropTypes.string,
  image: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
PageMessagesStatic.defaultProps = {
  message: 'no-data-found',
  image: NoDataImage,
  parentTranslationPath: 'Shared',
  translationPath: '',
};

export default PageMessagesStatic;
