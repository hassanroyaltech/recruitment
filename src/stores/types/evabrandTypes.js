/**
 * ----------------------------------------------------------------------------------
 * @title evabrandTypes.js
 * @author Yanal Kashou
 * ----------------------------------------------------------------------------------
 * Here we have all the Redux action 'types' defined for 'EVA-BRAND'.
 *
 * It is important to note that we only have GET, EDIT, SET and DELETE variations,
 * each with a REQUEST, SUCCESS, FAILURE and CANCEL suffix.
 *
 * The 'GET' variation is about obtaining data and loading it into the state.
 * The 'EDIT' variation encompasses updates.
 * The 'DELETE' variation deals with deletions.
 * The 'SET' variation is reserved for local updates, and not API-
 * related state updates.
 * ----------------------------------------------------------------------------------
 */

/**
 * LOADING Types
 */
export const LOADING_STATES = {
  GET: {
    SAVING: 'GET_SAVING_STATE',
    WORKING: 'GET_WORKING_STATE',
    DELETING: 'GET_DELETING_STATE',
  },
  SET: {
    SAVING: 'SET_SAVING_STATE',
    WORKING: 'SET_WORKING_STATE',
    DELETING: 'SET_DELETING_STATE',
  },
};

/**
 * CONTENT_LAYOUT_ORDER Types
 */
export const CONTENT_LAYOUT_ORDER = {
  GET: {
    REQUEST: 'GET_CONTENT_LAYOUT_ORDER_REQUEST',
    SUCCESS: 'GET_CONTENT_LAYOUT_ORDER_SUCCESS',
    FAILURE: 'GET_CONTENT_LAYOUT_ORDER_FAILURE',
    CANCEL: 'GET_CONTENT_LAYOUT_ORDER_CANCEL',
  },
  EDIT: {
    REQUEST: 'EDIT_CONTENT_LAYOUT_ORDER_REQUEST',
    SUCCESS: 'EDIT_CONTENT_LAYOUT_ORDER_SUCCESS',
    FAILURE: 'EDIT_CONTENT_LAYOUT_ORDER_FAILURE',
    CANCEL: 'EDIT_CONTENT_LAYOUT_ORDER_CANCEL',
  },
};

/**
 * APPEARANCE Types
 */
export const APPEARANCE = {
  GET: {
    REQUEST: 'GET_APPEARANCE_REQUEST',
    SUCCESS: 'GET_APPEARANCE_SUCCESS',
    FAILURE: 'GET_APPEARANCE_FAILURE',
    CANCEL: 'GET_APPEARANCE_CANCEL',
  },
  EDIT: {
    REQUEST: 'EDIT_APPEARANCE_REQUEST',
    SUCCESS: 'EDIT_APPEARANCE_SUCCESS',
    FAILURE: 'EDIT_APPEARANCE_FAILURE',
    CANCEL: 'EDIT_APPEARANCE_CANCEL',
  },
};

/**
 * ABOUT US Types
 */
export const ABOUT_US = {
  GET: {
    REQUEST: 'GET_ABOUT_US_REQUEST',
    SUCCESS: 'GET_ABOUT_US_SUCCESS',
    FAILURE: 'GET_ABOUT_US_FAILURE',
    CANCEL: 'GET_ABOUT_US_CANCEL',
  },
  EDIT: {
    REQUEST: 'EDIT_ABOUT_US_REQUEST',
    SUCCESS: 'EDIT_ABOUT_US_SUCCESS',
    FAILURE: 'EDIT_ABOUT_US_FAILURE',
    CANCEL: 'EDIT_ABOUT_US_CANCEL',
  },
};

/**
 * PERKS Types
 */
export const PERKS = {
  GET: {
    REQUEST: 'GET_PERKS_REQUEST',
    SUCCESS: 'GET_PERKS_SUCCESS',
    FAILURE: 'GET_PERKS_FAILURE',
    CANCEL: 'GET_PERKS_CANCEL',
  },
  EDIT: {
    REQUEST: 'EDIT_PERKS_REQUEST',
    SUCCESS: 'EDIT_PERKS_SUCCESS',
    FAILURE: 'EDIT_PERKS_FAILURE',
    CANCEL: 'EDIT_PERKS_CANCEL',
  },
};

/**
 * TESTIMONIALS Types
 */
export const TESTIMONIALS = {
  SET: 'SET_TESTIMONIALS',
  GET: {
    REQUEST: 'GET_TESTIMONIALS_REQUEST',
    SUCCESS: 'GET_TESTIMONIALS_SUCCESS',
    FAILURE: 'GET_TESTIMONIALS_FAILURE',
    CANCEL: 'GET_TESTIMONIALS_CANCEL',
  },
  EDIT: {
    REQUEST: 'EDIT_TESTIMONIALS_REQUEST',
    SUCCESS: 'EDIT_TESTIMONIALS_SUCCESS',
    FAILURE: 'EDIT_TESTIMONIALS_FAILURE',
    CANCEL: 'EDIT_TESTIMONIALS_CANCEL',
  },
  DELETE: {
    REQUEST: 'DELETE_TESTIMONIALS_REQUEST',
    SUCCESS: 'DELETE_TESTIMONIALS_SUCCESS',
    FAILURE: 'DELETE_TESTIMONIALS_FAILURE',
    CANCEL: 'DELETE_TESTIMONIALS_CANCEL',
  },
};

