import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { Inputs, PaginationComponent } from '../../../../../../../components';

import FontAwesomeIcons from '../../../../../../../assets/jsons/all-fontawesome-free-icons-v5.15.json';

export const GridIconsControl = ({
  editValue,
  onValueChanged,
  idRef,
  isSubmitted,
  parentId,
  subParentId,
  index,
  stateKey,
  errors,
}) => {
  const [localValue, setLocalValue] = useState(null);
  const [data] = useState(() => FontAwesomeIcons);
  const [filteredData, setFilteredData] = useState(() => FontAwesomeIcons);
  const [searchIcons, setSearchIcons] = useState('');
  const [filter, setFilter] = useState({
    page: 0,
    pageSize: 10,
  });

  // method to select data on edit inti
  const getEditInit = useCallback(async () => {
    if (editValue && data.length > 0) {
      const currentItem = data.find((item) => item.key === editValue);
      if (currentItem)
        // setInputValue(currentItem.label);
        setLocalValue(currentItem);
      else if (onValueChanged)
        onValueChanged({
          parentId,
          subParentId,
          index,
          id: stateKey,
          value: null,
        });
    }
  }, [data, editValue, index, onValueChanged, parentId, stateKey, subParentId]);
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex }));
  };
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, pageSize: newPageSize }));
  };
  useEffect(() => {
    getEditInit();
  }, [editValue, getEditInit, data]);

  return (
    <div className="icons-control-wrapper control-wrapper">
      <div className="icons-search-wrapper">
        <Inputs
          idRef={`${idRef}${index + 1}`}
          value={searchIcons}
          onInputChanged={(event) => {
            const {
              target: { value },
            } = event;
            setSearchIcons(value);
            setFilteredData(
              data.filter(
                (item) =>
                  (value
                    && item.label.toLowerCase().includes(value.toLowerCase()))
                  || !value,
              ),
            );
          }}
          endAdornment={
            <div className="end-adornment-wrapper">
              <span className="fas fa-search" />
            </div>
          }
          label="search"
          themeClass="theme-solid"
          parentTranslationPath="Shared"
        />
      </div>
      <div className="icons-items-wrapper">
        {filteredData
          .slice(
            filteredData.length <= filter.pageSize
              ? 0
              : filter.page * filter.pageSize,
            filteredData.length <= filter.pageSize
              ? filter.pageSize
              : filter.page * filter.pageSize + filter.pageSize,
          )
          .map((item, mapIndex) => (
            <ButtonBase
              key={`iconsKey${idRef}-${index + 1}-${mapIndex + 1}`}
              className={`btns theme-transparent icon-btn-wrapper${
                (localValue && item.key === localValue.key && ' selected-icon') || ''
              }`}
              onClick={() => {
                setLocalValue(item);
                if (onValueChanged)
                  onValueChanged({
                    parentId,
                    subParentId,
                    index,
                    id: stateKey,
                    value: item.key,
                  });
              }}
            >
              <span className={`icon-wrapper ${item.key}`} />
              <span className="text-wrapper">{item.label}</span>
            </ButtonBase>
          ))}
        {errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
          && errors[parentId && `${parentId}.${subParentId}[${index}].${stateKey}`]
            .error
          && isSubmitted && (
          <div className="error-wrapper">
            <span>
              {
                errors[
                  parentId && `${parentId}.${subParentId}[${index}].${stateKey}`
                ].message
              }
            </span>
          </div>
        )}
      </div>
      <PaginationComponent
        idRef={`iconPaginationRef${index + 1}`}
        totalCount={filteredData.length}
        pageSize={filter.pageSize}
        pageIndex={filter.page}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    </div>
  );
};

GridIconsControl.propTypes = {
  editValue: PropTypes.string,
  onValueChanged: PropTypes.func,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  index: PropTypes.number,
  idRef: PropTypes.string,
  errors: PropTypes.instanceOf(Object).isRequired,
};
GridIconsControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  idRef: 'GridIconsControlRef',
};
