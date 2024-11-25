/**
 * ----------------------------------------------------------------------------------
 * @title evabrandActions.js
 * @author Yanal Kashou
 * ----------------------------------------------------------------------------------
 * evabrandActions.js
 * Contains all Redux actions related to evabrand
 * Currently available:
 *  - resetState
 *  - getContentLayoutOrder
 *  - updateContentLayoutOrder
 *  - getAppearance
 *  - updateAppearance
 *  - getPerks
 *  - getTestimonials
 *  - updateTestimonialsInformation
 *  - deleteTestimonials
 * ----------------------------------------------------------------------------------
 */

// Import custom redux types
import { evabrandAPI } from '../../api/evabrand';

// mutateTestimonials
import { mutateTestimonials } from '../../utils/functions/mutators';

// Types
import {
  CONTENT_LAYOUT_ORDER,
  APPEARANCE,
  PERKS,
  TESTIMONIALS,
} from '../types/evabrandTypes';

// RESET TYPES
import { RESET_STATE } from '../types/resetTypes';

/**
 * Dispatcher function to reset states
 *
 * Expects a title-cased type:
 *  - 'CONTENT_LAYOUT_ORDER'
 *  - 'APPEARANCE'
 *  - 'PERKS'
 *  - 'TESTIMONIALS'
 *
 * @returns {function(*): Promise<void>}
 * @param type
 */
export function resetState(type) {
  return async (dispatch) => {
    dispatch({
      type: RESET_STATE.EVABRAND[type],
    });
  };
}

/**
 * Dispatcher function to get the content layout order
 * @returns {function(*): Promise<void>}
 */
export function getContentLayoutOrder(languageId) {
  return async (dispatch) => {
    // Make request
    dispatch({
      type: CONTENT_LAYOUT_ORDER.GET.REQUEST,
    });
    evabrandAPI
      .getContentLayoutOrder(languageId)
      .then((response) => {
        // Store results
        const { results } = response.data;
        // Request is successful
        dispatch({
          type: CONTENT_LAYOUT_ORDER.GET.SUCCESS,
          payload: results,
        });
        return results;
      })
      .catch(() => {
        // Request fails
        dispatch({
          type: CONTENT_LAYOUT_ORDER.GET.FAILURE,
        });
        return null;
      });
  };
}

/**
 * Dispatcher function to update the content layout order
 * @param sections
 * @returns {function(*): Promise<void>}
 */
export function updateContentLayoutOrder(language_id, sections) {
  return async (dispatch) => {
    // Make request
    dispatch({
      type: CONTENT_LAYOUT_ORDER.EDIT.REQUEST,
    });
    evabrandAPI
      .updateContentLayoutOrder(language_id, sections)
      .then((response) => {
        // Store results
        const { results } = response.data;
        // Request is successful
        dispatch({
          type: CONTENT_LAYOUT_ORDER.EDIT.SUCCESS,
          payload: results,
        });
        return results;
      })
      .catch(() => {
        // Request fails
        dispatch({
          type: CONTENT_LAYOUT_ORDER.EDIT.FAILURE,
        });
        return null;
      });
  };
}

/**
 * Dispatcher function to get the appearance data
 * @param languageId
 * @returns {function(*): Promise<void>}
 */
export function getAppearance(languageId) {
  return async (dispatch) => {
    // Make request
    dispatch({
      type: APPEARANCE.GET.REQUEST,
    });
    evabrandAPI
      .getAppearance(languageId)
      .then((response) => {
        // Store results
        const { results } = response.data;
        // Request is successful
        dispatch({
          type: APPEARANCE.GET.SUCCESS,
          payload: results,
        });
        return results;
      })
      .catch(() => {
        // Request fails
        dispatch({
          type: APPEARANCE.GET.FAILURE,
        });
        return null;
      });
  };
}

/**
 * Dispatcher function to get the appearance data
 * @param languageId
 * @param data
 * @returns {function(*): Promise<void>}
 */
export function updateAppearance(languageId, data) {
  return async (dispatch) => {
    // Make request
    dispatch({
      type: APPEARANCE.EDIT.REQUEST,
    });
    evabrandAPI
      .updateAppearance(languageId, data)
      .then((response) => {
        // Store results
        const { results } = response.data;
        // Request is successful
        dispatch({
          type: APPEARANCE.EDIT.SUCCESS,
          payload: results,
        });
        return results;
      })
      .catch(() => {
        // Request fails
        dispatch({
          type: APPEARANCE.EDIT.FAILURE,
        });
        return null;
      });
  };
}

