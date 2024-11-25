import React, { memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import moment from 'moment-hijri';
import i18next from 'i18next';
import { Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import {
  GlobalDateFormat,
  GlobalSavingDateFormat,
  GlobalSavingHijriDateFormat,
  StringToColor,
} from '../../../../../../../../../helpers';
import defaultUserImage from '../../../../../../../../../assets/icons/user-avatar.svg';
import {
  LoadableImageComponant,
  TooltipsComponent,
} from '../../../../../../../../../components';
import { PipelineStageMovementTypes } from '../../../../../../../../../enums/Pages/PipelineStageMovementTypes.Enum';
import { PipelineStagePeriodTypesEnum } from '../../../../../../../../../enums';

export const CandidatesCard = memo(
  ({
    candidateItem,
    candidateIndex,
    isLoading,
    stages,
    stageItem,
    isDisabledAllDragging,
    isTempItem,
    isLocalLoading,
    getIsDragCandidateDisabled,
    parentTranslationPath,
    translationPath,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [activeTooltip, setActiveTooltip] = useState({
      movedAt: null,
      borderNumber: null,
    });

    const getIsExceededTime = useMemo(
      () => (expiry_date, is_hijri) =>
        moment().isAfter(
          moment(
            expiry_date,
            (is_hijri && GlobalSavingHijriDateFormat) || GlobalSavingDateFormat,
          ),
        ),
      [],
    );

    const getCandidateFullName = useMemo(
      () => () =>
        `${candidateItem.candidate.first_name || ''}${
          (candidateItem.candidate.last_name
            && ` ${candidateItem.candidate.last_name}`)
          || ''
        }`,
      [candidateItem.candidate.first_name, candidateItem.candidate.last_name],
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
            // role="button"
            // tabIndex={0}
            // onKeyUp={() => {}}
            // onClick={onCandidateClick(candidateItem)}
          >
            <div className="card-content-wrapper">
              <div className="card-header-wrapper">
                <span className="d-inline-flex-v-center px-2">
                  {((candidateItem.candidate.profile_pic
                    || (!candidateItem.candidate.first_name
                      && !candidateItem.candidate.last_name)) && (
                    <LoadableImageComponant
                      classes="card-user-image-wrapper"
                      alt={
                        getCandidateFullName() || t(`${translationPath}user-image`)
                      }
                      src={candidateItem.candidate.profile_pic || defaultUserImage}
                    />
                  )) || (
                    <Avatar
                      style={{
                        backgroundColor: StringToColor(getCandidateFullName()),
                      }}
                      className="user-avatar-wrapper"
                    >
                      {(getCandidateFullName()
                        && getCandidateFullName()
                          .split(' ')
                          .map((word) => word[0]))
                        || ''}
                    </Avatar>
                  )}
                  <span className="header-text fz-14px px-2">
                    {getCandidateFullName()}
                  </span>
                </span>
              </div>
              <div className="card-body-wrapper">
                {candidateItem.moved_at && (
                  <div className="body-item-wrapper">
                    <TooltipsComponent
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      isOpen={activeTooltip.movedAt === candidateIndex}
                      onOpen={() =>
                        setActiveTooltip((items) => ({
                          ...items,
                          movedAt: candidateIndex,
                        }))
                      }
                      onClose={() =>
                        setActiveTooltip((items) => ({
                          ...items,
                          movedAt: null,
                        }))
                      }
                      title="moved-at"
                      contentComponent={
                        <span className="px-2">
                          {moment(candidateItem.moved_at)
                            .locale(i18next.language)
                            .format(GlobalDateFormat)}
                        </span>
                      }
                    />
                  </div>
                )}
                {candidateItem.border_number && (
                  <div className="body-item-wrapper">
                    <TooltipsComponent
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      isOpen={activeTooltip.borderNumber === candidateIndex}
                      onOpen={() =>
                        setActiveTooltip((items) => ({
                          ...items,
                          borderNumber: candidateIndex,
                        }))
                      }
                      onClose={() =>
                        setActiveTooltip((items) => ({
                          ...items,
                          borderNumber: null,
                        }))
                      }
                      title="border-number"
                      contentComponent={
                        <span className="px-1">
                          <span className="fas fa-border-all mx-1 " />
                          <span>{candidateItem.border_number}</span>
                        </span>
                      }
                    />
                  </div>
                )}
                <div className="body-item-wrapper">
                  <span className="px-1">
                    <span className="fas fa-cube mx-1 " />
                    <span className="wb-break-all">
                      {candidateItem.block_number}
                    </span>
                  </span>
                </div>
                {/*<div className="body-item-wrapper">*/}
                {/*  <span className="px-2">{candidateItem.candidate.email}</span>*/}
                {/*</div>*/}
                <div className="body-item-wrapper mb-0">
                  <span className="header-text fz-14px px-2">
                    {t(`${translationPath}job-title`)}
                  </span>
                </div>
                <div className="body-item-wrapper">
                  <span className="px-2">{candidateItem.job.title}</span>
                </div>
                <div className="body-item-wrapper mb-0">
                  <span className="header-text fz-14px px-2">
                    {t(`${translationPath}requested-by`)}
                  </span>
                </div>
                <div className="body-item-wrapper">
                  <span className="px-2">{`${
                    candidateItem.requested_from.first_name
                    && (candidateItem.requested_from.first_name[i18next.language]
                      || candidateItem.requested_from.first_name.en)
                  }${
                    candidateItem.requested_from.last_name
                    && ` ${
                      candidateItem.requested_from.last_name[i18next.language]
                      || candidateItem.requested_from.last_name.en
                    }`
                  }`}</span>
                </div>
                {/*<div className="body-item-wrapper">*/}
                {/*  <span className="px-2">{candidateItem.requested_from.email}</span>*/}
                {/*</div>*/}
              </div>
              <div className="card-footer-wrapper">
                <span></span>
                <span
                  className={`timeframe-tag-wrapper${
                    (getIsExceededTime(
                      candidateItem.expiry_date,
                      candidateItem.is_hijri,
                    )
                      && ' is-exceeded-timeframe')
                    || ''
                  }`}
                >
                  <span className="far fa-clock" />
                  <span className="px-1">
                    {moment(
                      candidateItem.expiry_date,
                      (candidateItem.is_hijri && GlobalSavingHijriDateFormat)
                        || GlobalSavingDateFormat,
                    )
                      .locale(i18next.language)
                      .fromNow()}
                  </span>
                </span>
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
    account_uuid: PropTypes.string,
    uuid: PropTypes.string,
    stage_uuid: PropTypes.string,
    border_number: PropTypes.string,
    block_number: PropTypes.string,
    user_uuid: PropTypes.string,
    visa_uuid: PropTypes.string,
    expiry_date: PropTypes.string,
    is_hijri: PropTypes.bool,
    issue_date: PropTypes.string,
    candidate: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      email: PropTypes.string,
      profile_pic: PropTypes.string,
      uuid: PropTypes.string,
    }),
    requested_from: PropTypes.shape({
      first_name: PropTypes.instanceOf(Object),
      last_name: PropTypes.instanceOf(Object),
      email: PropTypes.string,
      uuid: PropTypes.string,
    }),
    job: PropTypes.shape({ title: PropTypes.string, uuid: PropTypes.string }),
    moved_at: PropTypes.string,
  }).isRequired,
  candidateIndex: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isTempItem: PropTypes.bool,
  stages: PropTypes.instanceOf(Array).isRequired,
  isDisabledAllDragging: PropTypes.bool.isRequired,
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
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
CandidatesCard.defaultProps = {
  isTempItem: false,
};
