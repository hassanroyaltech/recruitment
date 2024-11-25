import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../../components';
import { ButtonBase, Divider } from '@mui/material';
import '../Offers.Style.scss';
import { SendOfferMethodsEnum } from 'enums/Shared/SendOfferMethods.Enum';
import { showError } from 'helpers';

export const CreateNewOfferDialog = ({
  isOpen,
  candidate_uuid,
  onSave,
  onClose,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText="create-new-offer-title"
      contentClasses="px-0"
      dialogContent={
        <div className="methods-grid-wrapper mx-4">
          <div>
            <div className="mimic-btn-spacing">
              <span>{t(`${translationPath}pdf-attach`)}</span>
            </div>
            <div className="d-flex my-3">
              <ButtonBase
                disabled
                onClick={() => {
                  onSave(SendOfferMethodsEnum.PDF.key);
                }}
                className="btns theme-transparent reset-btn-cl visuallyEnabled"
              >
                <div className="btn-grid-wrapper">
                  <div className="mx-2 d-flex-v-center">
                    <span className="fa-4x fas fa-file" />
                  </div>
                  <div className="text-start-al d-flex-v-center">
                    <div>
                      {t(`${translationPath}${SendOfferMethodsEnum.PDF.title}`)}
                    </div>
                    {/* <div className='my-2'>{t(`${translationPath}${SendOfferMethodsEnum.PDF.description}`)}</div> */}
                  </div>
                  <ButtonBase className="btns-icon theme-transparent m-0">
                    <span className="fas fa-long-arrow-alt-right" />
                  </ButtonBase>
                </div>
              </ButtonBase>
            </div>
            <div className="d-flex my-3">
              <ButtonBase
                disabled
                onClick={() => {
                  showError('Coming Soon, please select another method');
                  // onSave(SendOfferMethodsEnum.PDFLink.key)
                }}
                className="btns theme-transparent reset-btn-cl visuallyEnabled"
              >
                <div className="btn-grid-wrapper">
                  <div className="mx-2 d-flex-v-center">
                    <span className="fa-4x fas fa-link" />
                  </div>
                  <div className="text-start-al d-flex-v-center">
                    <div>
                      {t(`${translationPath}${SendOfferMethodsEnum.PDFLink.title}`)}
                    </div>
                    {/* <div className='my-2'>{t(`${translationPath}${SendOfferMethodsEnum.PDFLink.description}`)}</div> */}
                  </div>
                  <ButtonBase className="btns-icon theme-transparent m-0">
                    <span className="fas fa-long-arrow-alt-right" />
                  </ButtonBase>
                </div>
              </ButtonBase>
            </div>
          </div>

          <Divider orientation="vertical" flexItem className="mx-3 auto-height-cl" />

          <div>
            <div className="mimic-btn-spacing">
              <span>{t(`${translationPath}web-form`)}</span>
              <span>{t(`${translationPath}web-form-desc`)}</span>
            </div>
            <div className="d-flex my-3">
              <ButtonBase
                onClick={() => {
                  onSave(SendOfferMethodsEnum.WebForm.key);
                }}
                className="btns theme-transparent reset-btn-cl"
              >
                <div className="btn-grid-wrapper">
                  <div className="mx-2 d-flex-v-center">
                    <span className="fa-4x fas fa-envelope" />
                  </div>
                  <div className="text-start-al d-flex-v-center">
                    <div>
                      {t(`${translationPath}${SendOfferMethodsEnum.WebForm.title}`)}
                    </div>
                    {/* <div className='my-2'>{t(`${translationPath}${SendOfferMethodsEnum.WebForm.description}`)}</div> */}
                  </div>
                  <ButtonBase className="btns-icon theme-transparent m-0">
                    <span className="fas fa-long-arrow-alt-right" />
                  </ButtonBase>
                </div>
              </ButtonBase>
            </div>
            {/* <div className='d-flex my-3'>
              <ButtonBase 
                onClick={()=>{
                  showError('Coming Soon, please select another method')
                  // onSave(SendOfferMethodsEnum.FormLink.key)
                }}
                className="btns theme-transparent reset-btn-cl"
              >
                <div className="mx-2 d-flex-v-center">
                  <span className="fa-4x fas fa-link" />
                </div>
                <div  className='text-start-al d-flex-v-center'>
                  <div>{t(`${translationPath}${SendOfferMethodsEnum.FormLink.title}`)}</div>
                  <div className='my-2'>{t(`${translationPath}${SendOfferMethodsEnum.FormLink.description}`)}</div>
                </div>
                <ButtonBase className="btns-icon theme-transparent m-0">
                  <span className="fas fa-long-arrow-alt-right" />
                </ButtonBase>
              </ButtonBase>
            </div> */}
          </div>
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

CreateNewOfferDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  candidate_uuid: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
CreateNewOfferDialog.defaultProps = {
  onSave: undefined,
  onClose: undefined,
  translationPath: '',
};
