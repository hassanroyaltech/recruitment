// React
import React from 'react';

// Styled components
import styled from 'styled-components';

// Stylesheet
import 'assets/scss/elevatus/_evabrand.scss';

/**
 * Wrapper styled div
 */
const Wrapper = styled.div`
  background: ${(props) => (props.active ? 'var(--bg-primary, #03396C)' : 'white')};
  color: ${(props) => (props.active ? 'white' : 'rgb(82, 95, 127)')};
`;

/**
 * Stateless functional component (RequirementCheckbox)
 * @param options
 * @param selected
 * @param id
 * @param onChange
 * @returns {JSX.Element}
 * @constructor
 */
export default function RequirementCheckbox({
  options,
  selected,
  id,
  onChange,
  index,
}) {
  /**
   * Return JSX
   */
  return (
    <React.Fragment>
      {options.map((o, i) => (
        <Wrapper
          id="requirement-checkbox-wrapper"
          active={selected === o.key}
          key={i}
          onClick={() => onChange(id, o.key, index)}
        >
          {o.value}
        </Wrapper>
      ))}
    </React.Fragment>
  );
}
