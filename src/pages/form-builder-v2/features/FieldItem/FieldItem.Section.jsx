import * as React from 'react';
import { Box, Typography, Divider, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { CSS } from '@dnd-kit/utilities';
import { DndIcon } from '../../../form-builder/icons';
import FieldSwitcher from './FieldSwitcher';
import RTL from '../RTL';
import FieldSettingsPopper from './Poppers/FieldSettings.Popper';
import { memo, useMemo } from 'react';

const Field = styled(Box)(
  ({
    theme,
    type,
    isActive,
    isVisible,
    transform,
    transition,
    isDragging,
    isSorting,
    templateData,
  }) => ({
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? `2px dashed ${theme.palette.secondary.$80}` : undefined,
    display: isVisible ? 'flex' : 'none',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    outline:
      templateData.secondaryLang
      && isActive
      && !['inline', 'texteditor'].includes(type)
      && !isDragging
      && `2px solid ${theme.palette.secondary.$80}`,
    borderRadius: 12,
    flexDirection: templateData.layout === 'column' && 'column',
    ...(isSorting && {
      '&.dnd-field-item': {
        minHeight: 112,
        overflow: 'hidden',
      },
    }),
    '&.dnd-field-item': {
      '&.is-horizontal-labels': {
        '.MuiFormControl-root': {
          marginLeft: 0,
        },
        '.field-box-wrapper': {
          flexDirection: 'row',
          alignItems: 'flex-start',
          '.field-label-wrapper': {
            display: 'inline-block',
            marginTop: '.5rem',
            '> span': {
              padding: '0.5rem 0.5rem 0',
              display: 'inline-flex',
              alignSelf: 'center',
              width: 150,
              wordBreak: 'break-word',
            },
          },
          '.field-item-wrapper': {
            width: '10%',
            display: 'inline-flex',
            height: '100%',
            alignItems: 'center',
          },
        },
      },
    },
    '> .MuiBox-root': {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      flexDirection: !['inline', 'texteditor'].includes(type) && 'column',
      outline:
        !templateData.secondaryLang
        && isActive
        && !['inline', 'texteditor'].includes(type)
        && !isDragging
        && `2px solid ${theme.palette.secondary.$80}`,
      padding: !['inline', 'texteditor'].includes(type)
        ? theme.spacing(4, 3, 4, 2)
        : theme.spacing(0, 3, 0, 2),
      borderRadius: 12,
      '& .MuiFormControl-root ,& .text-editor-component-wrapper': {
        flex: !['salary', 'phone', 'select', 'custom_select'].includes(type) && 1,
        marginLeft: templateData.secondaryLang
          ? theme.spacing(1)
          : theme.spacing(6.5),
        '&:focus': {
          backgroundColor:
            ['inline', 'texteditor'].includes(type) && theme.palette.dark.$a4,
        },
      },
      '& .MuiFormGroup-root': {
        '& .MuiButtonBase-root': {
          padding: theme.spacing(2),
          marginLeft: 0,
        },
        flexDirection: 'column',
        '& .MuiFormControlLabel-root': {
          marginLeft: theme.spacing(3),
        },
      },
      '& .MuiIconButton-root': {
        cursor: isDragging ? 'grabbing' : 'grab',
      },
    },
  }),
);

const FieldItemSection = React.forwardRef(
  (
    {
      isFieldDisabled,
      preview,
      setDataSectionItems,
      fieldsItems,
      templateData,
      dataSectionItems,
      containerId,
      setActiveId,
      fillBy,
      isActive,
      listeners,
      languages,
      style,
      isDragging,
      type,
      id,
      errors,
      isSubmitted,
      showDescriptionInsteadOfTitle,
      formsRolesTypes,
      getFilteredRoleTypes,
      parentTranslationPath,
      translationPath,
      blocksItems,
      extractCurrencyByLang,
      theme,
      isVisible,
      transform,
      transition,
      isSorting,
      setIsGlobalLoading,
      assign,
      signatureMethod,
      isDrawAllowed,
      isWriteAllowed,
      isUploadAllowed,
      isPhoneMaskChecked,
      attachmentAllowedFileFormats,
      maxFileSize,
      fileQuantityLimitation,
      phoneAllowedCountries,
      phoneDefaultCountry,
      currency,
      multiline,
      charMin,
      charMax,
      rowMin,
      rowMax,
      isRequired,
      disablePastDates,
      disableFutureDates,
      equationUnit,
      result,
      equation,
      decimalPlaces,
      ratingValue,
      showNumberOnEnglish 
      // ...props
    },
    ref,
  ) => {
    const [popperAnchorEl, setPopperAnchorEl] = React.useState(null);

    const handleCardClick = React.useCallback(
      (e) => {
        e.stopPropagation();
        setActiveId((ids) =>
          ids.cardId !== id || ids.sectionId !== containerId
            ? { ...ids, cardId: id, sectionId: containerId }
            : ids,
        );
        setPopperAnchorEl((items) =>
          items !== e.currentTarget ? e.currentTarget : items,
        );
      },
      [containerId, id, setActiveId],
    );

    const blocksCheck = React.useMemo(
      () =>
        Object.values(blocksItems).some((item) => item.type === type)
        && type !== 'rating',
      [type, blocksItems],
    );

    const DirectionHandler = useMemo(() => {
      if (templateData.primaryLang === 'ar') return RTL;
      else return React.Fragment;
    }, [templateData.primaryLang]);
    return (
      <>
        <Field
          isDragging={isDragging}
          ref={ref}
          type={type}
          isActive={isActive}
          templateData={templateData}
          className={`dnd-field-item field-row-wrapper ${
            (templateData.labelsLayout === 'row'
              && !blocksCheck
              && 'is-horizontal-labels')
            || 'is-vertical-labels'
          }`}
          onClick={handleCardClick}
          theme={theme}
          isVisible={isVisible}
          transform={transform}
          transition={transition}
          isSorting={isSorting}
        >
          {!isDragging ? (
            <>
              <DirectionHandler>
                <Box
                  className="field-box-wrapper"
                  dir={templateData.primaryLang === 'ar' ? 'rtl' : 'ltr'}
                >
                  <Box
                    className="field-label-wrapper"
                    sx={{ mb: !['inline'].includes(type) && 4 }}
                  >
                    <Tooltip title="Drag">
                      <IconButton {...listeners}>
                        <DndIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                    {!languages[templateData.primaryLang]?.hideLabel
                      && !['inline', 'texteditor'].includes(type) && (
                      <Typography
                        variant={`${
                          languages[templateData.primaryLang]?.labelFontSize
                            || templateData?.globalFontSize
                            || 'body14'
                        }`}
                        sx={{
                          fontSize: `${
                            languages[templateData.primaryLang]?.labelFontSize
                              || templateData?.globalFontSize
                              || 14
                          }px`,
                          fontStyle:
                              languages[
                                templateData.primaryLang
                              ]?.labelDecorations?.includes('italic') && 'italic',
                          fontWeight:
                              languages[
                                templateData.primaryLang
                              ]?.labelDecorations?.includes('bold') && 700,
                          textDecoration:
                              languages[
                                templateData.primaryLang
                              ]?.labelDecorations?.includes('underline')
                              && 'underline',
                        }}
                      >
                        {languages[templateData.primaryLang].title}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    className="field-item-wrapper"
                    display="flex"
                    flex="1"
                    sx={{
                      '& *:not(.text-editor-wrapper *, .rating-wrapper * )': {
                        fontSize: `${
                          languages[templateData.primaryLang]?.labelFontSize
                          || templateData?.globalFontSize
                          || 14
                        }px`,
                      },
                    }}
                  >
                    <FieldSwitcher
                      type={type}
                      style={style}
                      isFieldDisabled={isFieldDisabled}
                      fillBy={fillBy}
                      placeholder={languages[templateData.primaryLang].placeholder}
                      options={languages[templateData.primaryLang].options}
                      initialValue={languages[templateData.primaryLang].value}
                      files={languages[templateData.primaryLang].files}
                      attachmentButtonLabel={
                        languages[templateData.primaryLang].buttonLabel
                      }
                      setIsGlobalLoading={setIsGlobalLoading}
                      cardId={id}
                      containerId={containerId}
                      templateData={templateData}
                      setDataSectionItems={setDataSectionItems}
                      currentInputLang={templateData.primaryLang}
                      preview={preview}
                      errors={errors}
                      isSubmitted={isSubmitted}
                      showDescriptionInsteadOfTitle={showDescriptionInsteadOfTitle}
                      dataSectionItems={dataSectionItems}
                      assign={assign}
                      signatureMethod={signatureMethod}
                      isDrawAllowed={isDrawAllowed}
                      isWriteAllowed={isWriteAllowed}
                      isUploadAllowed={isUploadAllowed}
                      isPhoneMaskChecked={isPhoneMaskChecked}
                      attachmentAllowedFileFormats={attachmentAllowedFileFormats}
                      maxFileSize={maxFileSize}
                      fileQuantityLimitation={fileQuantityLimitation}
                      phoneAllowedCountries={phoneAllowedCountries}
                      phoneDefaultCountry={phoneDefaultCountry}
                      currency={extractCurrencyByLang(
                        templateData.primaryLang,
                        currency,
                      )}
                      multiline={multiline}
                      charMin={charMin}
                      charMax={charMax}
                      rowMin={rowMin}
                      rowMax={rowMax}
                      isRequired={isRequired}
                      disablePastDates={disablePastDates}
                      disableFutureDates={disableFutureDates}
                      result={result}
                      equation={equation}
                      globalFontSize={templateData?.globalFontSize || ''}
                      fontFamily={templateData?.primaryFontFamily || ''}
                      itemFontSize={
                        languages?.[templateData.primaryLang]?.labelFontSize || ''
                      }
                      decimalPlaces={decimalPlaces}
                      equationUnit={languages[templateData.primaryLang].equationUnit}
                      rangeLabels={languages[templateData.primaryLang].rangeLabels}
                      ratingValue={ratingValue}
                      ratingRange={templateData.ratingRange}
                      ratingStyle={templateData.ratingStyle}
                      fieldsDirection={
                        templateData.primaryLang === 'ar' ? 'rtl' : 'ltr'
                      }
                      showNumberOnEnglish={showNumberOnEnglish}
                    />
                  </Box>
                </Box>
              </DirectionHandler>

              {templateData.secondaryLang
                && ![
                  'inline',
                  'direct_manager',
                  'head_of_department',
                  'video_gallery',
                  'video',
                  'image',
                  'image_gallery',
                  'attachment',
                  'signature',
                  'texteditor',
                  'rating',
                ].includes(type) && (
                <>
                  <Divider orientation="vertical" flexItem mx={{ mx: 4 }} />
                  <RTL>
                    <Box
                      className="field-box-wrapper is-secondary-lang"
                      dir={templateData.secondaryLang === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {!languages[templateData.secondaryLang]?.hideLabel && (
                        <Box
                          display="flex"
                          className="field-label-wrapper"
                          sx={{
                            mb: !['inline', 'texteditor'].includes(type) && 4,
                          }}
                        >
                          {!['inline', 'texteditor'].includes(type) && (
                            <Typography
                              variant={`${
                                languages[templateData.secondaryLang]
                                  ?.labelFontSize
                                  || languages[templateData.primaryLang]
                                    ?.labelFontSize
                                  || templateData?.globalFontSize
                                  || 'body14'
                              }`}
                              sx={{
                                fontSize: `${
                                  languages[templateData.secondaryLang]
                                    ?.labelFontSize
                                    || languages[templateData.primaryLang]
                                      ?.labelFontSize
                                    || templateData?.globalFontSize
                                    || 14
                                }px`,
                                fontStyle:
                                    languages[
                                      templateData.secondaryLang
                                    ]?.labelDecorations?.includes('italic')
                                    && 'italic',
                                fontWeight:
                                    languages[
                                      templateData.secondaryLang
                                    ]?.labelDecorations?.includes('bold') && 700,
                                textDecoration:
                                    languages[
                                      templateData.secondaryLang
                                    ]?.labelDecorations?.includes('underline')
                                    && 'underline',
                              }}
                            >
                              {languages[templateData.secondaryLang].title}
                            </Typography>
                          )}
                        </Box>
                      )}
                      <Box
                        className="field-item-wrapper"
                        display="flex"
                        flex="1"
                        sx={{
                          '& *:not(.text-editor-wrapper *, .rating-wrapper *)': {
                            fontSize: `${
                              languages[templateData.secondaryLang]
                                ?.labelFontSize
                                || languages[templateData.primaryLang]?.labelFontSize
                                || templateData?.globalFontSize
                                || 14
                            }px`,
                          },
                        }}
                      >
                        <FieldSwitcher
                          type={type}
                          style={style}
                          isFieldDisabled={isFieldDisabled}
                          fillBy={fillBy}
                          placeholder={
                            languages[templateData.secondaryLang].placeholder
                          }
                          options={languages[templateData.secondaryLang].options}
                          initialValue={
                            languages[templateData.secondaryLang].value
                          }
                          files={languages[templateData.secondaryLang].files}
                          attachmentButtonLabel={
                            languages[templateData.secondaryLang].buttonLabel
                          }
                          cardId={id}
                          containerId={containerId}
                          templateData={templateData}
                          setDataSectionItems={setDataSectionItems}
                          currentInputLang={templateData.secondaryLang}
                          preview={preview}
                          errors={errors}
                          isSubmitted={isSubmitted}
                          showDescriptionInsteadOfTitle={
                            showDescriptionInsteadOfTitle
                          }
                          isForSecondary
                          dataSectionItems={dataSectionItems}
                          assign={assign}
                          signatureMethod={signatureMethod}
                          isDrawAllowed={isDrawAllowed}
                          isWriteAllowed={isWriteAllowed}
                          isUploadAllowed={isUploadAllowed}
                          isPhoneMaskChecked={isPhoneMaskChecked}
                          setIsGlobalLoading={setIsGlobalLoading}
                          attachmentAllowedFileFormats={
                            attachmentAllowedFileFormats
                          }
                          maxFileSize={maxFileSize}
                          fileQuantityLimitation={fileQuantityLimitation}
                          phoneAllowedCountries={phoneAllowedCountries}
                          phoneDefaultCountry={phoneDefaultCountry}
                          currency={extractCurrencyByLang(
                            templateData.secondaryLang,
                            currency,
                          )}
                          multiline={multiline}
                          charMin={charMin}
                          charMax={charMax}
                          rowMin={rowMin}
                          rowMax={rowMax}
                          isRequired={isRequired}
                          disablePastDates={disablePastDates}
                          disableFutureDates={disableFutureDates}
                          result={result}
                          equation={equation}
                          globalFontSize={templateData?.globalFontSize || ''}
                          fontFamily={
                            templateData?.secondaryFontFamily
                              || templateData?.primaryFontFamily
                              || ''
                          }
                          itemFontSize={
                            languages?.[templateData.secondaryLang]
                              ?.labelFontSize
                              || languages?.[templateData.primaryLang]?.labelFontSize
                              || ''
                          }
                          decimalPlaces={decimalPlaces}
                          equationUnit={
                            languages[templateData.secondaryLang].equationUnit
                          }
                          ratingValue={ratingValue}
                          rangeLabels={
                            languages[templateData.secondaryLang].rangeLabels
                          }
                          ratingRange={templateData.ratingRange}
                          ratingStyle={templateData.ratingStyle}
                          showNumberOnEnglish={ showNumberOnEnglish}
                        />
                      </Box>
                    </Box>
                  </RTL>
                </>
              )}
            </>
          ) : (
            !languages[templateData.primaryLang]?.hideLabel && (
              <Box dispaly="flex">
                <Typography
                  variant={`${
                    languages[templateData.primaryLang]?.labelFontSize
                    || templateData?.globalFontSize
                    || 'body14'
                  }`}
                  weight={`${
                    languages[templateData.primaryLang]?.labelDecorations?.includes(
                      'bold',
                    ) || 'bold'
                  }`}
                  color="secondary.main"
                  sx={{
                    ml: 6,
                    fontSize: `${
                      languages[templateData.primaryLang]?.labelFontSize
                      || templateData?.globalFontSize
                      || 14
                    }px`,
                    fontStyle:
                      languages[
                        templateData.primaryLang
                      ]?.labelDecorations?.includes('italic') && 'italic',
                    fontWeight:
                      languages[
                        templateData.primaryLang
                      ]?.labelDecorations?.includes('bold') && 700,
                    textDecoration:
                      languages[
                        templateData.primaryLang
                      ]?.labelDecorations?.includes('underline') && 'underline',
                  }}
                >
                  {languages[templateData.primaryLang].title}
                </Typography>
              </Box>
            )
          )}
        </Field>
        {isActive && (
          <FieldSettingsPopper
            keepMounted
            cardId={id}
            containerId={containerId}
            type={type}
            styleType={style ?? undefined}
            fieldsItems={fieldsItems}
            templateData={templateData}
            fillBy={fillBy}
            setDataSectionItems={setDataSectionItems}
            dataSectionItems={dataSectionItems}
            open={isActive}
            formsRolesTypes={formsRolesTypes}
            getFilteredRoleTypes={getFilteredRoleTypes}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            anchorEl={popperAnchorEl}
            blocksItems={blocksItems}
          />
        )}
      </>
    );
  },
);

FieldItemSection.displayName = 'FieldItemSection';

export default memo(FieldItemSection);
