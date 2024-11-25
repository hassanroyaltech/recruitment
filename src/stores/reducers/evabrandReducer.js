/**
 * ----------------------------------------------------------------------------------
 * @title evabrandReducer.js
 * @author Yanal Kashou
 * ----------------------------------------------------------------------------------
 * Here we have the reducers defined for 'EVA-BRAND'.
 *
 * We use the types defined in evabrandTypes.js to designate the switch-case
 * statements.
 *
 * Each reducer will follow the architecture described below:
 *  - REQUEST: state
 *  - CANCEL: state
 *  - SUCCESS: ...state + payload
 *  - FAILURE: error
 *
 * To explain, if the type is a REQUEST, CANCEL, then the same state is
 * returned, however, if the type is a SUCCESS then the state is updated
 * with the payload. Finally, if it is a FAILURE, then the error as the payload.
 *
 * One of the things to note is that LOADING_STATES (isWorking, isSaving and
 * isDeleting) are updated in the reducer during the event. This removes the need for
 * manual loading state updates inside the modules.
 * ----------------------------------------------------------------------------------
 */

// Types
import {
  LOADING_STATES,
  CONTENT_LAYOUT_ORDER,
  APPEARANCE,
  ABOUT_US,
  PERKS,
  TESTIMONIALS,
  GALLERY,
  TEAM,
  CLIENTS,
  SOCIAL,
  SEO,
  SIGNUP_REQUIREMENTS,
  COLOR,
} from '../types/evabrandTypes';

// State Reset Types
import { RESET_STATE } from '../types/resetTypes';

/**
 * Define an Initial state for the reducer
 */
const INITIAL_STATE = {
  isWorking: false,
  isSaving: false,
  isDeleting: false,
  contentLayoutOrder: null,
  appearance: null,
  about_us: null,
  perks: null,
  testimonials: null,
  gallery: null,
  teams: null,
  clients: null,
  social: null,
  seo: null,
  signupRequirements: null,
  color: null,
};

/**
 * Reducer function for EVA-BRAND
 *
 * The following cases are sorted by the action they perform
 * in the order of suffixes (if present):
 *  - REQUEST
 *  - CANCEL
 *  - SUCCESS
 *  - FAILURE
 *
 * The reducer will switch between all the types defined in evabrandTypes.js
 *
 * @param state
 * @param action
 * @returns {
 * {testimonials: null, perks: null, contentLayoutOrder: *}|
 * {testimonials: null, perks: null, contentLayoutOrder: null}}
 */
