import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import './Timeline.Style.scss';
import i18next from 'i18next';

export const TimelineComponent = memo(
  ({
    data,
    oppositeContentComponent,
    separatorContentComponent,
    contentComponent,
    align,
    idRef,
    wrapperClasses,
    separatorTypeComponent,
    isWithSeparator,
  }) => {
    const getTimeSeparator = useCallback(
      (item, index) => {
        const SeparatorTypeComponent = separatorTypeComponent;
        const childrenContent
          = (separatorContentComponent && separatorContentComponent(item, index))
          || null;

        return <SeparatorTypeComponent>{childrenContent}</SeparatorTypeComponent>;
      },
      [separatorContentComponent, separatorTypeComponent],
    );
    return (
      <Timeline
        className={`timeline-wrapper component-wrapper${
          (wrapperClasses && ` ${wrapperClasses}`) || ''
        }`}
        align={`${
          (align === 'reversed'
            && ((i18next.dir() === 'rtl' && 'right') || 'left'))
          || align
        }`}
      >
        {data
          && data.map((item, index) => (
            <TimelineItem key={`${idRef}${index + 1}`}>
              {oppositeContentComponent && (
                <TimelineOppositeContent>
                  {oppositeContentComponent(item, index)}
                </TimelineOppositeContent>
              )}
              {(separatorContentComponent || isWithSeparator) && (
                <TimelineSeparator>
                  {getTimeSeparator(item, index)}
                  <TimelineConnector />
                </TimelineSeparator>
              )}
              {contentComponent && (
                <TimelineContent>{contentComponent(item, index)}</TimelineContent>
              )}
            </TimelineItem>
          ))}
      </Timeline>
    );
  },
);

TimelineComponent.displayName = 'TimelineComponent';

TimelineComponent.propTypes = {
  data: PropTypes.instanceOf(Array),
  oppositeContentComponent: PropTypes.func,
  separatorContentComponent: PropTypes.func,
  contentComponent: PropTypes.func,
  separatorTypeComponent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  isWithSeparator: PropTypes.bool,
  align: PropTypes.oneOf(['alternate', 'left', 'right', 'reversed']),
  idRef: PropTypes.string,
  wrapperClasses: PropTypes.string,
};

TimelineComponent.defaultProps = {
  data: [],
  align: 'reversed',
  idRef: 'timelineRef',
  wrapperClasses: undefined,
  oppositeContentComponent: undefined,
  separatorContentComponent: undefined,
  contentComponent: undefined,
  isWithSeparator: false,
  separatorTypeComponent: TimelineDot,
};
