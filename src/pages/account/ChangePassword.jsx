import React, { useState } from 'react';
import {
  Button,
  Modal,
  Row,
  Col,
  FormGroup,
  InputGroup,
  CardFooter,
} from 'reactstrap';
import Axios from 'axios';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';

export function ChangePassword(props) {
  const [state, setState] = useState({
    loading: false,
    submitted: false,
    message: '',
    type: '',
    user: JSON.parse(localStorage.getItem('user'))?.results,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleSubmit = async () => {
    setState((prevState) => ({ ...prevState, loading: true, submitted: true }));
    if (state.password !== state.password_confirmation) {
      setState((prevState) => ({ ...prevState, loading: false, submitted: false }));
      setState((prevState) => ({
        ...prevState,
        password_validation: 'The password not matches',
      }));
    } else {
      if (
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@()$%^&*=_{}[\]:;"'|\\<>,./~`±§+-]).{8,30}$/.test(
          state.password,
        )
      )
        await Axios.post(
          urls.auth.resetPassword.changePassword,
          {
            current_password: state.current_password,
            password: state.password,
            password_confirmation: state.password_confirmation,
          },
          {
            header: {
              Accept: 'application/json',
            },
            headers: generateHeaders(),
          },
        )
          .then(({ data }) => {
            setState((prevState) => ({
              ...prevState,
              type: 'success',
              message: data.message,
            }));
          })
          .catch((error) => {
            if (error?.message === 'Network Error')
              setState((prevState) => ({
                ...prevState,
                type: 'error',
                message: error.message,
              }));
            else
              setState((prevState) => ({
                ...prevState,
                type: 'error',
                message: error.response.data.message,
                errors: error.response.data.errors,
              }));
          });
      else
        setState((prevState) => ({
          ...prevState,
          password_validation:
            'The password must be 8–30 characters, and include a number, a symbol, a lower and a upper case letter',
        }));

      setState((prevState) => ({ ...prevState, loading: false, submitted: false }));
    }
  };
  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={props.isOpen}
      toggle={props.onClick}
    >
      <div className="modal-content ">
        <div className="modal-header bg-primary">
          <h5 className="modal-title mt-0 font-16 font-weight-200 text-white">
            Change Password
          </h5>
          <i
            className="fas fa-times text-white font-13"
            data-dismiss="modal"
            aria-hidden="true"
            onClick={props.onClick}
          />
        </div>
        <div className="modal-body">
          <Row className="p-4">
            <Col xl={12} md={12} xs={12}>
              {state.type === 'success' ? (
                <div className="alert alert-success">{state.message}</div>
              ) : state.type === 'error' ? (
                <div className="alert alert-danger">{state.message}</div>
              ) : null}
              <FormGroup>
                <InputGroup>
                  <div className="input-group-prepend">
                    <span className="input-group-text h-100">
                      <i className="fas fa-unlock-alt" />
                    </span>
                  </div>
                  <input
                    className="form-control px-3"
                    placeholder="Current Password"
                    type="password"
                    name="current_password"
                    value={state.current_password}
                    onChange={handleChange}
                  />
                </InputGroup>

                {state.errors && state.errors.current_password ? (
                  state.errors.current_password.length > 1 ? (
                    state.errors.current_password.map((error, key) => (
                      <p
                        key={`currentPasswordErrorsKey${key + 1}`}
                        className="m-0 text-xs text-danger"
                      >
                        {error}
                      </p>
                    ))
                  ) : (
                    <p className="m-o text-xs text-danger">
                      {state.errors.current_password}
                    </p>
                  )
                ) : (
                  ''
                )}
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <div className="input-group-prepend">
                    <span className="input-group-text h-100">
                      <i className="fas fa-unlock-alt" />
                    </span>
                  </div>
                  <input
                    className="form-control px-3"
                    placeholder="New Password"
                    type="password"
                    name="password"
                    value={state.password}
                    onChange={handleChange}
                  />
                </InputGroup>
                {state.password_validation && (
                  <p className="m-o text-xs text-danger">
                    {state.password_validation}
                  </p>
                )}
                {state.errors && state.errors.password ? (
                  state.errors.password.length > 1 ? (
                    state.errors.password.map((error, key) => (
                      <p
                        key={`passwordErrorsKey${key + 1}`}
                        className="m-0 text-xs text-danger"
                      >
                        {error}
                      </p>
                    ))
                  ) : (
                    <p className="m-o text-xs text-danger">
                      {state.errors.password}
                    </p>
                  )
                ) : (
                  ''
                )}
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <div className="input-group-prepend">
                    <span className="input-group-text h-100">
                      <i className="fas fa-unlock-alt" />
                    </span>
                  </div>
                  <input
                    className="form-control px-3"
                    placeholder="Confirm Password"
                    type="password"
                    name="password_confirmation"
                    value={state.password_confirmation}
                    onChange={handleChange}
                  />
                </InputGroup>
                {state.errors && state.errors.password_confirmation ? (
                  state.errors.password_confirmation.length > 1 ? (
                    state.errors.password_confirmation.map((error, key) => (
                      <p
                        key={`passwordConfirmErrorsKey${key + 1}`}
                        className="m-0 text-xs text-danger"
                      >
                        {error}
                      </p>
                    ))
                  ) : (
                    <p className="m-o text-xs text-danger">
                      {state.errors.password_confirmation}
                    </p>
                  )
                ) : (
                  ''
                )}
              </FormGroup>
            </Col>
          </Row>
          <CardFooter className="text-right">
            <Button
              type="button"
              color="primary"
              className="btn-sm"
              disabled={state.submitted}
              onClick={handleSubmit}
            >
              {state.submitted && <i className="fas fa-circle-notch fa-spin mr-2" />}
              {`${state.submitted ? 'Saving...' : 'Save'}`}
            </Button>
          </CardFooter>
        </div>
      </div>
    </Modal>
  );
}
