import React from 'react';
import { Row } from 'reactstrap';

export const InfoCompo = ({
  onDelete,
  index,
  length,
  personalInfo,
  handleChange,
}) => (
  <React.Fragment>
    <div className="row">
      <div className="col-auto">
        <p className="mt-4" />
      </div>
      <div className="col-10">
        <Row>
          <div className="col-6">
            <div className="form-group">
              <div
                className={
                  personalInfo.firstNameError
                    ? 'input-group input-group-merge error'
                    : 'input-group input-group-merge'
                }
              >
                <div className="input-group-prepend">
                  <span className="input-group-text ">
                    <i className="fas fa-user" />
                  </span>
                </div>
                <input
                  className="form-control form-control"
                  placeholder="First name"
                  type="text"
                  value={personalInfo.firstName}
                  name="firstName"
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <div
                className={
                  personalInfo.lastNameError
                    ? 'input-group input-group-merge error'
                    : 'input-group input-group-merge'
                }
              >
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fas fa-user" />
                  </span>
                </div>
                <input
                  className="form-control form-control"
                  placeholder="Last name"
                  type="text"
                  value={personalInfo.lastName}
                  name="lastName"
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <div
                className={
                  personalInfo.emailError
                    ? 'input-group input-group-merge error'
                    : 'input-group input-group-merge'
                }
              >
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fas fa-envelope" />
                  </span>
                </div>
                <input
                  className="form-control form-control"
                  placeholder="Email"
                  type="text"
                  value={personalInfo.email}
                  name="email"
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <div
                className={
                  personalInfo.phoneError
                    ? 'input-group input-group-merge error'
                    : 'input-group input-group-merge'
                }
              >
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fas fa-phone" />
                  </span>
                </div>
                <input
                  className="form-control form-control"
                  placeholder="Phone"
                  type="text"
                  value={personalInfo.phone}
                  name="phone"
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
            </div>
          </div>
        </Row>
        {length !== index + 1 && <hr />}
      </div>
      <div className="col">
        <button className="btn btn-sm btn-link text-danger" onClick={onDelete}>
          <i className="fas fa-user-times" />
        </button>
      </div>
    </div>
  </React.Fragment>
);
