import { DialogComponent } from '../../../../components';
import { Badge } from 'reactstrap';
import React, { useCallback } from 'react';
import { onboardingActivityMemberStatusesEnum } from '../../../../enums';
import { useTranslation } from 'react-i18next';

export const MembersStatusesDialog = ({
  translationPath,
  activeItem,
  isOpen,
  onCloseClicked,
  parentTranslationPath,
  onCancelClicked,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const getCompleteStatus = useCallback((item) => {
    if (item?.status === onboardingActivityMemberStatusesEnum.COMPLETED.key)
      return onboardingActivityMemberStatusesEnum.COMPLETED;
    else return onboardingActivityMemberStatusesEnum.INCOMPLETE;
  }, []);

  return (
    <DialogComponent
      maxWidth="xs"
      titleText="members"
      contentClasses="px-0"
      dialogContent={
        <div>
          {activeItem?.members?.length === 0 && (
            <div className="c-black-light fz-16px font-weight-600">
              {t(`${translationPath}no-members-data`)}
            </div>
          )}
          {activeItem?.members?.length > 0
            && activeItem?.members?.map((item, index) => (
              <div className="d-flex-v-center mb-1" key={item.uuid}>
                <i className="fas fa-user text-muted"></i>
                <span className={'px-2'}> {item.name}</span>
                <Badge className="badge-dot mr-2-reversed ml-1-reversed" color="">
                  <i className={getCompleteStatus(item).color} />
                  <span className="status">
                    {t(`${translationPath}${getCompleteStatus(item).value}`)}
                  </span>
                </Badge>
              </div>
            ))}
        </div>
      }
      saveType={'edit'}
      isOpen={isOpen}
      onCloseClicked={() => onCloseClicked()}
      onCancelClicked={() => onCancelClicked()}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};
