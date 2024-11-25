import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Avatar from '@mui/material/Avatar';
import i18next from 'i18next';
import { ApproveApplicantsTypesEnum } from '../../../../../../../enums';
import { StringToColor } from '../../../../../../../helpers';
import './Steps.Style.scss';
import { TooltipsComponent } from '../../../../../../../components';

export const StepsTab = ({
  steps,
  activeStep,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeTooltip, setActiveTooltip] = useState({
    approvalIndex: -1,
    approverIndex: -1,
  });

  /**
   * @param key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get active approve type
   */
  const getApproveApplicantsTypeEnum = useMemo(
    () => (key) =>
      Object.values(ApproveApplicantsTypesEnum).find((item) => item.key === key),
    [],
  );

  /**
   * @param item
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the full name
   */
  const getFullName = useCallback(
    (item) =>
      `${
        item.first_name && (item.first_name[i18next.language] || item.first_name.en)
      }${
        item.last_name
        && ` ${item.last_name[i18next.language] || item.last_name?.en || ''}`
      }` || 'N/A',
    [],
  );
  return (
    <div className="steps-tab tab-wrapper">
      {steps?.map((item, index) => (
        <div
          key={`stepsKey${index + 1}`}
          className={`step-item-wrapper${
            (activeStep && activeStep.uuid === item.uuid && ' is-active-step') || ''
          }`}
        >
          <div
            className={`step-item-body${
              (getApproveApplicantsTypeEnum(item.status)
                && ` ${getApproveApplicantsTypeEnum(item.status).borderColor}`)
              || ''
            }`}
          >
            <div
              className={`d-flex-v-center px-2 mb-1 header-text${
                (getApproveApplicantsTypeEnum(item.status)
                  && ` ${getApproveApplicantsTypeEnum(item.status).color}`)
                || ''
              }`}
            >
              <span>{t(`${translationPath}approval-#`)}</span>
              <span className="px-1">{index + 1}</span>
              {item.user && getApproveApplicantsTypeEnum(item.status) && (
                <span className="px-1">
                  ({t(getApproveApplicantsTypeEnum(item.status).value)})
                </span>
              )}
            </div>
            {(!item.user && (
              <div className="d-flex-v-center px-2">
                {t(`${translationPath}not-decided-yet`)}
              </div>
            )) || (
              <div className="d-flex-v-center px-2">
                <Avatar
                  style={{
                    backgroundColor: StringToColor(getFullName(item.user)),
                  }}
                  title={getFullName(item.user)}
                >
                  {getFullName(item.user)
                    .split(' ')
                    .map((word) => word[0])}
                </Avatar>
                <span className="pl-2-reversed">
                  <span className="d-flex header-text mb-1">
                    {getFullName(item.user)}
                  </span>
                  <span className="d-flex">{item.user.email || 'N/A'}</span>
                </span>
              </div>
            )}
            {item.users && (
              <span className="d-flex flex-wrap">
                {item.users.map((user, userIndex) => (
                  <TooltipsComponent
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    key={`approversList${index + 1}-${userIndex + 1}`}
                    isOpen={
                      activeTooltip.approvalIndex === index
                      && activeTooltip.userIndex === userIndex
                    }
                    titleComponent={
                      <span className="c-white">
                        <div className="d-flex-v-center mb-1">
                          <span>{t(`${translationPath}name`)}</span>
                          <span>:</span>
                          <span className="px-1">{getFullName(user)}</span>
                        </div>
                        <div className="d-flex-v-center">
                          <span>{t(`${translationPath}email`)}</span>
                          <span>:</span>
                          <span className="px-1">{user.email || 'N/A'}</span>
                        </div>
                      </span>
                    }
                    contentComponent={
                      <span className="mb-2 mx-1">
                        <Avatar
                          onMouseOver={() =>
                            setActiveTooltip({
                              approvalIndex: index,
                              userIndex,
                            })
                          }
                          className=""
                          onMouseOut={() =>
                            setActiveTooltip({
                              approvalIndex: -1,
                              userIndex: -1,
                            })
                          }
                          style={{
                            backgroundColor: StringToColor(getFullName(user)),
                          }}
                          title={getFullName(user)}
                        >
                          {getFullName(user)
                            .split(' ')
                            .map((word) => word[0])}
                        </Avatar>
                      </span>
                    }
                  />
                ))}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

StepsTab.propTypes = {
  steps: PropTypes.instanceOf(Array).isRequired,
  activeStep: PropTypes.instanceOf(Object),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
StepsTab.defaultProps = {
  activeStep: null,
  translationPath: '',
};
