import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  FormsStatusesEnum,
  FormsRolesEnum,
  FormsFieldsTypesEnum,
  NavigationSourcesEnum,
  FormsMembersTypesEnum,
  FormsAssistTypesEnum,
  FormsAssistRoleTypesEnum,
  FormsSubmissionsLevelsTypesEnum,
} from '../../../../enums';
import { differenceInDays, isEqual } from 'date-fns';
import SectionsWrapper from '../../features/Section/SectionsWrapper';
import { Box, Divider, Grid, styled, Typography } from '@mui/material';
import SubModelSection from '../../features/Section/SubModelSection';
import RTL from '../../features/RTL';
import formatDate from 'date-fns/format';
import FieldSwitcher from '../../features/FieldItem/FieldSwitcher';
import blocksItems from '../../data/BlocksFields.Data';
import {
  ChangeGlobalIsLoading,
  EnToArUni,
  ExtractTextFromHTML,
  isHTML,
} from '../../../../helpers';
import moment from 'moment';
const Section = styled(Box)(({ theme, templateData }) => ({
  backgroundColor: theme.palette.light.main,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 1255,
  margin: '0px auto',
  boxShadow: '0px 2px 13px rgba(0, 0, 0, 0.02)',
  borderRadius: 8,
  paddingInline: '0 !important',
  paddingBottom: '.05cm !important',
  paddingTop: '10px !important',
  marginBottom: '0 !important',
  '&, & *': {
    letterSpacing: '0mm !important',
    wordSpacing: '0mm !important',
  },
  '& .fb-rich-text *': {
    maxWidth: '98% !important',
  },
  '--font': ` ${templateData.primaryFontFamily || ''}`,
  '--font-fb-secondary': ` ${templateData.secondaryFontFamily || ''}`,
  '.fb-section-header': {
    paddingBottom: '.05cm !important',
    paddingTop: '.05cm !important',
    paddingInline: '8px !important',
  },
  '.field-box-wrapper': {
    paddingBottom: '0 !important',
    paddingTop: '0 !important',
  },
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
      padding: '0 .5rem  .1rem',

      '&.vertical-box': {
        flexDirection: 'column',
        '.field-label-wrapper': {
          width: '100%',
        },
      },
      '.field-label-wrapper': {
        display: 'inline-block',
        marginBlock: '.03cm',
        padding: '0 .5rem',
        width: 235,
        wordBreak: 'break-word',
        paddingInlineStart: 0,
        paddingInlineEnd: '.4cm',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
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
    padding: '0px !important',
    margin: '0px !important',
  },
}));

const Field = styled(Box)(({ theme, isVisible }) => ({
  display: isVisible ? 'flex' : 'none',
  flexDirection: 'column',
  flex: 1,
  padding: theme.spacing(1, 5.5),
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
      // TODO fix preview checkbox styles
      //'& span:nth-of-type(1)': {
      //border: `1px solid ${theme.palette.secondary.$80}`,
      //background: theme.palette.primary.$a4,
      //},
    },
  },
  '> .MuiTypography-root': {
    marginBottom: theme.spacing(2),
  },
  '[disabled], .Mui-disabled': {
    background: `${theme.palette.dark.$8}`,
    outline: `${theme.palette.dark.$8}`,
    borderColor: `${theme.palette.dark.$20}`,
  },
}));

