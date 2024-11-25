/**
 * Copied from:
 * https://react-select.com/creatable (last item)
 *
 * Allows us to create a query search field
 */
import React, { Component } from 'react';

import CreatableSelect from 'react-select/creatable';

const components = {
  DropdownIndicator: null,
};

const createOption = (label: string) => ({
  label,
  value: label,
});

export default class CreatableInputOnly extends Component<*, State> {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      value: [],
    };
  }

  handleChange = (value: any, actionMeta: any) => {
    this.setState({ value });
  };

  handleInputChange = (inputValue: string) => {
    this.setState({ inputValue });
  };

  handleKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    if (!value) return;
    switch (event.key) {
    case 'Enter':
    case 'Tab':
      this.setState({
        inputValue: '',
        value: [...value, createOption(inputValue)] || [],
      });
      event.preventDefault();
    }
  };

  render() {
    const { inputValue, value } = this.state;
    return (
      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        theme={this.props.theme}
        styles={this.props.styles}
        menuIsOpen={false}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder="Type something and press enter..."
        value={value}
      />
    );
  }
}
