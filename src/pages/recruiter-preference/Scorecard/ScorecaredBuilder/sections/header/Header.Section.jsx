import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import { ButtonBase, Chip, Grid, Typography } from '@mui/material';

import i18next from 'i18next';
import { ScorecardPreviewIcon } from '../../../../../../assets/icons';
import { useEventListener } from '../../../../../../hooks';
import {
  getIsAllowedPermissionV2,
  GetScorecardSourceItem,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../helpers';
import { ScoreCalculationTypeEnum } from '../../../../../../enums';
import {
  CreateScorecardTemplate,
  UpdateScorecardTemplate,
} from '../../../../../../services';
import { ScorecardPermissions } from '../../../../../../permissions';
import { useSelector } from 'react-redux';

export const HeaderSection = ({
  setIsOpenSideMenu,
  templateData,
  setIsSubmitted,
  isLoading,
  setIsLoading,
  setHeaderHeight,
  parentTranslationPath,
  setIsPreview,
  ratingSections,
  sections,
  activeTab,
}) => {
  const history = GlobalHistory;
  const headerRef = useRef(null);
  const timerResizeRef = useRef(null);
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  useEffect(() => {
    setHeaderHeight(headerRef.current.clientHeight);
  }, [setHeaderHeight]);
  useEventListener('resize', () => {
    if (timerResizeRef.current) clearTimeout(timerResizeRef.current);
    timerResizeRef.current = setTimeout(() => {
      setHeaderHeight(headerRef.current.clientHeight);
    }, 250);
  });
  useEffect(
    () => () => {
      if (timerResizeRef.current) clearTimeout(timerResizeRef.current);
    },
    [],
  );

  const calculateAllweights = useCallback(
    (sectionsToValidate) => {
      let check = true;
      if (
        sectionsToValidate
          ?.map((item) => item?.weight)
          .reduce((a, b) => a + b, 0) !== 100
      )
        check = false;
      ratingSections.forEach((sec) => {
        if (
          (sec?.blocks || [])
            ?.map((item) => item?.weight)
            .reduce((a, b) => a + b, 0) !== sec.weight
        )
          check = false;
      });
      return check;
    },
    [ratingSections],
  );
  const handleClose = useCallback(async () => {
    const templateSourceItem = GetScorecardSourceItem(Number(templateData.source));
    if (templateSourceItem)
      history.push(templateSourceItem.source_url({ templateData }));
    else history.push('/recruiter/recruiter-preference/scorecard');
  }, [history, templateData]);

  const saveForm = React.useCallback(async () => {
    setIsSubmitted(true);
    let errors = [];
    if (!Object.values(templateData?.title || {}).filter((item) => !!item).length)
      errors.push(`${t('title-is-required')}`);
    if (
      templateData?.card_setting?.score_calculation_method
        === ScoreCalculationTypeEnum.weight.key
      && ratingSections.length
      && !calculateAllweights(ratingSections)
    )
      errors.push(`${t('please-enter-correct-weights')}`);
    if (!templateData?.task_status_uuid)
      errors.push(`${t('please-select-task-status')}`);
    if (errors?.length > 0) {
      errors.forEach((item) => showError(item));
      return;
    }
    setIsLoading(true);
    const template = {
      ...templateData,
      description: Object.values(templateData?.description || {})?.some(
        (item) => !!item,
      )
        ? templateData?.description
        : null,
      sections: sections || [],
    };
    const response = await (template.uuid
      ? UpdateScorecardTemplate
      : CreateScorecardTemplate)(template);
    setIsLoading(false);
    if (response && (response.status === 201 || response.status === 200)) {
      showSuccess(
        `${t(
          templateData?.uuid
            ? 'scorecard-template-updated'
            : 'scorecard-template-created',
        )}`,
      );
      handleClose();
    } else
      showError(
        t(
          templateData?.uuid
            ? 'scorecard-template-update-failed'
            : 'scorecard-template-create-failed',
        ),
        response,
      );
  }, [
    setIsSubmitted,
    templateData,
    t,
    ratingSections,
    calculateAllweights,
    setIsLoading,
    sections,
    handleClose,
  ]);
  const isSaveDisabled = useMemo(
    () =>
      isLoading
      || (templateData?.uuid
        && !getIsAllowedPermissionV2({
          permissionId: ScorecardPermissions.UpdateScorecard.key,
          permissions: permissionsReducer,
        }))
      || (!templateData?.uuid
        && !getIsAllowedPermissionV2({
          permissionId: ScorecardPermissions.AddNewScorecard.key,
          permissions: permissionsReducer,
        })),
    [isLoading, permissionsReducer, templateData?.uuid],
  );
  return (
    <Grid
      ref={headerRef}
      container
      sx={{
        padding: (theme) => theme.spacing(4.5, 5, 4.5, 8),
        // boxShadow: '0px -1px 0px 0px #F4F4F4 inset',
        background: (theme) => theme.palette.light.main,
        minHeight: 75,
      }}
    >
      <div className="d-flex-v-center-h-between flex-wrap">
        <div className="d-inline-flex-v-center flex-wrap my-1">
          <Typography>{t('scorecard-templates')}</Typography>
          <span className="fas fa-arrow-right fz-14px px-3" />
          <Typography variant="h3" lh="rich">
            {templateData?.title?.[i18next.language]
              || templateData?.title?.en
              || 'Untitled'}
          </Typography>
          <Chip
            icon={
              <span className="d-inline-flex-center ff-default mx-1 lh-100">
                <span className="fz-30px">&bull;</span>
              </span>
            }
            label={t('draft')}
            variant="xs"
            bg="darka6"
            sx={{
              mr: 1.5,
              ml: 2.5,
              pr: 2,
              pl: 0.5,
              py: 0.5,
              color: 'dark.$60',
              '> .MuiChip-icon': {
                m: 0,
                fontSize: 18,
                color: 'dark.$40',
              },
            }}
          />
        </div>
        <div className="d-inline-flex-v-center my-1">
          <ButtonBase
            onClick={() => setIsPreview(true)}
            className="btns  theme-transparent mx-1 miw-0"
            sx={{
              border: '1px solid',
              borderRadius: '4px',
              borderColor: (theme) => theme.palette.dark.$50 + ' !important',
            }}
          >
            <ScorecardPreviewIcon />
          </ButtonBase>
          <ButtonBase
            disabled={!!isSaveDisabled}
            onClick={() => saveForm()}
            className="btns theme-solid miw-0"
          >
            {isLoading && (
              <span className="fas fa-circle-notch fa-spin mr-2-reversed" />
            )}{' '}
            {templateData?.uuid ? t('update-template') : t('save-template')}
          </ButtonBase>
          <ButtonBase
            onClick={handleClose}
            className="btns-icon theme-transparent ml-3-reversed"
          >
            <span className="fas fa-times" />
          </ButtonBase>
          {activeTab === 1 && (
            <ButtonBase
              className={`btns-icon theme-transparent mx-2 score-side-menu-btn`}
              onClick={() => {
                setIsOpenSideMenu((item) => !item);
              }}
            >
              <span className="fas fa-bars" />
            </ButtonBase>
          )}
        </div>
      </div>
    </Grid>
  );
};

HeaderSection.propTypes = {};
