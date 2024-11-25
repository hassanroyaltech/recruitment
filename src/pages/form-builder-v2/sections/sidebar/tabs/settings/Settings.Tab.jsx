import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  TextField,
  ButtonBase,
  IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SharedAutocompleteControl, SharedInputControl } from 'pages/setups/shared';
import {
  DynamicFormTypesEnum,
  FormsAssignTypesEnum,
  FormsAssistRoleTypesEnum,
  FormsAssistTypesEnum,
  FormsMembersTypesEnum,
  SystemActionsEnum,
} from 'enums';
import { SwitchComponent } from '../../../../../../components';
import { SimpleSortable } from '../../../../features/Dragndrop/SimpleSortable';
import { DndIcon } from '../../../../../form-builder/icons';

export default function SettingsTab({
  setTemplateData,
  isSubmitted,
  errors,
  templateData,
  dataSectionItems,
  setDataSectionItems,
  getFilteredRoleTypes,
  getFirstAvailableDefault,
  getCurrentDefaultEnumItem,
  parentTranslationPath,
  translationPath,
}) {
  const { t } = useTranslation(parentTranslationPath);
  const [allFieldsList, setAllFieldsList] = useState([]);
  // const categories = ['Non Residents', 'Managers'];
  const onIsWithRecipientChange = (event, isChecked) => {
    setTemplateData((items) => ({
      ...items,
      assignToAssist: [],
      isWithRecipient: isChecked,
    }));
    // to make sure all fields are for sender
    if (!isChecked)
      setDataSectionItems((items) => {
        const localItems = JSON.parse(JSON.stringify(items));
        let isChanged = false;
        Object.entries(localItems).map(([, value]) => {
          value.items.map((item) => {
            if (
              item.type !== 'inline'
              && !getFilteredRoleTypes(false).some(
                (element) => item.fillBy === element.key,
              )
            ) {
              if (!isChanged) isChanged = true;
              item.fillBy = getFirstAvailableDefault().key;
              item.assign = [];
            }
            return undefined;
          });
          return undefined;
        });
        return (isChanged && localItems) || items;
      });
  };

  const onIsWithDelayChanged = (event, isChecked) => {
    setTemplateData((items) => ({
      ...items,
      delayDuration: null,
      isWithDelay: isChecked,
    }));
  };

  const onIsWithDeadlineChanged = (event, isChecked) => {
    setTemplateData((items) => ({
      ...items,
      deadlineDays: null,
      isWithDeadline: isChecked,
    }));
  };

  const onStateChanged = ({ id, value }) => {
    setTemplateData((items) => ({
      ...items,
      [id]: value,
    }));
  };

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
          value={
            templateData.title === 'Untitled'
              ? t(`${translationPath}untitled`)
              : templateData.title
          }
        />
      </Box>
      {/* <Box display="flex" flexDirection="column" sx={{ mb: 6 }}>
        <Typography variant="body13" weight="medium" color="dark.$80" sx={{ mb:1 }}>
          Appearence for caterogies
        </Typography>
        <Box>
          {caterogies.map((cat) => <Chip variant="xs" bg="darka6" key={cat} label={cat} sx={{ mr:2 }}/> )}
        </Box>
      </Box> */}
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
          value={
            templateData.description === 'Edit description'
              ? t(`${translationPath}edit-description`)
              : templateData.description
          }
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
            placeholder="press-enter-to-add"
            isFreeSolo
            stateKey="tags"
            onValueChanged={(val) => {
              setTemplateData((prev) => ({ ...prev, tags: val.value }));
            }}
            type={DynamicFormTypesEnum.array.key}
            isFullWidth
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            sharedClassesWrapper="px-2"
          />
        </Box>
      </Box>
      {getCurrentDefaultEnumItem().isWithDeadline !== false && (
        <>
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
        </>
      )}
      {getCurrentDefaultEnumItem().isWithDelay && (
        <>
          <div className="separator-h mb-2" />
          <span className="d-inline-flex">
            <span>
              <SwitchComponent
                idRef="isWithDelay"
                isChecked={templateData.isWithDelay}
                label="is-with-delay"
                isReversedLabel
                isFlexEnd
                onChange={onIsWithDelayChanged}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </span>
          </span>
          {templateData.isWithDelay && (
            <SharedInputControl
              isFullWidth
              labelValue="delay-duration-days"
              errors={errors}
              stateKey="delayDuration"
              errorPath="delayDuration"
              floatNumbers={0}
              min={0}
              type="number"
              editValue={templateData.delayDuration}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
            />
          )}
        </>
      )}
      {getCurrentDefaultEnumItem().isWithSurvey && (
        <>
          <div className="separator-h mb-2" />
          <span className="d-inline-flex">
            <span>
              <SwitchComponent
                idRef="isWithDelay"
                isChecked={templateData.isSurvey}
                label="is-survey"
                isReversedLabel
                isFlexEnd
                stateKey="delayDuration"
                onChange={(event, isChecked) =>
                  onStateChanged({ id: 'isSurvey', value: isChecked })
                }
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </span>
          </span>
          <div className="separator-h mb-2" />
          {/*<Box display="flex" flexDirection="column" sx={{ mb: 2 }}>*/}
          {/*  <Typography variant="body13" weight="medium" color="dark.$80" sx={{ mb: 1 }}>*/}
          {/*    {t(`${translationPath}rating-range`)}*/}
          {/*  </Typography>*/}
          {/*  <Box>*/}
          {/*    <SharedAutocompleteControl*/}
          {/*      isFullWidth*/}
          {/*      disableClearable*/}
          {/*      placeholder="select-range"*/}
          {/*      onValueChanged={onStateChanged }*/}
          {/*      stateKey="ratingRange"*/}
          {/*      sharedClassesWrapper="mb-0"*/}
          {/*      initValues={ratingRanges}*/}
          {/*      editValue={templateData?.ratingRange}*/}
          {/*      parentTranslationPath={parentTranslationPath}*/}
          {/*      translationPath={translationPath}*/}
          {/*      initValuesKey="key"*/}
          {/*      getOptionLabel={(option) => t(option.label)}*/}
          {/*    />*/}
          {/*  </Box>*/}
          {/*</Box>*/}
          {/*<Box display="flex" flexDirection="column" sx={{ mb: 2 }}>*/}
          {/*  <Typography variant="body13" weight="medium" color="dark.$80" sx={{ mb: 1 }}>*/}
          {/*    {t(`${translationPath}rating-style`)}*/}
          {/*  </Typography>*/}
          {/*  <Box>*/}
          {/*    <SharedAutocompleteControl*/}
          {/*      isFullWidth*/}
          {/*      disableClearable*/}
          {/*      placeholder="select-style"*/}
          {/*      onValueChanged={onStateChanged }*/}
          {/*      stateKey="ratingStyle"*/}
          {/*      sharedClassesWrapper="mb-0"*/}
          {/*      initValues={ratingStyles}*/}
          {/*      editValue={templateData?.ratingStyles}*/}
          {/*      parentTranslationPath={parentTranslationPath}*/}
          {/*      translationPath={translationPath}*/}
          {/*      initValuesKey="key"*/}
          {/*      getOptionLabel={(option) => t(option.label)}*/}
          {/*    />*/}
          {/*  </Box>*/}
          {/*</Box>*/}
        </>
      )}
      {!getCurrentDefaultEnumItem().isWithoutRecipientSwitch && (
        <>
          <div className="separator-h mb-2" />
          <div className="d-flex-v-center mb-3">
            <span>
              <SwitchComponent
                idRef="isWithRecipient"
                isChecked={templateData.isWithRecipient}
                label="is-with-recipient"
                isReversedLabel
                isFlexEnd
                onChange={onIsWithRecipientChange}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </span>
          </div>
        </>
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
                  {
                    id: prev?.workflowApprovalFields?.length + 1 || 1,
                  },
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
    </Box>
  );
}

SettingsTab.propTypes = {
  templateData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.array,
    isWithRecipient: PropTypes.bool,
    isSurvey: PropTypes.bool,
    isWithDelay: PropTypes.bool,
    delayDuration: PropTypes.number,
    isWithDeadline: PropTypes.bool,
    deadlineDays: PropTypes.number,
    assign: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(FormsAssignTypesEnum).map((item) => item.key),
        ),
        uuid: PropTypes.string,
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      }),
    ),
    invitedMember: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(FormsMembersTypesEnum).map((item) => item.key),
        ),
        uuid: PropTypes.string,
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      }),
    ),
    assignToAssist: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(FormsAssistTypesEnum).map((item) => item.key),
        ),
        uuid: PropTypes.string,
        role: PropTypes.oneOf(
          Object.values(FormsAssistRoleTypesEnum).map((item) => item.key),
        ),
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      }),
    ),
    workflowApprovalFields: PropTypes.array,
  }),
  isSubmitted: PropTypes.bool,
  errors: PropTypes.instanceOf(Object).isRequired,
  getFilteredRoleTypes: PropTypes.func.isRequired,
  getFirstAvailableDefault: PropTypes.func.isRequired,
  getCurrentDefaultEnumItem: PropTypes.func.isRequired,
  setTemplateData: PropTypes.func.isRequired,
  dataSectionItems: PropTypes.shape({}),
  setDataSectionItems: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

SettingsTab.defaultProps = {
  templateData: undefined,
  setTemplateData: undefined,
};
