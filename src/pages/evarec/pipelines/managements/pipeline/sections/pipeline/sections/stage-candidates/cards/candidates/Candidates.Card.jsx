import React, { memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import moment from 'moment';
import i18next from 'i18next';
import { Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import {
  getIsAllowedPermissionV2,
  GlobalSecondaryDateFormat,
  StringToColor,
} from '../../../../../../../../../../../helpers';
import defaultUserImage from '../../../../../../../../../../../assets/icons/user-avatar.svg';
import {
  CheckboxesComponent,
  LinearProgressComponent,
  LoadableImageComponant,
  TooltipsComponent,
} from '../../../../../../../../../../../components';
import { PipelineStageMovementTypes } from '../../../../../../../../../../../enums/Pages/PipelineStageMovementTypes.Enum';
import { PipelineStagePeriodTypesEnum } from '../../../../../../../../../../../enums';
import { ManageApplicationsPermissions } from '../../../../../../../../../../../permissions';
import { useSelector } from 'react-redux';

export const CandidatesCard = memo(
  ({
    candidateItem,
    candidateIndex,
    isLoading,
    isBulkSelect,
    stages,
    stageItem,
    isDisabledAllDragging,
    isTempItem,
    getIsSelectedCandidate,
    selectCandidateChangeHandler,
    isLocalLoading,
    getIsDragCandidateDisabled,
    onCandidateClick,
    parentTranslationPath,
    translationPath,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [activeTooltip, setActiveTooltip] = useState({
      discussions: null,
      totalActions: null,
    });
    const permissions = useSelector(
      (reducerState) => reducerState?.permissionsReducer?.permissions,
    );

    const getIsExceededTime = useMemo(
      () => (movedToStageAt, timeframeDuration, timeframeDurationType) =>
        moment().isAfter(
          moment
            .unix(movedToStageAt)
            .add(
              timeframeDuration,
              Object.values(PipelineStagePeriodTypesEnum).find(
                (item) => item.key === timeframeDurationType,
              )?.momentKey,
            ),
        ),
      [],
    );
    return (
      <Draggable
        draggableId={candidateItem.uuid}
        index={candidateIndex}
        isDragDisabled={
          stages.length < 2
          || isLoading
          || isLocalLoading
          || isTempItem
          || isDisabledAllDragging
          || !getIsAllowedPermissionV2({
            permissions,
            permissionId: ManageApplicationsPermissions.MoveEvaRecApplication.key,
          })
          || getIsDragCandidateDisabled(stageItem)
        }
      >
        {(provided, snapshot) => (
          <div
            className={`candidate-item-wrapper${
              ((stages.length < 2
                || isLoading
                || isLocalLoading
                || isDisabledAllDragging
                || isTempItem
                || getIsDragCandidateDisabled(stageItem))
                && ' is-disabled-candidate-drag')
              || ''
            }${(snapshot.isDragging && ' is-dragging') || ''}${
              (isTempItem && ' is-temp-item') || ''
            }`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            role="button"
            tabIndex={0}
            onKeyUp={() => {}}
            id={`candidateId${candidateItem.uuid}`}
            onClick={onCandidateClick(candidateItem, candidateIndex)}
          >
            <div className="card-content-wrapper">
              <div className="card-header-wrapper">
                <span className="d-inline-flex-v-center px-2">
                  {(!isBulkSelect
                    && (((candidateItem.profile_pic || !candidateItem.name) && (
                      <LoadableImageComponant
                        classes="card-user-image-wrapper"
                        alt={candidateItem.name || t(`${translationPath}user-image`)}
                        src={candidateItem.profile_pic || defaultUserImage}
                      />
                    )) || (
                      <Avatar
                        style={{
                          backgroundColor: StringToColor(candidateItem.name),
                        }}
                        className="user-avatar-wrapper"
                      >
                        {(candidateItem.name
                          && candidateItem.name.split(' ').map((word) => word[0]))
                          || ''}
                      </Avatar>
                    ))) || (
                    <div className="checkbox-item-wrapper">
                      <CheckboxesComponent
                        idRef={`selectCandidateCheckboxRef${stageItem.uuid}-${
                          candidateIndex + 1
                        }`}
                        onSelectedCheckboxClicked={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          selectCandidateChangeHandler(candidateItem, stageItem)(
                            event,
                            !getIsSelectedCandidate(candidateItem.uuid),
                          );
                        }}
                        isDisabled={isDisabledAllDragging}
                        singleChecked={getIsSelectedCandidate(candidateItem.uuid)}
                      />
                    </div>
                  )}
                  <span className="header-text fz-14px px-2">
                    {candidateItem.name}
                  </span>
                </span>
              </div>
              <div className="card-body-wrapper">
                <div className="body-item-wrapper d-flex-v-center">
                  {(candidateItem.score_found && (
                    <LinearProgressComponent
                      value={candidateItem.score}
                      isWithPercentage
                      floatNumbers={2}
                    />
                  ))
                    || <span className="px-2">{t(`${translationPath}under-processing`)}</span>}
                  {candidateItem?.is_overqualified_exp && (
                    <span className="fas fa-plus px-1 fz-12px" />
                  )}
                </div>
                {candidateItem.apply_at && (
                  <div className="body-item-wrapper">
                    <span className="px-2">
                      {moment
                        .unix(candidateItem.apply_at)
                        .locale(i18next.language)
                        .format(GlobalSecondaryDateFormat)}
                    </span>
                  </div>
                )}
                <div className="body-item-wrapper">
                  <span className="px-2">{candidateItem.email}</span>
                </div>
              </div>
              <div className="card-footer-wrapper">
                <span>
                  <TooltipsComponent
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    isOpen={activeTooltip.discussions === candidateIndex}
                    onOpen={() =>
                      setActiveTooltip((items) => ({
                        ...items,
                        discussions: candidateIndex,
                      }))
                    }
                    onClose={() =>
                      setActiveTooltip((items) => ({
                        ...items,
                        discussions: null,
                      }))
                    }
                    title="discussions"
                    contentComponent={
                      <span className="px-2">
                        <span className="fas fa-comment" />
                        <span className="px-2">
                          {candidateItem.num_of_discussion || 0}
                        </span>
                      </span>
                    }
                  />
                  <TooltipsComponent
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    isOpen={activeTooltip.totalActions === candidateIndex}
                    onOpen={() =>
                      setActiveTooltip((items) => ({
                        ...items,
                        totalActions: candidateIndex,
                      }))
                    }
                    onClose={() =>
                      setActiveTooltip((items) => ({
                        ...items,
                        totalActions: null,
                      }))
                    }
                    title="total-actions"
                    contentComponent={
                      <span className="px-2">
                        <span className="fas fa-bolt" />
                        <span className="px-2">
                          {stageItem.actions?.length || 0}
                        </span>
                      </span>
                    }
                  />
                </span>
                {stageItem.is_with_timeframe && (
                  <span
                    className={`timeframe-tag-wrapper${
                      (getIsExceededTime(
                        candidateItem.move_to_stage_at,
                        stageItem.timeframe_duration,
                        stageItem.timeframe_duration_type,
                      )
                        && ' is-exceeded-timeframe')
                      || ''
                    }`}
                  >
                    <span className="far fa-clock" />
                    <span className="px-1">
                      {moment
                        .unix(candidateItem.move_to_stage_at)
                        .locale(i18next.language)
                        .fromNow()}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  },
);
CandidatesCard.displayName = 'CandidatesCard';
CandidatesCard.propTypes = {
  candidateItem: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profile_pic: PropTypes.string,
    score: PropTypes.number,
    apply_at: PropTypes.number,
    move_to_stage_at: PropTypes.number,
    num_of_discussion: PropTypes.number,
    is_overqualified_exp: PropTypes.bool,
    score_found: PropTypes.bool,
  }).isRequired,
  candidateIndex: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isTempItem: PropTypes.bool,
  isBulkSelect: PropTypes.bool.isRequired,
  stages: PropTypes.instanceOf(Array).isRequired,
  isDisabledAllDragging: PropTypes.bool.isRequired,
  getIsSelectedCandidate: PropTypes.func.isRequired,
  selectCandidateChangeHandler: PropTypes.func.isRequired,
  isLocalLoading: PropTypes.bool.isRequired,
  getIsDragCandidateDisabled: PropTypes.func.isRequired,
  stageItem: PropTypes.shape({
    uuid: PropTypes.string,
    total_candidates: PropTypes.number,
    is_with_timeframe: PropTypes.bool,
    timeframe_duration: PropTypes.number,
    timeframe_duration_type: PropTypes.oneOf(
      Object.values(PipelineStagePeriodTypesEnum).map((item) => item.key),
    ),
    move_in_out_type: PropTypes.oneOf(
      Object.values(PipelineStageMovementTypes).map((item) => item.key),
    ),
    actions: PropTypes.instanceOf(Array),
  }).isRequired,
  onCandidateClick: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
CandidatesCard.defaultProps = {
  isTempItem: false,
};
