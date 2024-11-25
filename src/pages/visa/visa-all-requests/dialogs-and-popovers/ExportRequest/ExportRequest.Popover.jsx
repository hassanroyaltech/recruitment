import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PopoverComponent } from '../../../../../components';
import PropTypes from 'prop-types';
import { ButtonBase } from '@mui/material';
import { ExportVisaRequests } from '../../../../../services';
import { showError, showSuccess } from '../../../../../helpers';
import './ExportRequestPopover.Style.scss';

export const ExportRequestPopover = ({
  translationPath,
  parentTranslationPath,
  attachedWith,
  popoverToggleHandler,
  selectedRequests,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const ExportRequestsHandler = useCallback(
    async ({ requests }) => {
      const response = await ExportVisaRequests({
        requests_uuid: requests?.length ? requests.map((it) => it.uuid) : null,
      });
      if (response?.status === 200) {
        showSuccess(t(`${translationPath}requests-exported-successfully`));
        popoverToggleHandler(null);
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [t, translationPath, popoverToggleHandler],
  );

  return (
    <PopoverComponent
      idRef="widget-ref"
      attachedWith={attachedWith}
      handleClose={() => popoverToggleHandler(null)}
      component={
        <div className="d-inline-flex-column-center-v m-2 pt-2 justify-content-start">
          <ButtonBase
            className="btns theme-transparent py-2 w-100 align-items-start justify-content-start"
            onClick={() => ExportRequestsHandler({ requests: selectedRequests })}
            disabled={!selectedRequests.length}
          >
            <div>
              <span className="fas fa-download mx-2" />
            </div>
            <div className="d-flex-column max-width-16rem align-items-start">
              <div>{t(`${translationPath}export-selected`)}</div>
              <div className="my-2 text-align-start-normal-whitespace">
                {t(`${translationPath}export-selected-desc`)}
              </div>
            </div>
          </ButtonBase>
          <ButtonBase
            className="btns theme-transparent py-2 w-100 align-items-start justify-content-start"
            onClick={() => ExportRequestsHandler({ requests: null })}
          >
            <div>
              <span className="fas fa-download mx-2" />
            </div>
            <div className="d-flex-column max-width-16rem align-items-start">
              <div>{t(`${translationPath}export-all`)}</div>
              <div className="my-2 text-align-start-normal-whitespace">
                {t(`${translationPath}export-all-desc`)}
              </div>
            </div>
          </ButtonBase>
        </div>
      }
    />
  );
};

ExportRequestPopover.propTypes = {
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  attachedWith: PropTypes.shape({
    sort: PropTypes.instanceOf(Object),
  }),
  popoverToggleHandler: PropTypes.func.isRequired,
  selectedRequests: PropTypes.array,
};
