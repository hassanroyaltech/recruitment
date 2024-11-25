// Import react
import React from 'react';

// TextField
import TextField from '@mui/material/TextField';

// Statemaker
import { dropdownStateMaker } from 'utils/functions/helpers';

/**
 * A customized TextField component made for mapped dropdowns
 * It works by passing an array of objects with a uuid and a label.
 *
 * This is because all of our APIs return lists of uuids and some other key:
 *  [
 *    { uuid: 6936efc4-a5d8-4289-893d-2521788ec705, label: value_one },
 *    { uuid: 7620c882-b90f-4330-8366-227bf0f541dc, label: value_two }
 *  ]
 */
export class StandardDropdown extends React.Component {
  constructor(props) {
    super(props);

    // Generate a state from the purpose prop
    this.state = dropdownStateMaker(props.purpose);
  }

  render() {
    return (
      <TextField
        select
        required={this.props.required}
        variant="outlined"
        id={this.state.id}
        label={this.state.label}
        name={this.state.name}
        className="form-control-alternative w-100"
        placeholder={this.state.placeholder}
        onChange={this.props.onChange}
        SelectProps={{
          native: true,
          displayEmpty: true,
        }}
      >
        {!this.props.makeDefault ? <option> </option> : null}
        {this.props.children}
      </TextField>
    );
  }
}
