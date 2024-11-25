import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this component is to move the scroll to the error location
 */
const FormikErrorFocusComponent = ({
  isSubmitting,
  isValidating,
  converterNames,
  errors,
  attribute,
  offsetGap,
  scrollableElement,
  contentsElement,
  isByScrollTop,
}) => {
  useEffect(() => {
    const keys = Object.keys(errors);
    if (keys.length > 0 && isSubmitting && !isValidating) {
      const convertedKey
        = (converterNames
          && converterNames.find(
            (item) =>
              (item.isArray && Array.isArray(errors[keys[0]]))
              || (!Array.isArray(errors[keys[0]]) && item.key === keys[0]),
          )?.value)
        || keys[0];
      console.log(convertedKey, errors[keys[0]]);
      const errorElement = document.querySelector(`[${attribute}=${convertedKey}]`);
      if (errorElement && errorElement.getBoundingClientRect()) {
        let offset
          = errorElement.getBoundingClientRect().top
          - contentsElement.getBoundingClientRect().top;
        if (isByScrollTop || contentsElement.scrollTop)
          offset
            = errorElement.getBoundingClientRect().top + contentsElement.scrollTop;
        scrollableElement.scrollTo({ top: offset - offsetGap, behavior: 'smooth' });
      }
    }
  }, [
    isSubmitting,
    isValidating,
    errors,
    attribute,
    offsetGap,
    scrollableElement,
    isByScrollTop,
    contentsElement,
    converterNames,
  ]);
  return null;
};

export default FormikErrorFocusComponent;

FormikErrorFocusComponent.prototype = {
  isSubmitting: PropTypes.bool.isRequired,
  isValidating: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  converterNames: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
      isArray: PropTypes.bool,
    }),
  ),
  scrollableElement: PropTypes.instanceOf(Element), // html element
  attribute: PropTypes.string,
  offsetGap: PropTypes.number,
  isByScrollTop: PropTypes.bool,
};

FormikErrorFocusComponent.defaultProps = {
  attribute: 'name',
  offsetGap: 78, // this gap to avoid header height (header is fixed)
  scrollableElement: window,
  contentsElement: document.body,
  isByScrollTop: false,
  converterNames: undefined,
};
