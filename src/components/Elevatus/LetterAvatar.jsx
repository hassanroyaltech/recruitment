/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
// React
import React from 'react';

// MUI
import { makeStyles } from '@mui/styles';
import Avatar from '@mui/material/Avatar';
import {
  yellow,
  amber,
  red,
  indigo,
  blue,
  teal,
  grey,
  blueGrey,
  green,
  pink,
  deepOrange,
  deepPurple,
} from '@mui/material/colors';

// Helpers and colorMaps
import { getInitials } from 'utils/functions/helpers';
import { avatarLetterMap } from 'utils/constants/colorMaps';

/**
 * Define style and material colormaps
 */
const useStyles = makeStyles((theme) => ({
  yellow: {
    color: theme.palette.getContrastText(yellow[500]),
    backgroundColor: yellow[500],
  },
  amber: {
    color: theme.palette.getContrastText(amber[500]),
    backgroundColor: amber[500],
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
  },
  indigo: {
    color: theme.palette.getContrastText(indigo[500]),
    backgroundColor: indigo[500],
  },
  blue: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
  },
  grey: {
    color: theme.palette.getContrastText(grey[900]),
    backgroundColor: grey[900],
  },
  blueGrey: {
    color: theme.palette.getContrastText(blueGrey[500]),
    backgroundColor: blueGrey[500],
  },
  teal: {
    color: theme.palette.getContrastText(teal[500]),
    backgroundColor: teal[500],
  },
  green: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
  },
}));

/**
 * Large style
 * @type {(props?: any) => ClassNameMap<"root">}
 */
const useLargeStyle = makeStyles((theme) => ({
  root: {
    height: '45px !important',
    width: '45px !important',
  },
}));

/**
 * Extra Large style
 * @type {(props?: any) => ClassNameMap<"root">}
 */
const useExtraLargeStyle = makeStyles((theme) => ({
  root: {
    height: '72px !important',
    width: '72px !important',
  },
}));

/**
 * This returns a custom LetterAvatar.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LetterAvatars = (props) => {
  const initials = getInitials(props.name);
  const firstLetter = initials.charAt(0);
  const color = avatarLetterMap[firstLetter];

  const classes = useStyles();
  const rootClass = useLargeStyle();
  const rootXLClass = useExtraLargeStyle();
  if (props.langCode)
    return (
      <Avatar id={props.id} className={classes[color]} style={props.style}>
        {props.name.substring(0, 2)}
      </Avatar>
    );

  if (props.name === 'N/A')
    return (
      <Avatar id={props.id} className={classes.grey} style={props.style}>
        {props.name}
      </Avatar>
    );

  if (props.large)
    return (
      <Avatar
        id={props.id}
        className={`${classes[color]} ${rootClass.root}`}
        style={props.style}
      >
        {getInitials(props.name)}
      </Avatar>
    );

  if (props.extraLarge)
    return (
      <Avatar
        id={props.id}
        className={`${classes[color]} ${rootXLClass.root}`}
        style={props.style}
      >
        {getInitials(props.name)}
      </Avatar>
    );

  return (
    <Avatar
      id={props.id}
      className={classes[color]}
      style={props.style}
      src={props.src && props.src}
      onClick={props.onClick}
    >
      {getInitials(props.name)}
    </Avatar>
  );
};
export default LetterAvatars;
