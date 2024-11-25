import React, { useState } from 'react';
import styled from 'styled-components';
import { Badge, Button, Col, Modal, Row, ModalBody, FormGroup } from 'reactstrap';
import axios from 'axios';
import urls from 'api/urls';
import Select from 'react-select';

import { useToasts } from 'react-toast-notifications';
import { generateHeaders } from 'api/headers';
import { CheckboxesComponent } from 'components';

const Name = styled.span`
  font-size: 1rem;
  font-weight: bold;
  top: 0px;
`;
const InviteStatus = (props) => {
  const { addToast } = useToasts(); // Toasts

  const [state, setState] = useState({
    status: 1,
    StatusList: [
      {
        label: 'All',
        value: 1,
      },
      {
        label: 'Incomplete',
        value: 2,
      },
      {
        label: 'Pending',
        value: 3,
      },
    ],
  });

  const [candidates, setCandidates] = useState(props.data);
  const [candidatesView, setCandidatesView] = useState(props.data);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const toggleCandidate = (currentState, idToToggle) => {
    if (!currentState) {
      setSelectedCandidates((items) => items.filter((s) => s !== idToToggle));
      return;
    }
    setSelectedCandidates((items) => [...items, idToToggle]);
  };

  const searchCandidates = (query) => {
    setCandidatesView(
      candidates.filter((c) => {
        const searchable = `${c.first_name} ${c.last_name} ${c.email}`;
        return searchable.toLowerCase().includes(query.trim().toLowerCase());
      }),
    );
  };

  const [isWorking, setIsWorking] = useState(false);

  const sendReminder = async () => {
    setIsWorking(true);
    await axios
      .put(
        urls.evassess.INVITE_CANDIDATE,
        {
          uuid: props.match.params.id,
          user_invited: candidates
            .filter((c) => selectedCandidates.includes(c.uuid))
            .map((c) => ({
              first_name: c.first_name,
              last_name: c.last_name,
              email: c.email,
            })),
        },
        {
          headers: generateHeaders(),
        },
      )
      .then((res) => {
        addToast('Invited Successfully', {
          appearance: 'success',
          autoDismiss: true,
        });
        props.closeModal();
        setIsWorking(false);
      })
      .catch(() => {
        addToast('Error in Inviting Candidates!', {
          appearance: 'error',
          autoDismiss: true,
        });
        setIsWorking(false);
      });
  };

  return (
    <>
      <Modal isOpen={props.isOpen} toggle={props.onClick}>
        <div className="modal-content card">
          <div className="modal-header border-0 bg-primary d-flex align-items-center">
            <h5 className="modal-title mt-0 text-white font-16">Invite Status</h5>
            <button
              type="button"
              className="close text-white"
              data-dismiss="modal"
              aria-hidden="true"
              onClick={props.onClick}
            >
              <i className="fas fa-times" />
            </button>
          </div>
          <ModalBody>
            <Row>
              <Col xl={12}>
                <form role="search" className="app-search-invite">
                  <div className="form-group m-0 ">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Name , Email"
                      onChange={(e) => searchCandidates(e.currentTarget.value)}
                    />
                  </div>
                </form>
              </Col>
            </Row>
            <Row className="p-3">
              <Col xl={4}>
                <h5 className="text-muted h4 mb-3 pt-2">Candidates List </h5>
              </Col>
              <Col xl={8} className="p-0">
                <FormGroup className="m-0  ">
                  <Select
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        status: e.value,
                      }))
                    }
                    defaultValue={state.status}
                    placeholder="Select Status ..."
                    options={state.StatusList.map((status) => ({
                      label: status.label,
                      value: status.value,
                    }))}
                  />
                </FormGroup>
              </Col>
              {candidatesView.map((candidate, i) => (
                <Col xl={12} className="border mt-2 mb-1" key={i}>
                  <Row className="pt-2 pb-2">
                    <Col xl={8}>
                      <div className="mb-1">
                        <CheckboxesComponent
                          idRef={`candidate-${i}`}
                          singleChecked={selectedCandidates.includes(candidate.uuid)}
                          onSelectedCheckboxChanged={(event, isChecked) => {
                            toggleCandidate(isChecked, candidate.uuid);
                          }}
                          label={
                            <div>
                              <Name>{`${candidate.first_name} ${candidate.last_name}`}</Name>
                              <small className="m-0 text-pending-muted d-block">
                                {candidate.email}
                              </small>
                            </div>
                          }
                        />
                      </div>
                    </Col>
                    <Col xl={4}>
                      <Badge className="badge-dot mr-4-reversed" color="">
                        <i
                          className={
                            candidate.is_new === 'Incomplete'
                              ? 'bg-danger'
                              : 'bg-gradient-yellow'
                          }
                        />
                        <span className="status">Pending</span>
                      </Badge>
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
            <div className="float-right">
              <Button onClick={sendReminder} color="primary" className="btn-sm">
                {isWorking && (
                  <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                )}
                {`${isWorking ? 'Sending...' : 'Send Reminder'}`}
              </Button>
            </div>
          </ModalBody>
        </div>
      </Modal>
    </>
  );
};

export default InviteStatus;