export const PreviewPDFSection = ({
  isFieldDisabled,
  dataSectionItems,
  setDataSectionItems,
  templateData,
  preview,
  isSubmitted,
  errors,
  formsRolesTypes,
  getIsAssignToMe,
  // onIsValidOfferChange,
  getSelectedRoleEnumItem,
  headerHeight,
  pdfRef,
  setIsGlobalLoading,
  isGlobalLoading,
  pdfDownLoad,
  extractCurrencyByLang,
  isTypographyField,
  // isValidOffer,
}) => {
  // const { t } = useTranslation('Shared');
  // const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  // console.log(JSON.stringify(dataSectionItems));
  // const [validationErrors, setValidationErrors] = useState([]);
  const previewPDFInitRef = useRef(true);
  const getIsHiddenCondition = useCallback(
    ({ type, languages, currentLanguage, fillBy, assign }) => {
      if (['video', 'video_gallery'].includes(type)) return true;
      if (
        preview.isActive
        && (getSelectedRoleEnumItem(preview.role).isHiddenIfNotAssignToMe
          || (getSelectedRoleEnumItem(preview.role).isHiddenOnFieldLevelAssign
            && templateData.typeOfSubmission
              === FormsSubmissionsLevelsTypesEnum.FieldsLevel.key))
      ) {
        if (
          !getIsAssignToMe({
            editorRole: preview.role,
            fillBy,
            assign,
          })
        )
          return true;
      } else if (
        (getSelectedRoleEnumItem(templateData.editorRole).isHiddenIfNotAssignToMe
          || (getSelectedRoleEnumItem(templateData.editorRole)
            .isHiddenOnFieldLevelAssign
            && templateData.typeOfSubmission
              === FormsSubmissionsLevelsTypesEnum.FieldsLevel.key))
        && !getIsAssignToMe({
          fillBy,
          assign,
        })
      )
        return true;
      if (
        !(
          templateData.editorRole !== FormsRolesEnum.Creator.key
          && ((preview.isActive
            && getSelectedRoleEnumItem(preview.role).isRecipientBehaviour)
            || getSelectedRoleEnumItem(templateData.editorRole).isRecipientBehaviour
            || templateData.formStatus === FormsStatusesEnum.Completed.key)
        )
        || !languages[currentLanguage].isConditionalHidden
      )
        return false;
      let conditionValue = languages[currentLanguage].isConditionalHiddenValue;
      let currentLanguageValue = languages[currentLanguage].value;
      if (currentLanguageValue || currentLanguageValue === 0) {
        if (type === FormsFieldsTypesEnum.Phone.key) {
          currentLanguageValue = currentLanguageValue.split('-');
          // 0: for iso(unique), 1: for code (not unique), 2: for phone
          if (currentLanguageValue.length === 3)
            currentLanguageValue = currentLanguageValue[1] + currentLanguageValue[2];
          else if (currentLanguageValue.length === 2)
            currentLanguageValue = currentLanguageValue[0] + currentLanguageValue[1];
          else currentLanguageValue = '';
        }
        if (type === FormsFieldsTypesEnum.Name.key) {
          currentLanguageValue = currentLanguageValue.join(' ').trim().toLowerCase();
          if (conditionValue) conditionValue = conditionValue.trim().toLowerCase();
        }

        if (type === FormsFieldsTypesEnum.Datetime.key)
          return (
            (conditionValue
              && currentLanguageValue
              && isEqual(currentLanguageValue, conditionValue))
            || false
          );
        if (type === FormsFieldsTypesEnum.Date.key)
          return (
            (conditionValue
              && currentLanguageValue
              && differenceInDays(currentLanguageValue, conditionValue)) === 0 || false
          );
        if (type === FormsFieldsTypesEnum.Time.key) {
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
        if (type === FormsFieldsTypesEnum.Checkbox.key)
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
    [
      getIsAssignToMe,
      getSelectedRoleEnumItem,
      preview.isActive,
      preview.role,
      templateData.editorRole,
      templateData.formStatus,
      templateData.typeOfSubmission,
    ],
  );
  const blocksCheck = React.useMemo(
    () => (type) => Object.values(blocksItems).some((item) => item.type === type),
    [],
  );

  const getIsValueDisplay = useMemo(
    () =>
      ({ type }) =>
        type !== 'attachment' && type !== 'signature' && !blocksCheck(type),
    [blocksCheck],
  );

  useEffect(() => {
    if (templateData.source === NavigationSourcesEnum.AporovalTrackingToForm.key)
      ChangeGlobalIsLoading(true);
    if (previewPDFInitRef.current) {
      previewPDFInitRef.current = false;
      return;
    }

    if (
      templateData.source === NavigationSourcesEnum.AporovalTrackingToForm.key
      && isGlobalLoading.length === 0
      && templateData.createdAt
      && pdfRef.current
    ) {
      if (
        Array.from(pdfRef.current.querySelectorAll('[data-form-image]')).some(
          (item) =>
            item.getAttribute('data-form-image') && !item.getAttribute('src'),
        )
      )
        return;
      pdfDownLoad({
        pdfName: templateData.name,
        element: pdfRef.current,
        ref: pdfRef,
        isView: true,
      });
    }
  }, [
    isGlobalLoading.length,
    pdfDownLoad,
    pdfRef,
    templateData,
    templateData.createdAt,
    templateData.name,
    templateData.source,
  ]);

  return (
    <Grid
      container
      item
      xs
      className={`previewer-wrapper ${pdfRef && 'for-pdf'}`}
      sx={{
        paddingTop: '0px',
        height: `calc(100vh - ${headerHeight}px)`,
        overflow: 'auto',
        color: 'black',
        ...(pdfRef && {
          height: 'auto',
          width: '210mm',
          maxWidth: '210mm',
          minHeight: '295mm',
          position: 'fixed',
          zIndex: '-50',
          backgroundColor: '#fff',
          top: '100vh',
        }),
      }}
      ref={pdfRef || null}
    >
      <SectionsWrapper
        xs
        item
        sx={{
          backgroundColor: (theme) => theme.palette.light.$1,
          justifyContent: 'center',
          pb: 11,
        }}
        forPDF
        noTopPaddin
      >
        {!Object.values(dataSectionItems).length ? (
          <Typography variant="body14" sx={{ alignSelf: 'center' }}>
            Add sections to preview them
          </Typography>
        ) : (
          Object.entries(dataSectionItems)
            .filter(([k]) => {
              if (
                !['header', 'logo', 'footer'].includes(dataSectionItems[k].type)
                && (templateData?.editorRole === FormsRolesEnum.Recipient.key
                  || (preview.isActive
                    && preview.role === FormsRolesEnum.Recipient.key))
              )
                return dataSectionItems[k].isSectionVisibleOnTheFinalDoc;
              return true;
            })
            ?.map(([k, section], rowIndex) => (
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
                    ? ` data-section fb-${section.type}-section`
                    : ''
                }${
                  ['pageBreak'].includes(section.type) ? ' page-break-section' : ''
                } `}
                key={`dataSectionItemsPreviewKey${k}-${rowIndex}`}
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
                        templateData?.editorRole === FormsRolesEnum.Recipient.key
                        || (preview.isActive
                          && preview.role === FormsRolesEnum.Recipient.key)
                      )
                        return it.isVisibleFinalDoc;
                      return true;
                    })
                    ?.map(
                      (
                        {
                          id,
                          fillBy,
                          assign,
                          isVisible,
                          isRequired,
                          languages,
                          style,
                          type,
                          showDescriptionInsteadOfTitle,
                          ...props
                        },
                        itemIndex,
                      ) => (
                        <Box
                          key={`fieldRowKey${id}`}
                          className={`field-row-wrapper${
                            (templateData.secondaryLang
                              && !blocksCheck(type)
                              && type !== 'rating'
                              && !isTypographyField(type)
                              && ' is-with-secondary')
                            || ''
                          }`}
                        >
                          {!getIsHiddenCondition({
                            type,
                            languages,
                            currentLanguage: templateData.primaryLang,
                            fillBy,
                            assign,
                          }) && (
                            <RTL>
                              {/*<a style={{ display: 'none' }} href={`#${id}`} id={id}>*/}
                              {/*  Link*/}
                              {/*</a>*/}
                              <Field
                                preview={preview}
                                isVisible={isVisible}
                                fillBy={fillBy}
                                className={`field-box-wrapper ${
                                  blocksCheck(type)
                                  && type !== 'rating'
                                  && 'vertical-box'
                                }`}
                                dir={
                                  templateData.primaryLang === 'ar' ? 'rtl' : 'ltr'
                                }
                              >
                                {!languages[templateData.primaryLang]?.hideLabel
                                  && !['inline', 'texteditor'].includes(type) && (
                                  <Typography
                                    sx={{
                                      color: 'black',
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
                                    color="black"
                                    className="field-label-wrapper"
                                  >
                                    {languages[templateData.primaryLang].title}
                                  </Typography>
                                )}
                                <Box
                                  display="flex"
                                  className={`field-item-wrapper${
                                    (!(
                                      getIsValueDisplay({ type })
                                      || (formsRolesTypes
                                        .filter((item) => !item.isFieldPreview)
                                        .map((item) => item.key)
                                        .includes(templateData.editorRole)
                                        && ['inline', 'texteditor'].includes(type))
                                    )
                                      && ' is-field-switcher')
                                    || ''
                                  }`}
                                  sx={{
                                    '& *:not(.text-editor-wrapper *, .fb-rich-text *, .rating-wrapper *)':
                                      {
                                        ...(templateData?.primaryFontFamily && {
                                          fontFamily: `${templateData.primaryFontFamily} !important`,
                                        }),
                                        '& *:not(.text-editor-wrapper *, .rating-wrapper *)':
                                          {
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
                                  {getIsValueDisplay({ type })
                                  || (formsRolesTypes
                                    .filter((item) => !item.isFieldPreview)
                                    .map((item) => item.key)
                                    .includes(templateData.editorRole)
                                    && ['inline', 'texteditor'].includes(type)) ? (
                                      (languages[templateData.primaryLang].value
                                      && languages[templateData.primaryLang].value
                                        .length !== 0)
                                    || (type === 'equation'
                                      && props.result !== null) ? (
                                          <div
                                            style={{
                                              width: '100%',
                                              fontSize: `${
                                                languages[templateData.primaryLang]
                                                  .labelFontSize
                                            || templateData?.globalFontSize
                                            || 14
                                              }px`,
                                              ...(!['texteditor', 'multiline'].includes(
                                                type,
                                              )
                                            && templateData?.primaryFontFamily && {
                                                fontFamily: ` ${templateData.primaryFontFamily}`,
                                              }),
                                              ...(['inline'].includes(type) && {
                                                fontFamily: style.fontFamily,
                                                fontSize: `${style.fontSize}px`,
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
                                          && !isHTML(
                                            languages[templateData.primaryLang]
                                              .value,
                                          )
                                          && languages[templateData.primaryLang].value}
                                            {['number'].includes(type)
                                          && EnToArUni(
                                            languages[templateData.primaryLang]
                                              .value,
                                            props.showNumberOnEnglish?"en": templateData.primaryLang,
                                          )}
                                            {['phone'].includes(type)
                                          && languages[templateData.primaryLang]
                                            .value
                                          && EnToArUni(
                                            languages[templateData.primaryLang]
                                              .value,
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
                                              <div style={{ display: 'flex' }}>
                                                <div className="d-flex flex-wrap">
                                                  {languages[
                                                    templateData.primaryLang
                                                  ].value.map((x, nameIndex) => (
                                                    <div
                                                      style={{ display: 'flex' }}
                                                      className="px-1"
                                                      key={`fieldItemNamePrimaryKey${k}-${x}-${nameIndex}-${itemIndex}-${rowIndex}`}
                                                    >
                                                      {x}
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
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
                                                  .map((x, checkboxIndex) => (
                                                    <Box
                                                      key={`primary${k}-${x.id}-${checkboxIndex}-${itemIndex}-${rowIndex}`}
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
                                            && preview.role
                                              === FormsRolesEnum.Recipient.key)
                                            || templateData.editorRole
                                              === FormsRolesEnum.Recipient.key)
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
                                            {(['texteditor', 'multiline'].includes(
                                              type,
                                            )
                                          || isHTML(
                                            languages[templateData.primaryLang]
                                              .value,
                                          )) && (
                                              <div
                                                className="fb-rich-text"
                                                style={{
                                                  // color: 'black' ,
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
                                          </div>
                                        ) : (
                                          <Typography
                                            variant="body14rich"
                                            sx={{
                                              color: 'black',
                                            }}
                                          >
                                            {/*No data...*/}
                                          </Typography>
                                        )
                                    ) : (
                                      <FieldSwitcher
                                        pdfRef={pdfRef}
                                        type={type}
                                        style={style}
                                        isFieldDisabled={isFieldDisabled}
                                        setIsGlobalLoading={setIsGlobalLoading}
                                        fillBy={fillBy}
                                        assign={assign}
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
                                        templateData={{
                                          ...templateData,
                                          ...(pdfRef && {
                                            editorRole: FormsRolesEnum.Recipient.key,
                                          }),
                                        }}
                                        setDataSectionItems={setDataSectionItems}
                                        currentInputLang={templateData.primaryLang}
                                        preview={preview}
                                        isRequired={isRequired}
                                        isSubmitted={isSubmitted}
                                        errors={errors}
                                        showDescriptionInsteadOfTitle={
                                          showDescriptionInsteadOfTitle
                                        }
                                        dataSectionItems={dataSectionItems}
                                        signatureMethod={props.signatureMethod}
                                        isDrawAllowed={props.isDrawAllowed}
                                        isWriteAllowed={props.isWriteAllowed}
                                        isUploadAllowed={props.isUploadAllowed}
                                        isPhoneMaskChecked={props.isPhoneMaskChecked}
                                        attachmentAllowedFileFormats={
                                          props.attachmentAllowedFileFormats
                                        }
                                        maxFileSize={props.maxFileSize}
                                        fileQuantityLimitation={
                                          props.fileQuantityLimitation
                                        }
                                        phoneAllowedCountries={
                                          props.phoneAllowedCountries
                                        }
                                        phoneDefaultCountry={props.phoneDefaultCountry}
                                        currency={extractCurrencyByLang(
                                          templateData.primaryLang,
                                          props.currency,
                                        )}
                                        multiline={props.multiline}
                                        charMin={props.charMin}
                                        charMax={props.charMax}
                                        rowMin={props.rowMin}
                                        rowMax={props.rowMax}
                                        disablePastDates={props.disablePastDates}
                                        disableFutureDates={props.disableFutureDates}
                                        equationUnit={
                                          languages[templateData.primaryLang]
                                            .equationUnit
                                        }
                                        result={props.result}
                                        equation={props.equation}
                                        decimalPlaces={props.decimalPlaces}
                                        ratingValue={props.ratingValue}
                                        ratingRange={templateData.ratingRange}
                                        ratingStyle={templateData.ratingStyle}
                                        fieldsDirection={
                                          templateData.primaryLang === 'ar'
                                            ? 'rtl'
                                            : 'ltr'
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
                              'direct_manager',
                              'head_of_department',
                              'video_gallery',
                              'video',
                              'image',
                              'image_gallery',
                              'attachment',
                              'texteditor',
                            ].includes(type)
                            && !getIsHiddenCondition({
                              type,
                              languages,
                              currentLanguage: templateData.secondaryLang,
                              fillBy,
                              assign,
                            }) && (
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
                                  className={`field-box-wrapper is-secondary-lang  ${
                                    blocksCheck(type)
                                      && type !== 'rating'
                                      && 'vertical-box'
                                  }`}
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
                                          ?.labelFontSize
                                            || templateData?.globalFontSize
                                            || 'body14'
                                      }`}
                                      weight={`${
                                        languages[
                                          templateData.secondaryLang
                                        ]?.labelDecorations?.includes('bold')
                                            || 'medium'
                                      }`}
                                      color="black"
                                      className="field-label-wrapper is-secondary-lang "
                                      sx={{
                                        display: 'block',
                                        color: 'black',
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
                                    className={`field-item-wrapper${
                                      (!getIsValueDisplay({ type })
                                          && ' is-field-switcher')
                                        || ''
                                    }`}
                                    display="flex"
                                    sx={{
                                      '& *:not(.text-editor-wrapper *, .fb-rich-text *, .rating-wrapper *)':
                                          {
                                            ...(templateData?.secondaryFontFamily && {
                                              fontFamily: `${templateData.secondaryFontFamily} !important`,
                                            }),
                                            '& *:not(.text-editor-wrapper *, .rating-wrapper *)':
                                              {
                                                fontSize: `${
                                                  languages[
                                                    templateData.secondaryLang
                                                  ]?.labelFontSize
                                                  || languages[templateData.primaryLang]
                                                    ?.labelFontSize
                                                  || templateData?.globalFontSize
                                                  || 14
                                                }px`,
                                              },
                                          },
                                    }}
                                  >
                                    {getIsValueDisplay({ type }) ? (
                                      <Box>
                                        {(languages[templateData.secondaryLang]
                                          .value
                                            && languages[templateData.secondaryLang]
                                              .value.length !== 0)
                                          || (type === 'equation'
                                            && props.result !== null) ? (
                                            <div
                                              style={{
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
                                                && !isHTML(
                                                  languages[
                                                    templateData.secondaryLang
                                                  ].value,
                                                )
                                                && languages[templateData.secondaryLang]
                                                  .value}
                                              {['number'].includes(type)
                                                && EnToArUni(
                                                  languages[
                                                    templateData.secondaryLang
                                                  ].value?.replace('+', '00') ?? '',
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
                                              {['datetime'].includes(type)
                                                && formatDate(
                                                  new Date(
                                                    languages[
                                                      templateData.secondaryLang
                                                    ].value,
                                                  ),
                                                  'PPpp',
                                                )}
                                              {['name'].includes(type) && (
                                                <div style={{ display: 'flex' }}>
                                                  <div className="d-flex flex-wrap">
                                                    {languages[
                                                      templateData.secondaryLang
                                                    ].value.map((x, nameIndex) => (
                                                      <div
                                                        style={{ display: 'flex' }}
                                                        className="px-1"
                                                        key={`dataSectionItemsPreviewSecondaryKey${k}-${x}-${nameIndex}-${itemIndex}${rowIndex}`}
                                                      >
                                                        {x}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
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
                                                    .map((x, checkboxIndex) => (
                                                      <Box
                                                        key={`secondary${k}-${x.id}-${checkboxIndex}-${itemIndex}-${rowIndex}`}
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
                                                  && preview.role
                                                    === FormsRolesEnum.Recipient.key)
                                                  || templateData.editorRole
                                                    === FormsRolesEnum.Recipient.key)
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
                                              {(['texteditor', 'multiline'].includes(
                                                type,
                                              )
                                                || isHTML(
                                                  languages[
                                                    templateData.secondaryLang
                                                  ].value,
                                                )) && (
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
                                            </div>
                                          ) : (
                                            <Typography
                                              variant="body14rich"
                                              sx={{
                                                color: 'black',
                                              }}
                                            >
                                              {/*No data...*/}
                                            </Typography>
                                          )}
                                      </Box>
                                    ) : (
                                      <FieldSwitcher
                                        pdfRef={pdfRef}
                                        type={type}
                                        style={style}
                                        isFieldDisabled={isFieldDisabled}
                                        setIsGlobalLoading={setIsGlobalLoading}
                                        assign={assign}
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
                                        templateData={{
                                          ...templateData,
                                          ...(pdfRef && {
                                            editorRole:
                                                FormsRolesEnum.Recipient.key,
                                          }),
                                        }}
                                        setDataSectionItems={setDataSectionItems}
                                        currentInputLang={
                                          templateData.secondaryLang
                                        }
                                        preview={preview}
                                        isRequired={isRequired}
                                        isSubmitted={isSubmitted}
                                        errors={errors}
                                        showDescriptionInsteadOfTitle={
                                          showDescriptionInsteadOfTitle
                                        }
                                        dataSectionItems={dataSectionItems}
                                        signatureMethod={props.signatureMethod}
                                        isDrawAllowed={props.isDrawAllowed}
                                        isWriteAllowed={props.isWriteAllowed}
                                        isUploadAllowed={props.isUploadAllowed}
                                        isPhoneMaskChecked={
                                          props.isPhoneMaskChecked
                                        }
                                        attachmentAllowedFileFormats={
                                          props.attachmentAllowedFileFormats
                                        }
                                        maxFileSize={props.maxFileSize}
                                        fileQuantityLimitation={
                                          props.fileQuantityLimitation
                                        }
                                        phoneAllowedCountries={
                                          props.phoneAllowedCountries
                                        }
                                        phoneDefaultCountry={
                                          props.phoneDefaultCountry
                                        }
                                        currency={extractCurrencyByLang(
                                          templateData.secondaryLang,
                                          props.currency,
                                        )}
                                        multiline={props.multiline}
                                        charMin={props.charMin}
                                        charMax={props.charMax}
                                        rowMin={props.rowMin}
                                        rowMax={props.rowMax}
                                        disablePastDates={props.disablePastDates}
                                        disableFutureDates={
                                          props.disableFutureDates
                                        }
                                        isForSecondary
                                        equationUnit={
                                          languages[templateData.secondaryLang]
                                            .equationUnit
                                        }
                                        result={props.result}
                                        equation={props.equation}
                                        decimalPlaces={props.decimalPlaces}
                                        ratingValue={props.ratingValue}
                                        ratingRange={templateData.ratingRange}
                                        ratingStyle={templateData.ratingStyle}
                                        fieldsDirection={
                                          templateData.secondaryLang === 'ar'
                                            ? 'rtl'
                                            : 'ltr'
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
};

PreviewPDFSection.propTypes = {
  isFieldDisabled: PropTypes.func.isRequired,
  dataSectionItems: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.string,
      sectionTitleDecorations: PropTypes.instanceOf(Array),
      isTitleVisibleOnTheFinalDocument: PropTypes.bool,
      isSectionVisibleOnTheFinalDoc: PropTypes.bool,
      sectionTitleDecoration: PropTypes.string,
      sectionTitleFontSize: PropTypes.number,
      isStepper: PropTypes.bool,
      order: PropTypes.number,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          type: PropTypes.oneOf(
            Object.values(FormsFieldsTypesEnum).map((item) => item.key),
          ),
          fillBy: PropTypes.oneOf(
            Object.values(FormsRolesEnum).map((item) => item.key),
          ),
          assign: PropTypes.arrayOf(
            PropTypes.shape({
              type: PropTypes.number,
              uuid: PropTypes.string,
            }),
          ),
          code: PropTypes.string,
          isVisible: PropTypes.bool,
          isRequired: PropTypes.bool,
          isVisibleFinalDoc: PropTypes.bool,
          cardTitle: PropTypes.string,
          description: PropTypes.string,
          icon: PropTypes.instanceOf(Object),
          currency: PropTypes.string,
          charMin: PropTypes.number,
          charMax: PropTypes.number,
          languages: PropTypes.objectOf(
            PropTypes.shape({
              value: PropTypes.oneOfType([
                PropTypes.instanceOf(Array),
                PropTypes.instanceOf(Object),
                PropTypes.string,
                PropTypes.number,
              ]),
              placeholder: PropTypes.string,
              title: PropTypes.string,
              isConditionalHidden: PropTypes.bool,
              isConditionalHiddenValue: PropTypes.bool,
              labelDecorations: PropTypes.string,
              labelFontSize: PropTypes.number,
              hideLabel: PropTypes.bool,
              options: PropTypes.arrayOf(
                PropTypes.shape({
                  id: PropTypes.string,
                  title: PropTypes.string,
                  isVisible: PropTypes.bool,
                  description: PropTypes.string,
                  code: PropTypes.string,
                }),
              ),
            }),
          ),
        }),
      ),
    }),
  ).isRequired,
  setDataSectionItems: PropTypes.func.isRequired,
  templateData: PropTypes.shape({
    uuid: PropTypes.string,
    code: PropTypes.string,
    formUUID: PropTypes.string,
    formStatus: PropTypes.oneOf(
      Object.values(FormsStatusesEnum).map((item) => item.key),
    ),
    editorRole: PropTypes.oneOf(
      Object.values(FormsRolesEnum).map((item) => item.key),
    ),
    typeOfSubmission: PropTypes.oneOf(
      Object.values(FormsSubmissionsLevelsTypesEnum).map((item) => item.key),
    ),
    isWithRecipient: PropTypes.bool,
    isWithDelay: PropTypes.bool,
    delayDuration: PropTypes.number,
    isWithDeadline: PropTypes.bool,
    deadlineDays: PropTypes.number,
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
    categories: PropTypes.instanceOf(Array),
    createdAt: PropTypes.string,
    description: PropTypes.string,
    isGrid: PropTypes.bool,
    // isNotShareable: PropTypes.bool,
    labelsLayout: PropTypes.oneOf(['row', 'column']),
    fieldLayout: PropTypes.oneOf(['row', 'column']),
    languages: PropTypes.instanceOf(Object),
    layout: PropTypes.oneOf(['row', 'column']),
    name: PropTypes.string,
    positionLevel: PropTypes.instanceOf(Array),
    primaryLang: PropTypes.string,
    secondaryLang: PropTypes.string,
    recipient: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
    }),
    sender: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
    }),
    source: PropTypes.oneOf(
      Object.values(NavigationSourcesEnum).map((item) => item.key),
    ),
    sections: PropTypes.instanceOf(Object),
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  preview: PropTypes.shape({
    isActive: PropTypes.bool.isRequired,
    role: PropTypes.oneOf(Object.values(FormsRolesEnum).map((item) => item.key))
      .isRequired,
  }).isRequired,
  setIsGlobalLoading: PropTypes.func,
  pdfDownLoad: PropTypes.func,
  isGlobalLoading: PropTypes.arrayOf(PropTypes.string),
  isSubmitted: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  // onIsValidOfferChange: PropTypes.func.isRequired,
  formsRolesTypes: PropTypes.instanceOf(Object).isRequired,
  headerHeight: PropTypes.number.isRequired,
  getSelectedRoleEnumItem: PropTypes.func.isRequired,
  getIsAssignToMe: PropTypes.func.isRequired,
  extractCurrencyByLang: PropTypes.func.isRequired,
  pdfRef: PropTypes.instanceOf(Object),
  // isValidOffer: PropTypes.bool.isRequired,
};
