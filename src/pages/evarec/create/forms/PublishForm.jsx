// React and reactstrap
import React from 'react';
import { Card, Col, Row } from 'reactstrap';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CheckboxesComponent } from 'components';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';

const translationPath = '';
const parentTranslationPath = 'CreateJob';

/**
 * Publish the application
 * This is the final step in the process where we publish the post
 * @param form
 * @param setForm
 * @returns {JSX.Element}
 * @constructor
 */
export default function PublishForm({ form, setForm }) {
  const { t } = useTranslation(parentTranslationPath);
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);

  /**
   * handler for setting values of fields in the form
   * @param field
   * @param value
   */
  const onSetFormField = (field, value) => {
    setForm((items) => ({ ...items, [field]: value }));
  };

  /**
   * handler for checkbox
   * @param field
   * @returns {function(*): void}
   */
  const onCheckboxFormEvent = (field) => (e, isChecked) => {
    setForm((items) => ({ ...items, [field]: isChecked }));
  };

  /**
   * Return JSX
   */
  return (
    <Card className="step-card">
      <h6 className="h6">{t(`${translationPath}publish-post`)}</h6>
      <div className="mt-3 mb-2 h6 font-weight-normal text-gray">
        {t(`${translationPath}publish-post-description`)}.
      </div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="m-0 p-4 stage-card post-card w-100">
          <div className="d-flex flex-row justify-content-between align-items-center mb-2">
            <div className="d-flex flex-row align-items-center">
              {selectedBranchReducer?.brandStyle?.logo && (
                <img
                  src={selectedBranchReducer.brandStyle.logo}
                  alt=""
                  className="logo-icon"
                />
              )}
            </div>

            <div className="d-flex-v-center-h-end flex-row">
              <div className="d-inline-flex-v-center">
                <span>{t(`${translationPath}schedule-this-job`)}</span>
                <span className="px-2">
                  <CheckboxesComponent
                    idRef="elevatus-deadline"
                    singleChecked={form.is_schedule}
                    onSelectedCheckboxChanged={onCheckboxFormEvent('is_schedule')}
                  />
                </span>
              </div>
            </div>
          </div>
          {form.is_schedule && (
            <Row className="mt-4">
              <Col xs="12" sm="5">
                <DatePicker
                  fullWidth
                  margin="normal"
                  variant="inline"
                  inputVariant="outlined"
                  disablePast
                  id="date-picker-dialog"
                  label={t(`${translationPath}form`)}
                  inputFormat="yyyy/MM/dd"
                  renderInput={(pickerProps) => <TextField {...pickerProps} />}
                  value={form?.fromDate || null}
                  onChange={(date) => {
                    onSetFormField('fromDate', date);
                  }}
                />
              </Col>
              {form?.fromDate && (
                <Col xs="12" sm="5">
                  <DatePicker
                    fullWidth
                    margin="normal"
                    variant="inline"
                    inputVariant="outlined"
                    disablePast
                    minDate={form?.fromDate}
                    id="date-picker-dialog"
                    label={t(`${translationPath}to`)}
                    inputFormat="yyyy/MM/dd"
                    value={form?.toDate || null}
                    onChange={(date) => {
                      onSetFormField('toDate', date);
                    }}
                    renderInput={(pickerProps) => <TextField {...pickerProps} />}
                  />
                </Col>
              )}
            </Row>
          )}
        </div>
      </LocalizationProvider>
    </Card>
  );
}
