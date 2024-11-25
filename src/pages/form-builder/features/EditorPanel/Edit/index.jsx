import * as React from 'react';
import { Grid, Box, Tab, Tabs, Button, Chip, Typography } from '@mui/material';
import EditorPanelButton from '../../../components/EditorPanelButton';
import Accordion from '../../../components/Accordion';
import Popover from '../../../components/Popover';
import DraggableCards from '../../Dragndrop/DraggableCards';
import { PlusIcon, LayersIcon } from '../../../icons';
import LanguageMenu from './LanguageMenu';
import LayoutMenu from './LayoutMenu';
import { useDispatch } from 'react-redux';
import { removeCandidateUser } from 'stores/actions/candidateActions';
import { useMemo, useState } from 'react';
import { FontsAutocompleteControl } from '../../../../evabrand/dialogs/appearance-management/controls';
import { useTranslation } from 'react-i18next';
import LayoutField from './LayoutField';
import { SharedAutocompleteControl } from '../../../../setups/shared';
import { DynamicFormTypesEnum } from '../../../../../enums';
import _ from 'lodash';

// TODO tab panel refactoring / reuse / separate
//  LayersIcon,
//dataSectionItems,
//<DraggableCards items={dataSectionItems} icon={<LayersIcon />} />
const translationPath = '';
const parentTranslationPath = 'EvaBrand';
const fontSizesArray = _.range(8, 48, 1).map((item) => `${item}`);
function TabPanel({ children, value, index, ...props }) {
  return (
    <Box
      sx={{ pt: 4 }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...props}
    >
      {value === index && children}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    sx: {
      alignItems: 'flex-start',
      minWidth: 'fit-content',
      p: 0,
      mr: 6,
    },
    disableRipple: true,
  };
}

function EditPanelFieldsAccordion({ fieldsItems, customFields }) {
  const { t } = useTranslation(parentTranslationPath);
  const [tab, setTab] = React.useState(1);

  const handleChange = (event, value) => {
    setTab(value);
  };

  const TypographyFields = React.useMemo(
    () =>
      Object.entries(fieldsItems).filter(
        (x) => x[1].type === 'inline' || x[1].type === 'texteditor',
      ),
    [fieldsItems],
  );
  const InputFields = React.useMemo(
    () =>
      Object.entries(fieldsItems).filter(
        (x) =>
          x[1].type !== 'inline'
          && x[1].type !== 'texteditor'
          && x[1].type !== 'custom_select',
      ),
    [fieldsItems],
  );
  const CustomFields = React.useMemo(
    () => Object.entries(customFields),
    [customFields],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tab} onChange={handleChange} aria-label="fields">
        <Tab label={t(`${translationPath}typography`)} {...a11yProps(0)} />
        <Tab label={t(`${translationPath}input-types`)} {...a11yProps(1)} />
        <Tab label={t(`${translationPath}custom-fields`)} {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <DraggableCards
          type="input"
          items={TypographyFields}
          sx={{ padding: (theme) => theme.spacing(1.5, 4, 4, 5) }}
          parentTranslationPath={'FormBuilderPage'}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <DraggableCards
          type="input"
          items={InputFields}
          sx={{ padding: (theme) => theme.spacing(1.5, 4, 4, 5) }}
          parentTranslationPath={'FormBuilderPage'}
        />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <DraggableCards
          type="input"
          items={CustomFields}
          icon={LayersIcon}
          sx={{ padding: (theme) => theme.spacing(1.5, 4, 4, 5) }}
        />
      </TabPanel>
    </Box>
  );
}

function EditPanelDataSectionAccordion({ handleAddSection, customSections }) {
  const { t } = useTranslation(parentTranslationPath);
  const SectionCards = React.useMemo(
    () => Object.entries(customSections).map((x) => x),
    [],
  );
  return (
    <Box sx={{ padding: (theme) => theme.spacing(1.5, 4, 4, 5) }}>
      <Grid item xs>
        <DraggableCards
          icon={LayersIcon}
          type="input"
          items={SectionCards}
          parentTranslationPath={'FormBuilderPage'}
        />
        <Button
          variant="ghost"
          size="m"
          sx={{ width: '100%' }}
          startIcon={<PlusIcon />}
          onClick={handleAddSection}
        >
          {t(`${translationPath}new-section`)}
        </Button>
      </Grid>
    </Box>
  );
}

