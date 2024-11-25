import React from 'react';
import styled from 'styled-components';
import { Col } from 'reactstrap';

export const selectColors = {
  primary25: '#F2F2F2',
  primary50: '#EDEDED',
  primary75: '#DADADA',
  primary: '#555555',
  dangerLight: '#FF4040',
};

export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.15) !important',
    border: '0.0625rem solid rgba(0, 0, 0, 0.05)',
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    backgroundColor: 'hsl(0,0%,90%)',
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: 'hsl(0,0%,70%)',
    fontSize: '13px',
  }),
  multiValue: (provided, state) => ({
    ...provided,
    borderRadius: '50px',
  }),
};

export const DragWrapper = styled(Col)``;
export const DragContainer = styled.div`
  align-items: center;
  border-color: #dadada;
  border-radius: 2px;
  border-style: dashed;
  border-width: 2px;
  color: #bdbdbd;
  cursor: pointer;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  outline: none;
  padding: 20px;
  transition: all 0.24s ease-in-out;

  width: 100%;
`;
export const DragText = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  & i {
    margin-right: 10px;
  }
  & p {
    margin-bottom: 0px;
  }
`;
export const FileWrapper = styled.div`
  display: flex;
  margin: 1rem 0;
  padding-left: 1rem;
  width: 300px;
  @media (max-width: 770px) {
    width: 100%;
  }
  & .file-name {
    max-width: 200px;
    @media (max-width: 770px) {
      max-width: 250px;
    }
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & .file-size {
    font-size: 12px;
  }
  & .left-align {
    align-items: center;
    display: flex;
    margin-left: auto;
    i {
      align-items: center;
      background: #ededed;
      border-radius: 100%;
      color: #ff7373;
      cursor: pointer;
      display: flex;
      font-size: 20px;
      height: 30px;
      justify-content: center;
      margin-left: 8px;

      width: 30px;
    }
  }
  & p {
    margin-bottom: 0;
  }
`;

const AddIndicatorCol = styled(Col)`
  align-items: center;
  background: #f8f8f8;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 15px;
  transition: 0.3s ease;
  &:hover {
    background: #ededed;
  }
  & i {
    margin-right: 5px;
  }
  & span {
    font-size: 14px;
  }
`;

// Checkbox Inputs

export const Wrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 770px) {
    display: grid;
    grid-template-columns: 1fr;
  }
`;
export const CheckboxWrapper = styled.div`
  border: 1px solid rgb(202, 209, 215);
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 15px 20px;
  padding-left: 40px;
  &:hover {
    border-color: var(--primary);
  }
`;
export const Label = styled.label`
  align-items: center;
  display: flex;
  width: 100%;
  & span {
    font-size: 12px;
    max-width: 400px;
    text-align: center;
    top: 0px;
  }
  &::before,
  &::after {
    height: 30px;
    left: -3rem;
    top: -6px;
    width: 30px;
  }
  &::before:focus,
  &::after:focus {
    background: transparent !important;
    background-color: transparent !important;
  }
`;
export const InputWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;
