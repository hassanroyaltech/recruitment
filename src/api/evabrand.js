/** evabrand.js
 * API service containing all APIs that are used in EVA-SSESS.
 *
 * @example
 * import { evabrandAPI } from 'api/evabrand';
 *
 * @example
 * evabrandAPI.getAboutUs(languageId);
 */

// Headers
import { generateHeaders } from 'api/headers';

// URLs
import urls from 'api/urls';

// Axios
import axios from 'api/middleware';

/**
 * Obtains the about us section based on the language
 * @param languageId
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getAboutUs(languageId) {
  return axios
    .get(urls.evabrand.about_us_GET, {
      params: {
        language_id: languageId,
      },
      headers: generateHeaders(),
    });
}

/**
 * Update information header for the 'About Us' section
 * @param languageId
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateAboutUsInformation(languageId, data) {
  return axios
    .put(
      urls.evabrand.information_about_us,
      {
        language_id: languageId,
        ...data.information,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Update the body for the 'About Us' section
 * @param languageId
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateAboutUs(languageId, data) {
  return axios
    .put(
      urls.evabrand.about_us_WRITE,
      {
        language_id: languageId,
        description: data.about_us.description,
        ...data.about_us,
        marketing_video_type: data.about_us.marketing_video_type === ''
        || data.about_us.marketing_video_type === 'None'
          ? null
          : data.about_us.marketing_video_type,
        marketing_video:
                    data.about_us.marketing_video_type === 'upload'
                    || data.about_us.marketing_video_type === 'None'
                      ? null
                      : data.about_us.marketing_video,
        video_uuid: data.about_us.marketing_video_type === 'upload' ? data.about_us.video_uuid?.uuid : null,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Get list of clients
 * @param languageId
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getClients(languageId) {
  return axios
    .get(urls.evabrand.client_GET, {
      params: {
        language_id: languageId,
      },
      headers: generateHeaders(),
    });
}

/**
 * Update 'Clients' header
 * @param languageId
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateClientsInformation(languageId, data) {
  return axios
    .put(
      urls.evabrand.information_client,
      {
        ...data,
        language_id: languageId,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Add clients
 * @param languageId
 * @param file
 * @returns {Promise<AxiosResponse<any>>}
 */
