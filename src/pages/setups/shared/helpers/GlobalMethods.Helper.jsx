/**
 * @param languages - the list of languages to filter
 * @param item - the state item that include the languages
 * @param index
 * @param isByCode boolean to check if finding language should use index ot code
 * @param code
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to filter the languages before send it to the autocomplete
 */
export const getNotSelectedLanguage = (languages, item, index, isByCode, code) =>
  (languages || []).filter((element) => {
    if (isByCode && code)
      return element.code === code || !Object.keys(item).includes(element.code);
    else
      return (
        Object.keys(item || {}).findIndex(
          (el, itemIndex) => el && el === element.code && index !== itemIndex,
        ) === -1
      );
  });

/**
 * @param languages - the list of languages to filter
 * @param languageCode
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to get language title
 */
export const getLanguageTitle = (languages, languageCode) =>
  languages.find((item) => languageCode === item.code)?.title || 'N/A';
