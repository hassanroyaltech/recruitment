import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';

class InputColor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: this.props.color_data,
      width: '100%',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    this.setState({ color: color.hex });
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          height: '14px',
          borderRadius: '2px',
          background: this.state.color,
        },
        swatch: {
          width: this.state.width,
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker
              color={this.state.color}
              onChange={(e) => {
                this.props.onChange(e);
                this.handleChange(e);
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default InputColor;
