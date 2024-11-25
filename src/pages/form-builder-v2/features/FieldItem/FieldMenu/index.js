import React, { cloneElement, useEffect, useMemo, useState } from 'react';
import {
  styled,
  Popover,
  Box,
  ButtonGroup,
  Typography,
  Tab,
  Tabs,
  Button,
} from '@mui/material';
import { TrashIcon, CheckIcon } from '../../../../form-builder/icons';
import RulesTab from './RulesTab';
import FieldTypeTab from './FieldTypeTab';
import { EquationOperatorsEnum } from 'enums';
import { EquationsParser, showError } from 'helpers';

function TabPanel({ children, value, index, ...props }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        px: 6,
        pt: 3,
        pb: '17px',
      }}
      role="tabpanel"
      hidden={value !== index}
      className="form-field-settings-body-wrapper"
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

const Menu = styled((props) => (
  <Popover
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.spacing(2),
    width: '100%',
    minWidth: 280,
    maxWidth: 410,
    boxShadow: '0px 4px 13px 0px #090B2114, 0px 0px 2px 0px #10111E33',
  },
}));

export default function CardSettingsMenu({
  children,
  cardId,
  containerId,
  templateData,
  dataSectionItems,
  setDataSectionItems,
  fieldsItems,
  blocksItems,
  handleRoleChange,
  fillBy,
}) {
  // select card item from all cards(fields)
  const cardItem = useMemo(
    () => dataSectionItems[containerId].items.find((x) => x.id === cardId),
    [cardId, containerId, dataSectionItems],
  );
  // main tab position
  const [tab, setTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const isOpen = Boolean(anchorEl);

  const [langSaveTo, setLangSaveTo] = useState(templateData.primaryLang);
  const [anotherLang, setAnotherLang] = useState(
    langSaveTo === templateData.primaryLang
      ? templateData.secondaryLang
      : templateData.primaryLang,
  );

  // multiple languages fields
  const [language, setLanguage] = useState({
    [templateData.primaryLang]: cardItem.languages[templateData.primaryLang],
    ...((templateData.secondaryLang && {
      [templateData.secondaryLang]: cardItem.languages[templateData.secondaryLang],
    })
      || {}),
  });

  // TODO refactor, make one state from all props except lang and isActive
  const [isRequired, setIsRequired] = useState(cardItem.isRequired);
  // general
  const [inputType, setInputType] = useState(cardItem.type);
  // attachment
  const [allowedFileFormatsArray, setAllowedFileFormatsArray] = useState(
    cardItem.attachmentAllowedFileFormats || [],
  );
  const [maxFileSize, setMaxFileSize] = useState(cardItem.maxFileSize || '');
  const [fileQuantityLimitation, setFileQuantityLimitation] = useState(
    cardItem.fileQuantityLimitation || '',
  );
  // signature
  const [isDrawAllowed, setIsDrawAllowed] = useState(cardItem.isDrawAllowed);
  const [isUploadAllowed, setIsUploadAllowed] = useState(cardItem.isUploadAllowed);
  const [signatureMethod, setSignatureMethod] = useState(cardItem.signatureMethod || '');

  // phone
  const [isPhoneMaskChecked, setIsPhoneMaskChecked] = useState(
    cardItem.isPhoneMaskChecked,
  );
  const [phoneCountriesValue, setPhoneCountriesValue] = useState(
    cardItem.phoneAllowedCountries || [],
  );
  const [phoneDefaultCountryValue, setPhoneDefaultCountryValue] = useState(
    cardItem.phoneDefaultCountry || '',
  );
  // all numeric
  const [charMin, setCharMin] = useState(cardItem.charMin);
  const [charMax, setCharMax] = useState(cardItem.charMax);
  // multiline
  const [rowMin, setRowMin] = useState(cardItem.rowMin);
  const [rowMax, setRowMax] = useState(cardItem.rowMax);
  // currency
  const [currencyValue, setCurrencyValue] = useState(cardItem.currency);
  // UI
  const [isVisible, setIsVisible] = useState(cardItem.isVisible);
  const [isVisibleFinalDoc, setIsVisibleFinalDoc] = useState(
    cardItem.isVisibleFinalDoc,
  );
  const [isTitleInteracted, setIsTitleInteracted] = useState(false);
  const [isPlaceholderInteracted, setIsPlaceholderInteracted] = useState(false);
  const [fieldCode, setFieldCode] = useState(cardItem.code);
  const [disablePastDates, setDisablePastDates] = useState(
    cardItem.disablePastDates,
  );
  const [disableFutureDates, setDisableFutureDates] = useState(
    cardItem.disableFutureDates,
  );
  const [showDescriptionInsteadOfTitle, setShowDescriptionInsteadOfTitle] = useState(
    cardItem.showDescriptionInsteadOfTitle,
  );
  const [equation, setEquation] = useState(cardItem.equation || []);
  const [equationUnit, setEquationUnit] = useState(cardItem.equationUnit);
  const [result] = useState(cardItem.result);
  const [decimalPlaces, setDecimalPlaces] = useState(cardItem?.decimalPlaces ?? 2);
  const [showNumberOnEnglish, setIsShowNumberOnEnglish] = useState(
    cardItem?.showNumberOnEnglish
  );
  const handleOpen = (e) => setAnchorEl(e.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleTabChange = (e, value) => setTab(value);

  useEffect(() => {
    setLanguage(() => ({
      [templateData.primaryLang]: cardItem.languages[templateData.primaryLang],
      ...((templateData.secondaryLang && {
        [templateData.secondaryLang]: cardItem.languages[templateData.secondaryLang],
      })
        || {}),
    }));
  }, [templateData.secondaryLang, templateData.primaryLang, cardItem]);

  const handleSave = () => {
    if (equation?.length) {
      let newEquation = equation
        .map((item) => {
          if (Object.values(EquationOperatorsEnum).includes(item))
            return item.value || item;
          else return 1;
        })
        .join('');
      try {
        EquationsParser(newEquation);
      } catch (e) {
        showError('Please write a valid equation!', e);
        return;
      }
    }
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.map((item) =>
          item.id === cardId
            ? {
              ...item,
              languages: {
                ...item.languages,
                ...language,
              },
              type: inputType,
              code: fieldCode,
              isPhoneMaskChecked:!!isPhoneMaskChecked,
              attachmentAllowedFileFormats: allowedFileFormatsArray,
              phoneAllowedCountries: phoneCountriesValue,
              phoneDefaultCountry: phoneDefaultCountryValue,
              currency: currencyValue,
              fileQuantityLimitation,
              maxFileSize,
              isDrawAllowed:!!isDrawAllowed,
              isUploadAllowed:!!isUploadAllowed,
              isVisible,
              isVisibleFinalDoc,
              showNumberOnEnglish:!!showNumberOnEnglish,
              charMax: charMax ?? null,
              charMin: charMin ?? null,
              rowMin: rowMin ?? null,
              rowMax: rowMax ?? null,
              isRequired,
              disablePastDates,
              disableFutureDates,
              showDescriptionInsteadOfTitle,
              equation: equation?.map((it) => it?.value || it),
              equationUnit,
              decimalPlaces,
              signatureMethod
            }
            : item,
        ),
      },
    }));
    handleClose();
  };

  const handleRemove = () => {
    handleClose();
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.filter((x) => x.id !== cardId),
      },
    }));
  };

  useEffect(() => {
    setLangSaveTo(templateData.primaryLang);
  }, [templateData.primaryLang]);

  useEffect(() => {
    setAnotherLang(
      langSaveTo === templateData.primaryLang
        ? templateData.secondaryLang
        : templateData.primaryLang,
    );
  }, [langSaveTo, templateData.primaryLang, templateData.secondaryLang]);

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      {cloneElement(children, {
        id: 'settings-card-item-button',
        'aria-controls': isOpen ? 'settings-card-item-menu' : undefined,
        'aria-haspopup': true,
        'aria-expanded': isOpen ? 'true' : undefined,
        variant: 'contained',
        onClick: handleOpen,
      })}
      <Menu
        id="customized-menu"
        className="form-field-settings-popover-wrapper"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
      >
        <Box sx={{ width: '100%' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="fields">
            <Tab label="Field type" {...a11yProps(0)} />
            <Tab label="Rules" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={tab} index={0}>
            <FieldTypeTab
              fieldsItems={fieldsItems}
              templateData={templateData}
              langSaveTo={langSaveTo}
              anotherLang={anotherLang}
              cardItem={cardItem}
              charMax={charMax}
              charMin={charMin}
              isVisible={isVisible}
              inputType={inputType}
              rowMax={rowMax}
              rowMin={rowMin}
              language={language}
              currencyValue={currencyValue}
              maxFileSize={maxFileSize}
              fileQuantityLimitation={fileQuantityLimitation}
              isPhoneMaskChecked={isPhoneMaskChecked}
              isDrawAllowed={isDrawAllowed}
              isUploadAllowed={isUploadAllowed}
              isTitleInteracted={isTitleInteracted}
              isPlaceholderInetracted={isPlaceholderInteracted}
              allowedFileFormatsArray={allowedFileFormatsArray}
              phoneCountriesValue={phoneCountriesValue}
              phoneDefaultCountryValue={phoneDefaultCountryValue}
              fieldCode={fieldCode}
              setLangSaveTo={setLangSaveTo}
              setCharMax={setCharMax}
              setCharMin={setCharMin}
              setRowMax={setRowMax}
              setRowMin={setRowMin}
              setMaxFileSize={setMaxFileSize}
              setIsDrawAllowed={setIsDrawAllowed}
              setIsUploadAllowed={setIsUploadAllowed}
              setFileQuantityLimitation={setFileQuantityLimitation}
              setPhoneCountriesValue={setPhoneCountriesValue}
              setPhoneDefaultCountryValue={setPhoneDefaultCountryValue}
              setIsPhoneMaskChecked={setIsPhoneMaskChecked}
              setInputType={setInputType}
              setLanguage={setLanguage}
              setIsVisible={setIsVisible}
              setCurrencyValue={setCurrencyValue}
              setIsPlaceholderInteracted={setIsPlaceholderInteracted}
              setIsTitleInteracted={setIsTitleInteracted}
              setAllowedFileFormatsArray={setAllowedFileFormatsArray}
              setFieldCode={setFieldCode}
              isRequired={isRequired}
              setIsRequired={setIsRequired}
              isVisibleFinalDoc={isVisibleFinalDoc}
              setIsVisibleFinalDoc={setIsVisibleFinalDoc}
              disablePastDates={disablePastDates}
              setDisablePastDates={setDisablePastDates}
              disableFutureDates={disableFutureDates}
              setDisableFutureDates={setDisableFutureDates}
              showDescriptionInsteadOfTitle={showDescriptionInsteadOfTitle}
              setShowDescriptionInsteadOfTitle={setShowDescriptionInsteadOfTitle}
              equation={equation}
              setEquation={setEquation}
              equationUnit={equationUnit}
              setEquationUnit={setEquationUnit}
              dataSectionItems={dataSectionItems}
              result={result}
              decimalPlaces={decimalPlaces}
              setDecimalPlaces={setDecimalPlaces}
              blocksItems={blocksItems}
              showNumberOnEnglish={showNumberOnEnglish}
              setIsShowNumberOnEnglish={setIsShowNumberOnEnglish}
            />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <RulesTab handleRoleChange={handleRoleChange} fillBy={fillBy} />
          </TabPanel>
        </Box>
        <ButtonGroup disableElevation variant="modal">
          <Button onClick={handleRemove}>
            <TrashIcon />
            <Typography>Remove</Typography>
          </Button>
          <Button onClick={handleSave}>
            <CheckIcon />
            <Typography>Save changes</Typography>
          </Button>
        </ButtonGroup>
      </Menu>
    </Box>
  );
}
