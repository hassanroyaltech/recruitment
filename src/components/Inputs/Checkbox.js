import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  & span {
    max-width: 400px;
    text-align: center;
    font-size: 12px;
  }
  &::before,
  &::after {
    width: 30px;
    height: 30px;
  }
  &::before:focus,
  &::after:focus {
    background: transparent !important;
    background-color: transparent !important;
  }
`;
const Wrapper = styled.div`
  align-items: center;
  display: flex;
`;

const Checkbox = ({ style, disabled, defaultChecked, onChange, id }) => (
  <React.Fragment>
    <Wrapper
      style={style}
      className="custom-control custom-control-alternative custom-checkbox"
    >
      <input
        disabled={disabled}
        defaultChecked={defaultChecked}
        onChange={onChange}
        className="custom-control-input"
        id={id || 'checkbox'}
        type="checkbox"
      />
      <Label className="custom-control-label" htmlFor={id || 'checkbox'}>
        {/* <span>{answer}</span> */}
      </Label>
    </Wrapper>
  </React.Fragment>
);

export default Checkbox;
