/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Button, Col, Input, InputGroup, InputGroupText, Row } from 'reactstrap';

const CandidateCard = (props) => {
  const handleInputChange = (e) => {
    props.setCandidateInfo(e.target.value, e.target.name, props.id, props.index);
  };

  const removeCandidate = () => {
    if (props.removeCandidate) props.removeCandidate(props.id);
  };

  const addCandidate = () => {
    if (props.addCandidate) props.addCandidate();
  };

  return (
    <Row style={{ position: 'relative' }}>
      <Col xs="12" sm="6" md="3">
        <InputGroup className="input-group-merge">
          <InputGroup addonType="prepend">
            <InputGroupText>
              <i className="fa fa-user" />
            </InputGroupText>
            <Input
              placeholder="First Name *"
              type="label"
              name="first_name"
              autoComplete=""
              onChange={handleInputChange}
              // value={candidateValue.first_name ? candidateValue.first_name : ''}
            />
          </InputGroup>
        </InputGroup>
      </Col>
      <Col xs="12" sm="6" md="3">
        <InputGroup addonType="prepend">
          <InputGroupText>
            <i className="fa fa-user" />
          </InputGroupText>
          <Input
            placeholder="Last Name *"
            type="label"
            name="last_name"
            autoComplete=""
            onChange={handleInputChange}
            // value={candidateValue.last_name ? candidateValue.last_name : ''}
          />
        </InputGroup>
      </Col>
      <Col xs="12" sm="6" md="3">
        <InputGroup addonType="prepend">
          <InputGroupText>
            <i className="ni ni-email-83" />
          </InputGroupText>
          <Input
            placeholder="Email *"
            type="email"
            name="email"
            autoComplete=""
            onChange={handleInputChange}
            // value={candidateValue.email ? candidateValue.email : ''}
          />
        </InputGroup>
      </Col>
      <Col xs="12" sm="6" md="3">
        <InputGroup addonType="prepend">
          <InputGroupText>
            <i className="fa fa-phone" />
          </InputGroupText>
          <Input
            placeholder="Phone Number - Optional"
            type="number"
            name="phone"
            autoComplete=""
            onChange={handleInputChange}
            // value={candidateValue.phone ? candidateValue.phone : ''}
          />
        </InputGroup>
      </Col>
      {props.removeCandidate ? (
        <Button close className="action-button" onClick={removeCandidate} />
      ) : props.addCandidate ? (
        <Button close className="action-button" onClick={addCandidate}>
          <span>+</span>
        </Button>
      ) : null}
    </Row>
  );
};

export default CandidateCard;
