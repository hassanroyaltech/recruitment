export const GetIsExternalRoutesHandler = () =>
  window.location.pathname.startsWith('/onboarding/invitations')
  || window.location.pathname.startsWith('/form-builder')
  || window.location.pathname.startsWith('/ats/shared-profiles')
  || window.location.pathname.startsWith('/assessment/shared-profiles')
  || window.location.pathname.startsWith('/forms')
  || window.location.pathname.startsWith('/scorecard-builder')
  || window.location.pathname.startsWith('/rms/shared-profiles');
