import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import ButtonBase from '@mui/material/ButtonBase';

const ChipsInput = ({
  chips,
  onAdd,
  onDelete,
  onChange,
  InputComp,
  onSelect,
  isChipsDisabled,
}) => {
  const [inputValue, setInputValue] = useState('');
  const handleAdd = () => {
    if (onAdd) onAdd(inputValue);

    if (onChange) {
      const newChips = [...chips, inputValue];
      onChange(newChips);
    }
    setInputValue('');
  };
  const handleDelete = (index) => {
    if (onDelete) onDelete(index);

    if (onChange) {
      const newChips = [...chips];
      newChips.splice(index, 1);
      onChange(newChips);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <Row>
      <Col xs="12" className="mb-4">
        <InputComp
          className="form-control-md border-0 w-100"
          style={{ background: '#f4f5f7' }}
          value={inputValue}
          onKeyDown={!onSelect ? handleKeyDown : undefined}
          onChange={(e) => {
            if (onSelect) onSelect(e);
            else setInputValue(e.target.value);
          }}
          autoComplete=""
        />
      </Col>
      <Col xs="12">
        {chips
          && chips.map((chip, index) => (
            <ButtonBase
              key={`keywordsKeys${index + 1}`}
              className="btns theme-transparent bg-gray-lighter miw-0 mx-2 mb-3"
              onClick={() => handleDelete(index)}
              disabled={isChipsDisabled}
            >
              <span>{chip}</span>
              <span className="fas fa-times mx-2" />
            </ButtonBase>
          ))}
      </Col>
    </Row>
  );
};

export default ChipsInput;