/**
 * Dispatcher function to get the perks
 * @param languageId
 * @returns {function(*): Promise<void>}
 */
export function getPerks(languageId) {
  return async (dispatch) => {
    dispatch({
      type: PERKS.GET.REQUEST,
    });
    evabrandAPI
      .getPerks(languageId)
      .then((response) => {
        // Store results
        const { results } = response.data;
        // Request is successful
        dispatch({
          type: PERKS.GET.SUCCESS,
          payload: results,
        });
        return results;
      })
      .catch(() => {
        // Request fails
        dispatch({
          type: PERKS.GET.FAILURE,
        });
        return null;
      });
  };
}

/**
 * Dispatcher function to get the testimonials
 * @param languageId
 * @returns {function(*): Promise<void>}
 */
export function getTestimonials(languageId) {
  return async (dispatch) => {
    dispatch({
      type: TESTIMONIALS.GET.REQUEST,
    });
    evabrandAPI
      .getTestimonials(languageId)
      .then((response) => {
        // Store results
        const { results } = response.data;

        // Request is successful
        dispatch({
          type: TESTIMONIALS.GET.SUCCESS,
          payload: {
            api: results,
            mutation: mutateTestimonials(results.testimonial),
          },
        });
        return {
          api: results,
          mutation: mutateTestimonials(results.testimonial),
        };
      })
      .catch(() => {
        // Request fails
        dispatch({
          type: TESTIMONIALS.GET.FAILURE,
        });
        return null;
      });
  };
}

/**
 * Dispatcher function to set testimonials state
 * @param data
 * @returns {function(*): Promise<void>}
 */
export function setTestimonials(data) {
  return async (dispatch) => {
    dispatch({
      type: TESTIMONIALS.SET,
    });
    return data;
  };
}

/**
 * Dispatcher function to update testimonial information
 * @param languageId
 * @param data
 * @returns {function(*): Promise<void>}
 */
export function updateTestimonialsInformation(languageId, data) {
  return async (dispatch) => {
    dispatch({
      type: TESTIMONIALS.EDIT.REQUEST,
    });
    evabrandAPI
      .updateTestimonialsInformation(languageId, data)
      .then((response) => {
        // Store results
        const { results } = response.data;
        // Request is successful
        dispatch({
          type: TESTIMONIALS.EDIT.SUCCESS,
          payload: {
            api: results,
            mutation: mutateTestimonials(results.testimonial),
          },
        });
        return {
          api: results,
          mutation: mutateTestimonials(results.testimonial),
        };
      })
      .catch(() => {
        // Request fails
        dispatch({
          type: TESTIMONIALS.EDIT.FAILURE,
        });
        return null;
      });
  };
}

/**
 * Dispatcher function to update testimonials
 * @param languageId
 * @param data
 * @returns {function(*): Promise<void>}
 */
export function updateTestimonials(languageId, data) {
  return async (dispatch) => {
    dispatch({
      type: TESTIMONIALS.EDIT.REQUEST,
    });
    evabrandAPI
      .updateTestimonials(languageId, data)
      .then((response) => {
        // Store results
        const { results } = response.data;
        // Request is successful
        dispatch({
          type: TESTIMONIALS.EDIT.SUCCESS,
          payload: {
            api: results,
            mutation: mutateTestimonials(results.testimonial),
          },
        });
        return {
          api: results,
          mutation: mutateTestimonials(results.testimonial),
        };
      })
      .catch(() => {
        // Request fails
        dispatch({
          type: TESTIMONIALS.EDIT.FAILURE,
        });
        return null;
      });
  };
}

/**
 * Dispatcher function to delete a testimonial
 * @param languageId
 * @param uuid
 * @returns {function(*): Promise<void>}
 */
export function deleteTestimonials(languageId, uuid) {
  return async (dispatch) => {
    dispatch({
      type: TESTIMONIALS.DELETE.REQUEST,
    });
    evabrandAPI
      .deleteTestimonials(languageId, uuid)
      .then((response) => {
        // Store results
        const { results } = response.data;
        // Request is successful
        dispatch({
          type: TESTIMONIALS.DELETE.SUCCESS,
          payload: {
            api: results,
            mutation: mutateTestimonials(results.testimonial),
          },
        });
        return {
          api: results,
          mutation: mutateTestimonials(results.testimonial),
        };
      })
      .catch((error) => {
        // Request fails
        dispatch({
          type: TESTIMONIALS.DELETE.FAILURE,
          payload: error?.response?.data?.errors,
        });
        return error?.response?.data?.errors;
      });
  };
}
