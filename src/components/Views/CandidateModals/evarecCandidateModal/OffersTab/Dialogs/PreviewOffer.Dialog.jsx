import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../../components';
import '../Offers.Style.scss';
import { SharedAutocompleteControl } from 'pages/setups/shared';
import { OffersStatusesEnum } from 'enums';

export const PreviewOfferDialog = ({
  isOpen,
  onClose,
  parentTranslationPath,
  translationPath,
  previewData,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <DialogComponent
      maxWidth="md"
      titleText="uploaded-offer-title"
      contentClasses="px-0"
      dialogContent={
        <div className="mx-4 mb-4">
          <SharedAutocompleteControl
            isFullWidth
            searchKey="search"
            initValuesKey="key"
            isDisabled
            initValuesTitle="status"
            initValues={Object.values(OffersStatusesEnum)}
            stateKey="upload_offer_status"
            errorPath="upload_offer_status"
            title="status"
            editValue={previewData?.upload_offer_status}
            placeholder="status"
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) => t(`${translationPath}${option.status}`)}
            wrapperClasses="my-2"
          />
          <embed
            src={previewData?.file?.url}
            type={previewData?.file?.extension}
            width="100%"
            style={{ minHeight: window.innerHeight * 0.5 }}
          />
        </div>
      }
      wrapperClasses="move-to-management-dialog-wrapper"
      isOpen={isOpen}
      onCloseClicked={onClose}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

PreviewOfferDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  previewData: PropTypes.shape({
    file: PropTypes.shape({
      url: PropTypes.string,
      extension: PropTypes.string,
    }),
    upload_offer_status: PropTypes.number,
  }),
};
PreviewOfferDialog.defaultProps = {
  onClose: undefined,
  translationPath: '',
};