function EditPanelFontFamilyAccordion({ templateData, setTemplateData }) {
  const { t } = useTranslation(parentTranslationPath);
  const [languages] = useState(
    () => JSON.parse(localStorage.getItem('user'))?.results?.language,
  );
  const GetFontFamilyFormBuilder = useMemo(
    () => (value) => {
      if (languages && languages.length > 0)
        return languages?.find((ele) => ele?.code === value);
    },
    [languages],
  );
  return (
    <Box sx={{ padding: (theme) => theme.spacing(1.5, 4, 4, 5) }}>
      <Grid item xs>
        <div className="py-2">
          <FontsAutocompleteControl
            editValue={(templateData && templateData.primaryFontFamily) || null}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            inputLabel={t(`${translationPath}primary-language-font-family`)}
            placeholder={t(`${translationPath}primary-language-font-family`)}
            stateKey="Font Family"
            isSubmitted={false}
            language={GetFontFamilyFormBuilder(templateData.primaryLang).id}
            onValueChanged={(newValue) => {
              setTemplateData((prev) => ({
                ...prev,
                primaryFontFamily: newValue.value,
              }));
            }}
          />
        </div>
        {templateData?.secondaryLang && (
          <div className="py-2">
            <FontsAutocompleteControl
              idRef="secondary-font-family"
              editValue={(templateData && templateData.secondaryFontFamily) || null}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              inputLabel={t(`${translationPath}secondary-language-font-family`)}
              placeholder={t(`${translationPath}secondary-language-font-family`)}
              stateKey="Font Family"
              isSubmitted={false}
              language={GetFontFamilyFormBuilder(templateData.secondaryLang).id}
              onValueChanged={(newValue) => {
                setTemplateData((prev) => ({
                  ...prev,
                  secondaryFontFamily: newValue.value,
                }));
              }}
            />
          </div>
        )}
        <SharedAutocompleteControl
          placeholder={t(`${translationPath}global-font-size`)}
          title={t(`${translationPath}global-font-size`)}
          getOptionLabel={(option) => option}
          sharedClassesWrapper="px-0 py-2"
          initValues={fontSizesArray}
          isStringArray
          onValueChanged={(newValue) => {
            setTemplateData((prev) => ({
              ...prev,
              globalFontSize: newValue.value,
            }));
          }}
          editValue={templateData?.globalFontSize || ''}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          type={DynamicFormTypesEnum.select.key}
        />
        {/*<div className="py-3">*/}
        {/*  {templateData.secondaryLang && (*/}
        {/*    <FontsAutocompleteControl*/}
        {/*      editValue={(templateData && templateData.secondary_font_family) || null}*/}
        {/*      parentTranslationPath={parentTranslationPath}*/}
        {/*      translationPath={translationPath}*/}
        {/*      inputLabel="Secondary Language Font Family"*/}
        {/*      placeholder="Secondary Language Font-Family"*/}
        {/*      stateKey="Font-Family"*/}
        {/*      language={GetFontFamilyFormBuilder(templateData.secondaryLang).id}*/}
        {/*      onValueChanged={( newValue ) => {*/}
        {/*        setTemplateData((prev) => ({*/}
        {/*          ...prev,*/}
        {/*          secondary_font_family: newValue.value,*/}
        {/*        }));*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*</div>*/}
      </Grid>
    </Box>
  );
}

