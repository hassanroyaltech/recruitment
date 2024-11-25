import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import ManIcon from 'assets/icons/business-man.png';
import i18next from 'i18next';
import moment from 'moment';
import {
  PopoverComponent,
  LoadableImageComponant,
  LoaderComponent,
} from '../../../../../components';
import { CardActionsComponent } from './sections';

import './CampaignCard.Style.scss';
import { CampaignTypes } from '../../../../../enums';
import { floatHandler, GlobalDateFormat } from '../../../../../helpers';
import { useEventListener } from '../../../../../hooks';

export const CampaignCardComponent = ({
  bodyRef,
  data,
  parentTranslationPath,
  isLoading,
  onLoadMore,
  onCampaignCardClicked,
  translationPath,
  onActionsClicked,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  const [activeItem, setActiveItem] = useState(null);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const actionsPopoverCloseHandler = useCallback(() => {
    setPopoverAttachedWith(null);
    setActiveItem(null);
  }, []);
  const actionsTogglerHandler = useCallback(
    (item) => (event) => {
      event.stopPropagation();
      event.preventDefault();
      setPopoverAttachedWith(event.target);
      setActiveItem(item);
    },
    [],
  );

  /**
   * @param item
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to send to parent the current clicked card item
   */
  const campaignCardHandler = useCallback(
    (item) => (event) => {
      event.preventDefault();
      event.stopPropagation();
      onCampaignCardClicked(item);
    },
    [onCampaignCardClicked],
  );
  //
  // useEffect(() => {
  //   if (!isLoading) onScrollHandler();
  // }, [isLoading, onScrollHandler]);
  const getCampaignType = useMemo(
    () => (key) => Object.values(CampaignTypes).find((item) => item.key === key),
    [],
  );

  return (
    <div className="campaign-cards-wrapper childs-wrapper">
      {data
        && data.results.map((item, index) => (
          <div
            className="campaign-card-wrapper card-wrapper"
            key={`campaignCardKey${index + 1}`}
          >
            <ButtonBase
              className={`card-content-wrapper${
                (!onCampaignCardClicked && ' is-normal-card') || ''
              }`}
              onClick={
                (onCampaignCardClicked && campaignCardHandler(item)) || undefined
              }
            >
              <div className="card-header-wrapper">
                <div className="px-3">
                  <span className="header-text-x2">{item.title || 'N/A'}</span>
                </div>
                <ButtonBase
                  className="btns-icon theme-transparent mx-3"
                  onClick={actionsTogglerHandler(item)}
                >
                  <span className="fas fa-ellipsis-h" />
                </ButtonBase>
              </div>
              <div className="card-body-wrapper">
                <div className="card-body-item-wrapper">
                  <div className="px-2 c-black-light mb-2">
                    <span>
                      <span>USD</span>
                      <span className="px-1">{floatHandler(item.cost, 3)}</span>
                    </span>
                  </div>
                  <div className="px-2 item-sections-wrapper mb-2">
                    <LoadableImageComponant
                      src={item.image}
                      classes="card-image-wrapper"
                      alt={`${t(translationPath)}user-image`}
                      defaultImage={ManIcon}
                    />
                    <span className="pl-2-reversed">
                      {(item.owner
                        && (item.owner.name[i18next.language] || item.owner.name.en))
                        || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-footer-wrapper">
                <div className="px-2">
                  {item.status && getCampaignType(item.status) && (
                    <span className={getCampaignType(item.status).color}>
                      <span className="fas fa-wave-square" />
                      <span className="px-1">
                        {t(
                          `${translationPath}${getCampaignType(item.status).value}`,
                        )}
                      </span>
                    </span>
                  )}
                </div>
                <div className="footer-dates-wrapper">
                  <span className="far fa-clock c-green-primary" />
                  <span className="px-2">
                    {(item.created_at
                      && moment(item.created_at)
                        .locale(i18next.language)
                        .format(GlobalDateFormat))
                      || 'N/A'}
                  </span>
                  <span className="far fa-clock c-warning" />
                  <span className="px-2">
                    {(item.expires_date
                      && moment(item.expires_date)
                        .locale(i18next.language)
                        .format(GlobalDateFormat))
                      || 'N/A'}
                  </span>
                </div>
              </div>
            </ButtonBase>
          </div>
        ))}
      {activeItem && (
        <PopoverComponent
          idRef="campaignCardActionsRef"
          attachedWith={popoverAttachedWith}
          handleClose={actionsPopoverCloseHandler}
          component={
            <CardActionsComponent
              isDeletable={activeItem.can_delete}
              onActionsClicked={(action) => {
                if (onActionsClicked) onActionsClicked(action, activeItem);
                actionsPopoverCloseHandler();
              }}
            />
          }
        />
      )}
      <LoaderComponent
        isLoading={isLoading}
        isSkeleton
        wrapperClasses="campaign-card-wrapper card-wrapper"
        skeletonClasses="card-content-wrapper"
        skeletonStyle={{ minHeight: 125 }}
      />
    </div>
  );
};

CampaignCardComponent.propTypes = {
  data: PropTypes.shape({
    results: PropTypes.instanceOf(Array),
    totalCount: PropTypes.number,
  }),
  onActionsClicked: PropTypes.func,
  onCampaignCardClicked: PropTypes.func,
  onLoadMore: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  bodyRef: PropTypes.instanceOf(Object).isRequired,
  translationPath: PropTypes.string,
};
CampaignCardComponent.defaultProps = {
  data: {
    results: [],
    totalCount: 0,
  },
  onActionsClicked: undefined,
  onCampaignCardClicked: undefined,
  onLoadMore: undefined,
  translationPath: '',
};
