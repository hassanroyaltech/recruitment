import React, { useState } from 'react';

import { Button, Container, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import { Helmet } from 'react-helmet';
import { ChangePassword } from './ChangePassword';
import TimelineHeader from '../../components/Elevatus/TimelineHeader';
import { Can } from '../../utils/functions/permissions';

export default function AccountSettings(props) {
  const [state, setState] = useState({
    closeAccountModal: false,
    SuccessCloseModal: false,
  });
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const TITLE = 'Account Settings';
  return (
    <React.Fragment>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      {state.closeAccountModal && (
        <ReactBSAlert
          warning
          style={{ display: 'block' }}
          title="Are you sure?"
          onConfirm={() => {
            setState((prevState) => ({
              ...prevState,
              closeAccountModal: false,
              openSuccessModal: true,
            }));
          }}
          onCancel={() => {
            setState((prevState) => ({
              ...prevState,
              closeAccountModal: false,
              openSuccessModal: false,
            }));
          }}
          showCancel
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="danger"
          confirmBtnText="Close Account"
          cancelBtnText="Deactivate "
          btnSize="sm"
        >
          You won&apos;t be able to revert this!
        </ReactBSAlert>
      )}
      {state.openSuccessModal && (
        <ReactBSAlert
          success
          style={{ display: 'block' }}
          title="Closed!"
          onConfirm={() => {
            setState((prevState) => ({
              ...prevState,
              closeAccountModal: false,
              openSuccessModal: false,
            }));
          }}
          onCancel={() => {
            setState((prevState) => ({
              ...prevState,
              closeAccountModal: false,
              openSuccessModal: false,
            }));
          }}
          confirmBtnBsStyle="primary"
          confirmBtnText="Ok"
          btnSize="sm"
        >
          Your Account has been closed.
        </ReactBSAlert>
      )}
      <TimelineHeader name="Account Setting" parentName="Account" />

      <Container fluid className=" m-t-5 pb-4 flex-mobile-row-reverse-2 mt--6">
        <Card>
          <CardHeader>
            <h3 className="font-16">Account Settings</h3>
          </CardHeader>
          <CardBody>
            <Container>
              <div className="card-md-deck d-md-flex">
                <Row>
                  {/* <Col xl="6" md="12" sm="12"> */}
                  {/*    <Card className="text-center account-setting p-4  ml-2 mr-2"> */}
                  {/*        <h2 className="font-25 font-weight-700 counter text-white"> */}
                  {/*            14 */}
                  {/*        </h2> */}
                  {/*        <p className="font-weight-500"> */}
                  {/*            No of days remaining for end of yearly subscription */}
                  {/*        </p> */}
                  {/*    </Card> */}
                  {/* </Col> */}
                  <Col xl="6" md="12" sm="12">
                    <Card className="p-4  ml-2 mr-2">
                      <div className="row d-flex align-items-center">
                        <div className="col-md-6 col-sm-8 col-xs-7">
                          <h3 className="font-16">Change Password</h3>
                          <p className="m-0">
                            Change your password, use a secure password for your
                            account.
                          </p>
                        </div>
                        <div className="col-md-6 col-sm-4 col-xs-5">
                          <div className="text-center ">
                            <Button
                              color="warning"
                              className="btn-sm"
                              onClick={() => {
                                setChangePasswordModal(!changePasswordModal);
                              }}
                            >
                              Change Password
                            </Button>
                            <ChangePassword
                              {...props}
                              isOpen={changePasswordModal}
                              onClick={() => {
                                setChangePasswordModal(!changePasswordModal);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  {Can('view', 'sub-user') && (
                    <Col xl="6" md="12" sm="12">
                      <Card className="p-4  ml-2 mr-2">
                        <div className="row d-flex align-items-center">
                          <div className="col-md-6 col-sm-8 col-xs-7">
                            <h3 className="font-16">Managing your users</h3>
                            <p>
                              You can create, modify and delete user sub-accounts
                              here.
                            </p>
                          </div>
                          <div className="col-md-6 col-sm-4 col-xs-5">
                            <div className="text-center actions">
                              <Link
                                disabled={!Can('view', 'sub-user')}
                                to="/recruiter/recruiter-preference/users"
                              >
                                <p className="btn-info  btn btn-sm">Manage Users</p>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  )}
                  <Col xl="6" md="12" sm="12">
                    <Card className="card p-4 ml-2 mr-2">
                      <div className="row d-flex align-items-center">
                        <div className="col-md-6 col-sm-8 col-xs-7">
                          <h3 className="font-16">Closing your Account</h3>
                          <p>
                            Learn about your options, and close your account if you
                            wish.
                          </p>
                        </div>
                        <div className="col-md-6 col-sm-4 col-xs-5">
                          <div className="text-center actions">
                            <Button
                              color="danger"
                              className="btn-sm"
                              onClick={() => {
                                setState((prevState) => ({
                                  ...prevState,
                                  closeAccountModal: true,
                                }));
                              }}
                            >
                              Close Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Container>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  );
}
