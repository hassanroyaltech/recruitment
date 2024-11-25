import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  Card,
  Col,
  Input,
  Row,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavItem,
  Nav,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import Select from 'react-select';
import { selectColors, customSelectStyles } from 'shared/styles';
import Slider from 'react-slider';
import classnames from 'classnames';
import { CheckboxesComponent } from '../components';

const ElevatusComponent = () => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const closeBtn = (
    <button className="close" onClick={toggle}>
      &times;
    </button>
  );
  /**
   * GPA mapping
   */
  const gpaDescription = [
    { id: 90, title: 'Excellent' },
    { id: 80, title: 'Very Good' },
    { id: 70, title: 'Good' },
    { id: 60, title: 'Pass' },
    { id: 50, title: 'Weak' },
  ];

  return (
    <>
      {modal && (
        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={closeBtn}>
              Modal title
            </ModalHeader>
            <ModalBody>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
              voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
              sint occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={toggle}>
                Do Something
              </Button>
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      )}
      <Row className="mt-5 ml-3">
        <Col xs="10" sm="4" className="mb-4 px-2">
          <h5 className="mr-1">AutoComplete MUI</h5>
          <Autocomplete
            autoHighlight
            options={gpaDescription}
            getOptionLabel={(option) => (option.title ? option.title : '')}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            className="form-control-alternative"
            id="GPA"
            name="GPA"
            label="GPA"
            variant="outlined"
            renderInput={(params) => (
              <TextField
                {...params}
                label="GPA"
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
          />
        </Col>
        <Col xs="10" sm="4" className="mb-4 px-2">
          <h5 className="mr-1">Text Field MUI</h5>
          <TextField
            fullWidth
            required
            className="form-control-alternative"
            id="title"
            name="title"
            label="Job Title"
            variant="outlined"
          />
        </Col>
        <Col xs="10" sm="4" className="mb-4 px-2">
          <h5 className="mr-1">Radio Group MUI</h5>
          <RadioGroup
            aria-label="transparentHeader"
            name="transparentHeaderRadio"
            // value={"fixed"}
          >
            <div className="d-flex ">
              <FormControlLabel
                value="fixed"
                control={<Radio color="primary" />}
                label="Yes"
              />
              <FormControlLabel
                value="notfixed"
                control={<Radio color="primary" />}
                label="No"
              />
            </div>
          </RadioGroup>
        </Col>
        <Col xs="10" sm="4" className="mb-2 px-2">
          <h5 className="mr-1">Check box React Strap</h5>
          <CheckboxesComponent
            idRef="questionPostApplicationRef"
            label="We are willing to sponsor applicants for a visa"
          />
        </Col>
        <Col xs="10" sm="4" className="mb-4 px-2">
          <h5 className="mr-1">Button React Strap</h5>
          <Button color="primary">Save</Button>
        </Col>
        <Col xs="10" sm="4" className="mb-4 px-2">
          <h5 className="mr-1">Dropdown menu From ReactStrap</h5>
          <Nav>
            <NavItem>
              <UncontrolledDropdown>
                <DropdownToggle
                  color=""
                  className="nav-link nav-link-shadow text-gray font-weight-normal"
                >
                  Action
                  <i className="fas fa-angle-down pl-2" />
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem
                    color="link"
                    className="btn-sm justfiy-self-end text-dark"
                  >
                    Send Questionnaire
                  </DropdownItem>
                  <DropdownItem
                    color="link"
                    className="btn-sm justfiy-self-end text-dark"
                  >
                    Send Video Assessment
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </NavItem>
          </Nav>
        </Col>
        <Col xs="10" sm="4" className="mb-4 px-2">
          <h5 className="mr-1">Input Field from ReactStrap</h5>
          <Input
            className="form-control-alternative"
            type="text"
            placeholder="Application Title"
          />
        </Col>
        <Col xs="10" sm="4" className="mb-4 px-2">
          <h5 className="mr-1">Select Field from React Select</h5>
          <Select
            isMulti
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                ...selectColors,
              },
            })}
            styles={customSelectStyles}
            options={[
              ...gpaDescription.map((gpa) => ({
                value: gpa.id,
                label: gpa.title,
              })),
            ]}
          />
        </Col>
        <Col xs="10" sm="3" className="mb-4 px-2">
          <h5 className="mr-1">Slider from React-Slider</h5>
          <Slider
            className="styled-slider"
            value={5}
            min={1}
            max={10}
            trackClassName={classnames('react-slider-track', 'score-5')}
            step={1}
            thumbClassName="react-slider-thumb"
          />
        </Col>
        <Col xs="10" sm="3" className="mb-4 px-2">
          <h5 className="mr-1">Card from ReactStrap</h5>
          <Card className="profile-skills-card">
            <div className="font-weight-bold font-14 mb-1">Skills</div>
            <div className="mt-2">
              {['c++', 'java', 'ReactJS', 'React Native'].map((item, index) => (
                <div
                  key={`languagesChipKey${index + 1}`}
                  className="chip-item small-item mr-1 mb-3"
                >
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs="10" sm="4" className="mb-4 px-2">
          <h5 className="mr-1">Modal React Strap</h5>
          <Button color="primary" onClick={() => setModal(true)}>
            Show Modal
          </Button>
        </Col>
      </Row>
    </>
  );
};
export default ElevatusComponent;
