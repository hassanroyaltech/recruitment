import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  TextField,
  IconButton,
  ButtonBase,
} from '@mui/material';
import PropTypes from 'prop-types';
import { SharedAutocompleteControl, SharedInputControl } from 'pages/setups/shared';
import { DynamicFormTypesEnum, SystemActionsEnum } from 'enums';
import { SimpleSortable } from '../../../form-builder-v2/features/Dragndrop/SimpleSortable';
import { DndIcon } from '../../icons';
import { useTranslation } from 'react-i18next';
import { SwitchComponent } from '../../../../components';
const parentTranslationPath = 'FormBuilderPage';
const translationPath = '';

export default function Settings({
  setTemplateData,
  templateData,
  isSubmitted,
  errors,
  setErrors,
  dataSectionItems,
}) {
  const { t } = useTranslation(parentTranslationPath);
  const [allFieldsList, setAllFieldsList] = useState([]);

  const onIsWithDeadlineChanged = (event, isChecked) => {
    setTemplateData((items) => ({
      ...items,
      deadlineDays: null,
      isWithDeadline: isChecked,
    }));
    if (isChecked)
      setErrors((prev) => ({
        ...prev,
        deadlineDays: { message: t('Shared:this-field-is-required'), error: true },
      }));
  };

  const onStateChanged = ({ id, value }) => {
    setTemplateData((items) => ({
      ...items,
      [id]: value,
    }));
    if (id === 'deadlineDays')
      if (!value && value !== 0)
        setErrors((prev) => ({
          ...prev,
          deadlineDays: { message: t('Shared:this-field-is-required'), error: true },
        }));
      else
        setErrors((prev) => {
          if (prev.deadlineDays) {
            delete prev.deadlineDays;
            return { ...prev };
          }
          return prev;
        });
  };
  console.log({
    errors
  })

  useEffect(() => {
    let allFields = [];
    Object.values(dataSectionItems).forEach((it) => {
      allFields = [...allFields, ...it.items];
    });
    setAllFieldsList(allFields);
  }, [dataSectionItems]);

  return (
    <Box
      sx={{
        p: 5,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="caption11">
        {' '}
        {t(`${translationPath}template-settings`)}
      </Typography>
      <Box display="flex" flexDirection="column" sx={{ mt: 8, mb: 6 }}>
        <Typography variant="body13" weight="medium" color="dark.$80" sx={{ mb: 1 }}>
          {t(`${translationPath}ref-code`)}
        </Typography>
        <Typography variant="body14" color="dark.$40">
          854739
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" sx={{ mb: 6 }}>
        <Typography variant="body13" weight="medium" color="dark.$80" sx={{ mb: 1 }}>
          {t(`${translationPath}template-name`)}
        </Typography>
        <TextField
          onChange={(e) =>
            setTemplateData((prev) => ({ ...prev, title: e.target?.value || '' }))
          }
          placeholder="Change template name"
          bg="a4"
          size="m"
          value={templateData.title || ''}
        />
      </Box>
      <Box display="flex" flexDirection="column" sx={{ mb: 6 }}>
        <Typography variant="body13" weight="medium" color="dark.$80" sx={{ mb: 1 }}>
          {t(`${translationPath}description`)}
        </Typography>
        <TextField
          multiline
          rows={3}
          onChange={(e) =>
            setTemplateData((prev) => ({
              ...prev,
              description: e.target?.value || '',
            }))
          }
          placeholder={t(`${translationPath}edit-description`)}
          bg="a4"
          value={templateData.description || ''}
        />
      </Box>
      <Divider sx={{ mx: -5 }} />
      <Box display="flex" flexDirection="column" sx={{ mb: 6 }}>
        <Typography variant="body13" weight="medium" color="dark.$80" sx={{ mb: 1 }}>
          {t(`${translationPath}tags`)}
        </Typography>
        <Box>
          <SharedAutocompleteControl
            editValue={templateData.tags}
            placeholder="Press enter to add"
            isFreeSolo
            stateKey="tags"
            onValueChanged={(val) => {
              setTemplateData((prev) => ({ ...prev, tags: val.value }));
            }}
            type={DynamicFormTypesEnum.array.key}
            isFullWidth
            sharedClassesWrapper="px-2"
          />
        </Box>
      </Box>
      <div className="separator-h mb-2" />
      <span className="d-inline-flex">
        <span>
          <SwitchComponent
            idRef="isWithDeadlineRef"
            isChecked={templateData.isWithDeadline}
            label="is-with-deadline"
            isReversedLabel
            isFlexEnd
            onChange={onIsWithDeadlineChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </span>
      </span>
      {templateData.isWithDeadline && (
        <SharedInputControl
          isFullWidth
          labelValue="deadline-days"
          errors={errors}
          stateKey="deadlineDays"
          errorPath="deadlineDays"
          floatNumbers={0}
          min={0}
          type="number"
          editValue={templateData.deadlineDays}
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {/* Fields to be shown in the approval request */}
      <Box display="flex" flexDirection="column" sx={{ mb: 6 }}>
        <div className="d-flex-v-center-h-between mb-2">
          <Typography
            variant="body13"
            weight="medium"
            color="dark.$80"
            sx={{ mb: 1 }}
          >
            {t(`${translationPath}fields-description`)}
          </Typography>
          <ButtonBase
            onClick={() =>
              setTemplateData((prev) => ({
                ...prev,
                workflowApprovalFields: [
                  ...(prev.workflowApprovalFields || []),
                  { id: prev?.workflowApprovalFields?.length + 1 || 1 },
                ],
              }))
            }
            className="btns-icon theme-transparent mx-1 mb-1"
          >
            <span className={SystemActionsEnum.add.icon} />
          </ButtonBase>
        </div>
        <Box>
          <SimpleSortable
            data={templateData.workflowApprovalFields}
            setDataOrder={(newOrder) => {
              setTemplateData((prev) => ({
                ...prev,
                workflowApprovalFields: newOrder,
              }));
            }}
            element={(option, index) => (
              <div className="d-flex-v-start my-2">
                <IconButton
                  disableRipple
                  sx={{ cursor: 'grab' }}
                  {...option.listeners}
                >
                  <DndIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <SharedAutocompleteControl
                  disableClearable
                  isEntireObject
                  editValue={option.id}
                  placeholder="select-field"
                  title="field"
                  stateKey="field"
                  isFullWidth
                  initValuesKey="id"
                  onValueChanged={(newValue) => {
                    if (newValue.value)
                      setTemplateData((prev) => {
                        let prevCopy = [...(prev.workflowApprovalFields || [])];
                        prevCopy[index] = {
                          id: newValue.value.id,
                          name:
                            newValue.value?.languages?.en?.title
                            || newValue.value?.languages?.ar?.title
                            || newValue.value?.languages?.de?.title,
                        };

                        return {
                          ...prev,
                          workflowApprovalFields: prevCopy,
                        };
                      });
                  }}
                  initValues={allFieldsList}
                  errorPath="status"
                  getOptionLabel={(op) =>
                    op.languages?.en?.title
                    || op.languages?.ar?.title
                    || op.languages?.de?.title
                  }
                  sharedClassesWrapper="mb-1"
                  disabledOptions={(op) =>
                    !!templateData.workflowApprovalFields?.filter(
                      (item) => item.id === op.id,
                    )?.length
                  }
                />
                <ButtonBase
                  onClick={() => {
                    setTemplateData((prev) => ({
                      ...prev,
                      workflowApprovalFields: prev.workflowApprovalFields?.filter(
                        (item, idx) => idx !== index,
                      ),
                    }));
                  }}
                  className="btns-icon theme-transparent mx-1 mb-1"
                >
                  <span className={SystemActionsEnum.delete.icon} />
                </ButtonBase>
              </div>
            )}
          />
        </Box>
      </Box>

      {/*<Divider sx={{ mx: -5 }} />*/}
      {/*<Box display="flex" flexDirection="column" sx={{ mt: 4, mb: 6 }}>*/}
      {/*  <Typography variant="body13" weight="medium" color="dark.$80" sx={{ mb: 1 }}>*/}
      {/*    Template permissions*/}
      {/*  </Typography>*/}
      {/*  <Box display="flex" alignItems="center" sx={{ mt: 5 }}>*/}
      {/*    <Switch />*/}
      {/*    <Typography sx={{ ml: 2.5 }}>Can be changed by sender</Typography>*/}
      {/*  </Box>*/}
      {/*</Box>*/}

      {/*<Divider sx={{ mx: -5 }} />*/}
      {/*<Box display="flex" flexDirection="column" sx={{ mt: 4, mb: 6 }}>*/}
      {/*  <Typography variant="body13" weight="medium" color="dark.$80" sx={{ mb: 1 }}>*/}
      {/*    Document workflow*/}
      {/*  </Typography>*/}
      {/*  <Box display="flex" alignItems="center" sx={{ mt:5 }}>*/}
      {/*    <Switch />*/}
      {/*    <Typography sx={{ ml: 2.5 }}>*/}
      {/*      Turn on workflows*/}
      {/*    </Typography>*/}
      {/*  </Box>*/}
      {/*</Box>*/}

      {/*<Divider sx={{ mx: -5 }} />*/}
      {/*<Box display="flex" flexDirection="column" sx={{ mt: 4, mb: 6 }}>*/}
      {/*  <Typography variant="body13" weight="medium" color="dark.$80" sx={{ mb: 1 }}>*/}
      {/*    Template usage*/}
      {/*  </Typography>*/}
      {/*  <Box display="flex" alignItems="center" sx={{ mt: 5 }}>*/}
      {/*    <Switch />*/}
      {/*    <Typography sx={{ ml: 2.5 }}>Track changes and usage</Typography>*/}
      {/*  </Box>*/}
      {/*</Box>*/}
    </Box>
  );
}

Settings.propTypes = {
  templateData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.array,
    isWithDeadline: PropTypes.bool,
    deadlineDays: PropTypes.number,
    workflowApprovalFields: PropTypes.array,
  }),
  isSubmitted: PropTypes.bool,
  setTemplateData: PropTypes.func,
  errors: PropTypes.object,
  setErrors: PropTypes.func,
  dataSectionItems: PropTypes.shape({}),
};

Settings.defaultProps = {
  templateData: undefined,
  setTemplateData: undefined,
};
