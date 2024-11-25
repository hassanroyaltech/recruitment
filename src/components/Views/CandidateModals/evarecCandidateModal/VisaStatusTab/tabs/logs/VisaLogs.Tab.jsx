import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment/moment';
import i18next from 'i18next';
import Avatar from '@mui/material/Avatar';
import {
  getIsAllowedPermissionV2,
  StringToColor,
} from '../../../../../../../helpers';
import { ButtonBase, Typography } from '@mui/material';
import {
  VisaRequestsCallLocationsEnum,
  VisaRequestsStatusesEnum,
} from '../../../../../../../enums';
import { useSelector } from 'react-redux';
import { EvaRecManageVisaPermissions } from '../../../../../../../permissions/eva-rec/EvaRecManageVisa.Permissions';

export const VisaLogsTab = ({
  visaRequests,
  onCallLocationChanged,
  onIsOpenDialogsChanged,
  getFullNameForRequestedFrom,
  getVisaStatusByKey,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  return (
    <div className="visa-logs-wrapper tab-wrapper">
      {visaRequests
        && visaRequests.map((item, index) => (
          <div
            className="details-section-wrapper"
            key={`visaRequestsKeys${index + 1}`}
          >
            <div className="details-body">
              <div className="details-body-item">
                <span className="details-body-item-title">
                  {t(`${translationPath}requested`)}
                </span>
                <span className="px-2">
                  {moment(item.created_at).locale(i18next.language).fromNow()}
                </span>
              </div>
              <div className="details-body-item">
                <span className="details-body-item-title">
                  {t(`${translationPath}requested-by`)}
                </span>
                <div className="d-inline-flex-v-center px-2">
                  <Avatar
                    style={{
                      backgroundColor: StringToColor(
                        getFullNameForRequestedFrom(item.requested_from),
                      ),
                    }}
                  >
                    {getFullNameForRequestedFrom(item.requested_from)
                      && getFullNameForRequestedFrom(item.requested_from)
                        .split(' ')
                        .map((word) => word[0])}
                  </Avatar>
                  <Typography className="px-2">
                    {getFullNameForRequestedFrom(item.requested_from)}
                  </Typography>
                </div>
              </div>
              <div className="details-body-item">
                <span className="details-body-item-title">
                  {t(`${translationPath}border-number`)}
                </span>
                <span className="px-2">{item.border_number || 'N/A'}</span>
              </div>
              <div className="details-body-item">
                <span className="details-body-item-title">
                  {t(`${translationPath}status`)}
                </span>
                <span className="px-2">
                  {getVisaStatusByKey(item.status).value || 'N/A'}
                </span>
              </div>
              {/* more_info */}
              <div className="details-body-item">
                <span className="details-body-item-title">
                  {t(`${translationPath}visa-stage`)}
                </span>
                <div className="stage-tag-wrapper">
                  <span className="fas fa-circle" />
                  <span className="px-1">{item.stage.title}</span>
                </div>
              </div>
              {item.status === VisaRequestsStatusesEnum.RequestInfo.key && (
                <>
                  <div className="details-body-item">
                    <span className="details-body-item-title">
                      {t(`${translationPath}request-more-info-by`)}
                    </span>
                    <div className="d-inline-flex-v-center px-2">
                      <Avatar
                        style={{
                          backgroundColor: StringToColor(
                            getFullNameForRequestedFrom(item.more_info_by),
                          ),
                        }}
                      >
                        {getFullNameForRequestedFrom(item.more_info_by)
                          && getFullNameForRequestedFrom(item.more_info_by)
                            .split(' ')
                            .map((word) => word[0])}
                      </Avatar>
                      <Typography className="px-2">
                        {getFullNameForRequestedFrom(item.more_info_by)}
                      </Typography>
                    </div>
                  </div>
                  <div className="details-body-item">
                    <span className="details-body-item-title">
                      {t(`${translationPath}more-information`)}
                    </span>
                    <span className="px-2">{item.more_info || 'N/A'}</span>
                  </div>
                </>
              )}
            </div>
            <div className="details-footer">
              {getIsAllowedPermissionV2({
                permissions,
                permissionId: EvaRecManageVisaPermissions.ViewVisaAllocation.key,
              }) && (
                <ButtonBase
                  className="btns theme-outline miw-0 mb-2"
                  onClick={() => {
                    onCallLocationChanged(
                      VisaRequestsCallLocationsEnum.EvaRecVisaStatusViewDetails.key,
                    );
                    onIsOpenDialogsChanged('visaRequestManagement', true, item)();
                  }}
                >
                  <span>{t(`${translationPath}view-details`)}</span>
                  <span className="fas fa-external-link-alt mx-2" />
                </ButtonBase>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

VisaLogsTab.propTypes = {
  visaRequests: PropTypes.instanceOf(Array),
  onCallLocationChanged: PropTypes.func.isRequired,
  onIsOpenDialogsChanged: PropTypes.func.isRequired,
  getFullNameForRequestedFrom: PropTypes.func.isRequired,
  getVisaStatusByKey: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

VisaLogsTab.defaultProps = {
  visaRequests: [],
};
