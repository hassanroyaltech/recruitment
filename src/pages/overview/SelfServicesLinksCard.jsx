import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import { Col } from 'reactstrap';
import { GenerateSSOKey } from '../../services';
import { showError } from '../../helpers';
import { SelfServicesCardEnum } from '../../enums/Shared/SelfServicesCard.Enum';
import { VitallyTrack } from '../../utils/Vitally';

const translationPath = '';
const parentTranslationPath = 'Overview';

const SelfServicesLinksCard = () => {
  const { t } = useTranslation(parentTranslationPath);

  const selfServiceHandler = useCallback(
    async (pageKey) => {
      VitallyTrack();
      const response = await GenerateSSOKey();
      if (response && response.status === 201) {
        const { results } = response.data;
        const account_uuid = localStorage.getItem('account_uuid');
        const user
          = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));

        window.open(
          `${process.env.REACT_APP_SELFSERVICE_URL}/accounts/login?token_key=${
            results.key
          }&account_uuid=${account_uuid}${
            pageKey ? `&redirect_page=${pageKey}` : ''
          }&is_external&${
            user?.results?.user?.uuid ? `user_uuid=${user?.results?.user?.uuid}` : ''
          }`,
          '_blank',
        );
      } else if (!response || response.message)
        showError(
          response?.message
            || t(`${translationPath}signup-requirements-update-failed`),
        );
    },
    [t],
  );

  return Object.values(SelfServicesCardEnum).map((element, index) => (
    <Col sm="12" xl="4" key={`${index + 1}-${element.key}-card-item`}>
      <div className="card-stats card">
        <ButtonBase className="btns" onClick={() => selfServiceHandler(element.key)}>
          <span>{t(`${translationPath}${element.value}`)}</span>
        </ButtonBase>
      </div>
    </Col>
  ));
};

export default SelfServicesLinksCard;
