import React, { useCallback } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { EquationOperatorsEnum } from 'enums';
import { EnToArUni, EquationsParser, showError } from 'helpers';

// eslint-disable-next-line react/display-name
export default React.memo(
  ({
    title,
    charMin,
    charMax,
    placeholder,
    equation,
    equationUnit,
    handleSetValue,
    disabled,
    isRequired,
    isSubmitted,
    result,
    dataSectionItems,
    currentInputLang,
    decimalPlaces,
    showNumberOnEnglish,
  }) => {
    const formatNumber = useCallback(
      (number) => {
        const decimals = (number.toString().split('.')[1] || []).length;
        if (decimals > (decimalPlaces ?? 2))
          return parseFloat(number.toFixed(decimalPlaces ?? 2));
        else return number;
      },
      [decimalPlaces],
    );

    const calculateEquation = useCallback(() => {
      let resultCalc;
      if (equation?.length) {
        let newEquation = equation
          .map((item) => {
            if (Object.values(EquationOperatorsEnum).includes(item) || !isNaN(item))
              return item.value || item;
            else {
              let field;
              Object.values(dataSectionItems).find((section) => {
                let found = section?.items?.find((it) => it.id === item);
                if (found) field = found;
              });
              if (
                field?.languages?.[currentInputLang]?.value
                || field?.languages?.en?.value
              )
                return (
                  field?.languages?.[currentInputLang]?.value
                  || field?.languages?.en?.value
                );
              else {
                showError(
                  'Cannot calculate this equation, please make sure to fill all if the fields values',
                );
                handleSetValue('', undefined, undefined, { result: '' });
                return item;
              }
            }
          })
          .join('');
        try {
          resultCalc = EquationsParser(newEquation);
          handleSetValue('', undefined, undefined, {
            result: formatNumber(resultCalc),
          });
        } catch (e) {
          showError(
            'Cannot calculate this equation, please make sure to fill all if the fields values',
            e,
          );
        }
      }
    }, [currentInputLang, formatNumber, dataSectionItems, equation, handleSetValue]);
    return (
      <>
        <TextField
          disabled={disabled}
          placeholder={placeholder}
          value={EnToArUni(
            result,
            showNumberOnEnglish ? 'en' : currentInputLang,
            true,
          )}
          name={title}
          id={`${title}-equationUnit`}
          className={
            (!disabled && isRequired && isSubmitted && !result && 'is-required')
            || ''
          }
          InputProps={{
            inputProps: {
              minLength: charMin,
              maxLength: charMax,
              readOnly: true,
            },
          }}
        />
        <Typography sx={{ display: 'flex', alignItems: 'center', ml: 4, mr: 2 }}>
          {equationUnit || ' '}
        </Typography>
        <Button
          className="mx-2"
          onClick={calculateEquation}
          variant="secondary"
          disabled={!equation?.length || disabled}
          size="m"
        >
          Calculate
        </Button>
      </>
    );
  },
);
