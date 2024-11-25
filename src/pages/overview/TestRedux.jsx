import React, { Component } from 'react';

import { connect } from 'react-redux';

import { simpleAction } from '../../stores/actions/simpleAction.js';

class Test extends Component {
  idi = () => {
    // this.props.history.push("./login");
    this.props.simpleAction();
    console.log(this.props.simpleReducer);
    this.props.history.push('./recruiter/nestodrugo');
  };

  render() {
    return (
      <div>
        {' '}
        test page for redux
        <button onClick={this.idi}>click me</button>
        {this.props.simpleReducer.result}
      </div>
    );
  }
}

const mapStateToProps = ({ simpleReducer }) => ({
  simpleReducer,
});

const mapDispatchToProps = {
  simpleAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Test);