export default function evabrandReducer(state = INITIAL_STATE, action) {
  // Switch between actions (types) and return the appropriate shard
  switch (action.type) {
  /**
     * [GET|SET] Loading states
     */
  case LOADING_STATES.GET.WORKING:
    return state;
  case LOADING_STATES.GET.SAVING:
    return state;
  case LOADING_STATES.GET.DELETING:
    return state;
  case LOADING_STATES.SET.WORKING:
    return {
      ...state,
      isWorking: action.payload,
    };
  case LOADING_STATES.SET.SAVING:
    return {
      ...state,
      isSaving: action.payload,
    };
  case LOADING_STATES.SET.DELETING:
    return {
      ...state,
      isDeleting: action.payload,
    };

    /**
     * [GET|EDIT] Content layout order
     */
  case CONTENT_LAYOUT_ORDER.GET.REQUEST:
    return state;
  case CONTENT_LAYOUT_ORDER.GET.CANCEL:
    return state;
  case CONTENT_LAYOUT_ORDER.GET.SUCCESS:
    return {
      ...state,
      contentLayoutOrder: action.payload,
    };
  case CONTENT_LAYOUT_ORDER.GET.FAILURE:
    return {
      ...state,
      contentLayoutOrder: null,
    };
  case CONTENT_LAYOUT_ORDER.EDIT.REQUEST:
    return state;
  case CONTENT_LAYOUT_ORDER.EDIT.CANCEL:
    return state;
  case CONTENT_LAYOUT_ORDER.EDIT.SUCCESS:
    return {
      ...state,
      contentLayoutOrder: action.payload,
    };
  case CONTENT_LAYOUT_ORDER.EDIT.FAILURE:
    return {
      ...state,
      contentLayoutOrder: null,
    };

    /**
     * [GET|EDIT] Appearance
     */
  case APPEARANCE.GET.REQUEST:
    return state;
  case APPEARANCE.GET.CANCEL:
    return state;
  case APPEARANCE.GET.SUCCESS:
    return {
      ...state,
      appearance: action.payload,
    };
  case APPEARANCE.GET.FAILURE:
    return {
      ...state,
      appearance: null,
    };
  case APPEARANCE.EDIT.REQUEST:
    return state;
  case APPEARANCE.EDIT.CANCEL:
    return state;
  case APPEARANCE.EDIT.SUCCESS:
    return {
      ...state,
      appearance: action.payload,
    };
  case APPEARANCE.EDIT.FAILURE:
    return {
      ...state,
      appearance: null,
    };

    /**
     * [GET|EDIT] About Us
     */
  case ABOUT_US.GET.REQUEST:
    return state;
  case ABOUT_US.GET.CANCEL:
    return state;
  case ABOUT_US.GET.SUCCESS:
    return {
      ...state,
      about_us: action.payload,
    };
  case ABOUT_US.GET.FAILURE:
    return {
      ...state,
      about_us: null,
    };
  case ABOUT_US.EDIT.REQUEST:
    return state;
  case ABOUT_US.EDIT.CANCEL:
    return state;
  case ABOUT_US.EDIT.SUCCESS:
    return {
      ...state,
      about_us: action.payload,
    };
  case ABOUT_US.EDIT.FAILURE:
    return {
      ...state,
      about_us: null,
    };

    /**
     * [GET|EDIT] Perks
     */
  case PERKS.GET.REQUEST:
    return state;
  case PERKS.GET.CANCEL:
    return state;
  case PERKS.GET.SUCCESS:
    return {
      ...state,
      perks: action.payload,
    };
  case PERKS.GET.FAILURE:
    return {
      ...state,
      perks: null,
    };
  case PERKS.EDIT.REQUEST:
    return state;
  case PERKS.EDIT.CANCEL:
    return state;
  case PERKS.EDIT.SUCCESS:
    return {
      ...state,
      perks: action.payload,
    };
  case PERKS.EDIT.FAILURE:
    return {
      ...state,
      perks: null,
    };

    /**
     * [GET|EDIT|DELETE|SET] Testimonials
     */
  case TESTIMONIALS.GET.REQUEST:
    return {
      ...state,
      isWorking: true,
    };
  case TESTIMONIALS.GET.CANCEL:
    return {
      ...state,
      isWorking: false,
    };
  case TESTIMONIALS.GET.SUCCESS:
    return {
      ...state,
      testimonials: action.payload,
      isWorking: false,
    };
  case TESTIMONIALS.GET.FAILURE:
    return {
      ...state,
      testimonials: null,
      isWorking: false,
    };
  case TESTIMONIALS.EDIT.REQUEST:
    return {
      ...state,
      isWorking: true,
      isSaving: true,
    };
  case TESTIMONIALS.EDIT.CANCEL:
    return {
      ...state,
      // isWorking: false,
      // isSaving: false,
    };
  case TESTIMONIALS.EDIT.SUCCESS:
    return {
      ...state,
      testimonials: action.payload,
      isWorking: false,
      isSaving: false,
    };
  case TESTIMONIALS.EDIT.FAILURE:
    return {
      ...state,
      testimonials: action.payload,
      isWorking: false,
      isSaving: false,
    };
  case TESTIMONIALS.DELETE.REQUEST:
    return {
      ...state,
      isDeleting: true,
      isWorking: true,
    };
  case TESTIMONIALS.DELETE.CANCEL:
    return {
      ...state,
      isWorking: false,
      // isSaving: false,
    };
  case TESTIMONIALS.DELETE.SUCCESS:
    return {
      ...state,
      testimonials: action.payload,
      isDeleting: false,
      isWorking: false,
    };
  case TESTIMONIALS.DELETE.FAILURE:
    return {
      ...state,
      testimonials: action.payload,
      isDeleting: false,
      isWorking: false,
    };
  case TESTIMONIALS.SET:
    return {
      ...state,
      testimonials: action.payload,
    };

    /**
     * [GET|EDIT] Gallery
     */
  case GALLERY.GET.REQUEST:
    return state;
  case GALLERY.GET.CANCEL:
    return state;
  case GALLERY.GET.SUCCESS:
    return {
      ...state,
      gallery: action.payload,
    };
  case GALLERY.GET.FAILURE:
    return {
      ...state,
      gallery: null,
    };
  case GALLERY.EDIT.REQUEST:
    return state;
  case GALLERY.EDIT.CANCEL:
    return state;
  case GALLERY.EDIT.SUCCESS:
    return {
      ...state,
      gallery: action.payload,
    };
  case GALLERY.EDIT.FAILURE:
    return {
      ...state,
      gallery: null,
    };

    /**
     * [GET|EDIT] TEAM
     */
  case TEAM.GET.REQUEST:
    return state;
  case TEAM.GET.CANCEL:
    return state;
  case TEAM.GET.SUCCESS:
    return {
      ...state,
      team: action.payload,
    };
  case TEAM.GET.FAILURE:
    return {
      ...state,
      team: null,
    };
  case TEAM.EDIT.REQUEST:
    return state;
  case TEAM.EDIT.CANCEL:
    return state;
  case TEAM.EDIT.SUCCESS:
    return {
      ...state,
      team: action.payload,
    };
  case TEAM.EDIT.FAILURE:
    return {
      ...state,
      team: null,
    };

    /**
     * [GET|EDIT] CLIENTS
     */
  case CLIENTS.GET.REQUEST:
    return state;
  case CLIENTS.GET.CANCEL:
    return state;
  case CLIENTS.GET.SUCCESS:
    return {
      ...state,
      clients: action.payload,
    };
  case CLIENTS.GET.FAILURE:
    return {
      ...state,
      clients: null,
    };
  case CLIENTS.EDIT.REQUEST:
    return state;
  case CLIENTS.EDIT.CANCEL:
    return state;
  case CLIENTS.EDIT.SUCCESS:
    return {
      ...state,
      clients: action.payload,
    };
  case CLIENTS.EDIT.FAILURE:
    return {
      ...state,
      clients: null,
    };

    /**
     * [GET|EDIT] SOCIAL
     */
  case SOCIAL.GET.REQUEST:
    return state;
  case SOCIAL.GET.CANCEL:
    return state;
  case SOCIAL.GET.SUCCESS:
    return {
      ...state,
      social: action.payload,
    };
  case SOCIAL.GET.FAILURE:
    return {
      ...state,
      social: null,
    };
  case SOCIAL.EDIT.REQUEST:
    return state;
  case SOCIAL.EDIT.CANCEL:
    return state;
  case SOCIAL.EDIT.SUCCESS:
    return {
      ...state,
      social: action.payload,
    };
  case SOCIAL.EDIT.FAILURE:
    return {
      ...state,
      social: null,
    };

    /**
     * [GET|EDIT] SEO
     */
  case SEO.GET.REQUEST:
    return state;
  case SEO.GET.CANCEL:
    return state;
  case SEO.GET.SUCCESS:
    return {
      ...state,
      seo: action.payload,
    };
  case SEO.GET.FAILURE:
    return {
      ...state,
      seo: null,
    };
  case SEO.EDIT.REQUEST:
    return state;
  case SEO.EDIT.CANCEL:
    return state;
  case SEO.EDIT.SUCCESS:
    return {
      ...state,
      seo: action.payload,
    };
  case SEO.EDIT.FAILURE:
    return {
      ...state,
      seo: null,
    };

    /**
     * [GET|EDIT] SIGNUP REQUIREMENTS
     */
  case SIGNUP_REQUIREMENTS.GET.REQUEST:
    return state;
  case SIGNUP_REQUIREMENTS.GET.CANCEL:
    return state;
  case SIGNUP_REQUIREMENTS.GET.SUCCESS:
    return {
      ...state,
      signupRequirements: action.payload,
    };
  case SIGNUP_REQUIREMENTS.GET.FAILURE:
    return {
      ...state,
      signupRequirements: null,
    };
  case SIGNUP_REQUIREMENTS.EDIT.REQUEST:
    return state;
  case SIGNUP_REQUIREMENTS.EDIT.CANCEL:
    return state;
  case SIGNUP_REQUIREMENTS.EDIT.SUCCESS:
    return {
      ...state,
      signupRequirements: action.payload,
    };
  case SIGNUP_REQUIREMENTS.EDIT.FAILURE:
    return {
      ...state,
      signupRequirements: null,
    };

    /**
     * [GET|EDIT] COLOR
     */
  case COLOR.GET.REQUEST:
    return state;
  case COLOR.GET.CANCEL:
    return state;
  case COLOR.GET.SUCCESS:
    return {
      ...state,
      color: action.payload,
    };
  case COLOR.GET.FAILURE:
    return {
      ...state,
      color: null,
    };
  case COLOR.EDIT.REQUEST:
    return state;
  case COLOR.EDIT.CANCEL:
    return state;
  case COLOR.EDIT.SUCCESS:
    return {
      ...state,
      color: action.payload,
    };
  case COLOR.EDIT.FAILURE:
    return {
      ...state,
      color: null,
    };

    /**
     * [RESET]
     * - Content layout order
     * - Appearance
     * - About Us
     * - Perks
     * - Testimonials
     * - Gallery
     * - Teams
     * - Clients
     * - Social
     * - SEO
     * - Signup requirements
     * - Color
     */
  case RESET_STATE.EVABRAND.CONTENT_LAYOUT_ORDER:
    return {
      ...state,
      contentLayoutOrder: null,
    };
  case RESET_STATE.EVABRAND.APPEARANCE:
    return {
      ...state,
      appearance: null,
    };
  case RESET_STATE.EVABRAND.ABOUT_US:
    return {
      ...state,
      about_us: null,
    };
  case RESET_STATE.EVABRAND.PERKS:
    return {
      ...state,
      perks: null,
    };
  case RESET_STATE.EVABRAND.TESTIMONIALS:
    return {
      ...state,
      testimonials: null,
    };
  case RESET_STATE.EVABRAND.GALLERY:
    return {
      ...state,
      gallery: null,
    };
  case RESET_STATE.EVABRAND.TEAM:
    return {
      ...state,
      team: null,
    };
  case RESET_STATE.EVABRAND.CLIENTS:
    return {
      ...state,
      clients: null,
    };
  case RESET_STATE.EVABRAND.SOCIAL:
    return {
      ...state,
      social: null,
    };
  case RESET_STATE.EVABRAND.SEO:
    return {
      ...state,
      seo: null,
    };
  case RESET_STATE.EVABRAND.SIGNUP_REQUIREMENTS:
    return {
      ...state,
      signupRequirements: null,
    };
  case RESET_STATE.EVABRAND.COLOR:
    return {
      ...state,
      color: null,
    };
  default:
    return state;
  }
}
