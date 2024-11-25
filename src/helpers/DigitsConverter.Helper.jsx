// noinspection JSCheckFunctionSignatures

import i18next from 'i18next';

// Mapping of Arabic digits
const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
// String.fromCharCode(`0x066${d}`)
// English to Arabic digits using unicode.
export const EnToArUni = (
  value,
  language = i18next.language,
  isReversed = false,
) => {
  if (value === null || value === undefined) return value;
  return language === 'ar'
    ? `${value}`
        && `${value}`.replace(/\d/gm, (d) => String.fromCharCode(`0x066${d}`))
    : isReversed
      ? `${value}`
      && `${value}`.replace(/[٠-٩]/gm, (d) => englishDigits[arabicDigits.indexOf(d)])
      : value;
  //
  // const arabicDigitCharCodeOffset = 0x0660; // Arabic digits start at 0x0660
  // const englishDigitCharCodeOffset = 0x0030; // English digits start at 0x0030
  //
  // const convertDigit = (d) => {
  //   if (d >= '0' && d <= '9')
  //     return String.fromCharCode(
  //       arabicDigitCharCodeOffset + (d.charCodeAt(0) - englishDigitCharCodeOffset),
  //     );
  //
  //   if (d >= '٠' && d <= '٩')
  //     return String.fromCharCode(
  //       englishDigitCharCodeOffset + (d.charCodeAt(0) - arabicDigitCharCodeOffset),
  //     );
  //
  //   return d;
  // };
  //
  // const regex = /\d|[٠-٩]/g;
  //
  // if (language === 'ar' && !isReversed)
  //   return `${value}`.replace(regex, convertDigit);
  //
  // if (isReversed) return `${value}`.replace(regex, convertDigit);
  //
  // return value;
};
