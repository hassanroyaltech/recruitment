import { Badge, Progress } from 'reactstrap';
import classnames from 'classnames';
import ButtonBase from '@mui/material/ButtonBase';
import { ChatGPTIcon } from '../../assets/icons';
import { TooltipsComponent } from '../Tooltips/Tooltips.Component';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showError } from '../../helpers';
import {
  GetSemantica,
  SemanticaCandidateResponseRate,
  SemanticaInterestGauge,
  SemanticaLanguageProficiency,
  SemanticaMentionedKeywords,
  SemanticaModelAnswer,
  SemanticaProfanity,
} from '../../services';
import PropTypes from 'prop-types';

const generateFunctions = {
  mentioned_keywords: SemanticaMentionedKeywords,
  candidate_response_rate: SemanticaCandidateResponseRate,
  language_proficiency: SemanticaLanguageProficiency,
  interest_gauge: SemanticaInterestGauge,
  profanity: SemanticaProfanity,
  model_answer: SemanticaModelAnswer,
};

export const SemanticaComponent = ({
  assessments,
  selectedAssessmentIndex,
  candidate,
  selectedVideo,
  videos,
  translationPath = 'ModalVideoAssessmentTab.',
  parentTranslationPath = 'EvaSSESSPipeline',
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isGenerating, setIsGenerating] = useState(false);
  const [semanticaResponse, setSemanticaResponse] = useState([]);

  /**
   * A memoized value for the semantica response for the selected video.
   */
  const SemanticaResponseMatched = useMemo(
    () =>
      semanticaResponse.map((item) => ({
        video: videos?.find((video) => video.uuid === item.answer_uuid),
        semantica: item,
      })),
    [semanticaResponse, videos],
  );

  const SemanticaValue = useMemo(
    () =>
      SemanticaResponseMatched.find(
        (item) => item.video?.uuid === selectedVideo?.uuid,
      )?.semantica?.semantica,
    [SemanticaResponseMatched, selectedVideo],
  );

  /**
   * A handler to get the semantica details of the current video.
   * @param uuid The uuid of the candidate.
   */
  const GetSemanticaHandler = useCallback(async () => {
    if (!assessments?.[selectedAssessmentIndex]?.assessment?.identifier?.uuid)
      return;
    // setLoading(true);
    const response = await GetSemantica({
      assessment_candidate_uuid:
        assessments?.[selectedAssessmentIndex]?.assessment?.identifier?.uuid,
    });
    // setLoading(false);

    if (response.status === 200) setSemanticaResponse(response.data.result);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [assessments, selectedAssessmentIndex, t]);

  const GetDynamicSemanticaHandler = useCallback(
    async ({ slug }) => {
      if (!videos?.length || !selectedVideo?.uuid || !candidate?.identity?.uuid)
        return;
      setIsGenerating(slug);
      const response = await generateFunctions[slug]({
        answer_uuid: selectedVideo?.uuid,
      });
      setIsGenerating('');

      if (response.status === 200) GetSemanticaHandler();
      else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [
      GetSemanticaHandler,
      candidate?.identity?.uuid,
      selectedVideo?.uuid,
      videos?.length,
      t,
    ],
  );

  useEffect(() => {
    GetSemanticaHandler();
  }, [GetSemanticaHandler, selectedAssessmentIndex]);

  return SemanticaValue ? (
    <>
      <hr className="my-3 mx-2" />
      {/* KEYWORDS CARD */}
      <div className="card p-3 semantica-card">
        <div className="d-flex flex-row flex-wrap align-items-center justify-content-between mb-3">
          <div className="h6 font-weight-400 text-brand-dark-blue mb-2">
            <span>
              {t(`${translationPath}keywords-matched`)}
              <span>:</span>
            </span>
            (
            {SemanticaValue.matched_keywords?.matched?.length
              + SemanticaValue.matched_keywords?.relevant?.length}{' '}
            /{' '}
            {SemanticaValue.matched_keywords?.matched?.length
              + SemanticaValue.matched_keywords?.relevant?.length
              + SemanticaValue.matched_keywords?.missing?.length}
            )
          </div>
          <div className="d-flex flex-row align-items-center">
            <div className="keyword-symbol keyword-matched mx-1" />
            <div className="font-12 text-gray mr-2-reversed">
              {t(`${translationPath}matched`)}
            </div>
            <div className="keyword-symbol keyword-relevant mx-1" />
            <div className="font-12 text-gray mr-2-reversed">
              {t(`${translationPath}relevant`)}
            </div>
            <div className="keyword-symbol keyword-missing mx-1" />
            <div className="font-12 text-gray">{t(`${translationPath}missing`)}</div>
          </div>
        </div>
        <div className="d-flex flex-row align-items-center flex-wrap">
          {SemanticaValue.matched_keywords?.matched?.map((matchedKeyword, index) => (
            <div
              key={`selectedVideoQuestionsKey${index + 1}`}
              className="mr-2-reversed mb-2"
            >
              <Badge
                className={classnames(
                  'keyword-item header-text c-white',
                  'keyword-matched',
                )}
                pill
              >
                {matchedKeyword}
              </Badge>
            </div>
          ))}
          {SemanticaValue.matched_keywords?.relevant?.map(
            (relevantKeyword, index) => (
              <div
                key={`selectedVideoQuestionsKey${index + 1}`}
                className="mr-2-reversed mb-2"
              >
                <Badge
                  className={classnames(
                    'keyword-item header-text c-white',
                    'keyword-relevant',
                  )}
                  pill
                >
                  {relevantKeyword}
                </Badge>
              </div>
            ),
          )}

          {SemanticaValue.matched_keywords?.missing?.map((missingKeyword, index) => (
            <div
              key={`selectedVideoQuestionsKey${index + 1}`}
              className="mr-2-reversed mb-2"
            >
              <Badge
                className={classnames(
                  'keyword-item header-text c-white',
                  'keyword-missing',
                )}
                pill
              >
                {missingKeyword}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* MENTIONED KEYWORDS CARD */}
      <div className="card my-3 p-3 semantica-card">
        <div className="d-flex-v-center-h-between flex-wrap mb-3">
          <div className="h6 font-weight-400 text-brand-dark-blue mb-2">
            {t(`${translationPath}mentioned-keywords`)}
          </div>
          {!SemanticaValue?.mentioned_keywords?.length && (
            <ButtonBase
              className="btns theme-outline mb-2"
              disabled={!!isGenerating}
              onClick={() =>
                GetDynamicSemanticaHandler({
                  slug: 'mentioned_keywords',
                })
              }
            >
              {`${isGenerating}` === 'mentioned_keywords' ? (
                <span className="fas fa-circle-notch fa-spin m-1" />
              ) : (
                <ChatGPTIcon color="var(--bc-primary)" />
              )}
              <span className="mx-1">
                {t(`${translationPath}generate-response`)}
              </span>
            </ButtonBase>
          )}
        </div>
        <div className="d-flex flex-row align-items-center flex-wrap">
          {SemanticaValue.mentioned_keywords?.map((mentionedKeyword, index) => (
            <div
              key={`selectedVideoQuestionsKey${index + 1}`}
              className="mr-2-reversed mb-2"
            >
              <Badge
                className={classnames(
                  'keyword-item header-text c-white',
                  'keyword-mentioned',
                )}
                pill
              >
                {mentionedKeyword}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* CANDIDATE RESPONSE RATE CARD */}
      <hr className="my-3 mx-2" />
      <div className="card p-3 semantica-card">
        <>
          <div className="d-flex-v-center-h-between flex-wrap">
            <TooltipsComponent
              title="candidate-response-rate-description"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              contentComponent={
                <div className="h6 font-weight-400 text-black">
                  {t(`${translationPath}candidate-response-rate`)}
                </div>
              }
              placement="bottom-start"
            />
            {!SemanticaValue.candidate_response_rate?.rating && (
              <ButtonBase
                className="btns theme-outline mb-2"
                disabled={!!isGenerating}
                onClick={() =>
                  GetDynamicSemanticaHandler({
                    slug: 'candidate_response_rate',
                  })
                }
              >
                {`${isGenerating}` === 'candidate_response_rate' ? (
                  <span className="fas fa-circle-notch fa-spin m-1" />
                ) : (
                  <ChatGPTIcon color="var(--bc-primary)" />
                )}
                <span className="mx-1">
                  {t(`${translationPath}generate-response`)}
                </span>
              </ButtonBase>
            )}
          </div>
          <div className="d-flex flex-row align-items-center w-100">
            <Progress className="flex-grow-1 p-0 mb-0" multi>
              <Progress
                bar
                className="bg-gradient-info"
                value={SemanticaValue.candidate_response_rate?.rating || 0}
              />
            </Progress>
            <span className="font-weight-bold text-primary ml-2-reversed">
              {Math.round(SemanticaValue.candidate_response_rate?.rating || 0, 1)}%
            </span>
          </div>
          {SemanticaValue.candidate_response_rate?.description && (
            <div className="mt-2 w-100">
              {SemanticaValue.candidate_response_rate.description && (
                <>
                  <p className="font-14 text-left fw-bold">
                    {t(`${translationPath}description`)}
                  </p>
                  <p className="font-14 text-left">
                    {SemanticaValue.candidate_response_rate.description}
                  </p>
                </>
              )}
            </div>
          )}
        </>
      </div>

      {/* MODEL ANSWER CARD */}
      <hr className="my-3 mx-2" />
      <div className="card p-3 semantica-card">
        <>
          <div className="d-flex-v-center-h-between flex-wrap">
            <TooltipsComponent
              title="model-answer-description"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              contentComponent={
                <div className="h6 font-weight-400 text-black">
                  {t(`${translationPath}model-answer`)}
                </div>
              }
              placement="bottom-start"
            />
          </div>
          <div className="d-flex flex-row align-items-center w-100">
            <Progress className="flex-grow-1 p-0 mb-0" multi>
              <Progress
                bar
                className="bg-gradient-info"
                value={SemanticaValue.model_answer?.rate || 0}
              />
            </Progress>
            <span className="font-weight-bold text-primary ml-2-reversed">
              {Math.round(SemanticaValue.model_answer?.rate || 0, 1)}%
            </span>
          </div>
          {SemanticaValue.model_answer?.model_answer && (
            <div className="mt-2 w-100">
              {SemanticaValue.model_answer.model_answer && (
                <>
                  <p className="font-14 text-left fw-bold">
                    {t(`${translationPath}model-answer`)}
                  </p>
                  <p className="font-14 text-left mb-2">
                    {SemanticaValue.model_answer.model_answer}
                  </p>
                </>
              )}
            </div>
          )}
        </>
      </div>

      {/* LANGUAGE PROFICIENCY CARD */}
      <hr className="my-3 mx-2" />
      <div className="card p-3 semantica-card">
        <>
          <div className="d-flex-v-center-h-between flex-wrap">
            <div className="h6 font-weight-400 text-black">
              {t(`${translationPath}language-proficiency`)}
            </div>
            {!SemanticaValue?.language_proficiency?.rating && (
              <ButtonBase
                className="btns theme-outline mb-2"
                disabled={!!isGenerating}
                onClick={() =>
                  GetDynamicSemanticaHandler({
                    slug: 'language_proficiency',
                  })
                }
              >
                {`${isGenerating}` === 'language_proficiency' ? (
                  <span className="fas fa-circle-notch fa-spin m-1" />
                ) : (
                  <ChatGPTIcon color="var(--bc-primary)" />
                )}
                <span className="mx-1">
                  {t(`${translationPath}generate-response`)}
                </span>
              </ButtonBase>
            )}
          </div>
          <div className="d-flex flex-row align-items-center w-100">
            <Progress className="flex-grow-1 p-0 mb-0" multi>
              <Progress
                bar
                className="bg-gradient-info"
                value={SemanticaValue.language_proficiency?.rating || 0}
              />
            </Progress>
            <span className="font-weight-bold text-primary ml-2-reversed">
              {Math.round(SemanticaValue.language_proficiency?.rating || 0, 1)}%
            </span>
          </div>
          {SemanticaValue.language_proficiency?.description && (
            <div className="mt-2 w-100">
              <p className="font-14 text-left mb-2">
                {SemanticaValue.language_proficiency.description}
              </p>
            </div>
          )}
        </>
      </div>

      {/* INTEREST GAUGE CARD */}
      <hr className="my-3 mx-2" />
      <div className="card p-3 semantica-card">
        <>
          <div className="d-flex-v-center-h-between flex-wrap">
            <div className="h6 font-weight-400 text-black">
              {t(`${translationPath}interest-gauge`)}
            </div>
            {!SemanticaValue.interest_gauge && (
              <ButtonBase
                className="btns theme-outline mb-2"
                disabled={!!isGenerating}
                onClick={() =>
                  GetDynamicSemanticaHandler({
                    slug: 'interest_gauge',
                  })
                }
              >
                {`${isGenerating}` === 'interest_gauge' ? (
                  <span className="fas fa-circle-notch fa-spin m-1" />
                ) : (
                  <ChatGPTIcon color="var(--bc-primary)" />
                )}
                <span className="mx-1">
                  {t(`${translationPath}generate-response`)}
                </span>
              </ButtonBase>
            )}
          </div>
          <div className="d-flex flex-row align-items-center w-100">
            <Progress className="flex-grow-1 p-0 mb-0" multi>
              <Progress
                bar
                className="bg-gradient-info"
                value={SemanticaValue.interest_gauge || 0}
              />
            </Progress>
            <span className="font-weight-bold text-primary ml-2-reversed">
              {Math.round(SemanticaValue.interest_gauge || 0, 1)}%
            </span>
          </div>
        </>
      </div>

      {/* PROFANITY CARD */}

      <hr className="my-3 mx-2" />
      <div className="card p-3 semantica-card">
        <>
          <div className="d-flex flex-row align-items-center justify-content-between">
            <div className="h6 font-weight-400 text-black">
              {t(`${translationPath}profanity`)}
            </div>
            {!SemanticaValue.profanity?.categories?.length && (
              <ButtonBase
                className="btns theme-outline mb-2"
                disabled={!!isGenerating}
                onClick={() =>
                  GetDynamicSemanticaHandler({
                    slug: 'profanity',
                  })
                }
              >
                {`${isGenerating}` === 'profanity' ? (
                  <span className="fas fa-circle-notch fa-spin m-1" />
                ) : (
                  <ChatGPTIcon color="var(--bc-primary)" />
                )}
                <span className="mx-1">
                  {t(`${translationPath}generate-response`)}
                </span>
              </ButtonBase>
            )}
          </div>
          {SemanticaValue.profanity?.is_impolite
            && SemanticaValue.profanity?.categories?.length > 0 && (
            <div>
              {SemanticaValue.profanity.categories.map((profanityCategory) => (
                <Badge
                  key={profanityCategory}
                  className={classnames(
                    'keyword-item header-text c-white',
                    'keyword-matched',
                  )}
                  pill
                >
                  {profanityCategory}
                </Badge>
              ))}
            </div>
          )}
        </>
      </div>
    </>
  ) : null;
};

SemanticaComponent.propTypes = {
  assessments: PropTypes.arrayOf(
    PropTypes.shape({
      assessment: PropTypes.shape({
        identifier: PropTypes.shape({
          uuid: PropTypes.string,
        }),
      }),
    }),
  ),
  selectedAssessmentIndex: PropTypes.number,
  candidate: PropTypes.shape({
    identity: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }),
  selectedVideo: PropTypes.string, // Check
  videos: PropTypes.array, // Check
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
};