async function addClient(languageId, file) {
  return axios
    .put(
      urls.evabrand.client_WRITE,
      {
        image_uuid: file.uuid,
        language_id: languageId,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Delete Clients
 * @param languageId
 * @param uuid
 * @returns {Promise<AxiosResponse<any>>}
 */
async function deleteClients(languageId, uuid) {
  return axios
    .delete(
      urls.evabrand.client_WRITE,

      {
        params: {
          uuid,
          language_id: languageId,
        },
        headers: generateHeaders(),
      },
    );
}

/**
 * Get the information for the 'Appearance' section
 * @param languageId
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getAppearance(languageId) {
  return axios
    .get(urls.evabrand.appearance_GET, {
      params: {
        hero_background_image_uuid: null,
        language_id: languageId,
      },
      headers: generateHeaders(),
    });
}

/**
 * Update the appearance section
 * @param languageId
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateAppearance(languageId, data) {
  return axios
    .put(
      urls.evabrand.appearance_WRITE,
      {
        ...data,
        language_id: languageId,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Get social media links
 * @param languageId
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getSocial(languageId) {
  return axios
    .get(urls.evabrand.social_GET, {
      params: {
        language_id: languageId,
      },
      headers: generateHeaders(),
    });
}

/**
 * Update social media links
 * @param languageId
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateSocial(languageId, data) {
  return axios
    .put(
      urls.evabrand.social_WRITE,
      {
        ...data,
        language_id: languageId,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Update social media header
 * @param languageId
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateSocialInformation(languageId, data) {
  return axios
    .put(
      urls.evabrand.information_social,
      {
        section_title: data.header,
        section_description: data.sub_header,
        language_id: languageId,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Get the 'Gallery' section
 * @param languageId
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getGallery(languageId) {
  return axios
    .get(urls.evabrand.gallery_GET, {
      params: {
        language_id: languageId,
      },
      headers: generateHeaders(),
    });
}

/**
 * Add files (images) to the 'Gallery' section
 * @param languageId
 * @param file
 * @returns {Promise<AxiosResponse<any>>}
 */
async function addGallery(languageId, file) {
  return axios
    .put(
      urls.evabrand.gallery_WRITE,
      {
        image_uuid: file.uuid,
        language_id: languageId,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Update the 'Gallery' section header
 * @param languageId
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateGalleryInformation(languageId, data) {
  return axios
    .put(
      urls.evabrand.information_gallery,
      {
        section_title: data.section_title,
        section_description: data.section_description,
        language_id: languageId,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Delete Gallery items
 * @param languageId
 * @param uuid
 * @returns {Promise<AxiosResponse<any>>}
 */
async function deleteGallery(languageId, uuid) {
  return axios
    .delete(
      urls.evabrand.gallery_WRITE,
      {
        params: {
          uuid,
          language_id: languageId,
        },

        headers: generateHeaders(),
      },
    );
}

/**
 * Get the list of perks
 * @param languageId
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getPerks(languageId) {
  return axios
    .get(urls.evabrand.perks_GET, {
      params: {
        language_id: languageId,
      },
      headers: generateHeaders(),
    });
}

/**
 * Update the list of perks with a title and icon
 * @param languageId
 * @param title
 * @param icon
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updatePerks(languageId, title, icon, desc) {
  return axios
    .put(
      urls.evabrand.perks_WRITE,
      {
        title,
        icon,
        language_id: languageId,
        description: desc,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Update the 'Perks' header
 * @param languageId
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updatePerksInformation(languageId, data) {
  return axios
    .put(
      urls.evabrand.information_perks,
      {
        section_title: data.section_title,
        section_description: data.section_description,
        language_id: languageId,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Delete a perk
 * @param languageId
 * @param uuid
 * @returns {Promise<AxiosResponse<any>>}
 */
async function deletePerks(languageId, uuid) {
  return axios
    .delete(
      urls.evabrand.perks_WRITE,
      {
        params: {
          uuid,
          language_id: languageId,
        },
        headers: generateHeaders(),
      },
    );
}

/**
 * Get testimonials
 * @param languageId
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getTestimonials(languageId) {
  return axios
    .get(urls.evabrand.testimonial_GET, {
      params: {
        language_id: languageId,
      },
      headers: generateHeaders(),
    });
}

/**
 * Update testimonials information
 * @param languageId
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateTestimonialsInformation(languageId, data) {
  return axios
    .put(
      urls.evabrand.information_testimonial,
      {
        ...data,
        image_uuid: data.image_uuid?.uuid,
        language_id: languageId,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Update testimonials
 * @param languageId
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateTestimonials(languageId, data) {
  return axios
    .put(
      urls.evabrand.testimonial_WRITE,
      {
        ...data,
        language_id: languageId,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Delete a testimonial
 * @param languageId
 * @param uuid
 * @returns {Promise<AxiosResponse<any>>}
 */
async function deleteTestimonials(languageId, uuid) {
  return axios
    .delete(
      urls.evabrand.testimonial_WRITE,
      {
        params: {
          uuid,
          language_id: languageId,
        },
        headers: generateHeaders(),
      },
    );
}

/**
 * Get SEO configuration
 * @param languageId
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getSeo(languageId) {
  return axios
    .get(urls.evabrand.seo_homepage_GET, {
      params: {
        language_id: languageId,
      },
      headers: generateHeaders(),
    });
}

/**
 * Update SEO configuration
 * @param languageId
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateSeo(languageId, data) {
  return axios
    .put(
      urls.evabrand.seo_homepage_WRITE,
      {
        ...data,
        image_uuid: data.image_uuid?.uuid,
        language_id: languageId,
      },
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Get the profile builder requirements
 * @param languageId
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getSignUpProfileBuilder(languageId) {
  if (!languageId) 
    // eslint-disable-next-line no-param-reassign
    languageId = JSON.parse(localStorage.getItem('user'))?.results?.language.filter(
      (lang) => lang.code === 'en',
    )[0].id;
  
  return axios
    .get(urls.company.SignUpProfileBuilder, {
      params: {
        language_uuid: languageId,
      },
      headers: generateHeaders(),
    });
}

/**
 * Update requiremends for the profile builder
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateSignupProfileBuilder(data) {
  if (!data.language_uuid) 
    // eslint-disable-next-line no-param-reassign
    data.language_uuid = JSON.parse(localStorage.getItem('user'))?.results?.language?.filter(
      (lang) => lang.code === 'en',
    )[0].id;
  
  return axios
    .put(
      urls.company.profileBuilderWRITE,
      data,
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Get the signup questionnaire (if defined)
 * @param languageId
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getSignUpQuestionnaire(languageId) {
  if (!languageId) 
    // eslint-disable-next-line no-param-reassign
    languageId = JSON.parse(localStorage.getItem('user'))?.results?.language?.filter(
      (lang) => lang.code === 'en',
    )[0].id;
  
  return axios
    .get(urls.questionnaire.SIGNUP_GET, {
      params: {
        language_uuid: languageId,
      },
      headers: generateHeaders(),
    });
}

/**
 * Update the signup questionnaire
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
async function updateSignupQuestionnaire(data) {
  if (!data.language_uuid) 
    // eslint-disable-next-line no-param-reassign
    data.language_uuid = JSON.parse(localStorage.getItem('user'))?.results?.language.filter(
      (lang) => lang.code === 'en',
    )[0].id;
  
  return axios
    .put(
      urls.questionnaire.SIGNUP_WRITE,
      data,
      {
        headers: generateHeaders(),
      },
    );
}

/**
 * Get the content layout order, how each element is ordered on the page.
 * @param languageId
 * @returns {Promise<void>}
 */
async function getContentLayoutOrder(languageId) {
  return axios.get(
    `${urls.evabrand.content_layout_order_GET}?language_id=${languageId}`, {
      headers: generateHeaders(),
    },
  );
}

/**
 * Update the content layout order, how each element is ordered on the page.
 * @param languageId
 * @returns {Promise<void>}
 */
async function updateContentLayoutOrder({ language_id, sections }) {
  return axios.put(
    urls.evabrand.content_layout_order_WRITE,
    {
      language_id,
      sections
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Export the evabrandAPI service
 */
export const evabrandAPI = {
  getAboutUs,
  updateAboutUsInformation,
  updateAboutUs,
  getClients,
  updateClientsInformation,
  deleteClients,
  addClient,
  getAppearance,
  updateAppearance,
  getSocial,
  updateSocial,
  updateSocialInformation,
  getGallery,
  addGallery,
  updateGalleryInformation,
  deleteGallery,
  getPerks,
  updatePerks,
  updatePerksInformation,
  deletePerks,
  getTestimonials,
  updateTestimonials,
  updateTestimonialsInformation,
  deleteTestimonials,
  getSeo,
  updateSeo,
  getSignUpProfileBuilder,
  updateSignupProfileBuilder,
  getSignUpQuestionnaire,
  updateSignupQuestionnaire,
  getContentLayoutOrder,
  updateContentLayoutOrder,
};
