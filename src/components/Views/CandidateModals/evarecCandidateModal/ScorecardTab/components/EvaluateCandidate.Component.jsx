import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EvaluateDrawer } from '../../../../../../pages/recruiter-preference/Scorecard/ScorecaredBuilder/evaluate-drawer/EvaluateDrawer';
import {
  ScorecardAppereanceEnum,
  ScorecardSubmitTypeEnum,
} from '../../../../../../enums';
import {
  GetCandidateScoreForm,
  SubmitCandidateScorecard,
} from '../../../../../../services';
import { getErrorByName, showError, showSuccess } from '../../../../../../helpers';
import block from 'react-color/lib/components/block/Block';
import * as yup from 'yup';
import i18next from 'i18next';
import { DialogComponent } from '../../../../../Dialog/Dialog.Component';
import { ButtonBase } from '@mui/material';
import PropTypes from 'prop-types';
import { ScorecardTab } from '../Scorecard.Tab';
import { VitallyTrack } from '../../../../../../utils/Vitally';

const parentTranslationPath = 'EvarecCandidateModel';
export const EvaluateCandidateComponent = ({
  uuid,
  drawerOpen,
  closeHandler,
  afterSubmitHandler,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [scorecardData, setScorecardData] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpenSaveDialog, setIsOpenSaveDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const getCandidateScoreForm = useCallback(async () => {
    const response = await GetCandidateScoreForm({ uuid });
    if (response && response.status === 200) {
      const result = response?.data?.results || {};
      setScorecardData(result);
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [uuid]);

  useEffect(() => {
    getCandidateScoreForm();
  }, [getCandidateScoreForm]);
  const handleChange = useCallback(
    ({ value, comment, type, containerId, cardId, isComment }) => {
      setScorecardData((items) => {
        const localeSections = [...(items?.sections || [])];
        const sectionIndex = (localeSections || []).findIndex(
          (sec) => sec?.id === containerId,
        );
        if (sectionIndex !== -1) {
          const blockIndex = (
            localeSections?.[sectionIndex]?.blocks || []
          ).findIndex((block) => block?.id === cardId);
          if (blockIndex !== -1) {
            let currentBlock = localeSections?.[sectionIndex].blocks?.[blockIndex];
            if (isComment) currentBlock.comment = comment;
            else {
              if (type === 'decision') currentBlock.decision.value = value;
              if (type === 'rating') currentBlock.rating = value;
              if (type === 'dropdown') currentBlock.value = value;
            }
            localeSections[sectionIndex].blocks[blockIndex] = currentBlock;
          }
        }
        return { ...items, sections: localeSections };
      });
    },
    [],
  );
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          sections: yup.array().of(
            yup.object().shape({
              blocks: yup.array().of(
                yup.object().shape({
                  value: yup.lazy((fieldVal, { parent }) => {
                    if (parent.is_required && parent.type === 'dropdown')
                      return yup
                        .string()
                        .nullable()
                        .required(t('Shared:this-field-is-required'));
                    else return yup.string().nullable();
                  }),
                  rating: yup.lazy((fieldVal, { parent }) => {
                    if (parent.type === 'rating')
                      return yup
                        .string()
                        .nullable()
                        .required(t('Shared:this-field-is-required'));
                    else return yup.string().nullable();
                  }),
                  comment: yup.lazy((fieldVal, { parent }) => {
                    if (parent?.block_setting?.is_required_comment)
                      return yup
                        .string()
                        .nullable()
                        .required(t('Shared:this-field-is-required'));
                    else return yup.string().nullable();
                  }),
                  decision: yup.lazy((fieldVal, { parent }) => {
                    if (parent.is_required && parent.type === 'decision')
                      return yup.object().shape({
                        value: yup
                          .number()
                          .min(1, t('Shared:this-field-is-required'))
                          .nullable()
                          .required(t('Shared:this-field-is-required')),
                      });
                    else return yup.string().nullable();
                  }),
                }),
              ),
            }),
          ),
        }),
      },
      scorecardData,
    ).then((result) => {
      setErrors(result);
    });
  }, [scorecardData, t]);
  useEffect(() => {
    getErrors();
  }, [getErrors]);

  const handleSubmit = useCallback(
    async ({ status }) => {
      let form = {
        ...scorecardData,
        status,
      };
      setIsSaving(true);
      const response = await SubmitCandidateScorecard(form);
      setIsSaving(false);
      if (response && response?.status === 200) {
        setScorecardData(form);
        closeHandler();
        showSuccess(
          t(
            status === ScorecardSubmitTypeEnum.Draft.key
              ? 'score-draft-saved-successfully'
              : 'score-submitted-successfully',
          ),
        );
        if (status === ScorecardSubmitTypeEnum.Submitted.key) {
          VitallyTrack('EVA-REC - Evaluate Candidates');
          if (afterSubmitHandler) afterSubmitHandler();
        }
      } else
        showError(
          t(
            status === ScorecardSubmitTypeEnum.Draft.key
              ? 'failed-to-save-draft'
              : 'failed-to-submit-score-card',
          ),
          response,
        );
    },
    [scorecardData, t],
  );

  const onClickSave = useCallback(() => {
    setIsSubmitted(true);
    if (Object.keys(errors).length) {
      showError(t('please-fill-all-required'));
      setIsOpenSaveDialog(true);
      return;
    } else handleSubmit({ status: ScorecardSubmitTypeEnum.Submitted.key });
  }, [errors, handleSubmit, t]);

  const onClickSaveAsDraft = useCallback(() => {
    setIsOpenSaveDialog(false);
    handleSubmit({ status: ScorecardSubmitTypeEnum.Draft.key });
  }, [handleSubmit]);
  const onCloseSaveDialog = useCallback(() => {
    setIsOpenSaveDialog(false);
  }, []);

  return (
    <>
      <EvaluateDrawer
        drawerOpen={drawerOpen || false}
        isPreview={scorecardData?.status === ScorecardSubmitTypeEnum.Submitted.key}
        closeHandler={closeHandler}
        labels={scorecardData?.template_labels || []}
        title={scorecardData?.title || {}}
        description={scorecardData?.description || {}}
        submitStyle={
          scorecardData?.card_setting?.appearance?.submit_style
          || ScorecardAppereanceEnum.steps.key
        }
        sections={scorecardData?.sections || []}
        globalSetting={scorecardData?.card_setting || {}}
        handleChange={handleChange}
        isSubmitted={isSubmitted}
        errors={errors}
        onClickSave={onClickSave}
        isSaving={isSaving}
        status={scorecardData?.status}
        showProfileValue={true}
      />
      {isOpenSaveDialog && (
        <DialogComponent
          isOpen={isOpenSaveDialog}
          maxWidth={'sm'}
          titleText={t('discard-form')}
          dialogContent={
            <div className={'px-2'}>
              <span className="font-weight-400">{t('save-draft-with-all')}</span>
            </div>
          }
          dialogActions={
            <div className="my-1 save-cancel-wrapper">
              <ButtonBase
                className="btns theme-outline mx-2"
                onClick={onCloseSaveDialog}
              >
                <span>{t('discard')}</span>
              </ButtonBase>
              <ButtonBase
                className="btns theme-outline mx-2"
                onClick={onClickSaveAsDraft}
              >
                <span>{t('save-draft')}</span>
              </ButtonBase>
              <ButtonBase
                className="btns theme-solid  mx-2"
                onClick={onCloseSaveDialog}
              >
                <span>{t('continue-editing')}</span>
              </ButtonBase>
            </div>
          }
        />
      )}
    </>
  );
};
EvaluateCandidateComponent.propTypes = {
  uuid: PropTypes.string.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  closeHandler: PropTypes.func,
  afterSubmitHandler: PropTypes.func,
};
