import React from 'react';
import { makeStyles } from '@mui/styles';
import { SharedInputControl } from '../../pages/setups/shared';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function TimePickerInput(props) {
  const classes = useStyles();
  return (
    <form className={classes.container} noValidate>
      <SharedInputControl
        isFullWidth
        editValue={props.value}
        onValueChanged={(newValue) => props.onChange(newValue.value)}
        stateKey="time"
        // isDisabled
        idRef="time"
        themeClass="theme-underline"
        errors={props.errors}
        errorPath={props.errorPath}
        isSubmitted={props.isSubmitted}
        InputLabelProps={{
          shrink: true,
          required: true,
        }}
        type="time"
        step={900} // 5 min
        isNotCenter
        labelValue={props.labelValue}
      />
    </form>
  );
}
