// noinspection LongLine

export const numbersExpression = /^[0-9]*$/;

export const phoneExpression
  = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,7}$/gm;
export const faxExpression = /[+? *[1-9]+]?[0-9 ]+/im;

// Define custom character ranges for alphabetic characters
const customCharacterRanges = [
  '\\u0041-\\u005A', // Basic Latin (A-Z)
  '\\u0061-\\u007A', // Basic Latin (a-z)
  '\\u00C0-\\u00D6', // Latin-1 Supplement
  '\\u00D8-\\u00F6', // Latin-1 Supplement
  '\\u00F8-\\u02C1', // Latin-1 Supplement, Latin Extended-A, Latin Extended-B
  '\\u0370-\\u037D', // Greek and Coptic
  '\\u037F-\\u1FFF', // Greek and Coptic, various other blocks
  '\\u200C-\\u200D', // Zero Width Non-Joiner and Zero Width Joiner
  '\\u2070-\\u218F', // Superscripts and Subscripts, various other blocks
  '\\u2C60-\\u2C7F', // Latin Extended-C
  '\\u2D80-\\u2DFF', // Ethiopic Extended
  '\\u3000-\\u303F', // CJK Symbols and Punctuation
  '\\u3040-\\uD7FF', // Hiragana, Katakana, various other blocks
  '\\uF900-\\uFD3D', // CJK Compatibility Ideographs
  '\\uFD40-\\uFDCF', // Arabic Presentation Forms-A
  '\\uFDF0-\\uFE1F', // Arabic Presentation Forms-B
  '\\uFE30-\\uFE44', // CJK Compatibility Forms
  '\\uFE49-\\uFE6F', // Small Form Variants, various other blocks
  '\\uFF00-\\uFFEF', // Halfwidth and Fullwidth Forms
];
export const alphabetsExpression = !RegExp.escape
  ? new RegExp('^[' + customCharacterRanges.join('') + '\\s]+$')
  : /^[\p{L}\s]+$/gimu;

const customCharacterRangesWithApostrophe = [
  '\\u0041-\\u005A', // Basic Latin (A-Z)
  '\\u0061-\\u007A', // Basic Latin (a-z)
  '\\u0027', // Apostrophe
  '\\u00C0-\\u00D6', // Latin-1 Supplement
  '\\u00D8-\\u00F6', // Latin-1 Supplement
  '\\u00F8-\\u02C1', // Latin-1 Supplement, Latin Extended-A, Latin Extended-B
  '\\u0370-\\u037D', // Greek and Coptic
  '\\u037F-\\u1FFF', // Greek and Coptic, various other blocks
  '\\u200C-\\u200D', // Zero Width Non-Joiner and Zero Width Joiner
  '\\u2070-\\u218F', // Superscripts and Subscripts, various other blocks
  '\\u2C60-\\u2C7F', // Latin Extended-C
  '\\u2D80-\\u2DFF', // Ethiopic Extended
  '\\u3000-\\u303F', // CJK Symbols and Punctuation
  '\\u3040-\\uD7FF', // Hiragana, Katakana, various other blocks
  '\\uF900-\\uFD3D', // CJK Compatibility Ideographs
  '\\uFD40-\\uFDCF', // Arabic Presentation Forms-A
  '\\uFDF0-\\uFE1F', // Arabic Presentation Forms-B
  '\\uFE30-\\uFE44', // CJK Compatibility Forms
  '\\uFE49-\\uFE6F', // Small Form Variants, various other blocks
  '\\uFF00-\\uFFEF', // Halfwidth and Fullwidth Forms
];

export const alphabetsWithApostropheExpression = !RegExp.escape
  ? new RegExp('^[' + customCharacterRangesWithApostrophe.join('') + '\\s]+$')
  : /^[\p{L}\s]+$/gimu;

export const onlyEnglishSmall = /^[a-z]*$/m;
export const numericAndAlphabeticalExpression = /^[a-zA-Z0-9]*$/m;
export const numericAndAlphabeticalAndSpecialExpression
  = /^[a-zA-Z0-9~`!@#$%^&*()-_=+/\\.]*$/m;
export const emailExpression
  = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const urlExpression = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
export const secureUrlExpression = /^(https):\/\/[^\s$.?#].[^\s]*$/;
export const strongStringRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
);
export const mediumStringRegex = new RegExp(
  '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})',
);
export const isImageType = /\.(gif|jpe?g|tiff?|png|webp|bmp|ico)$/i;
export const youtubeVideoExpression
  = /(https?):\/\/(?:youtu\.be\/|(?:[a-z]{2,3}\.)?youtube\.com\/watch(?:\?|#!)v=)([\w-]{11}).*/gi;
export const youtubeProfileExpression
  = /(https?:\/\/)?(www\.)?youtube\.com\/(channel|user|c|u)\/[\w-]/gi;
export const youtubeProfileOrVideoExpression
  = /((https?:\/\/)?(www\.)?youtube\.com\/(channel|user|c|u)\/[\w-])|((https?):\/\/(?:youtu\.be\/|(?:[a-z]{2,3}\.)?youtube\.com\/watch(?:\?|#!)v=)([\w-]{11}).*)/gi;
export const twitterExpression = /(https?:\/\/)?(www\.)?twitter\.com\/[\w-]/gi;
export const snapchatExpression
  = /(?:https?:)?\/\/(?:www\.)?snapchat\.com\/add\/?[A-z0-9._-]+\/?/gi;
export const instagramExpression
  = /(?:https?:)?\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/?[A-Za-z0-9_](?:(?:[A-Za-z0-9_]|\.(?!\.)){0,28}[A-Za-z0-9_])?/gi;
export const facebookExpression
  = /(?:(https?):\/\/)?(?:www\.)?facebook\.com\/(?:(\w)*#!\/)?(?:pages\/)?(?:[\w-]*\/)*([\w-]*)/gi;
export const linkedinExpression
  = /(?:(https?):\/\/)?(?:www\.)?linkedin\.com\/(?:(\w)*#!\/)?(?:pages\/)?(?:[\w-]*\/)*([\w-]*)/gi;
export const gitHubExpression
  = /(?:(https?):\/\/)?(?:www\.)?github\.intuit\.com\/(?:(\w)*#!\/)?(?:pages\/)?(?:[\w-]*\/)*([\w-]*)/gi;
export const regexExpression = /^\/.*?\/$/;
