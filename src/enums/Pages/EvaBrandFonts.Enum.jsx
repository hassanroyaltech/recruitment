import { SystemLanguagesConfig } from '../../configs';

export const EvaBrandFontsEnum = {
  UbuntuRegular: {
    key: 'Ubuntu-Regular',
    value: 'ubuntu-regular',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'ubuntu/Ubuntu-Regular.ttf',
    format: 'truetype',
  },
  UbuntuLight: {
    key: 'Ubuntu-Light',
    value: 'ubuntu-light',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'ubuntu/Ubuntu-Light.ttf',
    format: 'truetype',
  },
  UbuntuMedium: {
    key: 'Ubuntu-Medium',
    value: 'ubuntu-medium',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'ubuntu/Ubuntu-Medium.ttf',
    format: 'truetype',
  },
  UbuntuBold: {
    key: 'Ubuntu-Bold',
    value: 'ubuntu-bold',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'ubuntu/Ubuntu-Bold.ttf',
    format: 'truetype',
  },
  CairoRegular: {
    key: 'Cairo-Regular',
    value: 'cairo-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'cairo/Cairo-Regular.ttf',
    format: 'truetype',
  },
  CairoExtraLight: {
    key: 'Cairo-ExtraLight',
    value: 'cairo-extra-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'cairo/Cairo-ExtraLight.ttf',
    format: 'truetype',
  },
  CairoLight: {
    key: 'Cairo-Light',
    value: 'cairo-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'cairo/Cairo-Light.ttf',
    format: 'truetype',
  },
  CairoSemiBold: {
    key: 'Cairo-SemiBold',
    value: 'cairo-semi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'cairo/Cairo-SemiBold.ttf',
    format: 'truetype',
  },
  CairoBold: {
    key: 'Cairo-Bold',
    value: 'cairo-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'cairo/Cairo-Bold.ttf',
    format: 'truetype',
  },
  CairoBlack: {
    key: 'Cairo-Black',
    value: 'cairo-black',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'cairo/Cairo-Black.ttf',
    format: 'truetype',
  },
  GEFlowRegular: {
    key: 'GE-Flow-Regular',
    value: 'ge-flow-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ge-flow/GE-Flow-Regular.otf',
    format: 'opentype',
  },
  GEFlowBold: {
    key: 'GE-Flow-Bold',
    value: 'ge-flow-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ge-flow/GE-Flow-Bold.ttf',
    format: 'truetype',
  },
  GE_SS_Two_Bold: {
    key: 'GE_SS_Two_Bold',
    value: 'GE_SS_Two_Bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ge-flow/GE_SS_Two_Bold.otf',
    format: 'opentype',
  },
  GE_SS_Two_Light: {
    key: 'GE_SS_Two_Light',
    value: 'GE_SS_Two_Light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ge-flow/GE_SS_Two_Light.otf',
    format: 'opentype',
  },
  GE_SS_Two_Medium: {
    key: 'GE_SS_Two_Medium',
    value: 'GE_SS_Two_Medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ge-flow/GE_SS_Two_Light.otf',
    format: 'opentype',
  },
  Arial: {
    key: 'arial',
    value: 'arial',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
  },
  ArialBold: {
    key: 'Arial-Bold',
    value: 'arial-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'arial/Arial-Bold.ttf',
  },
  SansSerif: {
    key: 'sans-serif',
    value: 'sans-serif',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
  },
  AmpleSoftProRegular: {
    key: 'Ample-Soft-Pro-Regular',
    value: 'ample-soft-pro-regular',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'ample-soft-pro/Ample-Soft-Pro-Regular.ttf',
    format: 'truetype',
  },
  AmpleSoftProThin: {
    key: 'Ample-Soft-Pro-Thin',
    value: 'ample-soft-pro-thin',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'ample-soft-pro/Ample-Soft-Pro-Thin.ttf',
    format: 'truetype',
  },
  AmpleSoftProExtraLight: {
    key: 'Ample-Soft-Pro-ExtraLight',
    value: 'ample-soft-pro-extra-light',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'ample-soft-pro/Ample-Soft-Pro-ExtraLight.ttf',
    format: 'truetype',
  },
  AmpleSoftProLight: {
    key: 'Ample-Soft-Pro-Light',
    value: 'ample-soft-pro-light',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'ample-soft-pro/Ample-Soft-Pro-Light.ttf',
    format: 'truetype',
  },
  AmpleSoftProMedium: {
    key: 'Ample-Soft-Pro-Medium',
    value: 'ample-soft-pro-medium',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'ample-soft-pro/Ample-Soft-Pro-Medium.ttf',
    format: 'truetype',
  },
  AmpleSoftProBold: {
    key: 'Ample-Soft-Pro-Bold',
    value: 'ample-soft-pro-bold',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'ample-soft-pro/Ample-Soft-Pro-Bold.ttf',
    format: 'truetype',
  },
  FFShamelFamilyRegular: {
    key: 'FF-Shamel-Family-Regular',
    value: 'ff-shamel-family-regular',
    supportedLanguages: [SystemLanguagesConfig.ar.key],
    filePath: 'ff-shamel-family/FF-Shamel-Family-Regular.ttf',
    format: 'truetype',
  },
  FFShamelFamilyLight: {
    key: 'FF-Shamel-Family-Light',
    value: 'ff-shamel-family-light',
    supportedLanguages: [SystemLanguagesConfig.ar.key],
    filePath: 'ff-shamel-family/FF-Shamel-Family-Light.ttf',
    format: 'truetype',
  },
  FFShamelFamilyMedium: {
    key: 'FF-Shamel-Family-Medium',
    value: 'ff-shamel-family-medium',
    supportedLanguages: [SystemLanguagesConfig.ar.key],
    filePath: 'ff-shamel-family/FF-Shamel-Family-Medium.ttf',
    format: 'truetype',
  },
  FFShamelFamilyBold: {
    key: 'FF-Shamel-Family-Bold',
    value: 'ff-shamel-family-bold',
    supportedLanguages: [SystemLanguagesConfig.ar.key],
    filePath: 'ff-shamel-family/FF-Shamel-Family-Bold.ttf',
    format: 'truetype',
  },
  TerminalDosisRegular: {
    key: 'Terminal-Dosis-Regular',
    value: 'terminal-dosis-regular',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'terminal-dosis/Terminal-Dosis-Regular.ttf',
    format: 'truetype',
  },
  TerminalDosisExtraLight: {
    key: 'Terminal-Dosis-ExtraLight',
    value: 'terminal-dosis-extra-light',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'terminal-dosis/Terminal-Dosis-ExtraLight.ttf',
    format: 'truetype',
  },
  TerminalDosisLight: {
    key: 'Terminal-Dosis-Light',
    value: 'terminal-dosis-light',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'terminal-dosis/Terminal-Dosis-Light.ttf',
    format: 'truetype',
  },
  TerminalDosisMedium: {
    key: 'Terminal-Dosis-Medium',
    value: 'terminal-dosis-medium',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'terminal-dosis/Terminal-Dosis-Medium.ttf',
    format: 'truetype',
  },
  TerminalDosisSemiBold: {
    key: 'Terminal-Dosis-SemiBold',
    value: 'terminal-dosis-semi-bold',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'terminal-dosis/Terminal-Dosis-SemiBold.ttf',
    format: 'truetype',
  },
  TerminalDosisBold: {
    key: 'Terminal-Dosis-Bold',
    value: 'terminal-dosis-bold',
    supportedLanguages: [SystemLanguagesConfig.en.key],
  },
  TerminalDosisExtraBold: {
    key: 'Terminal-Dosis-ExtraBold',
    value: 'terminal-dosis-extra-bold',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'terminal-dosis/Terminal-Dosis-ExtraBold.ttf',
    format: 'truetype',
  },
  HelveticaRegular: {
    key: 'Helvetica',
    value: 'helvetica-regular',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'helvetica/Helvetica.ttf',
    format: 'truetype',
  },
  HelveticaLight: {
    key: 'Helvetica-light',
    value: 'helvetica-light',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'helvetica/helvetica-light.ttf',
    format: 'truetype',
  },
  HelveticaOblique: {
    key: 'Helvetica-Oblique',
    value: 'helvetica-oblique',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'helvetica/Helvetica-Oblique.ttf',
    format: 'truetype',
  },
  HelveticaBold: {
    key: 'Helvetica-Bold',
    value: 'helvetica-bold',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'helvetica/Helvetica-Bold.ttf',
    format: 'truetype',
  },
  HelveticaBoldOblique: {
    key: ' Helvetica-BoldOblique',
    value: 'helvetica-bold-oblique',
    supportedLanguages: [SystemLanguagesConfig.en.key],
    filePath: 'helvetica/Helvetica-BoldOblique.ttf',
    format: 'truetype',
  },
  MulishBlack: {
    key: 'Mulish-Black',
    value: 'Mulish-Black',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-Black.ttf',
    format: 'truetype',
  },
  MulishBlackItalic: {
    key: 'Mulish-BlackItalic',
    value: 'Mulish-BlackItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-BlackItalic.ttf',
    format: 'truetype',
  },
  MulishBold: {
    key: 'Mulish-Bold',
    value: 'Mulish-Bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-Bold.ttf',
    format: 'truetype',
  },
  MulishBoldItalic: {
    key: 'Mulish-BoldItalic',
    value: 'Mulish-BoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-BoldItalic.ttf',
    format: 'truetype',
  },
  MulishExtraBold: {
    key: 'Mulish-ExtraBold',
    value: 'Mulish-ExtraBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-ExtraBold.ttf',
    format: 'truetype',
  },
  MulishExtraBoldItalic: {
    key: 'Mulish-ExtraBoldItalic',
    value: 'Mulish-ExtraBoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-ExtraBoldItalic.ttf',
    format: 'truetype',
  },
  MulishExtraLight: {
    key: 'Mulish-ExtraLight',
    value: 'Mulish-ExtraLight',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-ExtraLight.ttf',
    format: 'truetype',
  },
  MulishExtraLightItalic: {
    key: 'Mulish-ExtraLightItalic',
    value: 'Mulish-ExtraLightItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
  },
  MulishItalic: {
    key: 'Mulish-Italic',
    value: 'Mulish-Italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
  },
  MulishItalicVariableFont_wght: {
    key: 'Mulish-Italic-VariableFont_wght',
    value: 'Mulish-Italic-VariableFont_wght',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
  },
  MulishLight: {
    key: 'Mulish-Light',
    value: 'Mulish-Light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
  },
  MulishLightItalic: {
    key: 'Mulish-LightItalic',
    value: 'Mulish-LightItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-ExtraLightItalic.ttf',
    format: 'truetype',
  },
  MulishMedium: {
    key: 'Mulish-Medium',
    value: 'Mulish-Medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-Medium.ttf',
    format: 'truetype',
  },
  MulishMediumItalic: {
    key: 'Mulish-MediumItalic',
    value: 'Mulish-MediumItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-MediumItalic.ttf',
    format: 'truetype',
  },
  MulishRegular: {
    key: 'Mulish-Regular',
    value: 'Mulish-Regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-Regular.ttf',
    format: 'truetype',
  },
  MulishSemiBold: {
    key: 'Mulish-SemiBold',
    value: 'Mulish-SemiBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-SemiBold.ttf',
    format: 'truetype',
  },
  MulishSemiBoldItalic: {
    key: 'Mulish-SemiBoldItalic',
    value: 'Mulish-SemiBoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Mulish/Mulish-SemiBoldItalic.ttf',
    format: 'truetype',
  },
  OpenSansBold: {
    key: 'OpenSans-Bold',
    value: 'OpenSans-Bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans-Bold.ttf',
    format: 'truetype',
  },
  OpenSansBoldItalic: {
    key: 'OpenSans-BoldItalic',
    value: 'OpenSans-BoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans-BoldItalic.ttf',
    format: 'truetype',
  },
  OpenSansExtraBold: {
    key: 'OpenSans-ExtraBold',
    value: 'OpenSans-ExtraBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans-ExtraBold.ttf',
    format: 'truetype',
  },
  OpenSansExtraBoldItalic: {
    key: 'OpenSans-ExtraBoldItalic',
    value: 'OpenSans-ExtraBoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans-ExtraBoldItalic.ttf',
    format: 'truetype',
  },
  OpenSansItalic: {
    key: 'OpenSans-Italic',
    value: 'OpenSans-Italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans-Italic.ttf',
    format: 'truetype',
  },
  OpenSansLight: {
    key: 'OpenSans-Light',
    value: 'OpenSans-Light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans-Light.ttf',
    format: 'truetype',
  },
  OpenSansLightItalic: {
    key: 'OpenSans-LightItalic',
    value: 'OpenSans-LightItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans-LightItalic.ttf',
    format: 'truetype',
  },
  OpenSansMedium: {
    key: 'OpenSans-Medium',
    value: 'OpenSans-Medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans-Medium.ttf',
    format: 'truetype',
  },
  OpenSansMediumItalic: {
    key: 'OpenSans-MediumItalic',
    value: 'OpenSans-MediumItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans-MediumItalic.ttf',
    format: 'truetype',
  },
  OpenSansRegular: {
    key: 'OpenSans-Regular',
    value: 'OpenSans-Regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans-Regular.ttf',
    format: 'truetype',
  },
  OpenSansSemiBold: {
    key: 'OpenSans-SemiBold',
    value: 'OpenSans-SemiBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans-SemiBold.ttf',
    format: 'truetype',
  },
  OpenSansSemiBoldItalic: {
    key: 'OpenSans-SemiBoldItalic',
    value: 'OpenSans-SemiBoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans-SemiBoldItalic.ttf',
    format: 'truetype',
  },
  OpenSans_CondensedBold: {
    key: 'OpenSans_Condensed-Bold',
    value: 'OpenSans_Condensed-Bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_Condensed-Bold.ttf',
    format: 'truetype',
  },
  OpenSans_CondensedBoldItalic: {
    key: 'OpenSans_Condensed-BoldItalic',
    value: 'OpenSans_Condensed-BoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_Condensed-BoldItalic.ttf',
    format: 'truetype',
  },
  OpenSans_CondensedExtraBold: {
    key: 'OpenSans_Condensed-ExtraBold',
    value: 'OpenSans_Condensed-ExtraBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_Condensed-ExtraBold.ttf',
    format: 'truetype',
  },
  OpenSans_CondensedExtraBoldItalic: {
    key: 'OpenSans_Condensed-ExtraBoldItalic',
    value: 'OpenSans_Condensed-ExtraBoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_Condensed-ExtraBoldItalic.ttf',
    format: 'truetype',
  },
  OpenSans_CondensedItalic: {
    key: 'OpenSans_Condensed-Italic',
    value: 'OpenSans_Condensed-Italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_Condensed-Italic.ttf',
    format: 'truetype',
  },
  OpenSans_CondensedLight: {
    key: 'OpenSans_Condensed-Light',
    value: 'OpenSans_Condensed-Light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_Condensed-Light.ttf',
    format: 'truetype',
  },
  OpenSans_CondensedLightItalic: {
    key: 'OpenSans_Condensed-LightItalic',
    value: 'OpenSans_Condensed-LightItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_Condensed-LightItalic.ttf',
    format: 'truetype',
  },
  OpenSans_CondensedMedium: {
    key: 'OpenSans_Condensed-Medium',
    value: 'OpenSans_Condensed-Medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_Condensed-Medium.ttf',
    format: 'truetype',
  },
  OpenSans_CondensedMediumItalic: {
    key: 'OpenSans_Condensed-MediumItalic',
    value: 'OpenSans_Condensed-MediumItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_Condensed-MediumItalic.ttf',
    format: 'truetype',
  },
  OpenSans_CondensedRegular: {
    key: 'OpenSans_Condensed-Regular',
    value: 'OpenSans_Condensed-Regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_Condensed-Regular.ttf',
    format: 'truetype',
  },
  OpenSans_CondensedSemiBold: {
    key: 'OpenSans_Condensed-SemiBold',
    value: 'OpenSans_Condensed-SemiBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_Condensed-SemiBold.ttf',
    format: 'truetype',
  },
  OpenSans_CondensedSemiBoldItalic: {
    key: 'OpenSans_Condensed-SemiBoldItalic',
    value: 'OpenSans_Condensed-SemiBoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_Condensed-SemiBoldItalic.ttf',
    format: 'truetype',
  },
  OpenSans_SemiCondensedBold: {
    key: 'OpenSans_SemiCondensed-Bold',
    value: 'OpenSans_SemiCondensed-Bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_SemiCondensed-Bold.ttf',
    format: 'truetype',
  },
  OpenSans_SemiCondensedBoldItalic: {
    key: 'OpenSans_SemiCondensed-BoldItalic',
    value: 'OpenSans_SemiCondensed-BoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_SemiCondensed-BoldItalic.ttf',
    format: 'truetype',
  },
  OpenSans_SemiCondensedExtraBold: {
    key: 'OpenSans_SemiCondensed-ExtraBold',
    value: 'OpenSans_SemiCondensed-ExtraBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_SemiCondensed-ExtraBold.ttf',
    format: 'truetype',
  },
  OpenSans_SemiCondensedExtraBoldItalic: {
    key: 'OpenSans_SemiCondensed-ExtraBoldItalic',
    value: 'OpenSans_SemiCondensed-ExtraBoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_SemiCondensed-ExtraBoldItalic.ttf',
    format: 'truetype',
  },
  OpenSans_SemiCondensedItalic: {
    key: 'OpenSans_SemiCondensed-Italic',
    value: 'OpenSans_SemiCondensed-Italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_SemiCondensed-Italic.ttf',
    format: 'truetype',
  },
  OpenSans_SemiCondensedLight: {
    key: 'OpenSans_SemiCondensed-Light',
    value: 'OpenSans_SemiCondensed-Light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_SemiCondensed-Light.ttf',
    format: 'truetype',
  },
  OpenSans_SemiCondensedLightItalic: {
    key: 'OpenSans_SemiCondensed-LightItalic',
    value: 'OpenSans_SemiCondensed-LightItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_SemiCondensed-LightItalic.ttf',
    format: 'truetype',
  },
  OpenSans_SemiCondensedMedium: {
    key: 'OpenSans_SemiCondensed-Medium',
    value: 'OpenSans_SemiCondensed-Medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_SemiCondensed-Medium.ttf',
    format: 'truetype',
  },
  OpenSans_SemiCondensedMediumItalic: {
    key: 'OpenSans_SemiCondensed-MediumItalic',
    value: 'OpenSans_SemiCondensed-MediumItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_SemiCondensed-MediumItalic.ttf',
    format: 'truetype',
  },
  OpenSans_SemiCondensedRegular: {
    key: 'OpenSans_SemiCondensed-Regular',
    value: 'OpenSans_SemiCondensed-Regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_SemiCondensed-Regular.ttf',
    format: 'truetype',
  },
  OpenSans_SemiCondensedSemiBold: {
    key: 'OpenSans_SemiCondensed-SemiBold',
    value: 'OpenSans_SemiCondensed-SemiBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_SemiCondensed-SemiBold.ttf',
    format: 'truetype',
  },
  OpenSans_SemiCondensedSemiBoldItalic: {
    key: 'OpenSans_SemiCondensed-SemiBoldItalic',
    value: 'OpenSans_SemiCondensed-SemiBoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'open-sans/OpenSans_SemiCondensed-SemiBoldItalic.ttf',
    format: 'truetype',
  },
  Poppins_Black: {
    key: 'Poppins-Black',
    value: 'Poppins-Black',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-Black.ttf',
    format: 'truetype',
  },
  Poppins_BlackItalic: {
    key: 'Poppins-BlackItalic',
    value: 'Poppins-BlackItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-BlackItalic.ttf',
    format: 'truetype',
  },
  Poppins_Bold: {
    key: 'Poppins-Bold',
    value: 'Poppins-Bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-Bold.ttf',
    format: 'truetype',
  },
  Poppins_BoldItalic: {
    key: 'Poppins-BoldItalic',
    value: 'Poppins-BoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-BoldItalic.ttf',
    format: 'truetype',
  },
  Poppins_ExtraBold: {
    key: 'Poppins-ExtraBold',
    value: 'Poppins-ExtraBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-ExtraBold.ttf',
    format: 'truetype',
  },
  Poppins_ExtraBoldItalic: {
    key: 'Poppins-ExtraBoldItalic',
    value: 'Poppins-ExtraBoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-ExtraBoldItalic.ttf',
    format: 'truetype',
  },
  Poppins_ExtraLight: {
    key: 'Poppins-ExtraLight',
    value: 'Poppins-ExtraLight',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-ExtraLight.ttf',
    format: 'truetype',
  },
  Poppins_ExtraLightItalic: {
    key: 'Poppins-ExtraLightItalic',
    value: 'Poppins-ExtraLightItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-ExtraLightItalic.ttf',
    format: 'truetype',
  },
  Poppins_Italic: {
    key: 'Poppins-Italic',
    value: 'Poppins-Italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-Italic.ttf',
    format: 'truetype',
  },
  Poppins_Light: {
    key: 'Poppins-Light',
    value: 'Poppins-Light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-Light.ttf',
    format: 'truetype',
  },
  Poppins_LightItalic: {
    key: 'Poppins-LightItalic',
    value: 'Poppins-LightItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-LightItalic.ttf',
    format: 'truetype',
  },
  Poppins_Medium: {
    key: 'Poppins-Medium',
    value: 'Poppins-Medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-Medium.ttf',
    format: 'truetype',
  },
  Poppins_MediumItalic: {
    key: 'Poppins-MediumItalic',
    value: 'Poppins-MediumItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-MediumItalic.ttf',
    format: 'truetype',
  },
  Poppins_Regular: {
    key: 'Poppins-Regular',
    value: 'Poppins-Regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-Regular.ttf',
    format: 'truetype',
  },
  Poppins_SemiBold: {
    key: 'Poppins-SemiBold',
    value: 'Poppins-SemiBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-SemiBold.ttf',
    format: 'truetype',
  },
  Poppins_SemiBoldItalic: {
    key: 'Poppins-SemiBoldItalic',
    value: 'Poppins-SemiBoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-SemiBoldItalic.ttf',
    format: 'truetype',
  },
  Poppins_Thin: {
    key: 'Poppins-Thin',
    value: 'Poppins-Thin',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-Thin.ttf',
    format: 'truetype',
  },
  Poppins_ThinItalic: {
    key: 'Poppins-ThinItalic',
    value: 'Poppins-ThinItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'poppins/Poppins-ThinItalic.ttf',
    format: 'truetype',
  },
  Diavlo_black: {
    key: 'diavlo_black',
    value: 'DiavloBlack',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'diavlo/diavlo_black_ii_37-webfont.ttf',
    format: 'truetype',
  },
  Apertura_regular: {
    key: 'Apertura-Regular',
    value: 'Apertura-Regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'apertura/Apertura-Regular.ttf',
    format: 'truetype',
  },
  Bahij_TheSansArabicExtraBold: {
    key: 'Bahij_TheSansArabic-ExtraBold',
    value: 'Bahij_TheSansArabic-ExtraBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'bahij/Bahij_TheSansArabic-ExtraBold.ttf',
    format: 'truetype',
  },
  Bahij_TheSansArabicPlain: {
    key: 'Bahij_TheSansArabic-Plain',
    value: 'Bahij_TheSansArabic-Plain',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'bahij/Bahij_TheSansArabic-Plain.ttf',
    format: 'truetype',
  },Bahij_TheSansArabicBlack: {
    key: 'Bahij_TheSansArabic-Black',
    value: 'Bahij_TheSansArabic-Black',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'bahij/Bahij_TheSansArabic-Black.ttf',
  },
  Bahij_TheSansArabicBold: {
    key: 'Bahij_TheSansArabic-Bold',
    value: 'Bahij_TheSansArabic-Bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'bahij/Bahij_TheSansArabic-Bold.ttf',
  },
  Bahij_TheSansArabicExtraLight: {
    key: 'Bahij_TheSansArabic-ExtraLight',
    value: 'Bahij_TheSansArabic-ExtraLight',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'bahij/Bahij_TheSansArabic-ExtraLight.ttf',
  },
  Bahij_TheSansArabicLight: {
    key: 'Bahij_TheSansArabic-Light',
    value: 'Bahij_TheSansArabic-Light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'bahij/Bahij_TheSansArabic-Light.ttf',
  },
  Bahij_TheSansArabicSemiBold: {
    key: 'Bahij_TheSansArabic-SemiBold',
    value: 'Bahij_TheSansArabic-SemiBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'bahij/Bahij_TheSansArabic-SemiBold.ttf',
  },
  Bahij_TheSansArabicSemiLight: {
    key: 'Bahij_TheSansArabic-SemiLight',
    value: 'Bahij_TheSansArabic-SemiLight',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'bahij/Bahij_TheSansArabic-SemiLight.ttf',
  },
  Avenir: {
    key: 'Avenir',
    value: 'Avenir',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'avenir/Avenir.ttc',
  },
  Avenir2: {
    key: 'Avenir2',
    value: 'Avenir2',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'avenir/Avenir2.ttc',
  },
  AvenirNext: {
    key: 'AvenirNext',
    value: 'AvenirNext',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'avenir/AvenirNext.ttc',
  },
  AvenirNextCondensed: {
    key: 'AvenirNextCondensed',
    value: 'AvenirNextCondensed',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'avenir/AvenirNextCondensed.ttc',
  },
  GothamBold: {
    key: 'GothamBold',
    value: 'GothamBold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Gotham/GothamBold.ttf',
  },
  GothamBoldItalic: {
    key: 'GothamBoldItalic',
    value: 'GothamBoldItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Gotham/GothamBoldItalic.ttf',
  },
  GothamBook: {
    key: 'GothamBook',
    value: 'GothamBook',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Gotham/GothamBook.ttf',
  },
  GothamBookItalic: {
    key: 'GothamBookItalic',
    value: 'GothamBookItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Gotham/GothamBookItalic.ttf',
  },
  GothamLight: {
    key: 'GothamLight',
    value: 'GothamLight',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Gotham/GothamLight.ttf',
  },
  GothamLightItalic: {
    key: 'GothamLightItalic',
    value: 'GothamLightItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Gotham/GothamLightItalic.ttf',
  },
  GothamMedium: {
    key: 'GothamMedium',
    value: 'GothamMedium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Gotham/GothamMedium.ttf',
  },
  GothamMedium_1: {
    key: 'GothamMedium_1',
    value: 'GothamMedium_1',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Gotham/GothamMedium_1.ttf',
  },
  GothamMediumItalic: {
    key: 'GothamMediumItalic',
    value: 'GothamMediumItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Gotham/GothamMediumItalic.ttf',
  },
  MetaPlus_Black: {
    key: 'MetaPlus-Black',
    value: 'MetaPlusBlack',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'masdar/MetaPlus-Black.otf',
  },
  MetaPlus_Italic: {
    key: 'MetaPlus-Italic',
    value: 'MetaPlusItalic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'masdar/MetaPlus-Italic.otf',
  },
  MetaPlus_MediumCaps: {
    key: 'MetaPlus-MediumCaps',
    value: 'MetaPlusMediumCaps',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'masdar/MetaPlus-MediumCaps.otf',
  },
  MetaPlus_Roman: {
    key: 'MetaPlus-Roman',
    value: 'MetaPlusRoman',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'masdar/MetaPlus-Roman.otf',
  },
  DubaiRegular: {
    key: 'Dubai-Regular',
    value: 'dubai-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'dubai/DubaiW23-Regular.ttf',
  },
  DubaiLight: {
    key: 'Dubai-Light',
    value: 'dubai-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'dubai/DubaiW23-Light.ttf',
  },
  DubaiMedium: {
    key: 'Dubai-Medium',
    value: 'dubai-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'dubai/DubaiW23-Medium.ttf',
  },
  DubaiBold: {
    key: 'Dubai-Bold',
    value: 'dubai-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'dubai/DubaiW23-Bold.ttf',
  },
  RalewayLinearBlack: {
    key: 'RalewayLinear-Black',
    value: 'raleway-linear-black',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-Black.otf',
  },
  RalewayLinearBlackItalic: {
    key: 'RalewayLinear-BlackItalic',
    value: 'raleway-linear-black-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-BlackItalic.otf',
  },
  RalewayLinearBold: {
    key: 'RalewayLinear-Bold',
    value: 'raleway-linear-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-Bold.otf',
  },
  RalewayLinearBoldItalic: {
    key: 'RalewayLinear-BoldItalic',
    value: 'raleway-linear-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-BoldItalic.otf',
  },
  RalewayLinearExtraBold: {
    key: 'RalewayLinear-ExtraBold',
    value: 'raleway-linear-extra-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-ExtraBold.otf',
  },
  RalewayLinearExtraBoldItalic: {
    key: 'RalewayLinear-ExtraBoldItalic',
    value: 'raleway-linear-extra-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-ExtraBoldItalic.otf',
  },
  RalewayLinearLight: {
    key: 'RalewayLinear-Light',
    value: 'raleway-linear-light',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-Light.otf',
  },
  RalewayLinearLightItalic: {
    key: 'RalewayLinear-LightItalic',
    value: 'raleway-linear-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-LightItalic.otf',
  },
  RalewayLinearExtraLight: {
    key: 'RalewayLinear-ExtraLight',
    value: 'raleway-linear-extra-light',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-ExtraLight.otf',
  },
  RalewayLinearExtraLightItalic: {
    key: 'RalewayLinear-ExtraLightItalic',
    value: 'raleway-linear-extra-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-ExtraLightItalic.otf',
  },
  RalewayLinearItalic: {
    key: 'RalewayLinear-Italic',
    value: 'raleway-linear-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-Italic.otf',
  },
  RalewayLinearMedium: {
    key: 'RalewayLinear-Medium',
    value: 'raleway-linear-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-Medium.otf',
  },
  RalewayLinearMediumItalic: {
    key: 'RalewayLinear-MediumItalic',
    value: 'raleway-linear-medium-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-MediumItalic.otf',
  },
  RalewayLinearRegular: {
    key: 'RalewayLinear-Regular',
    value: 'raleway-linear-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-Regular.otf',
  },
  RalewayLinearSemiBold: {
    key: 'RalewayLinear-SemiBold',
    value: 'raleway-linear-semi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-SemiBold.otf',
  },
  RalewayLinearSemiBoldItalic: {
    key: 'RalewayLinear-SemiBoldItalic',
    value: 'raleway-linear-semi-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-SemiBoldItalic.otf',
  },
  RalewayLinearThin: {
    key: 'RalewayLinear-Thin',
    value: 'raleway-linear-thin',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-Thin.otf',
  },
  RalewayLinearThinItalic: {
    key: 'RalewayLinear-ThinItalic',
    value: 'raleway-linear-thin-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'raleway-linear/RalewayLinear-ThinItalic.otf',
  },
  DINNextLTArabicUltraLight: {
    key: 'DINNextLTArabic-UltraLight',
    value: 'din-next-lt-arabic-ultra-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'DIN Next LT/DINNextLTArabic-UltraLight.ttf',
  },
  DINNextLTArabicLight: {
    key: 'DINNextLTArabic-Light',
    value: 'din-next-lt-arabic-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'DIN Next LT/DINNEXTLTARABIC-LIGHT.ttf',
  },
  DINNextLTArabicRegular: {
    key: 'DINNextLTArabic-Regular',
    value: 'din-next-lt-arabic-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'DIN Next LT/DINNextLTArabic-Regular.ttf',
  },
  DINNextLTArabicMedium: {
    key: 'DINNextLTArabic-Medium',
    value: 'din-next-lt-arabic-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'DIN Next LT/DINNextLTArabic-Medium.ttf',
  },
  DINNextLTArabicBold: {
    key: 'DINNextLTArabic-Bold',
    value: 'din-next-lt-arabic-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'DIN Next LT/DINNextLTArabic-Bold.ttf',
  },
  DINNextLTArabicBlack: {
    key: 'DINNextLTArabic-Black',
    value: 'din-next-lt-arabic-black',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'DIN Next LT/DINNextLTArabic-Black.ttf',
  },
  DINNextLTArabicHeavy: {
    key: 'DINNextLTArabic-Heavy',
    value: 'din-next-lt-arabic-heavy',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'DIN Next LT/DINNextLTArabic-Heavy.ttf',
  },
  NeoSansLight: {
    key: 'Neosans-Light',
    value: 'neo-sans-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'neo-sans/Neosans-Light.ttf',
  },
  NeosansRegular: {
    key: 'Neosans-Regular',
    value: 'neo-sans-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'neo-sans/Neosans-Regular.ttf',
  },
  NeosansMedium: {
    key: 'Neosans-Medium',
    value: 'neo-sans-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'neo-sans/Neosans-Medium.ttf',
  },
  NeosansBold: {
    key: 'Neosans-Bold',
    value: 'neo-sans-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'neo-sans/Neosans-Bold.ttf',
  },
  NeosansBlack: {
    key: 'Neosans-Black',
    value: 'neo-sans-black',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
  },
  NeoSansUltra: {
    key: 'Neosans-Ultra',
    value: 'neo-sans-ultra-heavy',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'neo-sans/Neosans-Ultra.ttf',
  },
  ApexSansBook: {
    key: 'Apex-Sans-Book',
    value: 'apex-sans-book',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Apex-Sans-Book.ttf',
  },
  ApexSansBookRegular: {
    key: 'Apex-Sans-Book-Regular',
    value: 'apex-sans-book-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Apex-Sans-Book-Regular.ttf',
  },
  ApexSansMedium: {
    key: 'Apex-Sans-Medium',
    value: 'apex-sans-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Apex-Sans-Medium.ttf',
  },
  ApexSansBold: {
    key: 'Apex-Sans-Bold',
    value: 'apex-sans-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Apex-Sans-Bold.ttf',
  },
  ApexSansBoldST: {
    key: 'Apex-Sans-Bold-ST',
    value: 'apex-sans-bold-st',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Apex-Sans-Bold-ST.ttf',
  },
  FrutigerLTArabicLight: {
    key: 'Frutiger-LT-Arabic-Light',
    value: 'frutiger-lt-arabic-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Frutiger-LT-Arabic-Light.ttf',
  },
  FrutigerLTArabic: {
    key: 'Frutiger-LT-Arabic',
    value: 'frutiger-lt-arabic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Frutiger-LT-Arabic.ttf',
  },
  FrutigerLTArabicBold: {
    key: 'Frutiger-LT-Arabic-Bold',
    value: 'frutiger-lt-arabic-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Frutiger-LT-Arabic-Bold.ttf',
  },
  FrutigerLTArabicBlack: {
    key: 'Frutiger-LT-Arabic-Black',
    value: 'frutiger-lt-arabic-black',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Frutiger-LT-Arabic-Black.ttf',
  },
  SegoeUILight: {
    key: 'Segoe-UI-Light',
    value: 'segoe-ui-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Segoe-UI-Light.ttf',
  },
  SegoeUISemiLight: {
    key: 'Segoe-UI-Semi-Light',
    value: 'segoe-ui-semi-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Segoe-UI-Semi-Light.ttf',
  },
  SegoeUI: {
    key: 'Segoe-UI',
    value: 'segoe-ui',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Segoe-UI.ttf',
  },
  SegoeUISemiBold: {
    key: 'Segoe-UI-Semi-Bold',
    value: 'segoe-ui-semi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Segoe-UI-Semi-Bold.ttf',
  },
  SegoeUIBold: {
    key: 'Segoe-UI-Bold',
    value: 'segoe-ui-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'EZCAFonts/Segoe-UI-Bold.ttf',
  },
  ProximaNovaLight: {
    key: 'ProximaNova-Light',
    value: 'proxima-nova-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNova-Light.otf',
  },
  ProximaNovaLightItalic: {
    key: 'ProximaNova-LightItalic',
    value: 'proxima-nova-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNova-LightItalic.otf',
  },
  ProximaNovaCondLight: {
    key: 'ProximaNovaCond-Light',
    value: 'proxima-nova-cond-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNovaCond-Light.otf',
  },
  ProximaNovaCondLightIt: {
    key: 'ProximaNovaCond-LightIt',
    value: 'proxima-nova-cond-light-it',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNovaCond-LightIt.otf',
  },
  ProximaNovaCondRegular: {
    key: 'ProximaNovaCond-Regular',
    value: 'proxima-nova-cond-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
  },
  ProximaNovaCondRegularIt: {
    key: 'ProximaNovaCond-RegularIt',
    value: 'proxima-nova-cond-regular-it',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNovaCond-RegularIt.otf',
  },
  ProximaNovaRegular: {
    key: 'ProximaNova-Regular',
    value: 'proxima-nova-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNovaCond-Regular.otf',
  },
  ProximaNovaRegularItalic: {
    key: 'ProximaNova-RegularItalic',
    value: 'proxima-nova-regular-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNova-RegularItalic.otf',
  },
  ProximaNovaCondSemibold: {
    key: 'ProximaNovaCond-Semibold',
    value: 'proxima-nova-cond-semi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNovaCond-Semibold.otf',
  },
  ProximaNovaSemibold: {
    key: 'ProximaNova-Semibold',
    value: 'proxima-nova-semi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNova-Semibold.otf',
  },
  ProximaNovaSemiboldItalic: {
    key: 'ProximaNova-SemiboldItalic',
    value: 'proxima-nova-semi-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNova-SemiboldItalic.otf',
  },
  ProximaNovaCondSemiboldIt: {
    key: 'ProximaNovaCond-SemiboldIt',
    value: 'proxima-nova-cond-semi-bold-it',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNovaCond-SemiboldIt.otf',
  },
  ProximaNovaBold: {
    key: 'ProximaNova-Bold',
    value: 'proxima-nova-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNova-Bold.otf',
  },
  ProximaNovaBoldIt: {
    key: 'ProximaNova-BoldIt',
    value: 'proxima-nova-bold-it',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNova-BoldIt.otf',
  },
  ProximaNovaBoldWebfont: {
    key: 'ProximaNova-Bold-Webfont',
    value: 'proxima-nova-bold-webfont',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNova-Bold-Webfont.ttf',
  },
  ProximaNovaExtrabold: {
    key: 'ProximaNova-Extrabold',
    value: 'proxima-nova-extra-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNova-Extrabold.otf',
  },
  ProximaNovaBlack: {
    key: 'ProximaNova-Black',
    value: 'proxima-nova-black',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'proxima-nova-font/ProximaNova-Black.otf',
  },
  MYRIADPROLight: {
    key: 'MYRIADPRO-Light',
    value: 'myriad-pro-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'MYRIADPRO/MyriadPro-Light.otf',
  },
  MYRIADPROCOND: {
    key: 'MYRIADPRO-COND',
    value: 'myriad-pro-cn',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'MYRIADPRO/MYRIADPRO-COND.OTF',
  },
  MYRIADPROCONDIT: {
    key: 'MYRIADPRO-CONDIT',
    value: 'myriad-pro-cn-it',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'MYRIADPRO/MYRIADPRO-CONDIT.OTF',
  },
  MYRIADPROREGULAR: {
    key: 'MYRIADPRO-REGULAR',
    value: 'myriad-pro-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'MYRIADPRO/MYRIADPRO-REGULAR.OTF',
  },
  MYRIADPROSEMIBOLD: {
    key: 'MYRIADPRO-SEMIBOLD',
    value: 'myriad-pro-semi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'MYRIADPRO/MYRIADPRO-SEMIBOLD.OTF',
  },
  MYRIADPROSEMIBOLDIT: {
    key: 'MYRIADPRO-SEMIBOLDIT',
    value: 'myriad-pro-semi-bold-it',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'MYRIADPRO/MYRIADPRO-SEMIBOLDIT.OTF',
  },

  MyriadProBold: {
    key: 'MyriadPro-Bold',
    value: 'myriad-pro-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'MYRIADPRO/MyriadPro-Bold.otf',
  },
  MYRIADPROBOLDCOND: {
    key: 'MYRIADPRO-BOLDCOND',
    value: 'myriad-pro-bold-cn',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'MYRIADPRO/MYRIADPRO-BOLDCOND.OTF',
  },
  MYRIADPROBOLDCONDIT: {
    key: 'MYRIADPRO-BOLDCONDIT',
    value: 'myriad-pro-bold-cn-it',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'MYRIADPRO/MYRIADPRO-BOLDCONDIT.OTF',
  },
  MYRIADPROBOLDIT: {
    key: 'MYRIADPRO-BOLDIT',
    value: 'myriad-pro-bold-it',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'MYRIADPRO/MYRIADPRO-BOLDIT.OTF',
  },
  MyriadProBlackSemiCn: {
    key: 'MyriadPro-BlackSemiCn',
    value: 'myriad-pro-black-semi-cn',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'MYRIADPRO/MyriadPro-BlackSemiCn.otf',
  },
  MyriadArabicRegular: {
    key: 'MyriadArabic-Regular',
    value: 'myriad-arabic-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'myriad-arabic/MyriadArabic-Regular.ttf',
  },
  MyriadArabicRegularItalic: {
    key: 'MyriadArabic-Regular-Italic',
    value: 'myriad-arabic-regular-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'myriad-arabic/MyriadArabic-Regular-Italic.otf',
  },
  MyriadArabicBold: {
    key: 'MyriadArabic-Bold',
    value: 'myriad-arabic-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'myriad-arabic/MyriadArabic-Bold.otf',
  },
  MyriadArabicBoldItalic: {
    key: 'MyriadArabic-Bold-Italic',
    value: 'myriad-arabic-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'myriad-arabic/MyriadArabic-Bold-Italic.otf',
  },
  TheMixArabRegular: {
    key: 'TheMixArab-Regular',
    value: 'the-mix-arab-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'the-mix-arab/TheMixArab-Regular.ttf',
  },
  TheMixArabBold: {
    key: 'TheMixArab-Bold',
    value: 'the-mix-arab-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'the-mix-arab/TheMixArab-Bold.ttf',
  },
  TheMixArabBlack: {
    key: 'TheMixArab-Black',
    value: 'the-mix-arab-black',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'the-mix-arab/TheMixArab-Black.ttf',
  },
  EuclidSquareLight: {
    key: 'EuclidSquare-Light',
    value: 'euclid-square-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'euclid-square/EuclidSquare-Light.ttf',
  },
  EuclidSquareRegular: {
    key: 'EuclidSquare-Regular',
    value: 'euclid-square-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'euclid-square/EuclidSquare-Regular.ttf',
  },
  EuclidSquareMedium: {
    key: 'EuclidSquare-Medium',
    value: 'euclid-square-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'euclid-square/EuclidSquare-Medium.ttf',
  },
  EuclidSquareSemiBold: {
    key: 'EuclidSquare-SemiBold',
    value: 'euclid-square-semi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'euclid-square/EuclidSquare-SemiBold.ttf',
  },
  EuclidSquareBold: {
    key: 'EuclidSquare-Bold',
    value: 'euclid-square-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'euclid-square/EuclidSquare-Bold.ttf',
  },
  HelveticaNeueLTArabicRoman: {
    key: 'HelveticaNeueLT-Arabic-Roman',
    value: 'helvetica-neue-lt-arabic-roman',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'helvetica-neue/HelveticaNeueLT-Arabic-Roman.ttf',
  },
  HelveticaNeueLTArabicBold: {
    key: 'HelveticaNeueLT-Arabic-Bold',
    value: 'helvetica-neue-lt-arabic-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'helvetica-neue/HelveticaNeueLT-Arabic-Bold.ttf',
  },
  LamaSansLight: {
    key: 'LamaSans-Light',
    value: 'lama-sans-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'lama-sans/LamaSans-Light.otf',
  },
  LamaSansRegular: {
    key: 'LamaSans-Regular',
    value: 'lama-sans-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'lama-sans/LamaSans-Regular.otf',
  },
  LamaSansMedium: {
    key: 'LamaSans-Medium',
    value: 'lama-sans-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'lama-sans/LamaSans-Medium.otf',
  },
  LamaSansBold: {
    key: 'LamaSans-Bold',
    value: 'lama-sans-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'lama-sans/LamaSans-Bold.otf',
  },
  LamaSansBlack: {
    key: 'LamaSans-Black',
    value: 'lama-sans-black',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'lama-sans/LamaSans-Black.otf',
  },
  RuaqArabicLight: {
    key: 'RuaqArabic-Light',
    value: 'ruaq-arabic-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'lama-sans/RuaqArabic-Light.ttf',
  },
  RuaqArabicMedium: {
    key: 'RuaqArabic-Medium',
    value: 'ruaq-arabic-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'lama-sans/RuaqArabic-Medium.ttf',
  },
  RuaqArabicBold: {
    key: 'RuaqArabic-Bold',
    value: 'ruaq-arabic-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'lama-sans/RuaqArabic-Medium.ttf',
  },
  HtArkanLight: {
    key: 'HtArkan-Light',
    value: 'ht-arkan-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ht-arkan-arabic/ht-arkan-light.otf',
  },
  HtArkanRegular: {
    key: 'HtArkan-Regular',
    value: 'ht-arkan-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ht-arkan-arabic/ht-arkan-regular.otf',
  },
  HtArkanMedium: {
    key: 'HtArkan-Medium',
    value: 'ht-arkan-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ht-arkan-arabic/ht-arkan-medium.otf',
  },
  HtArkan: {
    key: 'HtArkan',
    value: 'ht-arkan',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ht-arkan-arabic/ht-arkan.otf',
  },
  NewMurabbaLight: {
    key: 'NewMurabba-Light',
    value: 'new-murabba-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'new-murabba-cy/new-murabba-light.otf',
  },
  NewMurabbaRegular: {
    key: 'NewMurabba-Regular',
    value: 'new-murabba-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'new-murabba-cy/new-murabba-regular.otf',
  },
  NewMurabbaSemiBold: {
    key: 'NewMurabba-SemiBold',
    value: 'new-murabba-semi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'new-murabba-cy/new-murabba-semi-bold.otf',
  },
  NewMurabbaExtraBold: {
    key: 'NewMurabba-ExtraBold',
    value: 'new-murabba-extra-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'new-murabba-cy/new-murabba-extra-bold.otf',
  },
  GEDinarRegular: {
    key: 'GE-Dinar-Regular',
    value: 'ge-dinar-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ge-dinar/ge-dinar-one-regular.otf',
  },
  GEDinarOneMedium: {
    key: 'GE-Dinar-One-Medium',
    value: 'ge-dinar-one-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ge-dinar/GE_Dinar_One_Medium.otf',
  },
  GEDinarOneBold: {
    key: 'GE-Dinar-One-Bold',
    value: 'ge-dinar-one-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ge-dinar/GE-Dinar-One-Bold.ttf',
  },
  GEDinarTwoLightItalic: {
    key: 'GE-Dinar-Two-Light-Italic',
    value: 'ge-dinar-two-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ge-dinar/GE-Dinar-Two-Light-Italic.otf',
  },
  GEDinarTwoMedium: {
    key: 'GE-Dinar-Two-Medium',
    value: 'ge-dinar-two-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ge-dinar/GE-Dinar-Two-Medium.otf',
  },
  GEDinarTwoMediumItalic: {
    key: 'GE-Dinar-Two-Medium-Italic',
    value: 'ge-dinar-two-medium-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ge-dinar/GE-Dinar-Two-Medium-Italic.otf',
  },
  SSTArabicRoman: {
    key: 'SST-Arabic-Roman',
    value: 'sst-arabic-roman',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'sst-arabic/sst-arabic-roman.ttf',
  },
  SSTArabicMedium: {
    key: 'SST-Arabic-Medium',
    value: 'sst-arabic-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'sst-arabic/sst-arabic-medium.ttf',
  },
  SSTArabicBold: {
    key: 'SST-Arabic-Bold',
    value: 'sst-arabic-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'sst-arabic/sst-arabic-bold.ttf',
  },
  IBMPlexExtraLight: {
    key: 'IBM-Plex-Sans-Arabic-Extra-Light',
    value: 'ibm-plex-sans-arabic-extra-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ibm-plex-sans-arabic/ibm-plex-sans-arabic-extra-light.ttf',
  },
  IBMPlexLight: {
    key: 'IBM-Plex-Sans-Arabic-Light',
    value: 'ibm-plex-sans-arabic-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ibm-plex-sans-arabic/ibm-plex-sans-arabic-light.ttf',
  },
  IBMPlexRegular: {
    key: 'IBM-Plex-Sans-Arabic-Regular',
    value: 'ibm-plex-sans-arabic-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ibm-plex-sans-arabic/ibm-plex-sans-arabic-regular.ttf',
  },
  IBMPlexMedium: {
    key: 'IBM-Plex-Sans-Arabic-Medium',
    value: 'ibm-plex-sans-arabic-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ibm-plex-sans-arabic/ibm-plex-sans-arabic-medium.ttf',
  },
  IBMPlexSemiBold: {
    key: 'IBM-Plex-Sans-Arabic-Semi-Bold',
    value: 'ibm-plex-sans-arabic-semi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ibm-plex-sans-arabic/ibm-plex-sans-arabic-semi-bold.ttf',
  },
  IBMPlexBold: {
    key: 'IBM-Plex-Sans-Arabic-Bold',
    value: 'ibm-plex-sans-arabic-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'ibm-plex-sans-arabic/ibm-plex-sans-arabic-bold.ttf',
  },
  ParalucentCondThin: {
    key: 'Paralucent-Cond-Thin',
    value: 'paralucent-cond-thin',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentCondThin.otf',
  },
  ParalucentThin: {
    key: 'Paralucent-Thin',
    value: 'paralucent-thin',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentThin.otf',
  },
  ParalucentStencilExtraLight: {
    key: 'Paralucent-Stencil-Extra-Light',
    value: 'paralucent-stencil-extra-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentStencilExtraLight.otf',
  },
  ParalucentCondExtraLight: {
    key: 'Paralucent-Cond-Extra-Light',
    value: 'paralucent-cond-extra-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentCondExtraLight.otf',
  },
  ParalucentExtraLight: {
    key: 'Paralucent-Extra-Light',
    value: 'paralucent-extra-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentExtraLight.otf',
  },
  ParalucentCondLight: {
    key: 'Paralucent-Cond-Light',
    value: 'paralucent-cond-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentCondLight.otf',
  },
  ParalucentTextBook: {
    key: 'Paralucent-Text-Book',
    value: 'paralucent-text-book',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentTextBook.otf',
  },
  ParalucentCondMedium: {
    key: 'Paralucent-Cond-Medium',
    value: 'paralucent-cond-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentCondMedium.otf',
  },
  ParalucentMedium: {
    key: 'Paralucent-Medium',
    value: 'paralucent-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentMedium.otf',
  },
  ParalucentStencilMeduim: {
    key: 'Paralucent-Stencil-Meduim',
    value: 'paralucent-stencil-meduim',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentStencilMedium.otf',
  },
  ParalucentCondSimiBoldIT: {
    key: 'Paralucent-Cond-Simi-Bold-IT',
    value: 'paralucent-cond-simi-bold-it',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentCondDemiBoldIt.otf',
  },
  ParalucentSimiBold: {
    key: 'Paralucent-Simi-Bold',
    value: 'paralucent-simi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentDemiBold.otf',
  },
  ParalucentCondSimiBold: {
    key: 'Paralucent-Cond-Simi-Bold',
    value: 'paralucent-cond-simi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentCondDemiBold.otf',
  },
  ParalucentCondBold: {
    key: 'Paralucent-Cond-Bold',
    value: 'paralucent-cond-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentCondBold.otf',
  },
  ParalucentTextBold: {
    key: 'Paralucent-Text-Bold',
    value: 'paralucent-text-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentTextBold.otf',
  },
  ParalucentBold: {
    key: 'Paralucent-Bold',
    value: 'paralucent-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentBold.otf',
  },
  ParalucentCondHeavy: {
    key: 'Paralucent-Cond-Heavy',
    value: 'paralucent-cond-heavy',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentCondHeavy.otf',
  },
  ParalucentHeavy: {
    key: 'Paralucent-Heavy',
    value: 'paralucent-heavy',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentHeavy.otf',
  },
  ParalucentStencilHeavy: {
    key: 'Paralucent-Stencil-Heavy',
    value: 'paralucent-stencil-heavy',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Paralucent/ParalucentStencilHeavy.otf',
  },
  TitilliumThin: {
    key: 'Titillium-Thin',
    value: 'titillium-thin',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-Thin.otf',
  },
  TitilliumThinItalic: {
    key: 'Titillium-Thin-Italic',
    value: 'titillium-thin-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-ThinItalic.otf',
  },
  TitilliumThinUpright: {
    key: 'Titillium-Thin-Upright',
    value: 'titillium-thin-upright',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-ThinUpright.otf',
  },
  TitilliumLight: {
    key: 'Titillium-Light',
    value: 'titillium-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-Light.otf',
  },
  TitilliumLightItalic: {
    key: 'Titillium-Light-Italic',
    value: 'titillium-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-Light-Italic.otf',
  },
  TitilliumLightUpright: {
    key: 'Titillium-Light-Upright',
    value: 'titillium-light-upright',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Titillium-Light-Upright.otf',
  },
  TitilliumRegular: {
    key: 'Titillium-Regular',
    value: 'titillium-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-Regular.otf',
  },
  TitilliumRegularItalic: {
    key: 'Titillium-Regular-Italic',
    value: 'titillium-regular-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-Regular-Italic.otf',
  },
  TitilliumRegularUpright: {
    key: 'Titillium-Regular-Upright',
    value: 'titillium-regular-upright',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-Regular-Upright.otf',
  },
  TitilliumSimiBold: {
    key: 'Titillium-Simi-bold',
    value: 'titillium-simi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-Semibold.otf',
  },
  TitilliumSimiBoldItalic: {
    key: 'Titillium-Simi-bold-Italic',
    value: 'titillium-simi-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-SemiboldItalic.otf',
  },
  TitilliumSimiBoldUpright: {
    key: 'Titillium-Simi-bold-Upright',
    value: 'titillium-simi-bold-upright',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-SemiboldUpright.otf',
  },
  TitilliumBold: {
    key: 'Titillium-Bold',
    value: 'titillium-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-Bold.otf',
  },
  TitilliumBoldItalic: {
    key: 'Titillium-Bold-Italic',
    value: 'titillium-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-Bold-Italic.otf',
  },
  TitilliumBoldUpright: {
    key: 'Titillium-Bold-Upright',
    value: 'titillium-bold-upright',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-Bold-Upright.otf',
  },
  TitilliumBlack: {
    key: 'Titillium-Black',
    value: 'titillium-black',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'titillium/Titillium-Black.otf',
  },
  QuestaGrandeRegular: {
    key: 'Questa-Grande-Regular',
    value: 'questa-grande-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'questa-grande/Questa_Grande_Regular.otf',
  },
  TerminaThin: {
    key: 'Termina-Thin',
    value: 'termina-thin',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Termina/Termina-Thin.otf',
  },
  TerminaExtraLight: {
    key: 'Termina-Extra-Light',
    value: 'termina-extra-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Termina/Termina-ExtraLight.otf',
  },
  TerminaLight: {
    key: 'Termina-Light',
    value: 'termina-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Termina/Termina-Light.otf',
  },
  TerminaRegular: {
    key: 'Termina-Regular',
    value: 'termina-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Termina/Termina-Regular.otf',
  },
  TerminaMedium: {
    key: 'Termina-Medium',
    value: 'termina-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Termina/Termina-Medium.otf',
  },
  TerminaSimiBold: {
    key: 'Termina-Simi-Bold',
    value: 'termina-simi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Termina/Termina-Demi.otf',
  },
  TerminaBold: {
    key: 'Termina-Bold',
    value: 'termina-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Termina/Termina-Bold.otf',
  },
  TerminaHeavy: {
    key: 'Termina-Heavy',
    value: 'termina-heavy',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Termina/Termina-Heavy.otf',
  },
  TerminaBlack: {
    key: 'Termina-Black',
    value: 'termina-black',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Termina/Termina-Black.otf',
  },
  NotoKufiArabicLight: {
    key: 'Noto-Kufi-Arabic-Light',
    value: 'noto-kufi-arabic-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'NotoKufi/Noto-Kufi-Arabic-Light.ttf',
  },
  NotoKufiArabicRegular: {
    key: 'Noto-Kufi-Arabic-Regular',
    value: 'noto-kufi-arabic-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'NotoKufi/Noto-Kufi-Arabic-Regular.ttf',
  },
  MontserratLight: {
    key: 'Montserrat-Light',
    value: 'montserrat-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Montserrat/Montserrat-Light.ttf',
  },
  MontserratRegular: {
    key: 'Montserrat-Regular',
    value: 'montserrat-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'Montserrat/Montserrat-Regular.ttf',
  },
  GEThameenLightItalic: {
    key: 'GE-Thameen-Light-Italic',
    value: 'ge-thameen-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Thameen/GE-Thameen-Light-Italic.otf',
  },
  GEThameenBookItalic: {
    key: 'GE-Thameen-Book-Italic',
    value: 'ge-thameen-book-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Thameen/GE-Thameen-Book-Italic.otf',
  },
  GEThameenSimiBoldItalic: {
    key: 'GE-Thameen-Simi-Bold-Italic',
    value: 'ge-thameen-simi-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Thameen/GE-Thameen-DemiBold-Italic.otf',
  },
  GESSTextUltraLight: {
    key: 'GE-SS-Text-Ultra-Light',
    value: 'ge-ss-text-ultra-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE-SS-Text-UltraLight.otf',
  },
  GESSTextLight: {
    key: 'GE-SS-Text-Light',
    value: 'ge-ss-text-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE-SS-Text-Light.otf',
  },
  GESSTextLightItalic: {
    key: 'GE-SS-Text-Light-Italic',
    value: 'ge-ss-text-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS-Text-Light-Italic.otf',
  },
  GESSTextMedium: {
    key: 'GE-SS-Text-Medium',
    value: 'ge-ss-text-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE-SS-Text-Medium.otf',
  },
  GESSTextBold: {
    key: 'GE-SS-Text-Bold',
    value: 'ge-ss-text-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE-SS-Text-Bold.otf',
  },
  GESSThreeLight: {
    key: 'GE-SS-Three-Light',
    value: 'ge-ss-three-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE-SS-Three-Light.otf',
  },
  GESSTVLight: {
    key: 'GE-SS-TV-Light',
    value: 'ge-ss-tv-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE-SS-TV-Light.otf',
  },
  GESSTVMedium: {
    key: 'GE-SS-TV-Medium',
    value: 'ge-ss-tv-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE-SS-TV-Medium.otf',
  },
  GESSTVBold: {
    key: 'GE-SS-TV-Bold',
    value: 'ge-ss-tv-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE-SS-TV-Bold.otf',
  },
  GESSTwoLight: {
    key: 'GE-SS-Two-Light',
    value: 'ge-ss-two-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE_SS_Two_Light.otf',
  },
  GESSTwoMedium: {
    key: 'GE-SS-Two-Medium',
    value: 'ge-ss-two-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE_SS_Two_Medium.otf',
  },
  GESSTwoBold: {
    key: 'GE-SS-Two-Bold',
    value: 'ge-ss-two-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE_SS_Two_Bold.otf',
  },
  GESSUniqueLight: {
    key: 'GE-SS-Unique-Light',
    value: 'ge-ss-unique-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE_SS_Unique_Light.otf',
  },
  GESSUniqueb: {
    key: 'GE-SS-Unique-Bold',
    value: 'ge-ss-unique-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-SS/GE_SS_Unique_Bold.otf',
  },
  GEModernLight: {
    key: 'GE-Modern-Light',
    value: 'ge-modern-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Modern/GE-Modern-Light.otf',
  },
  GEModernMedium: {
    key: 'GE-Modern-Medium',
    value: 'ge-modern-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Modern/GE-Modern-Medium.otf',
  },
  GEModernBold: {
    key: 'GE-Modern-Bold',
    value: 'ge-modern-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Modern/GE-Modern-Bold.otf',
  },
  GEMBCondensedLight: {
    key: 'GE-MB-Condensed-Light',
    value: 'ge-mb-condensed-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Condensed-Light.otf',
  },
  GEMBMedium: {
    key: 'GE-MB-Medium',
    value: 'ge-mb-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Medium.otf',
  },
  GEMBMediumItalic: {
    key: 'GE-MB-Medium-Italic',
    value: 'ge-mb-medium-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Medium-Italic.otf',
  },
  GEMBBold: {
    key: 'GE-MB-Bold',
    value: 'ge-mb-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Bold.otf',
  },
  GEMBFarashaLight: {
    key: 'GE-MB-Farasha-Light',
    value: 'ge-mb-farasha-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Farasha-Light.otf',
  },
  GEMBFarashaMedium: {
    key: 'GE-MB-Farasha-Medium',
    value: 'ge-mb-farasha-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Farasha-Medium.otf',
  },
  GEMBFarashaMediumItalic: {
    key: 'GE-MB-Farasha-Medium-Italic',
    value: 'ge-mb-farasha-medium-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Farasha-Medium-Italic.otf',
  },
  GEMBFarashaBold: {
    key: 'GE-MB-Farasha-Bold',
    value: 'ge-mb-farasha-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Farasha-Bold.otf',
  },
  GEMBFaresLight: {
    key: 'GE-MB-Fares-Light',
    value: 'ge-mb-fares-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Fares-Light.otf',
  },
  GEMBFaresMedium: {
    key: 'GE-MB-Fares-Medium',
    value: 'ge-mb-fares-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Fares-Medium.otf',
  },
  GEMBFaresMediumItalic: {
    key: 'GE-MB-Fares-Medium-Italic',
    value: 'ge-mb-fares-medium-Italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Fares-Medium-Italic.otf',
  },
  GEMBFaresBold: {
    key: 'GE-MB-Fares-Bold',
    value: 'ge-mb-fares-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Fares-Bold.otf',
  },
  GEMBNajmLight: {
    key: 'GE-MB-Najm-Light',
    value: 'ge-mb-najm-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Najm-Light.otf',
  },
  GEMBNajmMedium: {
    key: 'GE-MB-Najm-Medium',
    value: 'ge-mb-najm-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Najm-Medium.otf',
  },
  GEMBNajmMediumItalic: {
    key: 'GE-MB-Najm-Medium-Italic',
    value: 'ge-mb-najm-medium-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Najm-Medium-Italic.otf',
  },
  GEMBNajmBold: {
    key: 'GE-MB-Najm-Bold',
    value: 'ge-mb-najm-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Mb/GE-MB-Najm-Bold.otf',
  },
  GEHeritageOneUltraLight: {
    key: 'GE-Heritage-One-Ultra-Light',
    value: 'ge-heritage-one-ultra-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Heritage/GE-Heritage-One-Ultra-Light.otf',
  },
  GEHeritageOneLight: {
    key: 'GE-Heritage-One-Light',
    value: 'ge-heritage-one-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Heritage/GE-Heritage-One-Light.otf',
  },
  GEHeritageOneMedium: {
    key: 'GE-Heritage-One-Medium',
    value: 'ge-heritage-one-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Heritage/GE-Heritage-One-Medium.otf',
  },
  GEHeritageOneBold: {
    key: 'GE-Heritage-One-Bold',
    value: 'ge-heritage-one-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Heritage/GE-Heritage-One-Bold.otf',
  },
  GEHeritageTwoLightItalic: {
    key: 'GE-Heritage-Two-Light-Italic',
    value: 'ge-heritage-two-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Heritage/GE-Heritage-Two-Light-Italic.otf',
  },
  GEHeritageTwoMedium: {
    key: 'GE-Heritage-Two-Medium',
    value: 'ge-heritage-two-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Heritage/GE-Heritage-Two-Medium.otf',
  },
  GEHeritageTwoBold: {
    key: 'GE-Heritage-Two-Bold',
    value: 'ge-heritage-two-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Heritage/GE-Heritage-Two-Bold.otf',
  },
  GEElegantItalic: {
    key: 'GE-Elegant-Italic',
    value: 'ge-elegant-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Elegant/GE-Elegant-Italic.otf',
  },
  GEElegantMedium: {
    key: 'GE-Elegant-Medium',
    value: 'ge-elegant-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Elegant/GE-Elegant-Medium.otf',
  },
  GEElegantBold: {
    key: 'GE-Elegant-Bold',
    value: 'ge-elegant-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE-Elegant/GE-Elegant-Bold.otf',
  },
  GEBoxBold: {
    key: 'GE-Box-Bold',
    value: 'ge-box-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Box-Bold.otf',
  },
  GECapMedium: {
    key: 'GE-Cap-Medium',
    value: 'ge-cap-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Cap-Medium.otf',
  },
  GEContrastBold: {
    key: 'GE-Contrast-Bold',
    value: 'ge-contrast-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Contrast-Bold.otf',
  },
  GECurvesMedium: {
    key: 'GE-Curves-Medium',
    value: 'ge-curves-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Curves-Medium.otf',
  },
  GEEastExtraBoldItalic: {
    key: 'GE-East-Extra-Bold-Italic',
    value: 'ge-east-extra-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-East-Extra-Bold-Italic.otf',
  },
  GEFlowBoldItalic: {
    key: 'GE-Flow-Bold-Italic',
    value: 'ge-flow-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Flow-Bold-Italic.otf',
  },
  GEFlowRegularItalic: {
    key: 'GE-Flow-Regular-Italic',
    value: 'ge-flow-regular-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-East-Extra-Bold-Italic.otf',
  },
  GEHiliBook: {
    key: 'GE-Hili-Book',
    value: 'ge-hili-book',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Hili-Book.otf',
  },
  GEHiliLight: {
    key: 'GE-Hili-Light',
    value: 'ge-hili-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Hili-Light.otf',
  },
  GEJaridaHeavy: {
    key: 'GE-Jarida-Heavy',
    value: 'ge-jarida-heavy',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Jarida-Heavy.otf',
  },
  GEJaridaHeavyItalic: {
    key: 'GE-Jarida-Heavy-Italic',
    value: 'ge-jarida-heavy-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Jarida-Heavy-Italic.otf',
  },
  GELadyMedium: {
    key: 'GE-Lady-Medium',
    value: 'ge-lady-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Lady-Medium.otf',
  },
  GEMeemMedium: {
    key: 'GE-Meem-Medium',
    value: 'ge-meem-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Meem-Medium.otf',
  },
  GEMinaretMedium: {
    key: 'GE-Minaret-Medium',
    value: 'ge-minaret-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Minaret-Medium.otf',
  },
  GENarrowLight: {
    key: 'GE-Narrow-Light',
    value: 'ge-narrow-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Narrow-Light.otf',
  },
  GENewBold: {
    key: 'GE-New-Bold',
    value: 'ge-new-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-New-Bold.otf',
  },
  GEQantaratExtraBold: {
    key: 'GE-Qantarat-Extra-Bold',
    value: 'ge-qantarat-extra-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Qantarat-Extra-Bold.otf',
  },
  GESerifMedium: {
    key: 'GE-Serif-Medium',
    value: 'ge-serif-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Serif-Medium.otf',
  },
  GESmoothLight: {
    key: 'GE-Smooth-Light',
    value: 'ge-smooth-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Smooth-Light.otf',
  },
  GESndBook: {
    key: 'GE-Snd-Book',
    value: 'ge-snd-book',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Snd-Book.ttf',
  },
  GETailMedium: {
    key: 'GE-Tail-Medium',
    value: 'ge-tail-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Tail-Medium.otf',
  },
  GETasmeemMedium: {
    key: 'GE-Tasmeem-Medium',
    value: 'ge-tasmeem-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Tasmeem-Medium.otf',
  },
  GEThuluthLight: {
    key: 'GE-Thuluth-Light',
    value: 'ge-thuluth-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Thuluth-Light.otf',
  },
  GEWideExtraBold: {
    key: 'GE-Wide-Extra-Bold',
    value: 'ge-wide-extra-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'GE/GE-Wide-Extra-Bold.otf',
  },
  TanseekModernProBold: {
    key: 'Tanseek-Modern-Pro-Bold',
    value: 'tanseek-modern-pro-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'tanseek-modern-pro/tanseek-modern-pro-bold.otf',
  },
  TanseekModernProMedium: {
    key: 'Tanseek-Modern-Pro-Medium',
    value: 'tanseek-modern-pro-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'tanseek-modern-pro/tanseek-modern-pro-medium.otf',
  },
  TanseekModernProLight: {
    key: 'Tanseek-Modern-Pro-Light',
    value: 'tanseek-modern-pro-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'tanseek-modern-pro/tanseek-modern-pro-light.otf',
  },
  CoHeadlineLight: {
    key: 'Co-Headline-Light',
    value: 'co-headline-light',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'co-headline/Co-Headline-Light.otf',
  },
  CoHeadlineRegular: {
    key: 'Co-Headline-Regular',
    value: 'co-headline-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'co-headline/Co-Headline.otf',
  },
  CoHeadlineBold: {
    key: 'Co-Headline-Bold',
    value: 'co-headline-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig).map((item) => item.key),
    filePath: 'co-headline/Co-Headline-Bold.otf',
  },
  NotoSansExtraLight: {
    key: 'Noto-Sans-ExtraLight',
    value: 'noto-sans-extra-light',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-ExtraLight.ttf',
  },
  NotoSansExtraLightItalic: {
    key: 'Noto-Sans-ExtraLightItalic',
    value: 'noto-sans-extra-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-ExtraLightItalic.ttf',
  },
  NotoSansLight: {
    key: 'Noto-Sans-Light',
    value: 'noto-sans-light',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-Light.ttf',
  },
  NotoSansLightItalic: {
    key: 'Noto-Sans-LightItalic',
    value: 'noto-sans-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-LightItalic.ttf',
  },
  NotoSansThin: {
    key: 'Noto-Sans-Thin',
    value: 'noto-sans-thin',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-Thin.ttf',
  },
  NotoSansThinItalic: {
    key: 'Noto-Sans-ThinItalic',
    value: 'noto-sans-thin-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-ThinItalic.ttf',
  },
  NotoSansRegular: {
    key: 'Noto-Sans-Regular',
    value: 'noto-sans-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-Regular.ttf',
  },
  NotoSansMedium: {
    key: 'Noto-Sans-Medium',
    value: 'noto-sans-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-Medium.ttf',
  },
  NotoSansMediumItalic: {
    key: 'Noto-Sans-MediumItalic',
    value: 'noto-sans-medium-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-MediumItalic.ttf',
  },
  NotoSansSemiBold: {
    key: 'Noto-Sans-SemiBold',
    value: 'noto-sans-semi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-SemiBold.ttf',
  },
  NotoSansSemiBoldItalic: {
    key: 'Noto-Sans-SemiBoldItalic',
    value: 'noto-sans-semi-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-SemiBoldItalic.ttf',
  },
  NotoSansBold: {
    key: 'Noto-Sans-Bold',
    value: 'noto-sans-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-Bold.ttf',
  },
  NotoSansBoldItalic: {
    key: 'Noto-Sans-BoldItalic',
    value: 'noto-sans-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-BoldItalic.ttf',
  },
  NotoSansExtraBold: {
    key: 'Noto-Sans-ExtraBold',
    value: 'noto-sans-extra-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-ExtraBold.ttf',
  },
  NotoSansExtraBoldItalic: {
    key: 'Noto-Sans-ExtraBoldItalic',
    value: 'noto-sans-extra-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-ExtraBoldItalic.ttf',
  },
  NotoSansBlack: {
    key: 'Noto-Sans-Black',
    value: 'noto-sans-black',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-Black.ttf',
  },
  NotoSansBlackItalic: {
    key: 'Noto-Sans-BlackItalic',
    value: 'noto-sans-black-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'noto-sans/NotoSans-BlackItalic.ttf',
  },
  IBMPlexSansEnglishExtraLight: {
    key: 'IBM-Plex-Sans-English-Extra-Light',
    value: 'ibm-plex-sans-english-extra-light',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'ibm-plex-sans-english/IBM-Plex-Sans-English-ExtraLight.ttf',
  },
  IBMPlexSansEnglishExtraLightItalic: {
    key: 'IBM-Plex-Sans-English-Extra-Light-Italic',
    value: 'ibm-plex-sans-english-extra-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'ibm-plex-sans-english/IBM-Plex-Sans-English-ExtraLightItalic.ttf',
  },
  IBMPlexSansEnglishLight: {
    key: 'IBM-Plex-Sans-English-Light',
    value: 'ibm-plex-sans-english-light',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'ibm-plex-sans-english/IBM-Plex-Sans-English-Light.ttf',
  },
  IBMPlexSansEnglishLightItalic: {
    key: 'IBM-Plex-Sans-English-Light-Italic',
    value: 'ibm-plex-sans-english-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'ibm-plex-sans-english/IBM-Plex-Sans-English-LightItalic.ttf',
  },
  IBMPlexSansEnglishThin: {
    key: 'IBM-Plex-Sans-English-Thin',
    value: 'ibm-plex-sans-english-thin',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'ibm-plex-sans-english/IBM-Plex-Sans-English-Thin.ttf',
  },
  IBMPlexSansEnglishThinItalic: {
    key: 'IBM-Plex-Sans-English-Thin-Italic',
    value: 'ibm-plex-sans-english-thin-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'ibm-plex-sans-english/IBM-Plex-Sans-English-ThinItalic.ttf',
  },
  ZazaTypeLinaSansBold: {
    key: 'Zaza-Type-Lina-Sans-Bold',
    value: 'zaza-type-lina-sans-bold',
    supportedLanguages: [SystemLanguagesConfig.ar.key],
    filePath: 'zaza-type-lina-sans/Zaza-Type-Lina-Sans-Bold.otf',
  },
  ZazaTypeLinaSansSemiBold: {
    key: 'Zaza-Type-Lina-Sans-Semi-Bold',
    value: 'zaza-type-lina-sans-simi-bold',
    supportedLanguages: [SystemLanguagesConfig.ar.key],
    filePath: 'zaza-type-lina-sans/Zaza-Type-Lina-Sans-SemiBold.otf',
  },
  ZazaTypeLinaSansExtraLight: {
    key: 'Zaza-Type-Lina-Sans-Extra-Light',
    value: 'zaza-type-lina-sans-extra-light',
    supportedLanguages: [SystemLanguagesConfig.ar.key],
    filePath: 'zaza-type-lina-sans/Zaza-Type-Lina-Sans-ExtraLight.otf',
  },
  ZazaTypeLinaSansLight: {
    key: 'Zaza-Type-Lina-Sans-Light',
    value: 'zaza-type-lina-sans-light',
    supportedLanguages: [SystemLanguagesConfig.ar.key],
    filePath: 'zaza-type-lina-sans/Zaza-Type-Lina-Sans-Light.otf',
  },
  ZazaTypeLinaSansMedium: {
    key: 'Zaza-Type-Lina-Sans-Medium',
    value: 'zaza-type-lina-sans-medium',
    supportedLanguages: [SystemLanguagesConfig.ar.key],
    filePath: 'zaza-type-lina-sans/Zaza-Type-Lina-Sans-Medium.otf',
  },
  ZazaTypeLinaSansRegular: {
    key: 'Zaza-Type-Lina-Sans-Regular',
    value: 'zaza-type-lina-sans-regular',
    supportedLanguages: [SystemLanguagesConfig.ar.key],
    filePath: 'zaza-type-lina-sans/Zaza-Type-Lina-Sans-Regular.otf',
  },
  ZazaTypeLinaSansThin: {
    key: 'Zaza-Type-Lina-Sans-Thin',
    value: 'zaza-type-lina-sans-thin',
    supportedLanguages: [SystemLanguagesConfig.ar.key],
    filePath: 'zaza-type-lina-sans/Zaza-Type-Lina-Sans-Thin.otf',
  },
  RobotoBlack: {
    key: 'Roboto-Black',
    value: 'roboto-black',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'roboto/Roboto-Black.ttf',
  },
  RobotoBlackItalic: {
    key: 'Roboto-BlackItalic',
    value: 'roboto-black-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'roboto/Roboto-BlackItalic.ttf',
  },
  RobotoBold: {
    key: 'Roboto-Bold',
    value: 'roboto-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'roboto/Roboto-Bold.ttf',
  },
  RobotoBoldItalic: {
    key: 'Roboto-BoldItalic',
    value: 'roboto-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'roboto/Roboto-BoldItalic.ttf',
  },
  RobotoItalic: {
    key: 'Roboto-Italic',
    value: 'roboto-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'roboto/Roboto-Italic.ttf',
  },
  RobotoLight: {
    key: 'Roboto-Light',
    value: 'roboto-light',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'roboto/Roboto-Light.ttf',
  },
  RobotoLightItalic: {
    key: 'Roboto-LightItalic',
    value: 'roboto-light-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'roboto/Roboto-LightItalic.ttf',
  },
  RobotoMedium: {
    key: 'Roboto-Medium',
    value: 'roboto-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'roboto/Roboto-Medium.ttf',
  },
  RobotoMediumItalic: {
    key: 'Roboto-MediumItalic',
    value: 'roboto-medium-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'roboto/Roboto-MediumItalic.ttf',
  },
  RobotoThin: {
    key: 'Roboto-Thin',
    value: 'roboto-thin',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'roboto/Roboto-Thin.ttf',
  },
  RobotoThinItalic: {
    key: 'Roboto-ThinItalic',
    value: 'roboto-thin-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'roboto/Roboto-ThinItalic.ttf',
  },
  PlayfairDisplayBlack: {
    key: 'Playfair-Display-Black',
    value: 'playfair-display-black',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'playfair-display/PlayfairDisplay-Black.ttf',
  },
  PlayfairDisplayBlackItalic: {
    key: 'Playfair-Display-BlackItalic',
    value: 'playfair-display-black-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'playfair-display/PlayfairDisplay-BlackItalic.ttf',
  },
  PlayfairDisplayBold: {
    key: 'Playfair-Display-Bold',
    value: 'playfair-display-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'playfair-display/PlayfairDisplay-Bold.ttf',
  },
  PlayfairDisplayBoldItalic: {
    key: 'Playfair-Display-BoldItalic',
    value: 'playfair-display-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'playfair-display/PlayfairDisplay-BoldItalic.ttf',
  },
  PlayfairDisplayExtraBold: {
    key: 'Playfair-Display-ExtraBold',
    value: 'playfair-display-extra-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'playfair-display/PlayfairDisplay-ExtraBold.ttf',
  },
  PlayfairDisplayExtraBoldItalic: {
    key: 'Playfair-Display-ExtraBoldItalic',
    value: 'playfair-display-extra-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'playfair-display/PlayfairDisplay-ExtraBoldItalic.ttf',
  },
  PlayfairDisplayItalic: {
    key: 'Playfair-Display-Italic',
    value: 'playfair-display-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'playfair-display/PlayfairDisplay-Italic.ttf',
  },
  PlayfairDisplayMedium: {
    key: 'Playfair-Display-Medium',
    value: 'playfair-display-medium',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'playfair-display/PlayfairDisplay-Medium.ttf',
  },
  PlayfairDisplayMediumItalic: {
    key: 'Playfair-Display-MediumItalic',
    value: 'playfair-display-medium-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'playfair-display/PlayfairDisplay-MediumItalic.ttf',
  },
  PlayfairDisplayRegular: {
    key: 'Playfair-Display-Regular',
    value: 'playfair-display-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'playfair-display/PlayfairDisplay-Regular.ttf',
  },
  PlayfairDisplaySemiBold: {
    key: 'Playfair-Display-SemiBold',
    value: 'playfair-display-semi-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'playfair-display/PlayfairDisplay-SemiBold.ttf',
  },
  PlayfairDisplaySemiBoldItalic: {
    key: 'Playfair-Display-SemiBoldItalic',
    value: 'playfair-display-semi-bold-italic',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'playfair-display/PlayfairDisplay-SemiBoldItalic.ttf',
  },
  TelkaTRIALExtendedRegular: {
    key: 'TelkaTRIAL-Extended-Regular',
    value: 'telka-trial-extended-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'telka-trial-extended/TelkaTRIAL-Extended-Regular.otf',
  },
  TelkaTRIALExtendedBold: {
    key: 'TelkaTRIAL-Extended-Bold',
    value: 'telka-trial-extended-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'telka-trial-extended/TelkaTRIAL-Extended-Bold.otf',
  },
  AlmaraiRegular: {
    key: 'Almarai-Regular',
    value: 'almarai-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .map((item) => item.key),
    filePath: 'almarai/Almarai-Regular.ttf',
  },
  AlmaraiExtraBold: {
    key: 'Almarai-ExtraBold',
    value: 'almarai-extra-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .map((item) => item.key),
    filePath: 'almarai/Almarai-ExtraBold.ttf',
  },
  VodafoneRegular: {
    key: 'Vodafone-Regular',
    value: 'vodafone-regular',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'vodafone/VodafoneRg_A.ttf',
  },
  VodafoneLight: {
    key: 'Vodafone-Light',
    value: 'vodafone-light',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'vodafone/VodafoneLt_A.ttf',
  },
  VodafoneRegularBold: {
    key: 'Vodafone-Bold',
    value: 'vodafone-bold',
    supportedLanguages: Object.values(SystemLanguagesConfig)
      .filter((item) => item.key !== SystemLanguagesConfig.ar.key)
      .map((item) => item.key),
    filePath: 'vodafone/VodafoneRgBd_A.ttf',
  },
};
