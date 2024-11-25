import styled from 'styled-components';
import { Modal } from 'reactstrap';

export const StyledModal = styled(Modal)`
  max-width: 60vw;
  & .modal-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    margin-bottom: 1rem;
  }
  & .modal-content {
    max-height: 90vh;
    /* overflow: auto; */
  }
  & .modal-footer {
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    margin-top: 1rem;
  }
  @media (max-width: 570px) {
    max-width: 100% !important;
  }
`;

export const selectColors = {
  primary25: '#f7fafc',
  primary50: '#EDEDED',
  primary75: '#DADADA',
  primary: 'var(--c-primary, #051274)',
  // dangerLight: '#FF4040',
};

export const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    boxShadow: '0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02)',
    border: 'none',
    minHeight: 46,
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: 'hsl(0,0%,90%)',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'hsl(0,0%,70%)',
    fontSize: '14px',
  }),
  multiValue: (provided) => ({
    ...provided,
    borderRadius: '8px',
    backgroundColor: '#F4F5F7',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#8898aa',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0px 8px',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: '999',
  }),
};
