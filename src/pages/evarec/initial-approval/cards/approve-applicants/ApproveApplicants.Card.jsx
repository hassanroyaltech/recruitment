import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase, CircularProgress } from '@mui/material';
import i18next from 'i18next';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {
  ApproveApplicantsTypesEnum,
  CandidateTypesEnum,
  SystemActionsEnum,
} from '../../../../../enums';
import {
  CheckboxesComponent,
  LoadableImageComponant,
  LoaderComponent,
  TooltipsComponent,
} from '../../../../../components';
import ManIcon from '../../../../../assets/icons/business-man.png';
import './ApproveApplicants.Style.scss';
import { getIsAllowedPermissionV2 } from '../../../../../helpers';
import { PreScreeningApprovalPermissions } from '../../../../../permissions';

export const ApproveApplicantsCard = ({
  data,
  isLoading,
  translationPath,
  onActionsClicked,
  selectedApplicants,
  parentTranslationPath,
  selectedApplicantsHandler,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const [activeTooltip, setActiveTooltip] = useState({
    rowIndex: -1,
    actionIndex: -1,
  });

  const getApproveApplicantsTypeEnum = useMemo(
    () => (key) =>
      Object.values(ApproveApplicantsTypesEnum).find((item) => item.key === key),
    [],
  );

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to check if the applicant is selected ot not
   */
  const getIsSelectedApplicants = useCallback(
    (uuid) => selectedApplicants.includes(uuid),
    [selectedApplicants],
  );

  return (
    <div className="approve-applicants-cards-wrapper childs-wrapper">
      {data
        && data.results.map((item, index) => (
          <div
            className="approve-applicants-card-wrapper card-wrapper"
            key={`approveApplicantsCardKey${index + 1}`}
          >
            <div className="card-content-wrapper">
              <div className="card-body-wrapper">
                <div className="card-body-item-wrapper">
                  <div className="px-2 item-sections-wrapper mb-2">
                    <LoadableImageComponant
                      src={item.image || ''}
                      defaultImage={ManIcon}
                      classes="card-image-wrapper"
                      alt={`${t(translationPath)}applicant-image`}
                    />
                    <span className="pl-2-reversed">
                      <span className="d-flex header-text mb-1">
                        {item.name || 'N/A'}
                      </span>
                      <span className="d-flex t-break-wrap">
                        {item.email || 'N/A'}
                      </span>
                      {item.candidate_type === CandidateTypesEnum.Employee.value ? (
                        <span className="chip-item small-item mx-0 my-1">
                          {t(`${translationPath}employee`)}
                        </span>
                      ) : null}
                    </span>
                  </div>
                  {item.is_lock && item.lock_at && (
                    <span className="pl-2-reversed">
                      <span>
                        <span>{t(`${translationPath}can-be-re-added`)}</span>
                        <span>:</span>
                        <span className="px-1">
                          {moment
                            .unix(item.lock_at)
                            .locale(i18next.language)
                            .fromNow()}
                        </span>
                      </span>
                    </span>
                  )}
                </div>
                <div className="card-header-checkbox">
                  <CheckboxesComponent
                    idRef={`hierarchyRef${index + 1}`}
                    singleChecked={getIsSelectedApplicants(item.uuid)}
                    onSelectedCheckboxChanged={(event, isChecked) => {
                      const localSelectedApplicants = [
                        ...(selectedApplicants || []),
                      ];

                      if (isChecked) localSelectedApplicants.push(item.uuid);
                      else {
                        const hierarchyIndex = localSelectedApplicants.indexOf(
                          item.uuid,
                        );
                        if (hierarchyIndex !== -1)
                          localSelectedApplicants.splice(hierarchyIndex, 1);
                      }
                      selectedApplicantsHandler(localSelectedApplicants);
                    }}
                  />
                </div>
              </div>
              <div className="card-footer-wrapper">
                <div className="px-2">
                  {item.status && getApproveApplicantsTypeEnum(item.status) && (
                    <span
                      className={getApproveApplicantsTypeEnum(item.status).color}
                    >
                      <span className="fas fa-circle" />
                      <span className="px-1">
                        {t(
                          `${translationPath}${
                            getApproveApplicantsTypeEnum(item.status).value
                          }`,
                        )}
                      </span>
                    </span>
                  )}
                </div>
                <div>
                  {[SystemActionsEnum.addUser, SystemActionsEnum.view].map(
                    (action, actionIndex) => (
                      <TooltipsComponent
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        key={`${action.key}-${index + 1}`}
                        isOpen={
                          activeTooltip.index === index
                          && activeTooltip.actionIndex === actionIndex
                        }
                        title={
                          (action.key === SystemActionsEnum.view.key
                            && t(`${translationPath}view-details`))
                          || (action.key === SystemActionsEnum.addUser.key
                            && (!getIsAllowedPermissionV2({
                              permissions,
                              permissionId:
                                PreScreeningApprovalPermissions.AddToPreScreening
                                  .key,
                            })
                              ? t(`${translationPath}no-permision`)
                              : t(
                                `${translationPath}add-to-pipeline${
                                  item.pipeline_uuid ? '-description' : ''
                                }`,
                              )))
                          || ''
                        }
                        contentComponent={
                          <span>
                            <ButtonBase
                              className="btns-icon theme-transparent mr-1-reversed c-primary"
                              disabled={
                                isLoading
                                || (action.key === SystemActionsEnum.addUser.key
                                  && ((item.status
                                    !== ApproveApplicantsTypesEnum.Approved.key
                                    && item.status
                                      !== ApproveApplicantsTypesEnum.ImmediateHire
                                        .key)
                                    || isLoading
                                    || !item.category_code
                                    || item.is_lock
                                    || !getIsAllowedPermissionV2({
                                      permissions,
                                      permissionId:
                                        PreScreeningApprovalPermissions
                                          .AddToPreScreening.key,
                                    })))
                                || false
                              }
                              onClick={() => {
                                if (onActionsClicked) onActionsClicked(action, item);
                              }}
                              onMouseOver={() =>
                                setActiveTooltip({
                                  actionIndex,
                                  index,
                                })
                              }
                              onMouseOut={() =>
                                setActiveTooltip({
                                  actionIndex: -1,
                                  index: -1,
                                })
                              }
                            >
                              {SystemActionsEnum.addUser.key === action.key && (
                                <div
                                  className={`add-user-icon-wrapper ${
                                    item.pipeline_uuid ? 'is-disabled' : ''
                                  }`}
                                >
                                  <span className={SystemActionsEnum.addUser.icon} />
                                </div>
                              )}
                              {SystemActionsEnum.view.key === action.key
                                && (isLoading ? (
                                  <CircularProgress size={18} />
                                ) : (
                                  <span className={SystemActionsEnum.view.icon} />
                                ))}
                            </ButtonBase>
                          </span>
                        }
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      <LoaderComponent
        isLoading={isLoading}
        isSkeleton
        wrapperClasses="approve-applicants-card-wrapper card-wrapper"
        skeletonClasses="card-content-wrapper"
        skeletonStyle={{ minHeight: 125 }}
      />
    </div>
  );
};

ApproveApplicantsCard.propTypes = {
  data: PropTypes.shape({
    results: PropTypes.instanceOf(Array),
    totalCount: PropTypes.number,
  }),
  onLoadMore: PropTypes.func,
  onActionsClicked: PropTypes.func,
  translationPath: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  selectedApplicantsHandler: PropTypes.func,
  selectedApplicants: PropTypes.instanceOf(Array),
  parentTranslationPath: PropTypes.string.isRequired,
};

ApproveApplicantsCard.defaultProps = {
  data: {
    results: [],
    totalCount: 0,
  },
  translationPath: '',
  onLoadMore: undefined,
  selectedApplicants: [],
  onActionsClicked: undefined,
  selectedApplicantsHandler: undefined,
};
