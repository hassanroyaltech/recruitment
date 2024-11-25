import React from 'react';

/**
 * Generates a truncated filename
 * @param fileName
 * @param ellipseLength
 * @returns {*}
 */
export function getEllipseFileName(fileName, ellipseLength = 6) {
  let newFileName = fileName;
  if (newFileName.length > ellipseLength + 4)
    newFileName = `${newFileName.substring(0, ellipseLength)}...`;

  return newFileName;
}

/**
 * This function generates a state from a single props for a dropdown.
 * It standardizes the issue that each dropdown may have a different
 * placeholder, name, id and label.
 *
 * This makes sure everything is consistent with a naming convention.
 *
 * Takes a prop called 'purpose'. If the purpose is 'template';
 * then:
 *    - purpose = 'template'
 *    - id = 'template_field'
 *    - name = 'templateField'
 *    - label = 'Select a template'
 *    - placeholder = 'Select a template'
 *
 * @param purpose
 * @returns {{purpose: *, name: string, placeholder: string, id: string, label: string}}
 */
export function dropdownStateMaker(purpose) {
  return {
    purpose,
    placeholder: `Select a ${purpose}`,
    name: `${purpose}Field`,
    id: `${purpose}_field`,
    label: `Select a ${purpose}`,
  };
}

/**
 * Flattens a list of objects into an array based on a key
 *
 * @example
 * const objectList = [
 *  {title: 'a', num: 1},
 *  {title: 'b', num: 2}
 * ]
 * const newArray = flattenObjectList(objectList, 'title')
 *
 * Results:
 * newArray = ['a', 'b']
 *
 * @param objectList
 * @param key
 */
export function flattenObjectList(objectList, key) {
  return Array.from(objectList, (x) => x[key]);
}

/**
 * Select a random item from an array
 * @param array
 * @returns {*}
 */
export function randomSelection(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get initials of a name
 * @param string
 * @returns {string}
 */
export function getInitials(string) {
  const names = string.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1)
    // This will only take into account the second index
    initials += names[1].substring(0, 1).toUpperCase();
  // This takes into account the last index (causes issues with cases like:
  // 'Firstname Lastname [Admin]', it will render 'F[' instead of 'FL'
  // initials += names[names.length - 1].substring(0, 1).toUpperCase();

  return initials;
}

/**
 * Format date
 * @param date
 * @returns {string}
 */
export function formatDate(date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}

/**
 * Matches for a youtube url
 * @param url
 * @returns {boolean}
 */
export function matchYoutubeUrl(url) {
  const p
    = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/;
  return !!url.match(p);
}

/**
 * Matches for a vimeo url
 * @param url
 * @returns {boolean}
 */
export function matchVimeoUrl(url) {
  const p
    = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com)\/(video\/|embed\/|watch\?\S*v=|v\/)?([A-Za-z0-9._%-]*)(\S+)?/;
  return !!url.match(p);
}

/**
 * Validation message for the URLs
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
export function UrlValidationMessage(props) {
  if (props.currentValue === '') return null;

  if (!props.isValidUrl && props.videoType === 'Youtube')
    return (
      <p className="mb-0 mt-1 text-xs text-danger">
        The URL is not a valid Youtube URL
      </p>
    );
  if (!props.isValidUrl && props.videoType === 'Vimeo')
    return (
      <p className="mb-0 mt-1 text-xs text-danger">
        The URL is not a valid Vimeo URL
      </p>
    );

  return null;
}

/**
 * Function that returns true, used in props
 */
export const returnTrue = () => true;

/**
 * Function that returns false, used in props
 */
export const returnFalse = () => false;

/**
 * Gets the uuid of the current language
 */
export const retrieveLanguage = () => {
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const platformLanguage = localStorage.getItem('platform_language') || 'en';
  return user?.language.filter((item) => {
    if (item.code === platformLanguage) return item.id;
  });
};

export const getNameHandler = (item, language) =>
  ((item.first_name || item.last_name)
    && `${
      item.first_name
      && (typeof item.first_name === 'string'
        ? item.first_name
        : item.first_name[language] || item.first_name.en)
    }${
      (item.last_name
        && ` ${
          typeof item.last_name === 'string'
            ? item.last_name
            : item.last_name[language] || item.last_name.en
        }`)
      || ''
    }`)
  || (item.name && (item.name?.[language] || item.name?.en))
  || (item.title
    && (typeof item.title === 'string'
      ? item.title
      : item.title?.[language] || item.title?.en));
