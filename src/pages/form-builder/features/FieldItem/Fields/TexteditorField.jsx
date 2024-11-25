import * as React from 'react';
import { TextEditorComponent } from 'components';

// eslint-disable-next-line react/display-name
export default React.memo(
  ({
    placeholder,
    handleSetValue,
    initialValue,
    disabled,
    isSubmitted,
    id,
    wrapperClasses,
    globalFontSize,
    fontFamily,
    itemFontSize,
  }) => (
    <TextEditorComponent
      editorValue={initialValue}
      idRef={id}
      isSubmitted={isSubmitted}
      height={155}
      menubar={false}
      rightToolbarExtend=" table"
      onEditorDelayedChange={(content) => {
        handleSetValue(content);
      }}
      isDisabled={disabled}
      wrapperClasses={wrapperClasses}
      placeholder={placeholder}
      contentStyle={`body * {font-size:${itemFontSize || globalFontSize}px;
                               font-family:${fontFamily} ;}`}
    />
  ),
);
