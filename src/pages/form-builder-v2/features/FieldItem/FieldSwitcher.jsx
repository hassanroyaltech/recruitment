import React, { memo, useEffect, useState } from 'react';
import SelectField from './Fields/SelectField';
import InputField from './Fields/InputField';
import RadioField from './Fields/RadioField';
import CheckboxField from './Fields/CheckboxField';
import NumberField from './Fields/NumberField';
import PhoneField from './Fields/PhoneField';
import SalaryField from './Fields/SalaryField';
import NameField from './Fields/NameField';
import DateField from './Fields/DateField';
import TimeField from './Fields/TimeField';
import DateTimeField from './Fields/DateTimeField';
import SignatureField from './Fields/SignatureField';
import AttachmentField from './Fields/AttachmentField';
import TextEditorField from './Fields/TexteditorField';
import EquationField from './Fields/EquationField';
import { FormsForTypesEnum } from '../../../../enums';
import MeetTeamField from './Fields/MeetTeam.Field';
import VideoField from './Fields/Video.Field';
import VideoGalleryField from './Fields/VideoGallery.Field';
import ImageField from './Fields/Image.Field';
import ImageGalleryField from './Fields/ImageGallery.Field';
import DirectManagerField from './Fields/DirectManager.Field';
import HeadOfDepartmentField from './Fields/HeadOfDepartment.Field';
import SurveyRating from './Fields/SurveyRating';

