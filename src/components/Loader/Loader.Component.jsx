import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import { TimelineComponent } from 'components/Timeline/Timeline.Component';
import './Loader.Style.scss';

export const LoaderComponent = memo(
  ({
    isLoading,
    isTimelineSkeleton,
    isSkeleton,
    numberOfItems,
    numberOfRepeat,
    oppositeContentVariant,
    separatorContentVariant,
    skeletonVariant,
    contentVariant,
    oppositeContentItemsVariant,
    contentItemsVariant,
    skeletonItems,
    timelineIdRef,
    idRef,
    wrapperClasses,
    skeletonClasses,
    oppositeContentStyle,
    skeletonStyle,
    contentStyle,
    separatorContentStyle,
  }) =>
    isLoading && (
      <div className={`loader-wrapper component-wrapper ${wrapperClasses}`}>
        {isTimelineSkeleton && (
          <TimelineComponent
            data={Array.from({ length: numberOfItems }, () => ({}))}
            timelineIdRef={timelineIdRef}
            oppositeContentComponent={
              (oppositeContentVariant || oppositeContentItemsVariant)
              && (() =>
                (oppositeContentItemsVariant
                  && oppositeContentItemsVariant.map((item, index) => (
                    <Skeleton
                      variant={item.variant}
                      key={`${timelineIdRef}Opposite${index + 1}`}
                      style={{
                        width: '100%',
                        minHeight: item.minHeight,
                        ...(item.style || {}),
                      }}
                    />
                  ))) || (
                  <Skeleton
                    variant={oppositeContentVariant}
                    style={{
                      width: '100%',
                      height:
                        (oppositeContentVariant !== 'text' && '100%') || undefined,
                      ...(oppositeContentStyle || {}),
                    }}
                  />
                ))
            }
            separatorContentComponent={() => (
              <Skeleton
                variant={separatorContentVariant}
                style={{
                  width: '100%',
                  height:
                    (separatorContentVariant !== 'text' && '100%') || undefined,
                  ...(separatorContentStyle || {}),
                }}
              />
            )}
            contentComponent={
              (contentItemsVariant || contentVariant)
              && (() =>
                (contentItemsVariant
                  && contentItemsVariant.map((item, index) => (
                    <Skeleton
                      variant={item.variant}
                      key={`${timelineIdRef}${index + 1}`}
                      style={{
                        width: '100%',
                        minHeight: item.minHeight,
                        ...(item.style || {}),
                      }}
                    />
                  ))) || (
                  <Skeleton
                    variant={contentVariant}
                    style={{
                      width: '100%',
                      height: (contentVariant !== 'text' && '100%') || undefined,
                      ...(contentStyle || {}),
                    }}
                  />
                ))
            }
          />
        )}
        {(isSkeleton || skeletonItems)
          && ((skeletonItems
            && Array.from({ length: numberOfRepeat || 1 }, () => skeletonItems)
              .flat()
              .map((item, index) => (
                <div className="skeleton-item-wrapper" key={`${idRef}${index + 1}`}>
                  <Skeleton
                    variant={item.variant}
                    className={item.className}
                    style={{
                      width: '100%',
                      ...(item.style || {}),
                    }}
                  />
                </div>
              ))) || (
            <Skeleton
              variant={skeletonVariant}
              className={skeletonClasses}
              style={{
                width: '100%',
                height: (skeletonVariant !== 'text' && '100%') || undefined,
                ...(skeletonStyle || {}),
              }}
            />
          ))}
      </div>
    ),
);

LoaderComponent.displayName = 'LoaderComponent';

LoaderComponent.propTypes = {
  numberOfItems: PropTypes.number,
  numberOfRepeat: PropTypes.number,
  oppositeContentItemsVariant: PropTypes.arrayOf(
    PropTypes.shape({
      variant: PropTypes.oneOf(['rectangular', 'circular', 'text']),
      minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      style: PropTypes.instanceOf(Object),
    }),
  ),
  contentItemsVariant: PropTypes.arrayOf(
    PropTypes.shape({
      variant: PropTypes.oneOf(['rectangular', 'circular', 'text']),
      minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      style: PropTypes.instanceOf(Object),
    }),
  ),
  skeletonItems: PropTypes.arrayOf(
    PropTypes.shape({
      variant: PropTypes.oneOf(['rectangular', 'circular', 'text']),
      minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      className: PropTypes.string,
      style: PropTypes.instanceOf(Object),
    }),
  ),
  isLoading: PropTypes.bool,
  isSkeleton: PropTypes.bool,
  isTimelineSkeleton: PropTypes.bool,
  timelineIdRef: PropTypes.string,
  wrapperClasses: PropTypes.string,
  idRef: PropTypes.string,
  skeletonClasses: PropTypes.string,
  oppositeContentStyle: PropTypes.instanceOf(Object),
  skeletonStyle: PropTypes.instanceOf(Object),
  contentStyle: PropTypes.instanceOf(Object),
  separatorContentStyle: PropTypes.instanceOf(Object),
  skeletonVariant: PropTypes.oneOf(['rectangular', 'circular', 'text']),
  oppositeContentVariant: PropTypes.oneOf(['rectangular', 'circular', 'text']),
  separatorContentVariant: PropTypes.oneOf(['rectangular', 'circular', 'text']),
  contentVariant: PropTypes.oneOf(['rectangular', 'circular', 'text']),
};
LoaderComponent.defaultProps = {
  numberOfItems: 3,
  numberOfRepeat: 1,
  isLoading: false,
  isTimelineSkeleton: false,
  isSkeleton: false,
  skeletonVariant: 'rectangular',
  skeletonItems: undefined,
  oppositeContentItemsVariant: undefined,
  oppositeContentStyle: undefined,
  skeletonStyle: undefined,
  contentStyle: undefined,
  separatorContentStyle: undefined,
  contentItemsVariant: undefined,
  timelineIdRef: 'loaderTimelineRef',
  idRef: 'loaderRef',
  oppositeContentVariant: undefined,
  wrapperClasses: '',
  skeletonClasses: '',
  separatorContentVariant: 'circular',
  contentVariant: undefined,
};