/**
 * TESTIMONIALS Types
 */
export const GALLERY = {
  GET: {
    REQUEST: 'GET_GALLERY_REQUEST',
    SUCCESS: 'GET_GALLERY_SUCCESS',
    FAILURE: 'GET_GALLERY_FAILURE',
    CANCEL: 'GET_GALLERY_CANCEL',
  },
  EDIT: {
    REQUEST: 'EDIT_GALLERY_REQUEST',
    SUCCESS: 'EDIT_GALLERY_SUCCESS',
    FAILURE: 'EDIT_GALLERY_FAILURE',
    CANCEL: 'EDIT_GALLERY_CANCEL',
  },
};

/**
 * TEAM Types
 */
export const TEAM = {
  GET: {
    REQUEST: 'GET_TEAM_REQUEST',
    SUCCESS: 'GET_TEAM_SUCCESS',
    FAILURE: 'GET_TEAM_FAILURE',
    CANCEL: 'GET_TEAM_CANCEL',
  },
  EDIT: {
    REQUEST: 'EDIT_TEAM_REQUEST',
    SUCCESS: 'EDIT_TEAM_SUCCESS',
    FAILURE: 'EDIT_TEAM_FAILURE',
    CANCEL: 'EDIT_TEAM_CANCEL',
  },
};

/**
 * CLIENTS Types
 */
export const CLIENTS = {
  GET: {
    REQUEST: 'GET_CLIENTS_REQUEST',
    SUCCESS: 'GET_CLIENTS_SUCCESS',
    FAILURE: 'GET_CLIENTS_FAILURE',
    CANCEL: 'GET_CLIENTS_CANCEL',
  },
  EDIT: {
    REQUEST: 'EDIT_CLIENTS_REQUEST',
    SUCCESS: 'EDIT_CLIENTS_SUCCESS',
    FAILURE: 'EDIT_CLIENTS_FAILURE',
    CANCEL: 'EDIT_CLIENTS_CANCEL',
  },
};

/**
 * SOCIAL Types
 */
export const SOCIAL = {
  GET: {
    REQUEST: 'GET_SOCIAL_REQUEST',
    SUCCESS: 'GET_SOCIAL_SUCCESS',
    FAILURE: 'GET_SOCIAL_FAILURE',
    CANCEL: 'GET_SOCIAL_CANCEL',
  },
  EDIT: {
    REQUEST: 'EDIT_SOCIAL_REQUEST',
    SUCCESS: 'EDIT_SOCIAL_SUCCESS',
    FAILURE: 'EDIT_SOCIAL_FAILURE',
    CANCEL: 'EDIT_SOCIAL_CANCEL',
  },
};

/**
 * SEO Types
 */
export const SEO = {
  GET: {
    REQUEST: 'GET_SEO_REQUEST',
    SUCCESS: 'GET_SEO_SUCCESS',
    FAILURE: 'GET_SEO_FAILURE',
    CANCEL: 'GET_SEO_CANCEL',
  },
  EDIT: {
    REQUEST: 'EDIT_SEO_REQUEST',
    SUCCESS: 'EDIT_SEO_REQUEST',
    FAILURE: 'EDIT_SEO_FAILURE',
    CANCEL: 'EDIT_SEO_CANCEL',
  },
};

/**
 * SIGNUP REQUIREMENTS Types
 */
export const SIGNUP_REQUIREMENTS = {
  GET: {
    REQUEST: 'GET_SIGNUP_REQUIREMENTS_REQUEST',
    SUCCESS: 'GET_SIGNUP_REQUIREMENTS_SUCCESS',
    FAILURE: 'GET_SIGNUP_REQUIREMENTS_FAILURE',
    CANCEL: 'GET_SIGNUP_REQUIREMENTS_CANCEL',
  },
  EDIT: {
    REQUEST: 'EDIT_SIGNUP_REQUIREMENTS_REQUEST',
    SUCCESS: 'EDIT_SIGNUP_REQUIREMENTS_SUCCESS',
    FAILURE: 'EDIT_SIGNUP_REQUIREMENTS_FAILURE',
    CANCEL: 'EDIT_SIGNUP_REQUIREMENTS_CANCEL',
  },
};

/**
 * COLOR Types
 */
export const COLOR = {
  GET: {
    REQUEST: 'GET_COLOR_REQUEST',
    SUCCESS: 'GET_COLOR_SUCCESS',
    FAILURE: 'GET_COLOR_FAILURE',
    CANCEL: 'GET_COLOR_CANCEL',
  },
  EDIT: {
    REQUEST: 'EDIT_COLOR_REQUEST',
    SUCCESS: 'EDIT_COLOR_SUCCESS',
    FAILURE: 'EDIT_COLOR_FAILURE',
    CANCEL: 'EDIT_COLOR_CANCEL',
  },
};