export default function Edit({
  fieldsItems,
  customFields,
  customSections,
  templateData,
  setTemplateData,
  handleAddSection,
  setDataSectionItems,
}) {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (sessionStorage.getItem('candidate_user_data'))
      dispatch(removeCandidateUser());
  }, [dispatch]);

  const accordionArr = [
    {
      header: t(`${translationPath}font-layout`),
      body: (
        <EditPanelFontFamilyAccordion
          templateData={templateData}
          setTemplateData={setTemplateData}
        />
      ),
    },
    {
      header: t(`${translationPath}data-section`),
      body: (
        <EditPanelDataSectionAccordion
          customSections={customSections}
          handleAddSection={handleAddSection}
        />
      ),
    },
    {
      header: t(`${translationPath}fields`),
      body: (
        <EditPanelFieldsAccordion
          fieldsItems={fieldsItems}
          customFields={customFields}
        />
      ),
    },
  ];
  return (
    <>
      {/* <Popover */}
      {/*   styles={{minWidth: 232}} */}
      {/*   anchorOrigin={{ */}
      {/*     vertical: 'center', */}
      {/*     horizontal: 'right', */}
      {/*   }} */}
      {/*   transformOrigin={{ */}
      {/*     vertical: 'top', */}
      {/*     horizontal: 'left', */}
      {/*   }} */}
      {/*   title="Select offer format"> */}
      {/*   <EditorPanelButton title="Sending as"> */}
      {/*     <Typography variant="body13rich">DocuSign</Typography> */}
      {/*   </EditorPanelButton> */}
      {/*   <SendingMenu templateData={templateData} setTemplateData={setTemplateData} /> */}
      {/* </Popover> */}
      <Popover
        styles={{ minWidth: 232 }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        title={t(`${translationPath}document-languages`)}
      >
        <EditorPanelButton title={t(`${translationPath}language`)}>
          <Chip
            variant="m"
            label={templateData.primaryLang.toUpperCase()}
            sx={{ ml: '10px' }}
          />
          {templateData.secondaryLang && (
            <Chip
              variant="m"
              label={templateData.secondaryLang.toUpperCase()}
              sx={{ ml: '10px' }}
            />
          )}
        </EditorPanelButton>
        <LanguageMenu
          setDataSectionItems={setDataSectionItems}
          templateData={templateData}
          setTemplateData={setTemplateData}
        />
      </Popover>
      {templateData.secondaryLang && (
        <Popover
          styles={{ minWidth: 444 }}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          title="Select layout for the translation"
        >
          <EditorPanelButton title={t(`${translationPath}layout`)}>
            <Typography variant="body13rich">
              {templateData.layout === 'row'
                ? `${t(`${translationPath}two-rows`)}`
                : `${t(`${translationPath}two-columns`)}`}
            </Typography>
          </EditorPanelButton>
          <LayoutMenu
            templateData={templateData}
            setTemplateData={setTemplateData}
          />
        </Popover>
      )}
      <Popover
        styles={{ minWidth: 444 }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        title={t(`${translationPath}select-layout-for-label`)}
      >
        <EditorPanelButton title={t(`${translationPath}labels-layout`)}>
          <Typography variant="body13rich">
            {templateData.labelsLayout === 'row'
              ? `${t(`${translationPath}one-row`)}`
              : `${t(`${translationPath}two-rows`)}`}
          </Typography>
        </EditorPanelButton>
        <LayoutMenu
          isLabels
          templateData={templateData}
          setTemplateData={setTemplateData}
        />
      </Popover>
      {!templateData?.secondaryLang && (
        <Popover
          styles={{ minWidth: 444 }}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          title={t(`${translationPath}select-layout-for-field`)}
        >
          <EditorPanelButton title={t(`${translationPath}fields-layout`)}>
            <Typography variant="body13rich">
              {templateData.fieldLayout === 'row'
                ? `${t(`${translationPath}one-row`)}`
                : `${t(`${translationPath}two-rows`)}`}
            </Typography>
          </EditorPanelButton>
          <LayoutField
            isFieldLayout
            templateData={templateData}
            setTemplateData={setTemplateData}
          />
        </Popover>
      )}
      <Accordion items={accordionArr} />
    </>
  );
}
