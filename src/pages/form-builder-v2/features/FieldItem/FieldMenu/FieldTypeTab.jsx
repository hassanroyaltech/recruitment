import React, { useEffect, useState, useMemo } from 'react';
import {
  styled,
  Box,
  TextField,
  Select,
  IconButton,
  FormControl,
  FormHelperText,
  MenuItem,
  Switch,
  Icon,
  Typography,
  Divider,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
} from '@mui/material';
import _ from 'lodash';
import { MoreIcon, CornerDownIcon, CrossIcon } from '../../../../form-builder/icons';
import ToggleLanguageButtons from './ToggleLanguageButtons';
import Options from './Options';
import Description from './Description';
import { countries } from '../../../data/countries';
import { currencies } from '../../../data/currencies';
import { fileFormats } from '../../../data/fileFormats';
import { CheckboxesComponent } from '../../../../../components';
import SelectField from '../Fields/SelectField';
import DateTimeField from '../Fields/DateTimeField';
import DateField from '../Fields/DateField';
import TimeField from '../Fields/TimeField';
import RadioField from '../Fields/RadioField';
import CheckboxField from '../Fields/CheckboxField';
import { textModificationList } from 'pages/form-builder/data/iconButtonLists';
import { EquationOperatorsEnum, FormsRolesEnum, ScorecardRangesEnum } from 'enums';
import { numbersExpression } from 'utils';
import { generateUUIDV4 } from '../../../../../helpers';

