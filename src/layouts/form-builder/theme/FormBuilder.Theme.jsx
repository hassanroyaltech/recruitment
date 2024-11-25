import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/700.css';
import { createTheme, alpha } from '@mui/material/styles';
import { arSD } from '@mui/material/locale';
import i18next from 'i18next';

// Theme configuration
const FormBuilderTheme = createTheme(
  {
    direction: i18next.dir(),
    palette: {
      primary: {
        main: '#19289B',
        $80: '#4851C8',
        $70: '#73757C',
      },
      secondary: {
        main: '#6663F0',
        $100: '#644DED',
        $80: '#9492FA',
        $16: '#ECE9FC',
        $8: '#F3F1FE',
      },
      dark: {
        main: '#242533',
        $80: '#484964',
        $70: '#1C1D21',
        $60: '#808192',
        $55: '#ECE5DE',
        $50: '#E6E7EA',
        $40: '#9FA0B0',
        $20: '#BCBCC6',
        $16: '#E4E4EB',
        $8: '#EEEEF2',
        $1: '#F4F3F3',
      },
      light: {
        main: '#FFFFFF',
        $3: '#FBFBFB',
        $2: '#F2F2F2',
        $1: '#F8F8FB',
      },
      error: {
        main: '#ED4D57',
        $80: '#F06396',
      },
    },
    spacing: 4,
    // TODO typography clean up
    typography: {
      fontFamily: 'IBM Plex Sans Arabic',
      fontSize: 12,
      fontWeightLight: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: {
        fontSize: '32px',
        fontWeight: 700,
      },
      h2: {
        fontSize: '24px',
        fontWeight: 700,
      },
      h3: {
        fontSize: '22px',
        fontWeight: 700,
      },
      h4: {
        fontSize: '20px',
        fontWeight: 700,
      },
      h5: {
        fontSize: '18px',
        fontWeight: 500,
      },
      h6: {
        fontSize: '16px',
        fontWeight: 500,
      },
      button: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1,
        textTransform: 'initial',
      },
      caption: {
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.5,
      },
      caption11: {
        fontSize: 11,
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body12: {
        fontSize: '12px',
      },
      body13: {
        fontSize: '13px',
      },
      body14: {
        fontSize: '14px',
      },
      body13controls: {
        fontSize: '13px',
        fontWeight: 500,
        lineHeight: 1,
      },
      body13rich: {
        fontSize: '13px',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body13content: {
        fontSize: '13.5px',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body14controls: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1,
      },
      body14rich: {
        fontSize: '14.5px',
        fontWeight: 400,
        lineHeight: 1.5,
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 1024,
        lg: 1366,
        xl: 1920,
        xxl: 2560,
      },
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        // most basic recommended timing
        standard: 300,
        // this is to be used in complex animations
        complex: 375,
        // recommended when something is entering screen
        enteringScreen: 225,
        // recommended when something is leaving screen
        leavingScreen: 195,
      },
      // Manual easing for smoother transition
      easing: {
        // This is the most common easing curve.
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        // Objects enter the screen at full velocity from off-screen and
        // slowly decelerate to a resting point.
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        // Objects leave the screen at full velocity. They do not decelerate when off-screen.
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        // The sharp curve is used by objects that may return to the screen at any time.
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
    shadow: {
      divider: {
        top: `0px 1px 0px 0px #f2f2f2 inset`,
        right: `-1px 0px 0px 0px #f2f2f2 inset`,
        bottom: `0px -1px 0px 0px #f2f2f2 inset`,
        left: `1px 0px 0px 0px #f2f2f2 inset`,
      },
    },
    shadows: [
      ...createTheme({}).shadows.map((shadow, i) =>
        i === 1
          ? '0px 4px 13px 0px rgba(9, 11, 33, .08), 0px 0px 2px 0px rgb(16, 17, 30, .2)'
          : shadow,
      ),
    ],
  },
  arSD,
);

const themeMutation = createTheme(FormBuilderTheme, {
  direction: i18next.dir(),
  palette: {
    dark: {
      $a4: `${alpha(FormBuilderTheme.palette.dark.main, 0.04)}`,
      $a6: `${alpha(FormBuilderTheme.palette.dark.main, 0.06)}`,
      $a8: `${alpha(FormBuilderTheme.palette.dark.main, 0.08)}`,
    },
    primary: {
      $a4: `${alpha(FormBuilderTheme.palette.primary.main, 0.04)}`,
    },
    secondary: {
      $a4: `${alpha(FormBuilderTheme.palette.secondary.$100, 0.04)}`,
      $a6: `${alpha(FormBuilderTheme.palette.secondary.$100, 0.06)}`,
      $a8: `${alpha(FormBuilderTheme.palette.secondary.$100, 0.08)}`,
      $a12: `${alpha(FormBuilderTheme.palette.secondary.$100, 0.12)}`,
    },
    error: {
      $a8: `${alpha(FormBuilderTheme.palette.error.main, 0.08)}`,
    },
  },
  typography: {
    h3: {
      color: FormBuilderTheme.palette.dark.$80,
    },
    h6: {
      color: FormBuilderTheme.palette.dark.$80,
    },
    caption: {
      color: FormBuilderTheme.palette.dark.$60,
    },
    caption11: {
      color: FormBuilderTheme.palette.dark.$80,
    },
    body13controls: {
      color: FormBuilderTheme.palette.dark.$80,
    },
    body13rich: {
      color: FormBuilderTheme.palette.dark.$40,
    },
    body13content: {
      color: FormBuilderTheme.palette.dark.$60,
    },
    body14controls: {
      color: FormBuilderTheme.palette.dark.main,
    },
    body14rich: {
      color: FormBuilderTheme.palette.dark.$80,
    },
  },
  components: {
    MuiTypography: {
      variants: [
        {
          props: { lh: 'double' },
          style: {
            lineHeight: 2,
          },
        },
        {
          props: { lh: 'rich' },
          style: {
            lineHeight: 1.5,
          },
        },
        {
          props: { lh: 'controls' },
          style: {
            lineHeight: 1,
          },
        },
        {
          props: { weight: 'regular' },
          style: {
            fontWeight: FormBuilderTheme.typography.fontWeightLight,
          },
        },
        {
          props: { weight: 'medium' },
          style: {
            fontWeight: FormBuilderTheme.typography.fontWeightMedium,
          },
        },
        {
          props: { weight: 'bold' },
          style: {
            fontWeight: FormBuilderTheme.typography.fontWeightBold,
          },
        },
        {
          props: { align: 'center' },
          style: {
            display: 'flex',
            alignItems: 'center',
          },
        },
      ],
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: FormBuilderTheme.palette.dark.$8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.MuiPaper-rounded': {
            borderRadius: '8px',
            boxShadow: FormBuilderTheme.shadows[1],
          },
          '.MuiCalendarPicker-root .MuiSvgIcon-root': {
            fill: 'currentColor',
          },
          '.MuiCalendarPicker-root .PrivatePickersFadeTransitionGroup-root': {
            margin: '0 .5rem',
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          '& .MuiMenuItem-root': {
            fontSize: 14,
            fontWeight: FormBuilderTheme.typography.fontWeightLight,
            padding: FormBuilderTheme.spacing(2, 4, 2, 4),
            borderRadius: FormBuilderTheme.spacing(2),
            marginLeft: FormBuilderTheme.spacing(2),
            marginRight: FormBuilderTheme.spacing(2),
            '&:not(:last-child)': {
              marginBottom: FormBuilderTheme.spacing(1),
            },
            '&.Mui-selected': {
              color: FormBuilderTheme.palette.secondary.$80,
              backgroundColor: FormBuilderTheme.palette.light.$1,
              '&:hover': {
                backgroundColor: FormBuilderTheme.palette.light.$2,
              },
            },
            '&:hover': {
              color: FormBuilderTheme.palette.secondary.$80,
              backgroundColor: FormBuilderTheme.palette.light.$1,
            },
            '& .MuiSvgIcon-root': {
              marginRight: FormBuilderTheme.spacing(1.5),
            },
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fill: 'none',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          padding: FormBuilderTheme.spacing(0, 4, 0, 5),
          boxShadow: FormBuilderTheme.shadow.divider.bottom,
          '& .MuiTab-root': {
            padding: '0 10px',
            marginRight: `${FormBuilderTheme.spacing(3)} /* @noflip */`,
            marginLeft: `0 /* @noflip */`,
          },
          '& .MuiTabs-indicator': {
            background: FormBuilderTheme.palette.dark.main,
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          margin: 0,
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          border: `1px solid ${FormBuilderTheme.palette.dark.$8}`,
          // maxHeight: 40,
          '& .MuiSelect-select': {
            fontWeight: FormBuilderTheme.typography.fontWeightMedium,
            padding: 10,
            alignItems: 'center',
            '&:focus': {
              backgroundColor: FormBuilderTheme.palette.light.main,
            },
          },
          // '& .MuiInputBase-input': {
          //   textIndent: '12px',
          // },
          '& .MuiInputBase-inputMultiline': {
            textIndent: '0px',
            paddingLeft: '12px',
            paddingRight: '12px',
          },
          // '& .MuiSvgIcon-root': {
          //   right: FormBuilderTheme.spacing(2),
          // },
          '&&&:before': {
            borderBottom: 'none',
          },
          '&&:after': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTextField: {
      variants: [
        {
          props: { size: 'm' },
          style: {
            '& .MuiInputBase-input': {
              padding: FormBuilderTheme.spacing(2.5, 3),
            },
          },
        },
        {
          props: { bg: 'a4' },
          style: {
            '& .MuiInputBase-input': {
              background: `${alpha(FormBuilderTheme.palette.dark.main, 0.04)}`,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          borderRadius: '4px',
          outline: 'none',
          border: 'none',
          paddingTop: 0,
          paddingBottom: 0,
          '& .MuiInputBase-input': {
            padding: FormBuilderTheme.spacing(2.5, 2.5),
          },
          '& .MuiInputBase-multiline': {
            padding: 0,
            '& .MuiInputBase-inputMultiline': {
              textIndent: '0px',
              paddingLeft: '12px',
              paddingRight: '12px',
            },
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: FormBuilderTheme.palette.dark.$8,
            },
            '&.Mui-focused fieldset': {
              boxShadow: '0 0 0 4px rgba(100, 77, 237, 0.08)',
              borderColor: FormBuilderTheme.palette.secondary.$80,
            },
            ':hover .MuiOutlinedInput-notchedOutline': {
              borderColor: FormBuilderTheme.palette.secondary.$80,
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 1,
          '&.Mui-selected': {
            backgroundColor: FormBuilderTheme.palette.secondary.$80,
          },
          '& .MuiSvgIcon-root': {
            '&:hover': {
              backgroundColor: FormBuilderTheme.palette.secondary.$a8,
              border: `5px solid ${FormBuilderTheme.palette.secondary.$80}`,
            },
            fontSize: 20,
            borderRadius: '6px',
            border: `1px solid ${FormBuilderTheme.palette.dark.$16}`,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          ...FormBuilderTheme.typography.body14controls,
          color: FormBuilderTheme.palette.dark.$60,
          fontWeight: 500,
          mr: 6,
          '&.Mui-selected': {
            color: FormBuilderTheme.palette.dark.main,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 24,
          height: 16,
          padding: 0,
          display: 'flex',
          '&:active': {
            '& .MuiSwitch-thumb': {
              width: 15,
            },
            '& .MuiSwitch-switchBase.Mui-checked': {
              transform: 'translateX(6px)',
            },
          },
          '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
              transform: 'translateX(8px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: FormBuilderTheme.palette.secondary.$80,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 12,
            height: 12,
            borderRadius: 6,
            transition: FormBuilderTheme.transitions.create(['width'], {
              duration: 150,
            }),
          },
          '& .MuiSwitch-track': {
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor: FormBuilderTheme.palette.dark.$16,
            boxSizing: 'border-box',
          },
        },
      },
    },
    MuiChip: {
      variants: [
        {
          props: { variant: 'l' },
          style: {
            padding: '7px 12px 7px 8px',
          },
        },
        {
          props: { variant: 'm' },
          style: {
            padding: '3px 8px',
          },
        },
        {
          props: { variant: 's' },
          style: {
            padding: '4px',
            '& .MuiChip-label': {
              fontSize: '14px',
            },
          },
        },
        {
          props: { variant: 'xs' },
          style: {
            padding: '4px',
            '& .MuiChip-label': {
              fontSize: '12px',
            },
          },
        },
        {
          props: { radius: 'round' },
          style: {
            borderRadius: '70px',
          },
        },
        {
          props: { radius: 'sharp' },
          style: {
            borderRadius: '3px',
          },
        },
        {
          props: { bg: 'darka6' },
          style: {
            background: `${alpha(FormBuilderTheme.palette.dark.main, 0.06)}`,
          },
        },
      ],
      styleOverrides: {
        root: {
          height: 'auto',
          '& .MuiChip-label': {
            padding: '0',
            fontSize: '14px',
          },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { size: 's' },
          style: {
            borderRadius: '4px',
            padding: FormBuilderTheme.spacing(2),
          },
        },
        {
          props: { size: 'm' },
          style: {
            borderRadius: '6px',
            padding: FormBuilderTheme.spacing(2.5, 3),
          },
        },
        {
          props: { size: 'l' },
          style: {
            borderRadius: '6px',
            padding: FormBuilderTheme.spacing(3.5, 4),
          },
        },
        {
          props: { variant: 'primary' },
          style: {
            backgroundColor: `var(--bg-primary, ${FormBuilderTheme.palette.primary.main})`,
            color: '#fff',
          },
        },
        {
          props: { variant: 'secondary' },
          style: {
            backgroundColor: FormBuilderTheme.palette.secondary.main,
            color: '#fff',
            '&:hover': {
              backgroundColor: FormBuilderTheme.palette.secondary.$80,
            },
          },
        },
        {
          props: { variant: 'ghost' },
          style: {
            backgroundColor: FormBuilderTheme.palette.light.main,
            color: FormBuilderTheme.palette.dark.main,
            '&:hover': {
              backgroundColor: `${alpha(
                FormBuilderTheme.palette.secondary.$100,
                0.08,
              )}`,
            },
          },
        },
        {
          props: { variant: 'border' },
          style: {
            backgroundColor: FormBuilderTheme.palette.light.main,
            color: FormBuilderTheme.palette.dark.main,
            border: `1px solid ${FormBuilderTheme.palette.dark.$16}`,
            '&:hover': {
              backgroundColor: `${alpha(
                FormBuilderTheme.palette.secondary.$100,
                0.04,
              )}`,
            },
          },
        },
      ],
    },
    MuiButtonGroup: {
      variants: [
        {
          props: { variant: 'modal' },
          style: {
            backgroundColor: FormBuilderTheme.palette.light.main,
            display: 'flex',
            boxShadow: FormBuilderTheme.shadow.divider.top,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            '& .MuiButton-modal': {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              padding: FormBuilderTheme.spacing(4, 0),
              flex: 1,
              '&:not(:last-child)': {
                boxShadow: FormBuilderTheme.shadow.divider.right,
              },
            },
            '& .MuiSvgIcon-root': {
              fontSize: FormBuilderTheme.spacing(6),
              marginRight: FormBuilderTheme.spacing(1.5),
            },
            '& .MuiTypography-root': {
              fontWeight: FormBuilderTheme.typography.fontWeightMedium,
              fontSize: FormBuilderTheme.typography.body14,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          ...FormBuilderTheme.typography.body14controls,
          color: FormBuilderTheme.palette.dark.$80,
          fontWeight: 500,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: FormBuilderTheme.spacing(1.5),
        },
      },
      variants: [
        {
          props: { size: 'xs' },
          style: {
            padding: FormBuilderTheme.spacing(1.5),
          },
        },
        {
          props: { variant: 'circle' },
          style: {
            borderRadius: 48,
          },
        },
        {
          props: { variant: 'rounded' },
          style: {
            borderRadius: 8,
          },
        },
        {
          props: { variant: 'rounded', color: 'error' },
          style: {
            color: FormBuilderTheme.palette.error.$80,
            '&:hover': {
              '& .MuiSvgIcon-root > path': {
                stroke: FormBuilderTheme.palette.error.$80,
              },
              background: `${alpha(FormBuilderTheme.palette.error.main, 0.08)}`,
            },
          },
        },
        {
          props: { variant: 'rounded', color: 'secondary' },
          style: {
            color: FormBuilderTheme.palette.secondary.$80,
            '&:hover': {
              '& .MuiSvgIcon-root > path': {
                stroke: FormBuilderTheme.palette.secondary.$80,
              },
              background: `${alpha(FormBuilderTheme.palette.secondary.main, 0.08)}`,
            },
          },
        },
      ],
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          ...FormBuilderTheme.typography.body13,
          fontWeight: FormBuilderTheme.typography.fontWeightLight,
          color: FormBuilderTheme.palette.dark.main,
          padding: FormBuilderTheme.spacing(2, 0),
          '&.Mui-selected': {
            backgroundColor: `${alpha(
              FormBuilderTheme.palette.secondary.$100,
              0.04,
            )}`,
            '&:hover': {
              backgroundColor: `${alpha(
                FormBuilderTheme.palette.secondary.$100,
                0.04,
              )}`,
            },
          },
        },
      },
      variants: [
        {
          props: { border: 'none' },
          style: {
            border: 'none',
          },
        },
        {
          props: { model: 'icon' },
          style: {
            padding: FormBuilderTheme.spacing(1.5),
            color: FormBuilderTheme.palette.dark.$40,
            '.MuiSvgIcon-root': {
              fontSize: 22,
              '> path': {
                stroke: FormBuilderTheme.palette.dark.$40,
              },
            },
            '&.Mui-selected': {
              backgroundColor: 'transparent',
              color: FormBuilderTheme.palette.dark.$80,
              '.MuiSvgIcon-root': {
                '> path': {
                  stroke: FormBuilderTheme.palette.dark.$80,
                },
              },
            },
          },
        },
      ],
    },
    MuiTimeline: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          '& .MuiTimelineConnector-root': {
            width: 1,
            backgroundColor: FormBuilderTheme.palette.dark.$16,
          },
          '& .MuiTimelineDot-root': {
            padding: 2,
            marginBottom: 16,
            margintop: 16,
          },
          '& .MuiTimelineItem-missingOppositeContent:before': {
            content: 'none',
          },
        },
      },
    },
  },
});

// z-index reminder (default)
// mobile stepper: 1000
// fab: 1050
// speed dial: 1050
// app bar: 1100
// drawer: 1200
// modal: 1300
// snackbar: 1400
// tooltip: 1500

export default themeMutation;
