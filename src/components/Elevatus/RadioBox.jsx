import React from 'react';
import { Wrapper, CheckboxWrapper, Label, InputWrapper } from './Styles';

export const RadioBox = (props) => (
  <Wrapper>
    {props.answers
      && props.answers.map((answer, i) => (
        <CheckboxWrapper
          // onClick={(e) => {
          //   e.preventDefault();
          //   setAnswer(answer?.uuid);
          // }}
          key={i}
        >
          <InputWrapper className="custom-control custom-control-alternative custom-radio">
            <input
              className="custom-control-input"
              id={`radio-${answer?.uuid || i}`}
              type="radio"
              checked={answer.candidate_answer}
              readOnly
            />
            <Label
              className="custom-control-label px-2"
              htmlFor={`radio-${answer?.uuid || i}`}
            >
              <span>{answer?.title}</span>
            </Label>
          </InputWrapper>
        </CheckboxWrapper>
      ))}
  </Wrapper>
);
