// React
import React from 'react';

// MUI components
import { StepConnector, StepIcon, StepLabel } from '@mui/material';
import { withStyles } from '@mui/styles';

/** Stepper connector component */
export const StepperConnector = withStyles(() => ({
  alternativeLabel: {
    top: 6,
    marginLeft: -14,
    marginRight: -14,
  },

  active: {
    '& $line': {
      // borderTop: `2px solid ${brandGreen}`,
      borderTop: '2px solid var(--bc-primary, #051274)',
    },
  },

  completed: {
    '& $line': {
      // borderTop: `2px solid ${brandGreen}`,
      borderTop: '2px solid var(--bc-primary, #051274)',
    },
  },

  line: {
    height: 2,
    border: 0,
    borderTop: '2px dashed #E9ECEF',
    borderRadius: 0.5,
  },
}))(StepConnector);

/** Stepper icon component */
export const StepperIcon = withStyles(() => ({
  root: {
    width: 12,
    height: 12,
    background: '#E2E2E2',
    fillOpacity: 0,
    borderRadius: 99999,
  },

  active: {
    // background: brandGreen,
    background: 'var(--bg-primary, #051274)',
  },

  completed: {
    // background: brandGreen,
    background: 'var(--bg-primary, #051274)',
  },
}))(StepIcon);

/** Stepper label component */
export const StepperLabel = withStyles(() => ({
  alternativeLabel: {
    padding: 0,
    color: '#899298',
    height: 12,
  },

  label: {
    marginTop: 0,
    position: 'relative',
    left: '50%',
    top: -60,
    color: '#899298 !important',
    fontFamily: 'Ubuntu, Open Sans, sans-serif',
  },

  active: {
    color: 'var(--c-primary, #051274) !important',
    fontWeight: 500,
  },

  completed: {
    color: 'var(--c-primary, #051274) !important',
    fontWeight: 500,
  },
}))(StepLabel);
