import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '@mui/material/Avatar';
import { showError, StringToColor } from '../../../../../../../../../../../helpers';
import ScorecardStarRating from '../../../../../../../../../../recruiter-preference/Scorecard/ScorecaredBuilder/components/RatingInputs/ScorecardStarRating.compnent';
import './BestPerformer.Style.scss';
import i18next from 'i18next';
import { GetJobBestPerformer } from '../../../../../../../../../../../services';
import PropTypes from 'prop-types';
import { ScoresSummaryDialog } from '../../../../dialogs';
const avatarStyles = {
  // height: `35px !important`,
  // width: `35px !important`,
  marginInlineStart: '0px',
  marginInlineEnd: '7px',
  // fontSize: '0.6rem !important',
};
export const DecisionCard = ({ decisions }) => (
  <div className="d-flex c-neutral-scale-1 gap-2">
    <div className="d-inline-flex-center border-c-secondary-3 best-decision-view">
      <span className="fa fa-check  fz-14px" />
      <span className="px-2 font-weight-500  fz-12px">
        {decisions?.accept?.value || 0}
      </span>
      <span className="font-weight-500 fz-12px">
        {decisions?.accept?.[i18next.language] || decisions?.accept?.en || ''}
      </span>
    </div>

    <div className="d-inline-flex-center border-c-secondary-3 best-decision-view">
      <span className="fa fa-times fz-14px" />
      <span className="px-2 font-weight-500  fz-12px">
        {' '}
        {decisions?.reject?.value || 0}{' '}
      </span>
      <span className="font-weight-500 fz-12px">
        {decisions?.reject?.[i18next.language] || decisions?.reject?.en || ''}
      </span>
    </div>
  </div>
);
export const BestPerformerCard = ({
  parentTranslationPath,
  translationPath,
  uuid,
  isWeightScoring,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [bestPerformer, setBestPerformer] = useState();
  const [isLoading, setIsLoading] = useState();
  const isMountedRef = useRef(null);
  const getJobBestPerformer = useCallback(async () => {
    if (!uuid) return;
    setIsLoading(true);
    const response = await GetJobBestPerformer({ uuid });
    setIsLoading(false);
    if (response && response.status === 200) {
      setBestPerformer(response?.data?.results || null);
      isMountedRef.current = true;
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [uuid]);

  useEffect(() => {
    getJobBestPerformer();
  }, [getJobBestPerformer]);

  return (
    <div className="score-best-performer-card">
      <span className="d-block c-neutral-scale-1">
        {t(`${translationPath}best-performer`)}
        {isLoading && <span className="fas fa-circle-notch fa-spin mx-2" />}
      </span>
      {!bestPerformer && isMountedRef.current === true && (
        <div className="d-flex-center py-2 px-1">
          {t(`${translationPath}best-performer-not-yet-available`)}
        </div>
      )}
      {bestPerformer && (
        <>
          <div className="my-2">
            <Avatar
              sx={{
                ...avatarStyles,
                backgroundColor: StringToColor(bestPerformer?.candidate_name || ''),
              }}
            >
              {(bestPerformer?.candidate_name || '')
                .split(' ')
                .map((word) => word[0]) || ''}
            </Avatar>
            <span className="font-weight-500 fz-15px c-neutral-scale-1">
              {bestPerformer?.candidate_name}
            </span>
          </div>
          <span className="d-block fz-13px c-neutral-scale-1">
            {t(`${translationPath}score`)}
          </span>
          <div className="d-inline-flex-v-center gap-2">
            {!isWeightScoring && (
              <ScorecardStarRating
                value={bestPerformer?.total_score || 0}
                maxNumber={5}
                isView={true}
                ishideLabels={true}
              />
            )}
            <span className="c-neutral-scale-1  font-weight-700 fz-22px">
              {bestPerformer?.total_score} {isWeightScoring && '%'}
            </span>
          </div>
          <span className=" d-block fz-13px mb-2 c-neutral-scale-1">
            {t(`${translationPath}decisions`)}
          </span>
          {bestPerformer?.committee_decisions && (
            <DecisionCard decisions={bestPerformer?.committee_decisions} />
          )}
        </>
      )}
    </div>
  );
};

BestPerformerCard.propTypes = {
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  uuid: PropTypes.string,
  isWeightScoring: PropTypes.bool,
};

DecisionCard.propTypes = {
  decisions: PropTypes.instanceOf(Object),
};
