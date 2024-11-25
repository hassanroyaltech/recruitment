// React and reactstrap
import React, { useEffect, useMemo, useState } from 'react';
import { Collapse } from 'reactstrap';
import { useTranslation } from 'react-i18next';

// Styled components
import styled from 'styled-components';
import RequirementCheckbox from './RequirementCheckbox';

// Stylesheet
import 'assets/scss/elevatus/_evabrand.scss';
import { GetAllSetupsCandidateProperties } from '../../services';
import i18next from 'i18next';
import { SharedAPIAutocompleteControl } from '../setups/shared';
import ButtonBase from '@mui/material/ButtonBase';
import { IconButton } from '@mui/material';

/**
 * Wrapper styled component
 */
const CollapseWrapper = styled.div`
  border: ${(props) => (props.isCollapsed ? '1px solid #57B2F2' : 'none')};
`;

/**
 * Header styled component
 */
const CollapseHeader = styled.div`
  background: ${(props) => (props.isCollapsed ? 'rgb(246, 249, 252)' : 'none')};
  box-shadow: ${(props) =>
    !props.isCollapsed
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      : 'none'};
`;
const translationPath = '';
const parentTranslationPath = 'EvaBrand';

/**
 * Require constructor
 * @param label
 * @param options
 * @param response
 * @param setNewResponse
 * @returns {JSX.Element}
 * @constructor
 */
const Require = ({
  label,
  options,
  response,
  setNewResponse,
  isSubmitted,
  errors,
  isForJobs,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  // Collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const statusOptions = [
    { key: 'optional', value: t(`${translationPath}optional`) },
    { key: 'required', value: t(`${translationPath}required`) },
    { key: 'disable', value: t(`${translationPath}disable`) },
  ];
  // Constructor to map labels into a new format

  // Data state
  const [data, setData] = useState([]);
  /**
   * Handler to change values
   * @param idToChange
   * @param newValue
   */
  const handleChange = (idToChange, newValue, index, key) => {
    let localeResponse = { ...response };
    let temp = {};
    if (options === 'dynamic_properties') {
      if (!key) {
        temp.value = newValue;
        temp.selected = newValue;
      } else {
        temp.id = newValue;
        temp.uuid = newValue;
      }

      localeResponse[options][index] = {
        ...localeResponse[options][index],
        ...temp,
      };
    } else {
      localeResponse[options][idToChange] = newValue;
      temp.selected = newValue;
    }

    setNewResponse(localeResponse);
    setData((items) => [
      ...items.map((r, i) => {
        if (options === 'dynamic_properties')
          if (i === index) return { ...r, ...temp };
          else return r;
        if (r.id === idToChange) return { ...r, ...temp };

        return r;
      }),
    ]);
  };

  // to update data on options or label changed
  useEffect(() => {
    setData(() => {
      if (options === 'dynamic_properties')
        return label.map((item) => ({
          ...item,
          id: item.uuid,
          options: statusOptions,
          selected: item.value || 'optional',
        }));
      else
        return Object.keys(label).map((r, i) => ({
          id: r,
          options: statusOptions,
          selected: Object.values(label)[i],
        }));
    });
  }, [t, label, options]);
  const isDynamicProperties = useMemo(
    () => options === 'dynamic_properties',
    [options],
  );

  const removeCandidateProperty = (index) => {
    let localeResponse = { ...response };
    localeResponse[options].splice(index, 1);
    setNewResponse(localeResponse);
    setData((items) => items.filter((_, i) => i !== index));
  };
  const addNewCandidateProperty = () => {
    let localeResponse = { ...response };
    const temp = {
      value: 'optional',
      selected: 'optional',
      id: '',
      uuid: '',
      options: statusOptions,
    };
    localeResponse[options].push(temp);
    setNewResponse(localeResponse);
    setData((items) => [...items, temp]);
  };
  /**
   * Return JSX
   */
  return (
    <CollapseWrapper id="collapse-wrapper" isCollapsed={isCollapsed}>
      <CollapseHeader
        id="collapse-header"
        isCollapsed={isCollapsed}
        onClick={() => setIsCollapsed((item) => !item)}
        className="d-flex justify-content-between"
      >
        <h3 className="mb-0 collapse-header-title">
          {t(`${translationPath}${options}`)}
        </h3>
        <i
          className={`fas ${!isCollapsed ? 'fa-angle-down' : 'fa-angle-up'} fa-2x`}
        />
      </CollapseHeader>
      <Collapse isOpen={isCollapsed}>
        {data.map((r, i) => (
          <React.Fragment key={`${r.id}-${i + 1}-require`}>
            {r.id !== 'social_network'
              && r.id !== 'location_map'
              && r.id !== 'references'
              && r.id !== 'mobile' && (
              <div id="require-row" className={'d-flex-v-center'}>
                {isDynamicProperties ? (
                  <SharedAPIAutocompleteControl
                    isHalfWidth
                    placeholder="select-dynamic-property"
                    stateKey={'dynamic_uuid'}
                    controlWrapperClasses={'mb-0'}
                    editValue={r.id}
                    onValueChanged={(newValue) => {
                      handleChange('', newValue.value || '', i, 'uuid');
                    }}
                    getOptionLabel={(option) =>
                      `${
                        option.name
                          && (option.name[i18next.language] || option.name.en)
                      }` || 'N/A'
                    }
                    getDataAPI={GetAllSetupsCandidateProperties}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    searchKey="search"
                    getDisabledOptions={(option) =>
                      (data || []).map((item) => item.uuid).includes(option.uuid)
                    }
                    isSubmitted={isSubmitted}
                    extraProps={{
                      ...(r.id && {
                        with_than: [r.id],
                      }),
                    }}
                    errors={errors}
                    errorPath={`${
                      isForJobs ? '' : 'activeCategoryRequirements.profile.'
                    }dynamic_properties[${i}].uuid`}
                  />
                ) : (
                  <h4 className="mb-0 require-row-title">
                    {t(`${translationPath}${r.id}`)}
                  </h4>
                )}

                <div className="ml-auto-reversed d-flex-v-center-h-between">
                  <div className="d-flex">
                    <RequirementCheckbox
                      options={r.options}
                      selected={r.selected}
                      id={r.id}
                      index={i}
                      onChange={handleChange}
                    />
                  </div>
                  {isDynamicProperties && (
                    <IconButton onClick={() => removeCandidateProperty(i)}>
                      <i className="fas fa-trash fz-14px" />
                    </IconButton>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
        {isDynamicProperties && (
          <div id={'require-row'}>
            <ButtonBase
              className="btns theme-solid my-2  mx-0"
              onClick={() => addNewCandidateProperty()}
            >
              <i className="fas fa-plus" />

              <span className="px-3">
                {t(`${translationPath}add-new-candidate-property`)}
              </span>
            </ButtonBase>
          </div>
        )}
      </Collapse>
    </CollapseWrapper>
  );
};

export default Require;
