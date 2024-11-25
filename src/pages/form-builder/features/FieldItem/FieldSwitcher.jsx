import React, { memo, useMemo } from 'react';
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

// 'input' type default case
export default memo(function FieldSwitcher({
  isFieldDisabled,
  fillBy,
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
  setErrors,
  disablePastDates,
  disableFutureDates,
  showDescriptionInsteadOfTitle,
  equationUnit,
  result,
  equation,
  dataSectionItems,
  pdfRef,
  globalFontSize,
  fontFamily,
  itemFontSize,
  decimalPlaces,
  showNumberOnEnglish
}) {
  // const query = useQuery();
  // const [queryStatus, setQueryStatus] = useState(query.get('status'));
  // if 2d language presented, define it in order to duplicate some data
  const otherLang = useMemo(
    () =>
      currentInputLang === templateData.primaryLang
        ? templateData.secondaryLang
        : templateData.primaryLang,
    [currentInputLang, templateData.primaryLang, templateData.secondaryLang],
  );
  const disabled = useMemo(() => isFieldDisabled(fillBy), [fillBy, isFieldDisabled]);

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
                    ...(['attachment'].includes(item.type) && {
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
          disabled={disabled}
          initialValue={memoizedInitialValue}
          filesDetails={files}
          allowedFormats={attachmentAllowedFileFormats}
          handleSetValue={handleSetValue}
          fileSizeLimit={maxFileSize}
          fileQuantityLimit={fileQuantityLimitation}
          buttonLabel={attachmentButtonLabel}
          preview={preview}
          role={templateData?.editorRole}
          fillBy={fillBy}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
          pdfRef={pdfRef}
        />
      );
    case 'signature':
      return (
        <SignatureField
          disabled={disabled}
          isDrawAllowed={isDrawAllowed}
          isWriteAllowed={isWriteAllowed}
          initialValue={initialValue}
          signatureMethod={signatureMethod}
          isUploadAllowed={isUploadAllowed}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
          pdfRef={pdfRef}
        />
      );
    case 'date':
      return (
        <DateField
          disabled={disabled}
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
          disableFutureDates={disableFutureDates}
          disablePastDates={disablePastDates}
        />
      );
    case 'time':
      return (
        <TimeField
          disabled={disabled}
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
        />
      );
    case 'datetime':
      return (
        <DateTimeField
          disabled={disabled}
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
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
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
        />
      );
    case 'radio':
      return (
        <RadioField
          disabled={disabled}
          list={options}
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
        />
      );
    case 'select':
    case 'custom_select':
      return (
        <SelectField
          disabled={disabled}
          list={options}
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          placeholder={placeholder}
          preview={preview}
          fillBy={fillBy}
          isRequired={isRequired}
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
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
          setErrors={setErrors}
          id={`${containerId}-${cardId}-${currentInputLang}`}
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
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
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
          isRequired={isRequired}
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
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
        />
      );
    case 'name':
      return (
        <NameField
          disabled={disabled}
          placeholder={placeholder}
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
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
          placeholder={placeholder}
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
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
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
          id={`${containerId}-${cardId}-${currentInputLang}`}
          wrapperClasses={
            preview.isActive && preview.role === fillBy && 'text-editor-highlight'
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
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
          id={`${containerId}-${cardId}-${currentInputLang}`}
          wrapperClasses={
            preview.isActive && preview.role === fillBy && 'text-editor-highlight'
          }
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
          initialValue={initialValue}
          handleSetValue={handleSetValue}
          isRequired={isRequired}
          isSubmitted={isSubmitted}
          type={type}
          setErrors={setErrors}
          id={`${containerId}-${cardId}-${currentInputLang}`}
        />
      );
    }
  }, [
    type,
    disabled,
    memoizedInitialValue,
    files,
    attachmentAllowedFileFormats,
    handleSetValue,
    maxFileSize,
    fileQuantityLimitation,
    attachmentButtonLabel,
    preview,
    templateData?.editorRole,
    fillBy,
    isRequired,
    isSubmitted,
    isDrawAllowed,
    isWriteAllowed,
    initialValue,
    signatureMethod,
    isUploadAllowed,
    options,
    placeholder,
    charMin,
    charMax,
    currency,
    isPhoneMaskChecked,
    phoneAllowedCountries,
    phoneDefaultCountry,
    style,
    rowMin,
    rowMax,
    multiline,
    containerId,
    cardId,
    currentInputLang,
    setErrors,
    disableFutureDates,
    disablePastDates,
    showDescriptionInsteadOfTitle,
    equationUnit,
    result,
    equation,
    dataSectionItems,
    globalFontSize,
    fontFamily,
    itemFontSize,
    decimalPlaces,
    showNumberOnEnglish
  ]);

  return <>{renderContent()}</>;
});
// FieldSwitcher.displayName = 'FieldSwitcher';
