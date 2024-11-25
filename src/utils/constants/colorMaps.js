import { makeStyles } from '@mui/styles';

/**
 * A simple object mapping letters to colors
 *
 * No reason for selecting them like the following pattern.
 */
export const avatarLetterMap = {
  A: 'amber',
  B: 'amber',
  C: 'amber',
  D: 'blue',
  E: 'blue',
  F: 'blue',
  G: 'teal',
  H: 'teal',
  I: 'teal',
  J: 'blueGrey',
  K: 'blueGrey',
  L: 'blueGrey',
  M: 'grey',
  N: 'indigo',
  O: 'indigo',
  P: 'pink',
  Q: 'pink',
  R: 'pink',
  S: 'blueGrey',
  T: 'indigo',
  U: 'indigo',
  V: 'blue',
  W: 'blue',
  X: 'blue',
  Y: 'blueGrey',
  Z: 'amber',
};

// Embedded style for avatar => (invited team portrait)
export const useOverlayedAvatarStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(-0.5),
    },
    zIndex: 20,
  },
}));

/**
 *  Embedded style for avatar => (language codes)
 */
export const useSeparatedAvatarStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(0.5),
      borderRadius: '5px',
      width: '30px !important',
      height: '30px !important',
    },
    zIndex: 20,
  },
}));
