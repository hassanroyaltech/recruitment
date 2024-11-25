import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ButtonBase from '@mui/material/ButtonBase';
import i18next from 'i18next';
import { SharedInputControl } from '../../../../shared';
import OrganizationChartComponent from '../../../../../../components/OrganizationChart/OrganizationChart.Component';

const HierarchicalStructureTab = ({
  state,
  isChanged,
  isLoading,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const selectedBranchReducer = useSelector(
    (reducerState) => reducerState?.selectedBranchReducer,
  );
  // search
  const [search, setSearch] = useState('');
  return (
    <div className="hierarchical-setups-page tab-wrapper">
      <div className="d-flex-v-center-h-between flex-wrap">
        <div className="d-inline-flex">
          <SharedInputControl
            idRef="searchRef"
            title="search"
            placeholder="search"
            stateKey="search"
            themeClass="theme-filled"
            endAdornment={
              <span className="end-adornment-wrapper">
                <span className="fas fa-search" />
              </span>
            }
            onValueChanged={(newValue) => {
              setSearch(newValue.value);
            }}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
        {isChanged && (
          <div className="px-2">
            <ButtonBase
              type="submit"
              disabled={
                !selectedBranchReducer
                || !selectedBranchReducer.uuid
                || isLoading
                || !isChanged
              }
              className={`btns theme-solid mx-2 mb-2${
                (state.initHierarchy
                  && state.initHierarchy.length > 0
                  && ' bg-secondary')
                || ' bg-green-primary'
              }`}
            >
              <span className="px-1">
                {t(
                  `${translationPath}${
                    (state.initHierarchy
                      && state.initHierarchy.length > 0
                      && 'update')
                    || 'create'
                  }`,
                )}
              </span>
            </ButtonBase>
          </div>
        )}
      </div>
      <OrganizationChartComponent
        dataset={state.hierarchy || []}
        rootText={
          (selectedBranchReducer
            && selectedBranchReducer.name
            && (selectedBranchReducer.name[i18next.language]
              || selectedBranchReducer.name.en))
          || null
        }
        getTitle={(item) =>
          (item.name && (item.name[i18next.language] || item.name.en)) || 'N/A'
        }
        getIncludeSearch={(item) =>
          search
          && item.name
          // eslint-disable-next-line max-len
          && Object.values(item.name || {}).filter((el) =>
            (el || '').toLowerCase().includes(search.toLowerCase()),
          ).length > 0
        }
        isWithGridBackground
      />
    </div>
  );
};

const hierarchyDto = PropTypes.arrayOf(
  PropTypes.shape({
    parent_uuid: PropTypes.string,
    uuid: PropTypes.string,
    code: PropTypes.string,
    isNotSaved: PropTypes.bool,
    name: PropTypes.instanceOf(Object),
    children: PropTypes.instanceOf(Array),
  }),
);
HierarchicalStructureTab.propTypes = {
  state: PropTypes.shape({
    initHierarchy: hierarchyDto,
    hierarchy: hierarchyDto,
  }).isRequired,
  isChanged: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default HierarchicalStructureTab;
