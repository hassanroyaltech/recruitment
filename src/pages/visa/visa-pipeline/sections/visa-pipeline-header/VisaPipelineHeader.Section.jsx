import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import './VisaPipelineHeader.Style.scss';
import {
  SortingCriteriaCallLocationsEnum,
  SortingCriteriaEnum,
} from '../../../../../enums';
import { PopoverComponent } from '../../../../../components';
import { SharedInputControl } from '../../../../setups/shared';

export const VisaPipelineHeaderSection = ({
  isLoading,
  pipelineDetails,
  popoverAttachedWith,
  onCandidatesFiltersChanged,
  onPopoverAttachedWithChanged,
  onIsOpenDialogsChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  /**
   * @param popoverKey - the key of the popover
   * @param event - the event of attached item
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the popover
   */
  const popoverToggleHandler = useCallback(
    (popoverKey, event = undefined) => {
      onPopoverAttachedWithChanged(
        popoverKey,
        (event && event.currentTarget) || null,
      );
    },
    [onPopoverAttachedWithChanged],
  );
  return (
    <div className="visa-pipeline-header-actions-wrapper actions-wrapper pt-3">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          <span>
            <div className="d-inline-flex-center p-2 bg-gray-light br-1rem">
              <span className="fas fa-database" />
            </div>
            <span className="px-2">{t(`${translationPath}visa-management`)}</span>
          </span>
        </span>
        <span className="description-text">
          {t(`${translationPath}visa-pipeline-description`)}
        </span>
      </div>
      <div className="actions-section-wrapper">
        <div className="d-inline-flex px-3 mb-3 mt-2">
          <span>
            <span>
              {(pipelineDetails.stages && pipelineDetails.stages.length) || 0}
            </span>
            <span className="px-1">
              <span>{t(`${translationPath}stages`)}</span>
              <span>,</span>
            </span>
          </span>
          <span>
            <span>{pipelineDetails.total_candidates || 0}</span>
            <span className="px-1">{t(`${translationPath}profiles`)}</span>
          </span>
        </div>
        <div className="d-inline-flex flex-wrap">
          <SharedInputControl
            parentTranslationPath="Shared"
            // editValue={candidatesFilters.search}
            isDisabled={isLoading}
            stateKey="search"
            themeClass="theme-transparent"
            placeholder="search"
            wrapperClasses="small-control px-2"
            onInputBlur={(newValue) => {
              onCandidatesFiltersChanged({ search: newValue.value });
            }}
            executeOnInputBlur
            onKeyDown={(event) => {
              if (event.key === 'Enter')
                onCandidatesFiltersChanged({ search: event.target.value });
            }}
            startAdornment={
              <div className="start-adornment-wrapper mx-2 mt-1 c-gray-primary">
                <span className="fas fa-search" />
              </div>
            }
          />
          <ButtonBase
            className="btns theme-transparent miw-0 mb-3 c-gray-primary"
            onClick={() => onIsOpenDialogsChanged('filters', true)}
          >
            <span>{t(`Shared:filters`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns theme-transparent miw-0 mb-3 c-gray-primary"
            onClick={(e) => popoverToggleHandler('sort', e)}
          >
            <span>{t(`Shared:sort`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns theme-transparent mb-3 c-gray-primary"
            onClick={() => onIsOpenDialogsChanged('stagesManagement', true)}
          >
            <span>{t(`${translationPath}visa-stages`)}</span>
          </ButtonBase>
        </div>
      </div>

      <PopoverComponent
        idRef="sortPopoverRef"
        attachedWith={popoverAttachedWith.sort}
        handleClose={() => popoverToggleHandler('sort')}
        popoverClasses="stages-display-popover"
        component={
          <div className="d-flex-column stage-display-items-wrapper">
            {Object.values(SortingCriteriaEnum)
              .filter(
                (criteria) =>
                  criteria.hiddenIn
                  && criteria.hiddenIn.indexOf(
                    SortingCriteriaCallLocationsEnum.VisaPipelineHeader.key,
                  ) === -1,
              )
              .map((criteria) => (
                <ButtonBase
                  key={criteria.id}
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary"
                  onClick={() => {
                    popoverToggleHandler('sort');
                    onCandidatesFiltersChanged({
                      order_by: criteria.order_by,
                      order_type: criteria.order_type,
                    });
                  }}
                >
                  <span>{t(`Shared:${criteria.title}`)}</span>
                </ButtonBase>
              ))}
          </div>
        }
      />
    </div>
  );
};

VisaPipelineHeaderSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  pipelineDetails: PropTypes.shape({
    stages: PropTypes.instanceOf(Array),
    total_candidates: PropTypes.number,
  }),
  candidatesFilters: PropTypes.shape({
    limit: PropTypes.number,
    page: PropTypes.number,
    order_type: PropTypes.oneOf(['ASC', 'DESC']),
    order_by: PropTypes.number,
    search: PropTypes.string,
    start_date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Object),
    ]),
    end_date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
  }),
  popoverAttachedWith: PropTypes.shape({
    sort: PropTypes.instanceOf(Object),
  }).isRequired,
  onCandidatesFiltersChanged: PropTypes.func.isRequired,
  onPopoverAttachedWithChanged: PropTypes.func.isRequired,
  onIsOpenDialogsChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
