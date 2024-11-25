import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CandidateFlowStatusesEnum, OnboardingTypesEnum } from '../../../../enums';
import moment from 'moment/moment';
import i18next from 'i18next';
import { GlobalDisplayDateTimeFormat } from '../../../../helpers';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import './InvitationsCard.Style.scss';
import { TooltipsComponent } from '../../../../components';

const InvitationsCardSection = ({
  item,
  onInvitationCardClicked,
  isGlobalLoading,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const getFlowStatus = useCallback(
    (status) =>
      Object.values(CandidateFlowStatusesEnum).find((item) => item.key === status),
    [],
  );
  return (
    <div className="invitations-card-section-wrapper">
      <ButtonBase
        className="invitations-card-wrapper"
        disabled={isGlobalLoading}
        onClick={onInvitationCardClicked(item)}
      >
        <div className="invitations-card-body">
          <div className="invitations-card-row mb-3">
            <span className={`fz-before-18px ${OnboardingTypesEnum.Flows.icon}`} />
          </div>
          <div className="invitations-card-row title-wrapper">
            <TooltipsComponent
              title={item.title}
              contentComponent={<span className="header-text">{item.title}</span>}
            />
          </div>
          <div className="invitations-card-row">
            <span className="tags-wrapper-v2">
              <div
                className={`tag-wrapper ${getFlowStatus(item.form_status).color}`}
              >
                {t(`${translationPath}${getFlowStatus(item.form_status).value}`)}
              </div>
            </span>
          </div>
          {item.created_at && (
            <div className="invitations-card-row">
              <span>{t(`${translationPath}created-at`)}</span>
              <span className="px-1">
                {moment(item.created_at)
                  .locale(i18next.language)
                  .format(GlobalDisplayDateTimeFormat)}
              </span>
            </div>
          )}
          {item.start_date && (
            <div className="invitations-card-row">
              <span>{t(`${translationPath}activation-date`)}</span>
              <span className="px-1">
                {moment(item.start_date)
                  .locale(i18next.language)
                  .format(GlobalDisplayDateTimeFormat)}
              </span>
            </div>
          )}
        </div>
        <div className="invitations-card-footer">
          <div className="invitations-card-row fj-end">
            <span className="fas fa-arrow-right" />
          </div>
        </div>
      </ButtonBase>
    </div>
  );
};

InvitationsCardSection.propTypes = {
  item: PropTypes.instanceOf(Object).isRequired,
  onInvitationCardClicked: PropTypes.func,
  isGlobalLoading: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default memo(InvitationsCardSection);