// 'input' type default case
function FieldSwitcher({
  isFieldDisabled,
  fillBy,
  assign,
  type,
  style,
  initialValue,
  signatureMethod,
  isDrawAllowed,
  isWriteAllowed,
  isUploadAllowed,
  options,
  placeholder,
  isPhoneMaskChecked,
  attachmentAllowedFileFormats,
  attachmentButtonLabel,
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
  containerId,
  cardId,
  templateData,
  currentInputLang,
  setDataSectionItems,
  isRequired,
  isSubmitted,
  preview,
  files,
  errors,
  disablePastDates,
  disableFutureDates,
  showDescriptionInsteadOfTitle,
  equationUnit,
  result,
  equation,
  isForSecondary,
  dataSectionItems,
  setIsGlobalLoading,
  pdfRef,
  systemUserRecipient,
  getIsValueDisplay,
  globalFontSize,
  fontFamily,
  itemFontSize,
  decimalPlaces,
  ratingValue,
  rangeLabels,
  ratingRange,
  ratingStyle,
  fieldsDirection,
  showNumberOnEnglish
}) {
  const [disabled, setDisabled] = useState(isFieldDisabled(fillBy, assign));
  const [otherLang, setOtherLang] = useState(
    currentInputLang === templateData.primaryLang
      ? templateData.secondaryLang
      : templateData.primaryLang,
  );

  // this callback is collecting values from every input and setting changing values accordingly for every field
  // and if 2d language is exists, required fields will be duplicated with same options, e.g. [checkbox, dropdown, etc]
  const handleSetValue = React.useCallback(
    (value, optId, isChecked, extra) => {
      setDataSectionItems((data) => ({
        ...data,
        [containerId]: {
          ...data[containerId],
          items: data[containerId].items.map((item) =>
            item.id === cardId
              ? {
                ...item,
                ...(extra && extra),
                languages: {
                  ...item.languages,
                  [currentInputLang]: {
                    ...item.languages[currentInputLang],
                    ...(!['attachment'].includes(item.type) && {
                      value,
                    }),
                    ...([
                      'attachment',
                      'video_gallery',
                      'video',
                      'image',
                      'image_gallery',
                    ].includes(item.type) && {
                      value: value.map((element) => element.uuid),
                      files: value,
                    }),
                  },
                  ...(otherLang && {
                    [otherLang]: {
                      ...item.languages[otherLang],
                      ...(![
                        'attachment',
                        'signature',
                        'multiline',
                        'input',
                        'name',
                      ].includes(item.type) && {
                        value,
                      }),
                    },
                  }),
                },
              }
              : item,
          ),
        },
      }));
    },
    [cardId, containerId, currentInputLang, otherLang, setDataSectionItems],
  );

  const memoizedInitialValue = React.useMemo(() => initialValue, [initialValue]);
  const renderContent = React.useCallback(() => {
    switch (type) {
    case 'attachment':
      return (
        <AttachmentField
          pdfRef={pdfRef}
          disabled={disabled}
          initialValue={memoizedInitialValue}
          filesDetails={files}
          isForCandidate={
            templateData.extraQueries.for === FormsForTypesEnum.Candidate.key
          }
          allowedFormats={attachmentAllowedFileFormats}
          handleSetValue={handleSetValue}
          fileSizeLimit={maxFileSize}
          fileQuantityLimit={fileQuantityLimitation}
          buttonLabel={attachmentButtonLabel}
          preview={preview}
          role={templateData?.editorRole}
          fillBy={fillBy}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
        />
      );
    case 'signature':
      return (
        <SignatureField
          disabled={disabled}
          isDrawAllowed={isDrawAllowed}
          isWriteAllowed={isWriteAllowed}
          initialValue={memoizedInitialValue}
          signatureMethod={signatureMethod}
          isUploadAllowed={isUploadAllowed}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
        />
      );
    case 'date':
      return (
        <DateField
          disabled={disabled}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          disableFutureDates={disableFutureDates}
          disablePastDates={disablePastDates}
        />
      );
    case 'time':
      return (
        <TimeField
          disabled={disabled}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
        />
      );
    case 'datetime':
      return (
        <DateTimeField
          disabled={disabled}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          disableFutureDates={disableFutureDates}
          disablePastDates={disablePastDates}
        />
      );
    case 'checkbox':
      return (
        <CheckboxField
          disabled={disabled}
          list={options}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
        />
      );
    case 'radio':
      return (
        <RadioField
          disabled={disabled}
          list={options}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
        />
      );
    case 'select':
    case 'custom_select':
      return (
        <SelectField
          disabled={disabled}
          list={options}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          placeholder={placeholder}
          preview={preview}
          fillBy={fillBy}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          showDescriptionInsteadOfTitle={showDescriptionInsteadOfTitle}
          role={templateData?.editorRole}
          currentInputLang={currentInputLang}
        />
      );
    case 'number':
      return (
        <NumberField
          disabled={disabled}
          placeholder={placeholder}
          charMin={charMin}
          charMax={charMax}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          errors={errors}
          id={`${cardId}${currentInputLang}`}
          showNumberOnEnglish={showNumberOnEnglish}
          currentInputLang={currentInputLang}
        />
      );
    case 'salary':
      return (
        <SalaryField
          disabled={disabled}
          placeholder={placeholder}
          charMin={charMin}
          charMax={charMax}
          currency={currency}
          currentInputLang={currentInputLang}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          dataSectionItems={dataSectionItems}
          showNumberOnEnglish={showNumberOnEnglish}
        />
      );
    case 'equation':
      return (
        <EquationField
          disabled={disabled}
          placeholder={placeholder}
          charMin={charMin}
          charMax={charMax}
          currency={currency}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          equationUnit={equationUnit}
          result={result}
          equation={equation}
          dataSectionItems={dataSectionItems}
          currentInputLang={currentInputLang}
          decimalPlaces={decimalPlaces}
          showNumberOnEnglish={showNumberOnEnglish}
        />
      );
    case 'phone':
      return (
        <PhoneField
          disabled={disabled}
          placeholder={placeholder}
          isPhoneMaskChecked={isPhoneMaskChecked}
          phoneAllowedCountries={phoneAllowedCountries}
          phoneDefaultCountry={phoneDefaultCountry}
          charMin={charMin}
          charMax={charMax}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
        />
      );
    case 'name':
      return (
        <NameField
          disabled={disabled}
          placeholder={placeholder}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
        />
      );
    case 'inline':
      return (
        <InputField
          readOnly={disabled}
          disabled={disabled}
          multiline
          type={type}
          style={style}
          errors={errors}
          placeholder={placeholder}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          id={`${cardId}${currentInputLang}`}
        />
      );
    case 'multiline':
      return (
        <TextEditorField
          disabled={disabled}
          charMin={charMin}
          charMax={charMax}
          rowMin={rowMin}
          rowMax={rowMax}
          placeholder={placeholder}
          multiline={multiline || true}
          globalFontSize={globalFontSize}
          fontFamily={fontFamily}
          itemFontSize={itemFontSize}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          id={`${containerId}-${cardId}-${currentInputLang}-${
            (isForSecondary && 'isForSecondary') || ''
          }`}
          wrapperClasses={
            (preview.isActive
                && preview.role === fillBy
                && 'text-editor-highlight')
              || undefined
          }
        />
      );
    case 'texteditor':
      return (
        <TextEditorField
          disabled={disabled}
          charMin={charMin}
          charMax={charMax}
          rowMin={rowMin}
          rowMax={rowMax}
          placeholder={placeholder}
          multiline={multiline || true}
          globalFontSize={globalFontSize}
          fontFamily={fontFamily}
          itemFontSize={itemFontSize}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          id={`${containerId}-${cardId}-${currentInputLang}-${
            (isForSecondary && 'isForSecondary') || ''
          }`}
          wrapperClasses={
            (preview.isActive
                && preview.role === fillBy
                && 'text-editor-highlight')
              || undefined
          }
        />
      );
    case 'team_member':
      return (
        <MeetTeamField
          disabled={disabled}
          charMin={charMin}
          charMax={charMax}
          rowMin={rowMin}
          rowMax={rowMax}
          preview={preview}
          role={templateData?.editorRole}
          fillBy={fillBy}
          placeholder={placeholder}
          multiline={multiline || true}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          id={`${containerId}-${cardId}-${currentInputLang}`}
          wrapperClasses={
            (preview.isActive
                && preview.role === fillBy
                && 'text-editor-highlight')
              || undefined
          }
          systemUserRecipient={systemUserRecipient}
          templateData={templateData}
          getIsValueDisplay={getIsValueDisplay}
        />
      );
    case 'video':
      return (
        <VideoField
          pdfRef={pdfRef}
          disabled={disabled}
          type={type}
          files={files}
          charMin={charMin}
          charMax={charMax}
          rowMin={rowMin}
          rowMax={rowMax}
          preview={preview}
          role={templateData?.editorRole}
          fillBy={fillBy}
          style={style}
          placeholder={placeholder}
          multiline={multiline || true}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          id={`${containerId}-${cardId}-${currentInputLang}`}
          wrapperClasses={
            (preview.isActive
                && preview.role === fillBy
                && 'text-editor-highlight')
              || undefined
          }
          attachmentButtonLabel={attachmentButtonLabel}
          getIsValueDisplay={getIsValueDisplay}
        />
      );
    case 'video_gallery':
      return (
        <VideoGalleryField
          pdfRef={pdfRef}
          disabled={disabled}
          files={files}
          type={type}
          fillBy={fillBy}
          charMin={charMin}
          charMax={charMax}
          rowMin={rowMin}
          rowMax={rowMax}
          preview={preview}
          role={templateData?.editorRole}
          style={style}
          placeholder={placeholder}
          multiline={multiline || true}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          id={`${containerId}-${cardId}-${currentInputLang}`}
          wrapperClasses={
            (preview.isActive
                && preview.role === fillBy
                && 'text-editor-highlight')
              || undefined
          }
          attachmentButtonLabel={attachmentButtonLabel}
          getIsValueDisplay={getIsValueDisplay}
        />
      );
    case 'image':
      return (
        <ImageField
          pdfRef={pdfRef}
          disabled={disabled}
          files={files}
          type={type}
          charMin={charMin}
          charMax={charMax}
          rowMin={rowMin}
          rowMax={rowMax}
          preview={preview}
          role={templateData?.editorRole}
          fillBy={fillBy}
          style={style}
          placeholder={placeholder}
          multiline={multiline || true}
          setIsGlobalLoading={setIsGlobalLoading}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          id={`${containerId}-${cardId}-${currentInputLang}`}
          wrapperClasses={
            (preview.isActive
                && preview.role === fillBy
                && 'text-editor-highlight')
              || undefined
          }
          attachmentButtonLabel={attachmentButtonLabel}
          getIsValueDisplay={getIsValueDisplay}
        />
      );
    case 'image_gallery':
      return (
        <ImageGalleryField
          pdfRef={pdfRef}
          disabled={disabled}
          files={files}
          type={type}
          charMin={charMin}
          charMax={charMax}
          rowMin={rowMin}
          rowMax={rowMax}
          preview={preview}
          role={templateData?.editorRole}
          fillBy={fillBy}
          style={style}
          setIsGlobalLoading={setIsGlobalLoading}
          placeholder={placeholder}
          multiline={multiline || true}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={
            errors[`${cardId}${currentInputLang}`]
              && errors[`${cardId}${currentInputLang}`].error
          }
          isSubmitted={isSubmitted}
          id={`${containerId}-${cardId}-${currentInputLang}`}
          wrapperClasses={
            (preview.isActive
                && preview.role === fillBy
                && 'text-editor-highlight')
              || undefined
          }
          attachmentButtonLabel={attachmentButtonLabel}
          getIsValueDisplay={getIsValueDisplay}
        />
      );
    case 'direct_manager':
      return (
        <DirectManagerField
          disabled={disabled}
          preview={preview}
          role={templateData?.editorRole}
          fillBy={fillBy}
          placeholder={placeholder}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          id={`${containerId}-${cardId}-${currentInputLang}`}
          wrapperClasses={
            (preview.isActive
                && preview.role === fillBy
                && 'text-editor-highlight')
              || undefined
          }
          systemUserRecipient={systemUserRecipient}
          templateData={templateData}
          getIsValueDisplay={getIsValueDisplay}
        />
      );
    case 'head_of_department':
      return (
        <HeadOfDepartmentField
          disabled={disabled}
          preview={preview}
          role={templateData?.editorRole}
          fillBy={fillBy}
          placeholder={placeholder}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          id={`${containerId}-${cardId}-${currentInputLang}`}
          wrapperClasses={
            (preview.isActive
                && preview.role === fillBy
                && 'text-editor-highlight')
              || undefined
          }
          systemUserRecipient={systemUserRecipient}
          templateData={templateData}
        />
      );
    case 'rating':
      return (
        <SurveyRating
          onChange={({ value }) =>
            handleSetValue(undefined, undefined, undefined, {
              ratingValue: value === ratingValue ? null : value,
            })
          }
          isRequired={isRequired}
          type={type}
          sectionSetting={{ range_labels: rangeLabels }}
          globalSetting={{
            score: {
              score_range: ratingRange,
              score_style: ratingStyle,
            },
          }}
          id={`${containerId}-${cardId}-${currentInputLang}`}
          value={ratingValue}
          isView={disabled}
          isSubmitted={isSubmitted}
          errors={errors}
          direction={fieldsDirection}
          errorPath={`${cardId}${currentInputLang}`}
        />
      );
    default:
      return (
        <InputField
          disabled={disabled}
          charMin={charMin}
          charMax={charMax}
          placeholder={placeholder}
          multiline={multiline}
          initialValue={memoizedInitialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
          errors={errors}
          type={type}
          id={`${cardId}${currentInputLang}`}
        />
      );
    }
  }, [
    type,
    pdfRef,
    disabled,
    memoizedInitialValue,
    files,
    templateData,
    attachmentAllowedFileFormats,
    handleSetValue,
    maxFileSize,
    fileQuantityLimitation,
    attachmentButtonLabel,
    preview,
    fillBy,
    errors,
    cardId,
    currentInputLang,
    isSubmitted,
    isDrawAllowed,
    isWriteAllowed,
    signatureMethod,
    isUploadAllowed,
    disableFutureDates,
    disablePastDates,
    options,
    placeholder,
    showDescriptionInsteadOfTitle,
    charMin,
    charMax,
    currency,
    equationUnit,
    result,
    equation,
    dataSectionItems,
    decimalPlaces,
    isPhoneMaskChecked,
    phoneAllowedCountries,
    phoneDefaultCountry,
    style,
    rowMin,
    rowMax,
    multiline,
    globalFontSize,
    fontFamily,
    itemFontSize,
    containerId,
    isForSecondary,
    systemUserRecipient,
    getIsValueDisplay,
    setIsGlobalLoading,
    isRequired,
    rangeLabels,
    ratingRange,
    ratingStyle,
    ratingValue,
    fieldsDirection,
    showNumberOnEnglish
  ]);

  useEffect(() => {
    setDisabled(isFieldDisabled(fillBy, assign));
  }, [assign, fillBy, isFieldDisabled]);

  useEffect(() => {
    setOtherLang(
      currentInputLang === templateData.primaryLang
        ? templateData.secondaryLang
        : templateData.primaryLang,
    );
  }, [currentInputLang, templateData.primaryLang, templateData.secondaryLang]);

  return <>{renderContent()}</>;
}

export default memo(FieldSwitcher);
FieldSwitcher.displayName = 'FieldSwitcher';
