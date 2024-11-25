import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  GetAllBlockNumber,
  GetAllVisaGenders,
  GetAllVisaNationalities,
  GetAllVisaOccupations,
  GetAllVisaReligions,
  GetAllVisaStages,
} from '../../../../../../../services';
import {
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../../../../setups/shared';
import './BlocksFilters.Style.scss';
import i18next from 'i18next';

export const BlocksFiltersSection = ({
  blocks,
  filter,
  onFilterChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="blocks-filters-section-wrapper">
      <div className="d-inline-flex">
        <span className="px-2 my-2">
          <span>{t(`${translationPath}showing`)}</span>
          <span className="px-1">{blocks.totalCount}</span>
        </span>
        <SharedAPIAutocompleteControl
          searchKey="search"
          stateKey="occupation"
          placeholder="occupation"
          title="occupation"
          getDataAPI={GetAllVisaOccupations}
          editValue={filter.occupation}
          getOptionLabel={(option) =>
            (option.name
              && (option.name[i18next.language] || option.name.en || 'N/A'))
            || 'N/A'
          }
          onValueChanged={({ value }) => {
            onFilterChanged({ occupation: value });
          }}
          autocompleteThemeClass="theme-outline"
          controlWrapperClasses="px-2"
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          extraProps={filter.occupation && { with_than: [filter.occupation] }}
        />
        <SharedAPIAutocompleteControl
          searchKey="search"
          stateKey="nationality"
          placeholder="nationality"
          title="nationality"
          getDataAPI={GetAllVisaNationalities}
          editValue={filter.nationality}
          getOptionLabel={(option) =>
            (option.name
              && (option.name[i18next.language] || option.name.en || 'N/A'))
            || 'N/A'
          }
          onValueChanged={({ value }) => {
            onFilterChanged({ nationality: value });
          }}
          autocompleteThemeClass="theme-outline"
          controlWrapperClasses="px-2"
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          extraProps={filter.nationality && { with_than: [filter.nationality] }}
        />
        <SharedAPIAutocompleteControl
          searchKey="search"
          stateKey="gender"
          placeholder="gender"
          title="gender"
          getDataAPI={GetAllVisaGenders}
          editValue={filter.gender}
          getOptionLabel={(option) =>
            (option.name
              && (option.name[i18next.language] || option.name.en || 'N/A'))
            || 'N/A'
          }
          onValueChanged={({ value }) => {
            onFilterChanged({ gender: value });
          }}
          autocompleteThemeClass="theme-outline"
          controlWrapperClasses="px-2"
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          extraProps={filter.gender && { with_than: [filter.gender] }}
        />
        <SharedAPIAutocompleteControl
          searchKey="search"
          stateKey="religion"
          placeholder="religion"
          title="religion"
          getDataAPI={GetAllVisaReligions}
          editValue={filter.religion}
          getOptionLabel={(option) =>
            (option.name
              && (option.name[i18next.language] || option.name.en || 'N/A'))
            || 'N/A'
          }
          onValueChanged={({ value }) => {
            onFilterChanged({ religion: value });
          }}
          autocompleteThemeClass="theme-outline"
          controlWrapperClasses="px-2"
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          extraProps={filter.religion && { with_than: [filter.religion] }}
        />
        <SharedAPIAutocompleteControl
          searchKey="search"
          stateKey="status"
          placeholder="stage"
          title="stage"
          getDataAPI={GetAllVisaStages}
          editValue={filter.status}
          getOptionLabel={(option) => option.title || 'N/A'}
          onValueChanged={({ value }) => {
            onFilterChanged({ status: value });
          }}
          autocompleteThemeClass="theme-outline"
          controlWrapperClasses="px-2"
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          extraProps={filter.status && { with_than: [filter.status] }}
        />
        <SharedAPIAutocompleteControl
          title="block-number"
          searchKey="search"
          stateKey="uuid"
          placeholder="block-number"
          idRef="searchBlockNumberAutocompleteRef"
          autocompleteThemeClass="theme-outline"
          controlWrapperClasses="px-0"
          isQuarterWidth
          editValue={filter.block_uuid || ''}
          getDataAPI={GetAllBlockNumber}
          getOptionLabel={(option) => option.block_number || 'N/A'}
          onValueChanged={({ value }) => {
            onFilterChanged({ block_uuid: value });
          }}
          parentTranslationPath={parentTranslationPath}
        />
      </div>
      {/*<div className="d-inline-flex">*/}
      {/*<SharedInputControl*/}
      {/*  parentTranslationPath={parentTranslationPath}*/}
      {/*  translationPath={translationPath}*/}
      {/*  editValue={filter.search}*/}
      {/*  stateKey="search"*/}
      {/*  placeholder="search"*/}
      {/*  themeClass="theme-transparent"*/}
      {/*  wrapperClasses="px-2"*/}
      {/*  onInputBlur={({ value }) => {*/}
      {/*    onFilterChanged({ status: value });*/}
      {/*  }}*/}
      {/*  executeOnInputBlur*/}
      {/*  onKeyDown={(event) => {*/}
      {/*    if (event.key === 'Enter') onFilterChanged({ status: event.target.value });*/}
      {/*  }}*/}
      {/*  startAdornment={*/}
      {/*    <div className="start-adornment-wrapper c-gray-primary px-2">*/}
      {/*      <span className="fas fa-search" />*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*/>*/}
      {/*</div>*/}
    </div>
  );
};

BlocksFiltersSection.propTypes = {
  blocks: PropTypes.shape({
    results: PropTypes.instanceOf(Array),
    totalCount: PropTypes.number,
  }).isRequired,
  filter: PropTypes.shape({
    company: PropTypes.string,
    is_expired: PropTypes.bool,
    occupation: PropTypes.string,
    nationality: PropTypes.string,
    gender: PropTypes.string,
    religion: PropTypes.string,
    issue_place: PropTypes.string,
    status: PropTypes.string,
    search: PropTypes.string,
    block_uuid: PropTypes.string,
  }).isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
