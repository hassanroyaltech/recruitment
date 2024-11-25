import React, { useCallback, useState } from 'react';
import {
  styled,
  Grid,
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { differenceInDays, isEqual } from 'date-fns';
import FieldSwitcher from '../FieldItem/FieldSwitcher';
import SubModelSection from '../Section/SubModelSection';
import SectionsWrapper from '../Section/SectionsWrapper';
import RTL from '../RTL';
import {
  FormsFieldsTypesEnum,
  NavigationSourcesEnum,
  TemplateRolesEnum,
} from '../../../../enums';
import { OffersStatusesEnum } from '../../../../enums/Shared/OffersStatuses.Enum';
import ButtonBase from '@mui/material/ButtonBase';
import { ValidateOfferWithDatabase } from '../../../../services';
import {
  EnToArUni,
  ExtractTextFromHTML,
  showError,
  showSuccess,
} from '../../../../helpers';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toSnakeCase } from '../../utils/helpers/toSnakeCase';
import moment from 'moment';

const Section = styled(Box)(({ theme, templateData }) => ({
  backgroundColor: theme.palette.light.main,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 1255,
  margin: '10px auto',
  boxShadow: '0px 2px 13px rgba(0, 0, 0, 0.02)',
  borderRadius: 8,
  '--font': ` ${templateData.primaryFontFamily || 'inherit'} !important`,
  '--font-fb-secondary': ` ${templateData.secondaryFontFamily || ''}`,
  '> .MuiBox-root': {
    display: 'flex',
    flex: 1,
    flexDirection: templateData.layout,
  },
  '&.is-horizontal-labels, &.is-vertical-labels': {
    overflow: 'hidden',
  },
  '&.is-horizontal-labels': {
    '.field-box-wrapper': {
      flexDirection: 'row',
      padding: '0 .5rem 1rem',
      // width: '100%',
      '.field-label-wrapper': {
        display: 'inline-block',
        marginTop: '.6rem',
        padding: '0 .5rem',
        width: 150,
        wordBreak: 'break-word',
        alignSelf: 'center',
        '&:not(.is-secondary-lang)': {
          ...(templateData?.primaryFontFamily && {
            fontFamily: `${templateData.primaryFontFamily || 'inherit'} !important`,
          }),
        },
        '&.is-secondary-lang': {
          ...(templateData?.secondaryFontFamily && {
            fontFamily: `${
              templateData.secondaryFontFamily || 'inherit'
            } !important`,
          }),
        },
      },
      '.field-item-wrapper': {
        display: 'inline-flex',
        height: '100%',
        alignItems: 'center',
        placeSelf: 'center',
        alignSelf: 'center',
        minWidth: '50%',
        '&.MuiBox-root': {
          width: '100%',
        },
      },
    },
  },
  '&.page-break-section': {
    padding: '2px !important',
    backgroundColor: theme.palette.dark.$16,
  },
}));

const Field = styled(Box)(({ theme, isVisible }) => ({
  display: isVisible ? 'flex' : 'none',
  flexDirection: 'column',
  flex: 1,
  padding: theme.spacing(4, 5.5),
  borderRadius: 8,
  '.MuiBox-root': {
    '> div': {
      flex: 1,
    },
  },
  '> span': {
    display: 'inline-block',
  },
  '& .MuiRadio-root': {
    padding: 0,
  },
  '& .MuiFormGroup-root': {
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2, 0, 2, 3),
    },
  },
  '> .MuiTypography-root': {
    marginBottom: theme.spacing(3),
  },
  '[disabled], .Mui-disabled': {
    background: `${theme.palette.dark.$8}`,
    outline: `${theme.palette.dark.$8}`,
    borderColor: `${theme.palette.dark.$20}`,
  },
}));

