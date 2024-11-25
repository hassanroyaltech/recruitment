import React, { memo } from 'react';
import { FormGroup } from 'reactstrap';
import Select from 'react-select';
import { selectColors, customSelectStyles } from 'shared/styles';
import { useTranslation } from 'react-i18next';

const translationPath = 'Components.';
const parentTranslationPath = 'RecruiterPreferences';

export const Annotations = memo(
  ({ variables, annotationLabel, index, addAnnotation }) => {
    const { t } = useTranslation(parentTranslationPath);

    const copyVariable = (e) => {
      // navigator.clipboard.writeText(e.currentTarget.value);
      if (addAnnotation) addAnnotation(e?.value);
    };
    return (
      <FormGroup className="mb-3">
        <label
          className="form-control-label mt-3"
          htmlFor={`email-annotations-${index || ''}`}
        >
          {annotationLabel || t(`${translationPath}email-annotations`)}
        </label>
        <Select
          id={`email-annotations-${index || ''}`}
          // className="form-control form-control-alternative"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              ...selectColors,
            },
          })}
          styles={customSelectStyles}
          placeholder={t(`${translationPath}select-annotations`)}
          onChange={copyVariable}
          options={[...variables.map((v, i) => ({ value: v, label: v }))]}
        />
      </FormGroup>
    );
  },
);
Annotations.displayName = 'Annotations';