const InputOptionBox = styled(Box)`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
    & > .MuiTypography-root {
        flex: 0 112px;
        margin-right: 8px;
    }
    & > .MuiBox-root {
        flex: 1;
    }
`;

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ style, theme }) => ({
  padding: theme.spacing(0),
  ...style,
}));
const decimalNumbers = Array.from({ length: 6 }, (_, index) => index);
export default function FieldTypeTab({
  cardItem,
  fieldsItems,
  templateData,
  langSaveTo,
  setLangSaveTo,
  anotherLang,
  language,
  setLanguage,
  inputType,
  maxFileSize,
  isVisible,
  charMax,
  charMin,
  rowMax,
  rowMin,
  setCharMax,
  setCharMin,
  isDrawAllowed,
  isUploadAllowed,
  phoneCountriesValue,
  allowedFileFormatsArray,
  phoneDefaultCountryValue,
  isPhoneMaskChecked,
  setRowMax,
  setRowMin,
  currencyValue,
  fieldCode,
  fileQuantityLimitation,
  setPhoneCountriesValue,
  setPhoneDefaultCountryValue,
  setIsPhoneMaskChecked,
  setCurrencyValue,
  setIsVisible,
  setInputType,
  setMaxFileSize,
  setIsDrawAllowed,
  setIsUploadAllowed,
  isTitleInteracted,
  isPlaceholderIneteracted,
  setIsTitleInteracted,
  setIsPlaceholderInteracted,
  setFileQuantityLimitation,
  setAllowedFileFormatsArray,
  setFieldCode,
  isRequired,
  setIsRequired,
  isVisibleFinalDoc,
  setIsVisibleFinalDoc,
  disablePastDates,
  setDisablePastDates,
  disableFutureDates,
  setDisableFutureDates,
  showDescriptionInsteadOfTitle,
  setShowDescriptionInsteadOfTitle,
  equation,
  setEquation,
  equationUnit,
  setEquationUnit,
  dataSectionItems,
  decimalPlaces,
  setDecimalPlaces,
  blocksItems,
  showNumberOnEnglish,
  setIsShowNumberOnEnglish,
}) {
  const [currentFields, setCurrentFields] = useState([]);

  const handleIsDrawAllowed = () => setIsDrawAllowed((isDraw) => !isDraw);

  const handleIsUploadAllowed = () => setIsUploadAllowed((isUpload) => !isUpload);

  const handlePhoneMaskChange = () => setIsPhoneMaskChecked((prev) => !prev);

  const handleFileQuantityLimitation = ({ target: { value } }) =>
    setFileQuantityLimitation(value);

  const handleMaxFileSizeChange = ({ target: { value } }) => setMaxFileSize(value);

  const handlePhoneCountryChange = ({ target: { value } }) => {
    setPhoneCountriesValue(value);
    if (value.length < phoneCountriesValue)
      setPhoneDefaultCountryValue((items) =>
        items.filter((item) => value.some((element) => element.iso === item.iso)),
      );
  };

  const handleAllowedFileFormatsChange = ({ target: { value } }) =>
    setAllowedFileFormatsArray(value);

  const handlePhoneDefaultCountryChange = ({ target: { value } }) =>
    setPhoneDefaultCountryValue(value);

  const handleFieldCodeChange = ({ target: { value } }) => setFieldCode(value);

  const handleCurrencyChange = ({ target: { value } }) => setCurrencyValue(value);

  const handleInputMinChange = ({ target: { value } }) => setCharMin(value);

  const handleInputMaxChange = ({ target: { value } }) => setCharMax(value);

  const handleRowMinChange = ({ target: { value } }) => setRowMin(value);

  const handleRowMaxChange = ({ target: { value } }) => setRowMax(value);
  const handleIsRequiredChange = (event, isChecked) => setIsRequired(isChecked);

  const handleButtonLabelChange = ({ target: { value } }) => {
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        buttonLabel: value,
      },
    }));
  };

  const handlePlaceholderChange = ({ target: { value } }) => {
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        placeholder: value,
      },
    }));
    if (!isPlaceholderIneteracted) setIsPlaceholderInteracted(true);
  };

  const handleNameChange = ({ target: { value } }) => {
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        title: value,
      },
    }));
    if (!isTitleInteracted) setIsTitleInteracted(true);
  };

  const handleStyleChange = ({ key, value }) => {
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        [key]: value,
      },
    }));
  };

  const handleConditionalHiddenValueChange = ({ target: { value } }) => {
    if (
      anotherLang
      && ['select', 'custom_select', 'radio', 'checkbox'].includes(inputType)
    )
      setLanguage((langs) => ({
        ...langs,
        [langSaveTo]: {
          ...langs[langSaveTo],
          isConditionalHiddenValue: value,
        },
        [anotherLang]: {
          ...langs[anotherLang],
          isConditionalHiddenValue: value,
        },
      }));
    else
      setLanguage((langs) => ({
        ...langs,
        [langSaveTo]: {
          ...langs[langSaveTo],
          isConditionalHiddenValue: value,
        },
      }));
  };
  const handleIsConditionalHiddenChange = (event, isChecked) => {
    if (
      anotherLang
      && ['select', 'custom_select', 'radio', 'checkbox'].includes(inputType)
    )
      setLanguage((langs) => ({
        ...langs,
        [langSaveTo]: {
          ...langs[langSaveTo],
          isConditionalHidden: isChecked,
        },
        [anotherLang]: {
          ...langs[anotherLang],
          isConditionalHidden: isChecked,
        },
      }));
    else
      setLanguage((langs) => ({
        ...langs,
        [langSaveTo]: {
          ...langs[langSaveTo],
          isConditionalHidden: isChecked,
        },
      }));
    if (language[langSaveTo].isConditionalHiddenValue)
      handleConditionalHiddenValueChange({ target: { value: null } });
  };

  const handleCardVisibilityChange = () => {
    setIsVisible((isVis) => {
      if (!isVis === false) setIsVisibleFinalDoc(false);
      return !isVis;
    });
  };
  const handleCardVisibilityFinalDocChange = () => {
    setIsVisibleFinalDoc((isVis) => !isVis);
  };

  const handleInputTypeChange = ({ target: { value } }) => {
    setInputType(value);
    console.log(blocksItems[value],"tested");
    console.log(blocksItems);

    const newField = fieldsItems[value] || blocksItems[value];
    const newOptionID = generateUUIDV4();
    if (!isTitleInteracted)
      setLanguage((langs) => ({
        ...langs,
        [langSaveTo]: {
          ...newField?.languages[langSaveTo],
          ...langs[langSaveTo],
          title: newField.languages[langSaveTo]?.title || newField.languages[langSaveTo]?.cardTitle,
          value: '',
          options:
            langs[langSaveTo].options
            || (newField.languages[langSaveTo].options && [
              { ...newField.languages[langSaveTo].options[0], id: newOptionID },
            ])
            || [],
        },
        ...(anotherLang && {
          [anotherLang]: {
            ...newField.languages[anotherLang],
            ...langs[anotherLang],
            title: newField.languages[anotherLang].title,
            value: '',
            options:
              langs[anotherLang].options
              || (newField.languages[anotherLang].options && [
                { ...newField.languages[anotherLang].options[0], id: newOptionID },
              ])
              || [],
          },
        }),
      }));
    if (!isPlaceholderIneteracted)
      setLanguage((langs) => ({
        ...langs,
        [langSaveTo]: {
          ...langs[langSaveTo],
          placeholder: newField.languages[langSaveTo].placeholder,
          options:
            langs[langSaveTo].options
            || (newField.languages[langSaveTo].options && [
              { ...newField.languages[langSaveTo].options[0], id: newOptionID },
            ])
            || [],
        },
        ...(anotherLang && {
          [anotherLang]: {
            ...langs[anotherLang],
            placeholder: newField.languages[anotherLang].placeholder,
            options:
              langs[anotherLang].options
              || (newField.languages[anotherLang].options && [
                { ...newField.languages[anotherLang].options[0], id: newOptionID },
              ])
              || [],
          },
        }),
      }));

  };

  const getEquation = useMemo(
    () =>
      equation?.map((item, idx) => {
        if (
          !EquationOperatorsEnum.includes(item)
          && currentFields.length > 0
          && !item?.type
          && isNaN(item)
        ) {
          const fullData = currentFields.find((it) => it.id === item);
          return (
            <Chip
              sx={{ px: 2 }}
              key={`getEquationKey${fullData?.id}-${idx}`}
              label={fullData?.languages?.[langSaveTo]?.title}
              deleteIcon={<></>}
              onClick={() => {
                setEquation((items) => items.filter((x, index) => index !== idx));
              }}
            />
          );
        } else if (item?.type === 'number')
          return (
            <div
              className="d-flex-center my-2"
              key={`getEquationKey${item.type}-${idx}`}
            >
              <TextField
                onWheel={(event) => event?.target?.blur()}
                sizeSmall
                type="number"
                value={
                  ((item.value || item.value === 0) && item.value) || 0 || item || 0
                }
                pattern={numbersExpression}
                onChange={(e) => {
                  setEquation((items) =>
                    items.map((x, index) => {
                      if (index === idx)
                        return {
                          type: 'number',
                          value: e.target.value,
                        };
                      else return x;
                    }),
                  );
                }}
              />
              <CrossIcon
                onClick={() =>
                  setEquation((items) => items.filter((x, index) => index !== idx))
                }
              />
            </div>
          );
        else if (isNaN(item))
          return (
            <Chip
              sx={{ px: 3 }}
              key={`getEquationKey${item}-${idx}`}
              label={item}
              deleteIcon={<></>}
              onClick={() => {
                setEquation((items) => items.filter((x, index) => index !== idx));
              }}
            />
          );
        else
          return (
            <Chip
              sx={{ px: 3 }}
              key={`getEquationKey${item}-${idx}`}
              label={item}
              deleteIcon={<></>}
              onClick={() => {
                setEquation((items) => items.filter((x, index) => index !== idx));
              }}
            />
          );
      }),
    [currentFields, equation, langSaveTo, setEquation],
  );
  const handleIsShowNumberOnEnglish = () => {
    // setIsShowNumberOnEnglish((isShow)=>{
    //   if(!isShow===false) setIsShowNumberOnEnglish(false);
    //   return !isShow
    // })
    setIsShowNumberOnEnglish((items) => !items);
  };
  useEffect(() => {
    if (!isVisible) setIsRequired(false);
  }, [isVisible, setIsRequired]);

  useEffect(() => {
    if (cardItem) setIsVisibleFinalDoc(cardItem?.isVisibleFinalDoc);
  }, [cardItem, setIsVisibleFinalDoc]);

  useEffect(() => {
    if (cardItem && (inputType === 'date' || inputType === 'datetime'))
      setDisableFutureDates(cardItem?.disableFutureDates);
  }, [cardItem, inputType, setDisableFutureDates]);

  useEffect(() => {
    if (cardItem && (inputType === 'date' || inputType === 'datetime'))
      setDisablePastDates(cardItem?.disablePastDates);
  }, [cardItem, inputType, setDisablePastDates]);
  useEffect(() => {
    if (cardItem) setIsShowNumberOnEnglish(cardItem?.showNumberOnEnglish);
  }, [cardItem, setIsShowNumberOnEnglish]);
  useEffect(() => {
    let allFields = [];
    Object.values(dataSectionItems).forEach((it) => {
      allFields = [...allFields, ...it.items];
    });
    setCurrentFields(
      allFields.filter((item) => item?.type === 'salary' || item?.type === 'number'),
    );
  }, [dataSectionItems]);

  const handleMultiplePlaceholdersChange = (val, index) => {
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        placeholder: { ...langs[langSaveTo].placeholder, [index]: val },
      },
    }));
    if (!isPlaceholderIneteracted) setIsPlaceholderInteracted(true);
  };
  const handleEquationUnitChange = ({ target: { value } }) => {
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        equationUnit: value,
      },
    }));
  };
  const handleRangeLabelsChange = (value, key) => {
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        rangeLabels: { ...langs?.[langSaveTo]?.rangeLabels, [key]: value },
      },
    }));
  };
  return (
    <>
      {templateData.secondaryLang && (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography
              variant="caption"
              lh="rich"
              weight="medium"
              color="dark.$60"
              align="center"
            >
              Add data for each language
            </Typography>
            <IconButton>
              <MoreIcon />
            </IconButton>
          </Box>
          <ToggleLanguageButtons
            langSaveTo={langSaveTo}
            setLangSaveTo={setLangSaveTo}
            templateData={templateData}
          />
        </>
      )}

      <InputOptionBox sx={{ mt: 4 }}>
        <Typography variant="caption" align="center">
          Input Type
        </Typography>
        <Box component={FormControl}>
          <Select
            displayEmpty
            fullWidth
            variant="standard"
            id="modal-input-type-select"
            IconComponent={CornerDownIcon}
            value={inputType}
            onChange={handleInputTypeChange}
          >
            {Object.entries(fieldsItems)
              .filter(([, { type }]) => type !== 'inline' && type !== 'texteditor')
              .map(([k, { languages, id, type, icon }]) => (
                <MenuItem key={`selectKey${id}`} value={type} name={k}>
                  <Box display="flex" alignItems="center">
                    <Icon component={icon} />
                    {languages[templateData.primaryLang].title}
                  </Box>
                </MenuItem>
              ))}
            {Object.entries(blocksItems).map(
              ([k, { languages, id, type, icon }]) => (
                <MenuItem key={`selectKey${id}`} value={type} name={k}>
                  <Box display="flex" alignItems="center">
                    <Icon component={icon} />
                    {languages[templateData.primaryLang].title}
                  </Box>
                </MenuItem>
              ),
            )}
          </Select>
        </Box>
      </InputOptionBox>
      <Box
        sx={{
          border: 1,
          padding: 2,
          borderRadius: 1,
          borderColor: '#ccc',
          borderStyle: 'dashed',
          marginBottom: 3,
        }}
      >
        <InputOptionBox>
          <Typography variant="caption" align="center">
            Label
          </Typography>
          <Box>
            <TextField
              onChange={handleNameChange}
              value={language[langSaveTo].title}
              sx={{ py: '2px' }}
            />
          </Box>
        </InputOptionBox>
        <InputOptionBox>
          <Typography variant="caption" align="center">
            Label font size
          </Typography>
          <Box>
            <Select
              fullWidth
              variant="standard"
              id="modal-input-type-select"
              IconComponent={CornerDownIcon}
              value={language[langSaveTo]?.labelFontSize}
              onChange={(e) => {
                handleStyleChange({ key: 'labelFontSize', value: e.target.value });
              }}
            >
              {_.range(8, 48, 1).map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </InputOptionBox>
        <InputOptionBox>
          <Typography variant="caption" align="center">
            Label style
          </Typography>
          <Box>
            <CustomToggleButtonGroup
              value={language[langSaveTo]?.labelDecorations}
              onChange={(e, value) => {
                handleStyleChange({ key: 'labelDecorations', value });
              }}
            >
              {textModificationList.map(({ icon, value }, i) => (
                <ToggleButton model="icon" key={i} value={value}>
                  <Icon component={icon} />
                </ToggleButton>
              ))}
            </CustomToggleButtonGroup>
          </Box>
        </InputOptionBox>
        <InputOptionBox>
          <Typography variant="caption" align="left">
            Hide label
          </Typography>
          <Switch
            checked={language?.[langSaveTo]?.hideLabel || false}
            onChange={() => {
              handleStyleChange({
                key: 'hideLabel',
                value: language[langSaveTo]?.hideLabel ? false : true,
              });
            }}
            sx={{ alignSelf: 'center', mr: 2.5 }}
            inputProps={{ 'aria-label': 'controlled-card-item-switch' }}
          />
          <Typography variant="body13" align="center" color="dark.main">
            Active
          </Typography>
        </InputOptionBox>
      </Box>

      {![
        'rating',
        'radio',
        'checkbox',
        'attachment',
        'signature',
        'video_gallery',
      ].includes(inputType) && (
        <InputOptionBox>
          <Typography variant="caption" align="center">
            Placeholder
          </Typography>
          <Box component={FormControl}>
            <TextField
              value={language[langSaveTo].placeholder}
              onChange={handlePlaceholderChange}
            />
          </Box>
        </InputOptionBox>
      )}
      {['video_gallery'].includes(inputType)
        && language[langSaveTo].value
        && language[langSaveTo].value.map((item, index) => (
          <React.Fragment key={item}>
            <InputOptionBox>
              <Typography variant="caption" align="center">
                Video{` ${index + 1} `} Placeholder
              </Typography>
              <Box component={FormControl}>
                <TextField
                  value={language[langSaveTo].placeholder[index] || ''}
                  onChange={(e) =>
                    handleMultiplePlaceholdersChange(e.target.value, index)
                  }
                />
              </Box>
            </InputOptionBox>
          </React.Fragment>
        ))}
      {['signature'].includes(inputType) && (
        <>
          <InputOptionBox sx={{ mt: 2.5 }}>
            <Typography variant="caption" align="center">
              Signature
            </Typography>
            <Switch
              checked={isDrawAllowed}
              onChange={handleIsDrawAllowed}
              sx={{ alignSelf: 'center', mr: 2.5 }}
              inputProps={{ 'aria-label': 'controlled-card-item-switch' }}
              disabled={cardItem?.signatureMethod === 'drawing'}
            />
            <Typography variant="body13" align="center" color="dark.main">
              Allow handdrawing
            </Typography>
          </InputOptionBox>
          <InputOptionBox>
            <Typography variant="caption"> </Typography>
            <Box display="flex" alignItems="center" flexItem sx={{ mt: 2 }}>
              <Switch
                checked={isUploadAllowed}
                onChange={handleIsUploadAllowed}
                sx={{ mr: 2.5 }}
                disabled={cardItem?.signatureMethod === 'file'}
              />
              <Typography>Allow signature file upload</Typography>
            </Box>
          </InputOptionBox>
        </>
      )}

      {['attachment'].includes(inputType) && (
        <>
          <InputOptionBox>
            <Typography variant="caption" align="center">
              Button Label
            </Typography>
            <Box>
              <TextField
                onChange={handleButtonLabelChange}
                value={language[langSaveTo].buttonLabel}
                sx={{ py: '2px' }}
              />
            </Box>
          </InputOptionBox>
          <InputOptionBox>
            <Typography variant="caption" align="center">
              Allowed formats
            </Typography>
            <Box component={FormControl}>
              <Select
                displayEmpty
                multiple
                variant="standard"
                id="formats-multiselect"
                IconComponent={CornerDownIcon}
                value={allowedFileFormatsArray}
                onChange={handleAllowedFileFormatsChange}
              >
                <MenuItem value="">Select formats</MenuItem>
                {Object.entries(fileFormats).map(([k, v]) => (
                  <MenuItem key={k} value={v.fileType}>
                    {k.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </InputOptionBox>
          <InputOptionBox>
            <Typography variant="caption" align="center">
              Max file size | KB
            </Typography>
            <Box>
              <TextField
                onChange={handleMaxFileSizeChange}
                value={maxFileSize}
                sx={{ py: '2px' }}
              />
            </Box>
          </InputOptionBox>
          <InputOptionBox>
            <Typography variant="caption" align="center">
              Limit file quantity
            </Typography>
            <Box component={FormControl}>
              <Select
                displayEmpty
                fullWidth
                variant="standard"
                id="file-quantity-select"
                IconComponent={CornerDownIcon}
                value={fileQuantityLimitation}
                onChange={handleFileQuantityLimitation}
              >
                <MenuItem value="">Unlimited</MenuItem>
                {_.range(1, 11).map((k) => (
                  <MenuItem key={k} value={k}>
                    {k}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </InputOptionBox>
        </>
      )}

      {['phone'].includes(inputType) && (
        <>
          <InputOptionBox>
            <Typography variant="caption" align="center">
              Allowed countries
            </Typography>
            <Box component={FormControl}>
              <Select
                displayEmpty
                multiple
                variant="standard"
                id="allowed-country-select"
                IconComponent={CornerDownIcon}
                value={phoneCountriesValue}
                onChange={handlePhoneCountryChange}
              >
                <MenuItem value="">Select countries</MenuItem>
                {countries.map((c) => (
                  <MenuItem key={c.name} value={c.iso}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </InputOptionBox>
          <InputOptionBox>
            <Typography variant="caption" align="center">
              Default country
            </Typography>
            <Box component={FormControl}>
              <Select
                displayEmpty
                fullWidth
                variant="standard"
                id="default-country-select"
                IconComponent={CornerDownIcon}
                value={phoneDefaultCountryValue}
                onChange={handlePhoneDefaultCountryChange}
              >
                <MenuItem value="">Select</MenuItem>
                {countries
                  .filter((country) =>
                    phoneCountriesValue.some((item) => item === country.iso),
                  )
                  .map((c) => (
                    <MenuItem key={c.name} value={c.iso}>
                      {c.name}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
          </InputOptionBox>
          <InputOptionBox sx={{ mt: 3 }}>
            <Typography variant="caption" align="center">
              Mask format
            </Typography>
            <Box display="flex">
              <Switch
                checked={isPhoneMaskChecked}
                onChange={handlePhoneMaskChange}
                sx={{ mr: 2 }}
              />
              <Typography>Use phone mask</Typography>
            </Box>
          </InputOptionBox>

          <InputOptionBox>
            <Typography variant="caption" align="center">
              {' '}
            </Typography>
          </InputOptionBox>
          <Divider sx={{ mt: 6, mb: 3, mx: -6 }} />
        </>
      )}

      {['salary'].includes(inputType) && (
        <>
          <InputOptionBox>
            <Typography variant="caption" align="center">
              Currency
            </Typography>
            <Box component={FormControl}>
              <Select
                displayEmpty
                fullWidth
                variant="standard"
                id="currency-select"
                IconComponent={CornerDownIcon}
                value={currencyValue}
                onChange={handleCurrencyChange}
              >
                <MenuItem value="">Select currency</MenuItem>
                {currencies.map((c) => (
                  <MenuItem key={c.currency} value={c.currency}>
                    {c.languages?.[langSaveTo] || c.languages?.en}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </InputOptionBox>
          <Divider sx={{ mt: 6, mb: 3, mx: -6 }} />
        </>
      )}

      {['equation'].includes(inputType) && (
        <Box
          sx={{
            border: 1,
            padding: 2,
            borderRadius: 1,
            borderColor: '#ccc',
            borderStyle: 'dashed',
            marginBottom: 3,
          }}
        >
          <Typography variant="caption" align="center" sx={{ my: 4 }}>
            Select field from dropdown or operator to create an equation
          </Typography>
          <InputOptionBox>
            <Typography variant="caption" align="center">
              Add Field
            </Typography>
            <Box component={FormControl}>
              <Select
                displayEmpty
                variant="standard"
                id="field-select"
                value=""
                IconComponent={CornerDownIcon}
                onChange={({ target: { value } }) => {
                  setEquation((prev) => [...prev, value]);
                }}
              >
                <MenuItem value="">Select field</MenuItem>
                {currentFields.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.languages?.[langSaveTo]?.title || c.languages?.en?.title}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </InputOptionBox>
          <InputOptionBox>
            <Typography variant="caption" align="left">
              Add operators and numbers
            </Typography>
            <Box component={FormControl}>
              <Select
                displayEmpty
                variant="standard"
                id="field-select"
                value=""
                IconComponent={CornerDownIcon}
                onChange={({ target: { value } }) => {
                  setEquation((prev) => [...prev, value]);
                }}
              >
                <MenuItem value="">Select value</MenuItem>
                {EquationOperatorsEnum.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c?.type || c}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </InputOptionBox>
          <InputOptionBox>
            <Typography variant="caption" align="center" sx={{ pb: 4 }}>
              Equation
            </Typography>
            <Box spacing={1}>{getEquation}</Box>
          </InputOptionBox>
          <InputOptionBox>
            <Typography variant="caption" align="center" sx={{ pb: 4 }}>
              Unit
            </Typography>
            <Box component={FormControl} variant="standard" sx={{ mr: 2 }}>
              <TextField
                id="unit-input-settings"
                value={language[langSaveTo]?.equationUnit || ''}
                onChange={handleEquationUnitChange}
                aria-describedby="unit-settings-text"
              />
            </Box>
          </InputOptionBox>
          <InputOptionBox>
            <Typography variant="caption" align="center" sx={{ pb: 4 }}>
              Decimal places
            </Typography>
            <Box component={FormControl} variant="standard" sx={{ mr: 2 }}>
              <Select
                displayEmpty
                variant="standard"
                id="decimal-places-select"
                value={decimalPlaces}
                IconComponent={CornerDownIcon}
                onChange={({ target: { value } }) => {
                  setDecimalPlaces(value);
                }}
              >
                <MenuItem value="">Select value</MenuItem>
                {decimalNumbers.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </InputOptionBox>
        </Box>
      )}
      {['rating'].includes(inputType) && (
        <Box
          sx={{
            border: 1,
            padding: 2,
            borderRadius: 1,
            borderColor: '#ccc',
            borderStyle: 'dashed',
            marginBottom: 3,
          }}
        >
          <Typography variant="caption" align="center" sx={{ my: 4 }}>
            Range tips
          </Typography>
          <InputOptionBox>
            <Typography variant="caption" align="center" sx={{ pb: 4 }}>
              Min label
            </Typography>
            <Box component={FormControl} variant="standard" sx={{ mr: 2 }}>
              <TextField
                id="range-labels-input-settings-min"
                value={language[langSaveTo]?.rangeLabels?.min || ''}
                onChange={(e) => handleRangeLabelsChange(e.target.value, 'min')}
                aria-describedby="range-labels-input-settings-min"
              />
            </Box>
          </InputOptionBox>
          {templateData?.ratingRange === ScorecardRangesEnum.zeroTen.key && (
            <InputOptionBox>
              <Typography variant="caption" align="center" sx={{ pb: 4 }}>
                Med label
              </Typography>
              <Box component={FormControl} variant="standard" sx={{ mr: 2 }}>
                <TextField
                  id="range-labels-input-settings-med"
                  value={language[langSaveTo]?.rangeLabels?.med || ''}
                  onChange={(e) => handleRangeLabelsChange(e.target.value, 'med')}
                  aria-describedby="range-labels-input-settings-med"
                />
              </Box>
            </InputOptionBox>
          )}

          <InputOptionBox>
            <Typography variant="caption" align="center" sx={{ pb: 4 }}>
              Max label
            </Typography>
            <Box component={FormControl} variant="standard" sx={{ mr: 2 }}>
              <TextField
                id="range-labels-input-settings-max"
                value={language[langSaveTo]?.rangeLabels?.max || ''}
                onChange={(e) => handleRangeLabelsChange(e.target.value, 'max')}
                aria-describedby="range-labels-input-settings-max"
              />
            </Box>
          </InputOptionBox>
        </Box>
      )}
      {['input', 'multiline', 'salary', 'phone', 'equation'].includes(inputType) && (
        <InputOptionBox>
          <Typography variant="caption" align="center" sx={{ pb: 4 }}>
            Characters limit
          </Typography>
          <Box component={FormControl} variant="standard" sx={{ mr: 2 }}>
            <TextField
              id="max-char-input-settings"
              value={charMin}
              onChange={handleInputMinChange}
              aria-describedby="min-input-settings-text"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                'aria-label': 'Min',
              }}
            />
            <FormHelperText id="min-input-settings-text">Min</FormHelperText>
          </Box>
          <Box component={FormControl}>
            <TextField
              id="min-char-input-settings"
              value={charMax}
              onChange={handleInputMaxChange}
              aria-describedby="max-input-settings-text"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                'aria-label': 'Max',
              }}
            />
            <FormHelperText id="max-input-settings-text" sx={{ m: 0 }}>
              Max
            </FormHelperText>
          </Box>
        </InputOptionBox>
      )}
      {['number'].includes(inputType) && (
        <InputOptionBox>
          <Typography variant="caption" align="center" sx={{ pb: 4 }}>
            Range
          </Typography>
          <Box component={FormControl} variant="standard" sx={{ mr: 2 }}>
            <TextField
              id="max-char-input-settings"
              value={charMin}
              onChange={handleInputMinChange}
              aria-describedby="min-input-settings-text"
              inputProps={{
                type: 'number',
                inputMode: 'numeric',
                pattern: '[0-9]*',
                'aria-label': 'Min',
              }}
            />
            <FormHelperText id="min-input-settings-text">Min</FormHelperText>
          </Box>
          <Box component={FormControl}>
            <TextField
              id="min-char-input-settings"
              value={charMax}
              onChange={handleInputMaxChange}
              aria-describedby="max-input-settings-text"
              inputProps={{
                type: 'number',
                inputMode: 'numeric',
                pattern: '[0-9]*',
                'aria-label': 'Max',
              }}
            />
            <FormHelperText id="max-input-settings-text" sx={{ m: 0 }}>
              Max
            </FormHelperText>
          </Box>
        </InputOptionBox>
      )}
      {/* {['multiline'].includes(inputType) && (
        <InputOptionBox>
          <Typography variant="caption" align="center" sx={{ pb: 4 }}>
            Rows limit
          </Typography>
          <Box component={FormControl} variant="standard" sx={{ mr: 2 }}>
            <TextField
              id="min-rows-input-settings"
              value={rowMin}
              onChange={handleRowMinChange}
              aria-describedby="min-row-settings-text"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                'aria-label': 'row-min',
              }}
            />
            <FormHelperText id="min-row-settings-text">Min</FormHelperText>
          </Box>
          <Box component={FormControl}>
            <TextField
              id="min-rows-input-settings"
              value={rowMax}
              onChange={handleRowMaxChange}
              aria-describedby="max-row-settings-text"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                'aria-label': 'row-max',
              }}
            />
            <FormHelperText id="max-row-settings-text">Max</FormHelperText>
          </Box>
        </InputOptionBox>
      )} */}

      {!['equation'].includes(inputType) && (
        <InputOptionBox>
          <Typography variant="caption" align="center">
            Required
          </Typography>
          <span className="px-2">
            <CheckboxesComponent
              idRef={`isRequiredIdRef${inputType}`}
              isDisabled={!isVisible}
              singleChecked={isRequired}
              onSelectedCheckboxChanged={handleIsRequiredChange}
            />
          </span>
        </InputOptionBox>
      )}

      {cardItem.description !== '' && (
        <Description description={cardItem.description} />
      )}

      {['select', 'custom_select', 'radio', 'checkbox'].includes(inputType) && (
        <Options
          setLanguage={setLanguage}
          language={language}
          langSaveTo={langSaveTo}
          anotherLang={anotherLang}
          inputType={inputType}
          disabled={inputType === 'custom_select' ? true : false}
        />
      )}
      {[
        'input',
        'multiline',
        'salary',
        'number',
        'phone',
        'name',
        'select',
        'custom_select',
        'datetime',
        'date',
        'time',
        'radio',
        'checkbox',
        'email',
      ].includes(inputType) && (
        <InputOptionBox>
          <Typography variant="caption" align="center" sx={{ pb: 3, pt: 2 }}>
            Hide if value is
          </Typography>
          <span className="px-2 pt-2">
            <CheckboxesComponent
              idRef={`conditionalHiddenIdRef${inputType}`}
              singleChecked={language[langSaveTo].isConditionalHidden}
              onSelectedCheckboxChanged={handleIsConditionalHiddenChange}
            />
          </span>
          {[
            'input',
            'multiline',
            'salary',
            'number',
            'phone',
            'name',
            'email',
            'equation',
          ].includes(inputType)
            && language[langSaveTo].isConditionalHidden && (
            <Box component={FormControl}>
              <TextField
                id="conditionalHidden"
                value={language[langSaveTo].isConditionalHiddenValue}
                onChange={handleConditionalHiddenValueChange}
                aria-describedby="handle-conditional-hidden-text"
                // inputProps={{
                //   inputMode: (inputType === 'number' && 'numeric') || undefined,
                //   pattern: (inputType === 'number' && '[0-9]*') || undefined,
                // 'aria-label': 'Max',
                //}}
              />
              {/*<FormHelperText id="max-input-settings-text" sx={{ m: 0 }}>*/}
              {/*  Max*/}
              {/*</FormHelperText>*/}
            </Box>
          )}
          {['select', 'custom_select'].includes(inputType)
            && language[langSaveTo].isConditionalHidden && (
            <Box component={FormControl}>
              <SelectField
                list={language[langSaveTo].options}
                initialValue={language[langSaveTo].isConditionalHiddenValue}
                handleSetValue={(value) =>
                  handleConditionalHiddenValueChange({ target: { value } })
                }
                placeholder={language[langSaveTo].placeholder}
                preview={{
                  isActive: true,
                }}
                // fillBy={fillBy}
                isRequired={isRequired}
                // isSubmitted={isSubmitted}
              />
            </Box>
          )}
          {['datetime'].includes(inputType)
            && language[langSaveTo].isConditionalHidden && (
            <Box component={FormControl}>
              <DateTimeField
                initialValue={language[langSaveTo].isConditionalHiddenValue}
                handleSetValue={(value) =>
                  handleConditionalHiddenValueChange({ target: { value } })
                }
              />
            </Box>
          )}
          {['date'].includes(inputType)
            && language[langSaveTo].isConditionalHidden && (
            <Box component={FormControl}>
              <DateField
                initialValue={language[langSaveTo].isConditionalHiddenValue}
                handleSetValue={(value) =>
                  handleConditionalHiddenValueChange({ target: { value } })
                }
              />
            </Box>
          )}
          {['time'].includes(inputType)
            && language[langSaveTo].isConditionalHidden && (
            <Box component={FormControl}>
              <TimeField
                initialValue={language[langSaveTo].isConditionalHiddenValue}
                handleSetValue={(value) => {
                  handleConditionalHiddenValueChange({ target: { value } });
                }}
              />
            </Box>
          )}
        </InputOptionBox>
      )}
      {['custom_select'].includes(inputType)
        && [
          'benefit_group',
          'contract_marital_status',
          'ticket_route',
          'transportation_type',
          'critical_care',
          'special_area',
          'transportation_allowance',
          'project_allowance',
          'over_time',
          'ticket_entitlement',
          'housing_type',
          'salary_basic',
          'sub_category',
        ].includes(cardItem.formLockup) && (
        <InputOptionBox>
          <Typography variant="caption" align="left" sx={{ pb: 3, pt: 2 }}>
              Show description instead of title
          </Typography>
          <span className="px-2 pt-2">
            <CheckboxesComponent
              idRef={`conditionalHiddenIdRef${inputType}`}
              singleChecked={showDescriptionInsteadOfTitle || false}
              onSelectedCheckboxChanged={() =>
                setShowDescriptionInsteadOfTitle((val) => !val)
              }
            />
          </span>
        </InputOptionBox>
      )}
      {['radio'].includes(inputType) && language[langSaveTo].isConditionalHidden && (
        <RadioField
          list={language[langSaveTo].options}
          initialValue={language[langSaveTo].isConditionalHiddenValue}
          handleSetValue={(value) => {
            handleConditionalHiddenValueChange({
              target: {
                value,
              },
            });
          }}
        />
      )}
      {['checkbox'].includes(inputType)
        && language[langSaveTo].isConditionalHidden && (
        <CheckboxField
          list={language[langSaveTo].options}
          initialValue={language[langSaveTo].isConditionalHiddenValue}
          handleSetValue={(value) => {
            handleConditionalHiddenValueChange({
              target: {
                value,
              },
            });
          }}
        />
      )}
      <Divider sx={{ mx: -6, mb: 4, mt: 1 }} />
      <InputOptionBox>
        <Typography variant="caption" align="center">
          Field code
        </Typography>
        <Box>
          <TextField value={fieldCode} onChange={handleFieldCodeChange} />
        </Box>
      </InputOptionBox>
      <Divider sx={{ mx: -6, mb: 4, mt: 1 }} />

      {
        // templateData.primaryLang !== 'en' &&
        ['salary', 'number', 'equation'].includes(inputType) && (
          <InputOptionBox>
            <Typography variant="caption" align="left">
              Show number on English
            </Typography>
            <Switch
              checked={showNumberOnEnglish}
              onChange={handleIsShowNumberOnEnglish}
              sx={{ alignSelf: 'center', mr: 2.5 }}
              inputProps={{ 'aria-label': 'controlled-card-item-switch' }}
            />
            <Typography variant="body13" align="center" color="dark.main">
              Active
            </Typography>
          </InputOptionBox>
        )}
      <InputOptionBox>
        <Typography variant="caption" align="center">
          Visibility
        </Typography>
        <Switch
          checked={isVisible}
          onChange={handleCardVisibilityChange}
          sx={{ alignSelf: 'center', mr: 2.5 }}
          inputProps={{ 'aria-label': 'controlled-card-item-switch' }}
        />
        <Typography variant="body13" align="center" color="dark.main">
          Active
        </Typography>
      </InputOptionBox>
      <Tooltip
        title={
          cardItem.fillBy === FormsRolesEnum.Recipient.key
            ? 'Make sure this field is not intended to be filled by recipient in order to control this option'
            : ''
        }
      >
        <InputOptionBox>
          <Typography variant="caption" align="left">
            Visible on final document
          </Typography>
          <Switch
            checked={isVisibleFinalDoc}
            onChange={handleCardVisibilityFinalDocChange}
            sx={{ alignSelf: 'center', mr: 2.5 }}
            inputProps={{ 'aria-label': 'controlled-card-item-switch' }}
            disabled={cardItem.fillBy === FormsRolesEnum.Recipient.key || !isVisible}
          />
          <Typography variant="body13" align="center" color="dark.main">
            Active
          </Typography>
        </InputOptionBox>
      </Tooltip>
      {(inputType === 'date' || inputType === 'datetime') && (
        <>
          <InputOptionBox>
            <Typography variant="caption" align="left">
              Disable past dates
            </Typography>
            <Switch
              checked={disablePastDates}
              onChange={() => setDisablePastDates((val) => !val)} //
              sx={{ alignSelf: 'center', mr: 2.5 }}
              inputProps={{ 'aria-label': 'controlled-card-item-switch' }}
              disabled={disableFutureDates}
            />
            <Typography variant="body13" align="center" color="dark.main">
              Active
            </Typography>
          </InputOptionBox>
          <InputOptionBox>
            <Typography variant="caption" align="left">
              Disable future dates
            </Typography>
            <Switch
              checked={disableFutureDates}
              onChange={() => setDisableFutureDates((val) => !val)} //
              sx={{ alignSelf: 'center', mr: 2.5 }}
              inputProps={{ 'aria-label': 'controlled-card-item-switch' }}
              disabled={disablePastDates}
            />
            <Typography variant="body13" align="center" color="dark.main">
              Active
            </Typography>
          </InputOptionBox>
        </>
      )}
    </>
  );
}
