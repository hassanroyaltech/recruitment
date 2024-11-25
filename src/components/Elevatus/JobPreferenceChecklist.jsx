import React, { Component } from 'react';
import { Button } from 'reactstrap';

import '../Account/Account.scss';

export class JobPreferenceChecklist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      required: false,
      optional: false,
      disabled: false,
    };
  }

  changeColor(e) {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (e.target.value == parseInt(1))
      this.setState({
        required: !this.state.required,
        optional: false,
        disabled: false,
      });

    if (e.target.value == parseInt(2))
      this.setState({
        required: false,
        optional: !this.state.optional,
        disabled: false,
      });

    if (e.target.value == parseInt(3))
      this.setState({
        required: false,
        optional: false,
        disabled: !this.state.disabled,
      });
  }

  render() {
    const required_btn = this.state.required ? 'primary' : 'secondary';
    const optional_btn = this.state.optional ? 'primary' : 'secondary';
    const disabled_btn = this.state.disabled ? 'primary' : 'secondary';
    return (
      <React.Fragment>
        <tr>
          <th scope="row">
            <span className="name mb-0 text-sm ">{this.props.title}</span>
          </th>
          <td>
            <div className="custom-control custom-radio ">
              <input
                className="custom-control-input"
                id={this.props.id}
                name={this.props.name}
                type="hidden"
              />
              <Button
                name={this.props.name}
                onClick={this.changeColor.bind(this)}
                value={1}
                color={required_btn}
                size="sm"
                type="button"
              >
                Required
              </Button>
            </div>
          </td>
          <td>
            <div className="custom-control custom-radio ">
              <input
                className="custom-control-input"
                id="customRadio2"
                name="about-info"
                type="radio"
              />

              <Button
                name={this.props.name}
                onClick={this.changeColor.bind(this)}
                value={2}
                color={optional_btn}
                size="sm"
                type="button"
              >
                Optional
              </Button>
            </div>
          </td>
          <td>
            <div className="custom-control custom-radio ">
              <input
                className="custom-control-input"
                id="customRadio3"
                name="about-info"
                type="radio"
              />

              <Button
                name={this.props.name}
                onClick={this.changeColor.bind(this)}
                value={3}
                color={disabled_btn}
                size="sm"
                type="button"
              >
                Disabled
              </Button>
            </div>
          </td>
        </tr>
      </React.Fragment>
    );
  }
}
