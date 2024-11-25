export const IsBase64 = (str) => {
  if (str === '' || str.trim() === '') return false;
  try {
    return str.includes('base64') || window.atob(window.atob(str)) === str;
  } catch (err) {
    return false;
  }
};
