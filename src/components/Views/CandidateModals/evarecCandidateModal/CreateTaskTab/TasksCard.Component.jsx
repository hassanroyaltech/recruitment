import React, { useState } from 'react';
import { ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import moment from 'moment';
import './TasksTab.Style.scss';
import i18next from 'i18next';
export const TasksCardsComponent = ({
  data,
  lastPage,
  pageIndex,
  limit,
  icon,
  titleKey,
  subTitleKey,
  subTitleComponent,
  tagKey,
  tagComponent,
  dateKey,
  footerComponent,
  onPageIndexChanged,
  parentTranslationPath,
  onCardClick,
  isVertical,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isHovered, setIsHovered] = useState(null);

  return (
    <div>
      <div
        className={`card-component-content-wrapper${
          isVertical ? ' is-vertical' : ''
        }`}
      >
        {data.map((card, index) => (
          <ButtonBase
            key={`${index}-card`}
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered(null)}
            onClick={(e) =>
              onCardClick({
                card,
                index,
                e,
              })
            }
            className={`${isVertical ? 'w-100' : ''}`}
          >
            <div
              className={`p-3 card-component-content-item${
                isHovered === index ? ' highlighted' : ''
              }${isVertical ? ' is-vertical' : ''}`}
            >
              <div className="d-flex m-2">
                {icon && (
                  <ButtonBase className="my-1 mx-3 icon-wrapper btns-icon theme-transparent">
                    <span
                      className={`d-flex-center card-icon ${
                        isHovered === index ? ' highlighted' : ''
                      }`}
                    >
                      {icon}
                    </span>
                  </ButtonBase>
                )}
                <div className="content-second">
                  <div
                    className="c-black fz-20px fw-bold"
                    style={{
                      textAlign: 'start',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      lineClamp: 3,
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {card[titleKey]}
                  </div>
                  <div className="my-3">
                    {(subTitleKey || subTitleComponent) && (
                      <div className="sub-title my-2">
                        {subTitleKey && card[subTitleKey]}
                        {subTitleComponent && subTitleComponent(card)}
                      </div>
                    )}
                    {(tagKey || tagComponent) && (
                      <div className="tag my-3">
                        <div
                          className="d-flex-center bg-gray-lighter pr-2 pl-1"
                          style={{ borderRadius: '33px', width: 'fit-content' }}
                        >
                          {tagKey && card[tagKey]}
                          {tagComponent && tagComponent(card)}
                        </div>
                      </div>
                    )}
                    {dateKey && (
                      <div className="d-flex-v-center my-2">
                        <span className="far fa-clock c-gray-light" />
                        <span className="mx-2">
                          {card[dateKey]
                            ? moment(card[dateKey])
                              .locale(i18next.language)
                              .format('DD/MM/YYYY')
                            : t('not-specified')}
                        </span>
                      </div>
                    )}
                    {footerComponent && (
                      <div className="my-2">{footerComponent(card)}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ButtonBase>
        ))}
      </div>
      {lastPage > pageIndex && (
        <ButtonBase
          className="btns small-button c-black my-3"
          onClick={() => {
            onPageIndexChanged(pageIndex);
          }}
        >
          {`${t('load-next')} ${limit}`}
        </ButtonBase>
      )}
    </div>
  );
};

TasksCardsComponent.propTypes = {
  data: PropTypes.array.isRequired,
  lastPage: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  icon: PropTypes.node,
  titleKey: PropTypes.string,
  subTitleKey: PropTypes.string,
  subTitleComponent: PropTypes.func,
  tagKey: PropTypes.string,
  tagComponent: PropTypes.func,
  dateKey: PropTypes.string,
  footerComponent: PropTypes.func,
  onPageIndexChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  onCardClick: PropTypes.func.isRequired,
  isVertical: PropTypes.bool,
};