export default function Previewer({
  isFieldDisabled,
  dataSectionItems,
  setDataSectionItems,
  templateData,
  preview,
  isSubmitted,
  queryStatus,
  setErrors,
  onIsValidOfferChange,
  headerHeight,
  isValidOffer,
  setIsGlobalLoading,
  extractCurrencyByLang,
  isTypographyField,
}) {
  const { t } = useTranslation('Shared');
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const offersValidationWithDatabaseReducer = useSelector(
    (reducerState) => reducerState?.offersValidationWithDatabaseReducer,
  );
  const [validationErrors, setValidationErrors] = useState([]);
  const getIsHiddenCondition = useCallback(
    (type, languages, currentLanguage) => {
      if (
        !(
          templateData.editorRole !== TemplateRolesEnum.Creator.key
          && (preview?.role === TemplateRolesEnum.Recipient.key
            || templateData.editorRole === TemplateRolesEnum.Recipient.key
            || +queryStatus === OffersStatusesEnum.Completed.key
            || +queryStatus === OffersStatusesEnum.CompletedAsSecondary.key)
        )
        || !languages[currentLanguage].isConditionalHidden
      )
        return false;
      let conditionValue = languages[currentLanguage].isConditionalHiddenValue;
      let currentLanguageValue = languages[currentLanguage].value;
      if (currentLanguageValue || currentLanguageValue === 0) {
        if (type === 'phone') {
          currentLanguageValue = currentLanguageValue.split('-');
          // 0: for iso(unique), 1: for code (not unique), 2: for phone
          if (currentLanguageValue.length === 3)
            currentLanguageValue = currentLanguageValue[1] + currentLanguageValue[2];
          else if (currentLanguageValue.length === 2)
            currentLanguageValue = currentLanguageValue[0] + currentLanguageValue[1];
          else currentLanguageValue = '';
        }
        if (type === 'name') {
          currentLanguageValue = currentLanguageValue.join(' ').trim().toLowerCase();
          if (conditionValue) conditionValue = conditionValue.trim().toLowerCase();
        }

        if ('datetime' === type)
          return (
            (conditionValue
              && currentLanguageValue
              && isEqual(currentLanguageValue, conditionValue))
            || false
          );
        if ('date' === type)
          return (
            (conditionValue
              && currentLanguageValue
              && differenceInDays(currentLanguageValue, conditionValue)) === 0 || false
          );
        if ('time' === type) {
          currentLanguageValue
            = (currentLanguageValue && new Date(currentLanguageValue))
            || currentLanguageValue;
          conditionValue
            = (conditionValue && new Date(conditionValue)) || conditionValue;
          return (
            (conditionValue
              && currentLanguageValue
              && isEqual(
                new Date(
                  currentLanguageValue.getHours(),
                  currentLanguageValue.getMinutes(),
                ),
                new Date(conditionValue.getHours(), conditionValue.getMinutes()),
              ))
            || false
          );
        }
        if (type === 'checkbox')
          return (
            currentLanguageValue
            && conditionValue
            && currentLanguageValue.some((item) => conditionValue.includes(item))
          );
        if (
          type === FormsFieldsTypesEnum.TextEditor.key
          || type === FormsFieldsTypesEnum.Multiline.key
        )
          return (
            currentLanguageValue
            && conditionValue
            && ExtractTextFromHTML(currentLanguageValue) === conditionValue
          );
      }
      return currentLanguageValue === conditionValue;
    },
    [preview?.role, templateData.editorRole, queryStatus],
  );

  const validateWithDatabaseHandler = useCallback(
    (uuid, sections) => async () => {
      setIsLoadingLocal(true);
      const response = await ValidateOfferWithDatabase({ uuid, sections });
      setIsLoadingLocal(false);
      if (response && response.status === 200)
        if (response.data.results.is_valid) {
          setValidationErrors([]);
          showSuccess(t('offer-validation-success-description'));
          if (onIsValidOfferChange) onIsValidOfferChange(true);
        } else {
          const reason = Object.entries(response.data.results.response).reduce(
            (total, [key, value]) => {
              if (!value.is_valid) total[key] = { key, value: value.message };
              return total;
            },
            {},
          );
          showError('Validation failed. Please see the errors below.');
          // showError('', {
          //   data: {
          //     reason,
          //   },
          // });
          setValidationErrors(Object.values(reason));
        }
      else showError(t('failed-to-get-saved-data'), response);
    },
    [onIsValidOfferChange, t],
  );

  // TODO divide into smaller components
  return (
    <Grid
      container
      item
      xs
      className="previewer-wrapper"
      sx={{
        paddingTop: '0px',
        height: `calc(100vh - ${headerHeight}px)`,
        overflow: 'auto',
      }}
    >
      <SectionsWrapper
        xs
        item
        sx={{
          backgroundColor: (theme) => theme.palette.light.$1,
          justifyContent: 'center',
          pb: 11,
        }}
        noTopPaddin
      >
        {Object.values(dataSectionItems).length > 0
          && templateData?.editorRole === 'sender'
          && templateData?.source
            !== NavigationSourcesEnum.FromSelfServiceToFormBuilder.key
          && templateData?.source
            !== NavigationSourcesEnum.FromOfferViewToFormBuilder.key
          && (templateData?.status === OffersStatusesEnum.Draft.key
            || templateData?.status === OffersStatusesEnum.PendingApproval.key)
          && offersValidationWithDatabaseReducer
          && offersValidationWithDatabaseReducer.hasValidation
          && !preview.isActive && (
          <div
            className="d-flex-column-center"
            style={{
              position: 'sticky',
              top: '0px',
              zIndex: 100,
              backgroundColor: '#FBFBFB',
            }}
          >
            <div
              className="d-flex-v-center-h-between flex-wrap bg-white p-2"
              style={{
                maxWidth: 1255,
                boxShadow: '0 2px 13px rgba(0, 0, 0 ,.02)',
                borderRadius: '.5rem',
                width: '100%',
              }}
            >
              <span>
                <div className="d-inline-flex-center bg-warning-light c-black p-2 br-100">
                  <span className="fas fa-exclamation-triangle" />
                </div>
                <span className="px-2">
                    Validate offer with database first. This template require to do a
                    validation
                </span>
              </span>
              <ButtonBase
                className="btns theme-outline"
                disabled={isLoadingLocal || isValidOffer}
                onClick={validateWithDatabaseHandler(
                  templateData?.uuid,
                  toSnakeCase(dataSectionItems),
                )}
              >
                <span className="fas fa-sync" />
                <span className="px-2">Validate with database</span>
              </ButtonBase>
            </div>
            {validationErrors?.length > 0 && (
              <div
                className="d-flex-v-center-h-between flex-wrap"
                style={{
                  maxWidth: 1255,
                  boxShadow: '0 2px 13px rgba(0, 0, 0 ,.02)',
                  borderRadius: '.5rem',
                  width: '100%',
                  marginTop: 10,
                }}
              >
                <Accordion sx={{ width: '100%' }}>
                  <AccordionSummary>
                    <span
                      style={{
                        textDecoration: 'underline',
                      }}
                      className="px-2"
                    >
                        Show errors
                    </span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {validationErrors.map((err, idx) => (
                        <li
                          key={`${err.key}-${idx}`}
                        >{`${err.key}: ${err.value}`}</li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              </div>
            )}
          </div>
        )}
        {!Object.values(dataSectionItems).length ? (
          <Typography variant="body14" sx={{ alignSelf: 'center' }}>
            Add sections to preview them
          </Typography>
        ) : (
          Object.entries(dataSectionItems)
            .filter(([k]) => {
              if (
                !['header', 'logo', 'footer'].includes(dataSectionItems[k].type)
                && (templateData?.editorRole === 'recipient'
                  || (preview.isActive && preview.role === 'recipient'))
              )
                return dataSectionItems[k].isSectionVisibleOnTheFinalDoc;
              return true;
            })
            ?.map(([k, section]) => (
              <Section
                className={`${
                  (templateData.labelsLayout === 'row' && 'is-horizontal-labels')
                  || 'is-vertical-labels'
                } ${
                  templateData.fieldLayout === 'row'
                  && !['logo', 'header', 'footer'].includes(section.type)
                    ? 'field-layout-row-wrapper'
                    : 'field-layout-col-wrapper'
                }${
                  ['logo', 'header', 'footer'].includes(section.type)
                    ? ' data-section'
                    : ''
                }${
                  ['pageBreak'].includes(section.type) ? ' page-break-section' : ''
                }`}
                key={k}
                templateData={templateData}
              >
                {dataSectionItems[k].isTitleVisibleOnTheFinalDocument
                  && !['logo', 'header', 'footer', 'pageBreak'].includes(
                    dataSectionItems[k].type,
                  ) && (
                  <>
                    <Typography
                      variant={`${
                        !dataSectionItems[k]?.sectionTitleFontSize
                          && !dataSectionItems[k]?.sectionTitleDecorations?.length
                          && 'h6'
                      }`}
                      className={`fb-section-header${
                        (templateData.primaryLang === 'ar' && ' is-rtl') || ''
                      }`}
                      sx={{
                        p: 4,
                        fontSize: `${
                          dataSectionItems[k]?.sectionTitleFontSize
                            || templateData?.globalFontSize
                            || 14
                        }px !important`,
                        fontStyle:
                            dataSectionItems[k]?.sectionTitleDecoration?.includes(
                              'italic',
                            ) && 'italic',
                        fontWeight:
                            dataSectionItems[k]?.sectionTitleDecoration?.includes(
                              'bold',
                            ) && 700,
                        textDecoration:
                            dataSectionItems[k]?.sectionTitleDecoration?.includes(
                              'underline',
                            ) && 'underline',
                      }}
                    >
                      {dataSectionItems[k].title}
                    </Typography>
                    <Divider />
                  </>
                )}
                {section.subModel ? (
                  <Box display="flex">
                    <SubModelSection
                      currentSection={dataSectionItems[k]}
                      setIsGlobalLoading={setIsGlobalLoading}
                    />
                  </Box>
                ) : (
                  section.items
                    ?.filter((it) => {
                      if (
                        templateData?.editorRole === 'recipient'
                        || (preview.isActive && preview.role === 'recipient')
                      )
                        return it.isVisibleFinalDoc;
                      return true;
                    })
                    ?.map(
                      ({
                        id,
                        fillBy,
                        isVisible,
                        isRequired,
                        languages,
                        style,
                        type,
                        showDescriptionInsteadOfTitle,
                        ...props
                      }) => (
                        <Box
                          key={id}
                          className={`field-row-wrapper${
                            (templateData.secondaryLang
                              && !isTypographyField(type)
                              && ' is-with-secondary')
                            || ''
                          }`}
                        >
                          {!getIsHiddenCondition(
                            type,
                            languages,
                            templateData.primaryLang,
                          ) && (
                            <RTL>
                              <a
                                style={{
                                  visibility: 'hidden',
                                  height: '0px',
                                  width: '0px',
                                }}
                                href={`#${id}`}
                                id={id}
                              >
                                Link
                              </a>
                              <Field
                                preview={preview}
                                isVisible={isVisible}
                                fillBy={fillBy}
                                className="field-box-wrapper"
                                dir={
                                  templateData.primaryLang === 'ar' ? 'rtl' : 'ltr'
                                }
                              >
                                {!languages[templateData.primaryLang]?.hideLabel
                                  && !['inline', 'texteditor'].includes(type) && (
                                  <Typography
                                    sx={{
                                      display: 'block',
                                      mb:
                                          !['inline', 'texteditor'].includes(type)
                                          && 4,
                                      fontSize: `${
                                        languages[templateData.primaryLang]
                                          .labelFontSize
                                          || templateData?.globalFontSize
                                          || 14
                                      }px`,
                                      fontStyle:
                                          languages[
                                            templateData.primaryLang
                                          ]?.labelDecorations?.includes('italic')
                                          && 'italic',
                                      fontWeight:
                                          languages[
                                            templateData.primaryLang
                                          ]?.labelDecorations?.includes('bold')
                                          && 700,
                                      textDecoration:
                                          languages[
                                            templateData.primaryLang
                                          ]?.labelDecorations?.includes(
                                            'underline',
                                          ) && 'underline',
                                    }}
                                    variant={`${
                                      languages[templateData.primaryLang]
                                        .labelFontSize
                                        || templateData?.globalFontSize
                                        || 'body14'
                                    }`}
                                    weight={`${
                                      languages[
                                        templateData.primaryLang
                                      ]?.labelDecorations?.includes('bold')
                                        || 'medium'
                                    }`}
                                    color="dark.main"
                                    className="field-label-wrapper"
                                  >
                                    {languages[templateData.primaryLang].title}
                                  </Typography>
                                )}
                                <Box
                                  display="flex"
                                  className="field-item-wrapper"
                                  sx={{
                                    '& *:not(.text-editor-wrapper *, .fb-rich-text *)':
                                      {
                                        ...(templateData?.primaryFontFamily && {
                                          fontFamily: `${templateData.primaryFontFamily} !important`,
                                        }),
                                        '& *:not(.text-editor-wrapper *)': {
                                          fontSize: `${
                                            languages[templateData.primaryLang]
                                              ?.labelFontSize
                                            || templateData?.globalFontSize
                                            || 14
                                          }px`,
                                        },
                                      },
                                  }}
                                >
                                  {(preview.isActive
                                    && ['recipient'].includes(preview.role)
                                    && ['sender'].includes(fillBy)
                                    && type !== 'attachment'
                                    && type !== 'signature')
                                  || (((['recipient'].includes(
                                    templateData.editorRole,
                                  )
                                    && ['sender'].includes(fillBy))
                                    || +templateData?.source
                                      === NavigationSourcesEnum.AporovalTrackingToForm
                                        .key)
                                    && type !== 'signature'
                                    && type !== 'attachment')
                                  || (['sender'].includes(templateData.editorRole)
                                    && ['inline', 'texteditor'].includes(type)) ? (
                                      (languages[templateData.primaryLang].value
                                      && languages[templateData.primaryLang].value
                                        .length !== 0)
                                    || (type === 'equation'
                                      && props.result !== null) ? (
                                          <Typography
                                            sx={{
                                              width: '100%',
                                              fontSize: `${
                                                languages[templateData.primaryLang]
                                                  .labelFontSize
                                            || templateData?.globalFontSize
                                            || 14
                                              }px !important`,
                                              ...(!['texteditor', 'multiline'].includes(
                                                type,
                                              )
                                            && templateData?.primaryFontFamily && {
                                                fontFamily: ` ${templateData.primaryFontFamily} !important`,
                                              }),
                                              ...(['inline'].includes(type) && {
                                                fontFamily: style.fontFamily,
                                                fontSize: `${style.fontSize}px !important`,
                                                color: 'black',
                                                fontStyle:
                                              style.textDecoration.includes(
                                                'italic',
                                              ) && 'italic',
                                                fontWeight:
                                              style.textDecoration.includes(
                                                'bold',
                                              ) && 700,
                                                textDecoration:
                                              style.textDecoration.includes(
                                                'underline',
                                              ) && 'underline',
                                                textAlign: style.textAlign,
                                              }),
                                              wordBreak: 'break-word',
                                            }}
                                          >
                                            {![
                                              'name',
                                              'time',
                                              'date',
                                              'datetime',
                                              'checkbox',
                                              'radio',
                                              'select',
                                              'custom_select',
                                              'phone',
                                              'texteditor',
                                              'salary',
                                              'multiline',
                                              'number',
                                              'equation',
                                            ].includes(type)
                                          && languages[templateData.primaryLang].value}
                                            {['number'].includes(type)
                                          && EnToArUni(
                                            languages[templateData.primaryLang]
                                              .value,
                                            props.showNumberOnEnglish
                                              ? 'en'
                                              : templateData.primaryLang,
                                          )}
                                            {['phone'].includes(type)
                                          && languages[templateData.primaryLang]
                                            .value
                                          && EnToArUni(
                                            languages[
                                              templateData.primaryLang
                                            ].value?.replace('+', '00') ?? '',
                                            templateData.primaryLang,
                                          )
                                            .split('-')
                                            .filter(
                                              (item) => item && item !== 'undefined',
                                            )
                                            .map(
                                              (item, index) =>
                                                (index && item) || `${item} `,
                                            )}

                                            {['date'].includes(type)
                                          && moment
                                            .unix(
                                              languages[templateData.primaryLang]
                                                .value / 1000,
                                            )
                                            .locale(templateData.primaryLang)
                                            .format('MMM DD, YYYY')}
                                            {['time'].includes(type)
                                          && moment
                                            .unix(
                                              languages[templateData.primaryLang]
                                                .value / 1000,
                                            )
                                            .locale(templateData.primaryLang)
                                            .format('hh:mm A')}
                                            {['datetime'].includes(type)
                                          && moment(
                                            languages[templateData.primaryLang]
                                              .value,
                                          )
                                            .locale(templateData.primaryLang)
                                            .format('MMM DD, YYYY, hh:mm A')}
                                            {['name'].includes(type) && (
                                              <Box dispaly="flex">
                                                <div className="d-flex flex-wrap">
                                                  {languages[
                                                    templateData.primaryLang
                                                  ].value.map((x) => (
                                                    <Box
                                                      className="px-1"
                                                      key={`${k}-${x}`}
                                                    >
                                                      {x}
                                                    </Box>
                                                  ))}
                                                </div>
                                              </Box>
                                            )}
                                            {['checkbox'].includes(type) && (
                                              <Box>
                                                {languages[
                                                  templateData.primaryLang
                                                ].options
                                                  .filter((option) =>
                                                    languages[
                                                      templateData.primaryLang
                                                    ].value?.includes(option.id),
                                                  )
                                                  .map((x) => (
                                                    <Box key={`primary${k}-${x.id}`}>
                                                      {x.title}
                                                    </Box>
                                                  ))}
                                              </Box>
                                            )}
                                            {['radio'].includes(type) && (
                                              <Box>
                                                {
                                                  languages[
                                                    templateData.primaryLang
                                                  ].options.find(
                                                    (option) =>
                                                      option.id
                                                  === languages[templateData.primaryLang]
                                                    .value,
                                                  )?.title
                                                }
                                              </Box>
                                            )}
                                            {['select', 'custom_select'].includes(
                                              type,
                                            )
                                          && ((((preview.isActive
                                            && preview.role === 'recipient')
                                            || templateData.editorRole
                                              === 'recipient')
                                            && showDescriptionInsteadOfTitle
                                            && languages[
                                              templateData.primaryLang
                                            ]?.options?.find(
                                              (option) =>
                                                option.id
                                                === languages[templateData.primaryLang]
                                                  ?.value,
                                            )?.description)
                                            || languages[
                                              templateData.primaryLang
                                            ]?.options?.find(
                                              (option) =>
                                                option.id
                                                === languages[templateData.primaryLang]
                                                  ?.value,
                                            )?.title)}
                                            {['texteditor', 'multiline'].includes(
                                              type,
                                            ) && (
                                              <div
                                                className="fb-rich-text"
                                                style={{
                                                  color: 'initial',
                                                  fontFamily: `${
                                                    templateData?.primaryFontFamily || ''
                                                  } `,
                                                }}
                                                dangerouslySetInnerHTML={{
                                                  __html:
                                                languages[templateData.primaryLang]
                                                  .value,
                                                }}
                                              />
                                            )}
                                            {['salary'].includes(type) && (
                                              <div>
                                                <span>
                                                  {EnToArUni(
                                                    languages[templateData.primaryLang]
                                                      .value,
                                                    props.showNumberOnEnglish
                                                      ? 'en'
                                                      : templateData.primaryLang,
                                                  )}
                                                </span>
                                                <span className="mx-2">
                                                  {extractCurrencyByLang(
                                                    templateData.primaryLang,
                                                    props.currency,
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                            {['equation'].includes(type) && (
                                              <div>
                                                <span>
                                                  {EnToArUni(
                                                    props.result,
                                                    props.showNumberOnEnglish
                                                      ? 'en'
                                                      : templateData.primaryLang,
                                                  )}
                                                </span>
                                                <span className="mx-2">
                                                  {EnToArUni(
                                                    languages[templateData.primaryLang]
                                                      .equationUnit,
                                                    templateData.primaryLang,
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          </Typography>
                                        ) : (
                                          <Typography
                                            variant="body14rich"
                                            sx={{
                                              color: (theme) => theme.palette.dark.$40,
                                              fontSize: `${
                                                dataSectionItems[k]
                                                  ?.sectionTitleFontSize
                                            || templateData?.globalFontSize
                                            || 14
                                              }px !important`,
                                            }}
                                          >
                                        No data...
                                          </Typography>
                                        )
                                    ) : (
                                      <FieldSwitcher
                                        {...props}
                                        type={type}
                                        style={style}
                                        isFieldDisabled={isFieldDisabled}
                                        fillBy={fillBy}
                                        placeholder={
                                          languages[templateData.primaryLang]
                                            .placeholder
                                        }
                                        options={
                                          languages[templateData.primaryLang].options
                                        }
                                        initialValue={
                                          languages[templateData.primaryLang].value
                                        }
                                        files={
                                          languages[templateData.primaryLang].files
                                        }
                                        attachmentButtonLabel={
                                          languages[templateData.primaryLang]
                                            .buttonLabel
                                        }
                                        cardId={id}
                                        containerId={k}
                                        templateData={templateData}
                                        setDataSectionItems={setDataSectionItems}
                                        currentInputLang={templateData.primaryLang}
                                        preview={preview}
                                        isRequired={isRequired}
                                        isSubmitted={isSubmitted}
                                        setErrors={setErrors}
                                        showDescriptionInsteadOfTitle={
                                          showDescriptionInsteadOfTitle
                                        }
                                        dataSectionItems={dataSectionItems}
                                        globalFontSize={
                                          templateData?.globalFontSize || ''
                                        }
                                        fontFamily={
                                          templateData?.primaryFontFamily || ''
                                        }
                                        itemFontSize={
                                          languages?.[templateData.primaryLang]
                                            ?.labelFontSize || ''
                                        }
                                        currency={extractCurrencyByLang(
                                          templateData.primaryLang,
                                          props.currency,
                                        )}
                                        equationUnit={
                                          languages[templateData.primaryLang]
                                            .equationUnit
                                        }
                                        showNumberOnEnglish={props.showNumberOnEnglish}
                                      />
                                    )}
                                </Box>
                              </Field>
                            </RTL>
                          )}
                          {templateData.secondaryLang
                            && ![
                              'inline',
                              'attachment',
                              'signature',
                              'texteditor',
                            ].includes(type)
                            && !getIsHiddenCondition(
                              type,
                              languages,
                              templateData.secondaryLang,
                            ) && (
                            <>
                              <Divider
                                orientation="vertical"
                                flexItem
                                mx={{ mx: 4 }}
                              />
                              <RTL>
                                <Field
                                  preview={preview}
                                  isVisible={isVisible}
                                  fillBy={fillBy}
                                  className="field-box-wrapper is-secondary-lang"
                                  dir={
                                    templateData.secondaryLang === 'ar'
                                      ? 'rtl'
                                      : 'ltr'
                                  }
                                >
                                  {!languages[templateData.secondaryLang]
                                    ?.hideLabel
                                      && !['inline', 'texteditor'].includes(type) && (
                                    <Typography
                                      variant={`${
                                        languages[templateData.secondaryLang]
                                          ?.labelFontSize || 'body14'
                                      }`}
                                      weight={`${
                                        languages[
                                          templateData.secondaryLang
                                        ]?.labelDecorations?.includes('bold')
                                            || 'medium'
                                      }`}
                                      color="dark.main"
                                      className="field-label-wrapper is-secondary-lang"
                                      sx={{
                                        display: 'block',
                                        mb:
                                              !['inline', 'texteditor'].includes(
                                                type,
                                              ) && 4,
                                        fontSize: `${
                                          languages[templateData.secondaryLang]
                                            .labelFontSize
                                              || languages[templateData.primaryLang]
                                                .labelFontSize
                                              || templateData?.globalFontSize
                                              || 14
                                        }px`,
                                        fontStyle:
                                              languages[
                                                templateData.secondaryLang
                                              ]?.labelDecorations?.includes(
                                                'italic',
                                              ) && 'italic',
                                        fontWeight:
                                              languages[
                                                templateData.secondaryLang
                                              ]?.labelDecorations?.includes(
                                                'bold',
                                              ) && 700,
                                        textDecoration:
                                              languages[
                                                templateData.secondaryLang
                                              ]?.labelDecorations?.includes(
                                                'underline',
                                              ) && 'underline',
                                      }}
                                    >
                                      {
                                        languages[templateData.secondaryLang]
                                          .title
                                      }
                                    </Typography>
                                  )}
                                  <Box
                                    className="field-item-wrapper"
                                    display="flex"
                                    sx={{
                                      '& *:not(.text-editor-wrapper *, .fb-rich-text *)':
                                          {
                                            ...(templateData?.secondaryFontFamily && {
                                              fontFamily: `${templateData.secondaryFontFamily} !important`,
                                            }),
                                            '& *:not(.text-editor-wrapper *)': {
                                              fontSize: `${
                                                languages[templateData.secondaryLang]
                                                  ?.labelFontSize
                                                || languages[templateData.primaryLang]
                                                  ?.labelFontSize
                                                || templateData?.globalFontSize
                                                || 14
                                              }px`,
                                            },
                                          },
                                    }}
                                  >
                                    {(preview.isActive
                                        && ['recipient'].includes(preview.role)
                                        && ['sender'].includes(fillBy))
                                      || (['recipient'].includes(
                                        templateData.editorRole,
                                      )
                                        && ['sender'].includes(fillBy))
                                      || +templateData?.source
                                        === NavigationSourcesEnum.AporovalTrackingToForm
                                          .key ? (
                                        <Box>
                                          {(languages[templateData.secondaryLang]
                                            .value
                                            && languages[templateData.secondaryLang]
                                              .value.length !== 0)
                                          || (type === 'equation'
                                            && props.result !== null) ? (
                                              <Typography
                                                sx={{
                                                  fontSize: `${
                                                    languages[
                                                      templateData.secondaryLang
                                                    ].labelFontSize
                                                  || languages[templateData.primaryLang]
                                                    .labelFontSize
                                                  || templateData?.globalFontSize
                                                  || 14
                                                  }px`,
                                                  ...(![
                                                    'texteditor',
                                                    'multiline',
                                                  ].includes(type)
                                                  && templateData?.secondaryFontFamily && {
                                                    fontFamily: ` ${templateData.secondaryFontFamily}`,
                                                  }),
                                                  ...([
                                                    'inline',
                                                    'texteditor',
                                                    'multiline',
                                                  ].includes(type) && {
                                                    fontFamily:
                                                    templateData?.secondaryFontFamily
                                                    || style?.fontFamily,
                                                    fontSize: `${
                                                      style?.fontSize
                                                    || templateData?.globalFontSize
                                                    }px`,
                                                    color: 'black',
                                                    fontStyle:
                                                    style?.textDecoration.includes(
                                                      'italic',
                                                    ) && 'italic',
                                                    fontWeight:
                                                    style?.textDecoration.includes(
                                                      'bold',
                                                    ) && 700,
                                                    textDecoration:
                                                    style?.textDecoration.includes(
                                                      'underline',
                                                    ) && 'underline',
                                                    textAlign: style?.textAlign,
                                                    wordBreak: 'break-word',
                                                  }),
                                                }}
                                              >
                                                {![
                                                  'name',
                                                  'time',
                                                  'date',
                                                  'datetime',
                                                  'checkbox',
                                                  'radio',
                                                  'select',
                                                  'custom_select',
                                                  'phone',
                                                  'texteditor',
                                                  'salary',
                                                  'multiline',
                                                  'number',
                                                  'equation',
                                                ].includes(type)
                                                && languages[templateData.secondaryLang]
                                                  .value}
                                                {['number'].includes(type)
                                                && EnToArUni(
                                                  languages[
                                                    templateData.secondaryLang
                                                  ].value,
                                                  props.showNumberOnEnglish
                                                    ? 'en'
                                                    : templateData.secondaryLang,
                                                )}
                                                {['phone'].includes(type)
                                                && languages[templateData.secondaryLang]
                                                  .value
                                                && EnToArUni(
                                                  languages[
                                                    templateData.secondaryLang
                                                  ].value,
                                                  templateData.secondaryLang,
                                                )
                                                  .split('-')
                                                  .filter(
                                                    (item) =>
                                                      item && item !== 'undefined',
                                                  )
                                                  .map(
                                                    (item, index) =>
                                                      (index && item) || `${item} `,
                                                  )}
                                                {['date'].includes(type)
                                                && moment
                                                  .unix(
                                                    languages[
                                                      templateData.secondaryLang
                                                    ].value / 1000,
                                                  )
                                                  .locale(templateData.secondaryLang)
                                                  .format('MMM DD, YYYY')}
                                                {['time'].includes(type)
                                                && moment
                                                  .unix(
                                                    languages[
                                                      templateData.secondaryLang
                                                    ].value / 1000,
                                                  )
                                                  .locale(templateData.secondaryLang)
                                                  .format('hh:mm A')}
                                                {['datetime'].includes(type)
                                                && moment(
                                                  languages[
                                                    templateData.secondaryLang
                                                  ].value,
                                                )
                                                  .locale(templateData.secondaryLang)
                                                  .format('MMM DD, YYYY, hh:mm A')}
                                                {['name'].includes(type) && (
                                                  <Box dispaly="flex">
                                                    <div className="d-flex flex-wrap">
                                                      {languages[
                                                        templateData.secondaryLang
                                                      ].value.map((x) => (
                                                        <Box
                                                          className="px-1"
                                                          key={`${k}-${x}`}
                                                        >
                                                          {x}
                                                        </Box>
                                                      ))}
                                                    </div>
                                                  </Box>
                                                )}
                                                {['checkbox'].includes(type) && (
                                                  <Box>
                                                    {languages[
                                                      templateData.secondaryLang
                                                    ].options
                                                      .filter((option) =>
                                                        languages[
                                                          templateData.secondaryLang
                                                        ].value?.includes(option.id),
                                                      )
                                                      .map((x) => (
                                                        <Box
                                                          key={`secondary${k}-${x.id}`}
                                                        >
                                                          {x.title}
                                                        </Box>
                                                      ))}
                                                  </Box>
                                                )}
                                                {['radio'].includes(type) && (
                                                  <Box>
                                                    {
                                                      languages[
                                                        templateData.secondaryLang
                                                      ].options.find(
                                                        (option) =>
                                                          option.id
                                                        === languages[
                                                          templateData.secondaryLang
                                                        ].value,
                                                      )?.title
                                                    }
                                                  </Box>
                                                )}
                                                {['select', 'custom_select'].includes(
                                                  type,
                                                )
                                                && ((((preview.isActive
                                                  && preview.role === 'recipient')
                                                  || templateData.editorRole
                                                    === 'recipient')
                                                  && showDescriptionInsteadOfTitle
                                                  && languages[
                                                    templateData.secondaryLang
                                                  ]?.options?.find(
                                                    (option) =>
                                                      option.id
                                                      === languages[
                                                        templateData.secondaryLang
                                                      ]?.value,
                                                  )?.description)
                                                  || languages[
                                                    templateData.secondaryLang
                                                  ]?.options?.find(
                                                    (option) =>
                                                      option.id
                                                      === languages[
                                                        templateData.secondaryLang
                                                      ]?.value,
                                                  )?.title)}
                                                {['texteditor', 'multiline'].includes(
                                                  type,
                                                ) && (
                                                  <div
                                                    className="fb-rich-text"
                                                    style={{
                                                      fontFamily: `${
                                                        templateData?.secondaryFontFamily
                                                      || templateData?.primaryFontFamily
                                                      || ''
                                                      } `,
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                      __html:
                                                      languages[
                                                        templateData.secondaryLang
                                                      ].value,
                                                    }}
                                                  />
                                                )}
                                                {['salary'].includes(type) && (
                                                  <div>
                                                    <span>
                                                      {EnToArUni(
                                                        languages[
                                                          templateData.secondaryLang
                                                        ].value,
                                                        props.showNumberOnEnglish
                                                          ? 'en'
                                                          : templateData.secondaryLang,
                                                      )}
                                                    </span>
                                                    <span className="mx-2">
                                                      {extractCurrencyByLang(
                                                        templateData.secondaryLang,
                                                        props.currency,
                                                      )}
                                                    </span>
                                                  </div>
                                                )}
                                                {/*{['salary'].includes(type) && (*/}
                                                {/*  <div>*/}
                                                {/*    <span>{props.result}</span>*/}
                                                {/*    <span className="mx-2">*/}
                                                {/*      {props.equationUnit}*/}
                                                {/*    </span>*/}
                                                {/*  </div>*/}
                                                {/*)}*/}
                                                {['equation'].includes(type) && (
                                                  <div>
                                                    <span>
                                                      {EnToArUni(
                                                        props.result,
                                                        props.showNumberOnEnglish
                                                          ? 'en'
                                                          : templateData.secondaryLang,
                                                      )}
                                                    </span>
                                                    <span className="mx-2">
                                                      {EnToArUni(
                                                        languages[
                                                          templateData.secondaryLang
                                                        ].equationUnit,
                                                        templateData.secondaryLang,
                                                      )}
                                                    </span>
                                                  </div>
                                                )}
                                              </Typography>
                                            ) : (
                                              <Typography
                                                variant="body14rich"
                                                sx={{
                                                  color: (theme) =>
                                                    theme.palette.dark.$40,
                                                  fontSize: `${
                                                    languages[
                                                      templateData.secondaryLang
                                                    ].labelFontSize
                                                  || languages[templateData.primaryLang]
                                                    .labelFontSize
                                                  || templateData?.globalFontSize
                                                  || 14
                                                  }px`,
                                                }}
                                              >
                                              No data...
                                              </Typography>
                                            )}
                                        </Box>
                                      ) : (
                                        <FieldSwitcher
                                          {...props}
                                          type={type}
                                          style={style}
                                          isFieldDisabled={isFieldDisabled}
                                          fillBy={fillBy}
                                          placeholder={
                                            languages[templateData.secondaryLang]
                                              .placeholder
                                          }
                                          options={
                                            languages[templateData.secondaryLang]
                                              .options
                                          }
                                          initialValue={
                                            languages[templateData.secondaryLang]
                                              .value
                                          }
                                          files={
                                            languages[templateData.secondaryLang]
                                              .files
                                          }
                                          attachmentButtonLabel={
                                            languages[templateData.secondaryLang]
                                              .buttonLabel
                                          }
                                          cardId={id}
                                          containerId={k}
                                          templateData={templateData}
                                          setDataSectionItems={setDataSectionItems}
                                          currentInputLang={
                                            templateData.secondaryLang
                                          }
                                          preview={preview}
                                          isRequired={isRequired}
                                          isSubmitted={isSubmitted}
                                          setErrors={setErrors}
                                          showDescriptionInsteadOfTitle={
                                            showDescriptionInsteadOfTitle
                                          }
                                          dataSectionItems={dataSectionItems}
                                          globalFontSize={
                                            templateData?.globalFontSize || ''
                                          }
                                          fontFamily={
                                            templateData?.secondaryFontFamily
                                            || templateData?.primaryFontFamily
                                            || ''
                                          }
                                          itemFontSize={
                                            languages?.[templateData.secondaryLang]
                                              ?.labelFontSize
                                            || languages?.[templateData.primaryLang]
                                              ?.labelFontSize
                                            || ''
                                          }
                                          currency={extractCurrencyByLang(
                                            templateData.secondaryLang,
                                            props.currency,
                                          )}
                                          equationUnit={
                                            languages[templateData.secondaryLang]
                                              .equationUnit
                                          }
                                          showNumberOnEnglish={
                                            props.showNumberOnEnglish
                                          }
                                        />
                                      )}
                                  </Box>
                                </Field>
                              </RTL>
                            </>
                          )}
                        </Box>
                      ),
                    )
                )}
              </Section>
            ))
        )}
      </SectionsWrapper>
    </Grid>
  );
}
