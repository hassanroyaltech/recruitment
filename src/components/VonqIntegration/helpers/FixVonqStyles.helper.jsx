export const FixVonqStyles = (lang) => {
  if (window?.hapi?.ui?.service) {
    window.hapi.ui.service.setStyleAttribute(
      '#hapi__body',
      'direction',
      lang === 'ar' ? 'rtl' : 'ltr',
    );
    window.hapi.ui.service.setStyleAttribute(
      '.hapi__form-input-range-container',
      'direction',
      'ltr',
    );
  }
};
