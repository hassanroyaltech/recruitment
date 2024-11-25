/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/**
 * ----------------------------------------------------------------------------------
 * @title PipelineFilters.jsx
 * ----------------------------------------------------------------------------------
 * This module contains EVA-SSESS Pipeline Filters, the filters applied for
 * candidate name, email, applied date, and assessments completeness.
 * ----------------------------------------------------------------------------------
 */

// React and reactstrap
import React, { useMemo, useState } from 'react';
import { Button, Col, Row, ModalBody } from 'reactstrap';

// Standard Modal Component
import { StandardModalFrame } from 'components/Modals/StandardModalFrame';

// MUI components
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';

// import Moment to format date and time
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { DynamicFormTypesEnum, LanguageCerfScaleEnum } from '../../../enums';
import { SharedAutocompleteControl } from '../../setups/shared';

const translationPath = 'PipelineFiltersComponent.';
const PipelineFilters = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  // A state to hold Filters values
  const [filters, setFilters] = useState({
    query: null,
    applied_date: null,
    completeness: null,
    sort: null,
    language_proficiency: null,
  });
  // Function to handle onChange event for Fields
  const onChangeFilter = (field) => (e) => {
    const v = e.target.value;
    setFilters((items) => ({ ...items, [field]: v }));
  };
  // Function to handle onChange date
  const onSetDateField = (field, value) => {
    setFilters((items) => ({
      ...items,
      [field]: moment(value).format('YYYY-MM-DD'),
    }));
  };
  const cerfScale = useMemo(() => Object.values(LanguageCerfScaleEnum), []);

  const assessmentCompleteness = [
    { id: 2, title: t(`${translationPath}complete`) },
    { id: 1, title: t(`${translationPath}incomplete`) },
    { id: 0, title: t(`${translationPath}complete-and-incomplete`) },
  ];

  const sortingCriteria = [
    {
      id: 0,
      title: t(`${translationPath}model-answer-low-to-high`),
      order_by: t(`${translationPath}asc`),
      candidate_order_by: 1,
    },
    {
      id: 1,
      title: t(`${translationPath}model-answer-high-to-low`),
      order_by: t(`${translationPath}desc`),
      candidate_order_by: 1,
    },
    {
      id: 2,
      title: t(`${translationPath}applied-date-old-to-new`),
      order_by: t(`${translationPath}asc`),
      candidate_order_by: 2,
    },
    {
      id: 3,
      title: t(`${translationPath}applied-date-new-to-old`),
      order_by: t(`${translationPath}desc`),
      candidate_order_by: 2,
    },
    {
      id: 4,
      title: t(`${translationPath}average-rating-low-to-high`),
      order_by: t(`${translationPath}asc`),
      candidate_order_by: 3,
    },
    {
      id: 5,
      title: t(`${translationPath}average-rating-high-to-low`),
      order_by: t(`${translationPath}desc`),
      candidate_order_by: 3,
    },
  ];
  return (
    <StandardModalFrame
      isOpen={props.isOpen}
      onClose={props.onClose}
      modalTitle={t(`${translationPath}eva-ssess-filters`)}
      closeOnClick={props.onClose}
      className="modal-dialog-centered share-candidate-modal"
    >
      <ModalBody>
        <div className="pb-3">
          <Row className="mt-3 justify-content-center">
            <Col xl={8} className="mb-4">
              <TextField
                fullWidth
                className="form-control-alternative"
                id="name"
                name="name"
                label={t(`${translationPath}candidate-name`)}
                variant="outlined"
                value={filters?.query || ''}
                onChange={onChangeFilter('query')}
              />
            </Col>
            <Col xl={8}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  id="date-picker-filter"
                  label={t(`${translationPath}applied-date`)}
                  inputFormat="yyyy/MM/dd"
                  value={filters?.applied_date || null}
                  onChange={(date) => {
                    onSetDateField('applied_date', date);
                  }}
                  renderInput={(pickerProps) => (
                    <TextField {...pickerProps} fullWidth />
                  )}
                />
              </LocalizationProvider>
            </Col>
            <Col xl={8} className="pt-0">
              <Autocomplete
                fullWidth
                autoHighlight
                options={assessmentCompleteness}
                getOptionLabel={(option) => (option.title ? option.title : '')}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                className="mt-4"
                id="completeness"
                name="completeness"
                label={t(`${translationPath}completeness`)}
                variant="outlined"
                value={filters?.completeness || null}
                onChange={(e, value) => {
                  setFilters((items) => ({ ...items, completeness: value }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t(`${translationPath}assessment-completeness`)}
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                    }}
                    value={filters?.completeness || null}
                  />
                )}
              />
            </Col>
            <Col xl={8} className="pt-0">
              <Autocomplete
                fullWidth
                autoHighlight
                options={sortingCriteria}
                getOptionLabel={(option) => (option.title ? option.title : '')}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                className="mt-4"
                id="sort"
                name="sort"
                label={t(`${translationPath}candidates-sort`)}
                variant="outlined"
                value={filters?.sort || null}
                onChange={(e, value) => {
                  setFilters((items) => ({ ...items, sort: value }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t(`${translationPath}sorting-candidates-by`)}
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                    }}
                    value={filters?.sort || null}
                  />
                )}
              />
            </Col>
            <Col xl={8} className="pt-3">
              <SharedAutocompleteControl
                title="language-proficiency"
                editValue={filters.language_proficiency || []}
                initValues={cerfScale}
                stateKey="cerf_scale"
                onValueChanged={(e) => {
                  setFilters((items) => ({
                    ...items,
                    language_proficiency: e.value,
                  }));
                }}
                placeholder="language-proficiency"
                parentTranslationPath={props.parentTranslationPath}
                translationPath={translationPath}
                initValuesTitle="value"
                initValuesKey="key"
                sharedClassesWrapper="px-0 py-2"
                type={DynamicFormTypesEnum.array.key}
              />
            </Col>
          </Row>
          <div className="mt-5 d-flex justify-content-center">
            <Button
              type="button"
              color="primary"
              className="btn"
              onClick={() => props.onApply(filters)}
            >
              {t(`${translationPath}apply-filters`)}
            </Button>
            <Button
              type="button"
              color="primary"
              outline
              className="btn"
              onClick={() => {
                setFilters({
                  query: null,
                  applied_date: null,
                  completeness: null,
                  language_proficiency: null,
                });
              }}
            >
              {t(`${translationPath}reset-filters`)}
            </Button>
          </div>
        </div>
      </ModalBody>
    </StandardModalFrame>
  );
};

export default PipelineFilters;
