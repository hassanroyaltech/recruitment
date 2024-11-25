import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: ${(props) => (props.active ? 'var(--bg-primary, #03396C)' : 'white')};
  border-radius: 8px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  color: ${(props) => (props.active ? 'white' : 'rgb(82, 95, 127)')};
  cursor: pointer;
  margin-right: 10px;
  padding: 0.5rem;
`;
export default function RequirementCheckbox({ options, selected, id, onChange }) {
  return (
    <React.Fragment>
      {options.map((o, i) => (
        <Wrapper key={i} active={selected === o} onClick={() => onChange(id, o)}>
          {o}
        </Wrapper>
      ))}
    </React.Fragment>
  );
}
