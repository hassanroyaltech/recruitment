import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../components';
import { SortByAutoCompleteControl } from './controls';
import { GlobalSearchDelay } from '../../../../../helpers';
import './ChannelsFilter.Style.scss';
// import { ChannelsSortByEnum } from '../../../../../enums';

// const getOrderByValue = (filterBy) => {
//   let filterKey = ChannelsSortByEnum.costFromHighToLow.key;
//   switch (filterBy.direction) {
//   case 'desc':
//     filterKey = filterBy.order_by === ChannelsSortByEnum.costFromHighToLow.key ? ChannelsSortByEnum.costFromLowToHigh.key : ChannelsSortByEnum.nameFromAToZ.key;
//     return filterKey;
//   case 'asc':
//     filterKey = filterBy.order_by === ChannelsSortByEnum.costFromLowToHigh.key ? ChannelsSortByEnum.costFromHighToLow.key : ChannelsSortByEnum.nameFromZToA.key;
//     return filterKey;
//   default:
//     return filterKey
//   }
// }

export const ChannelsFilter = ({
  filter,
  filterBy,
  onFilterByChanged,
  onFilterChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const searchTimerRef = useRef(null);
  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      if (onFilterChanged) onFilterChanged({ ...filter, page: 0, title: value });
    }, GlobalSearchDelay);
  };
  useEffect(
    () => () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    },
    [],
  );
  // const isToggleOrderDisabled = useMemo(()=>
  //   [ChannelsSortByEnum.relevant.key , ChannelsSortByEnum.recent.key].includes(filterBy.order_by)
  // ,[filterBy.order_by])
  //
  return (
    <div className="filter-section">
      {filter && (
        <div className="filter-item">
          <Inputs
            idRef="searchChannelsFilterRef"
            endAdornment={<span className="fas fa-search mx-3" />}
            onKeyUp={searchHandler}
            label="search"
            parentTranslationPath={parentTranslationPath}
          />
        </div>
      )}
      {filterBy && (
        <div className="filter-item">
          <SortByAutoCompleteControl
            idRef="sortByChannelsFilter"
            startAdornment="sort-by-dots"
            inputPlaceholder="sort-by"
            onSelectedValueChanged={(newValue) => {
              if (filter.page !== 0 && onFilterChanged)
                onFilterChanged({ ...filter, page: 0 });
              if (onFilterByChanged)
                onFilterByChanged({ ...filterBy, order_by: newValue });
            }}
            filterBy={filterBy}
            // endAdornment={(
            //   <ButtonBase
            //     disabled={isToggleOrderDisabled}
            //     className="btns theme-transparent h-100 w-100 miw-40px mx-0 br-0"
            //     onClick={() => {
            //       if (filter.page !== 1 && onFilterChanged)
            //         onFilterChanged({ ...filter, page: 1 });
            //       if (onFilterByChanged)
            //         onFilterByChanged({
            //           ...filterBy,
            //           order_by: getOrderByValue(filterBy),
            //           direction: (filterBy.direction === 'desc' && 'asc') || 'desc',
            //         });
            //     }}
            //   >
            //     <span
            //       className={`fas fa-sort-amount-${
            //         (filterBy.direction === 'desc' && 'down') || 'up'
            //       }`}
            //     />
            //   </ButtonBase>
            // )}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      )}
    </div>
  );
};

ChannelsFilter.propTypes = {
  filter: PropTypes.shape({
    limit: PropTypes.number,
    page: PropTypes.number,
    title: PropTypes.string,
  }),
  filterBy: PropTypes.shape({
    limit: PropTypes.number,
    order_by: PropTypes.number,
    direction: PropTypes.string,
  }),
  onFilterByChanged: PropTypes.func,
  onFilterChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
ChannelsFilter.defaultProps = {
  onFilterChanged: undefined,
  onFilterByChanged: undefined,
  filter: undefined,
  filterBy: undefined,
  translationPath: 'ChannelsFilter.',
};
