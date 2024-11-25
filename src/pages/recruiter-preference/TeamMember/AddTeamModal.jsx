import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';

// reactstrap components
import { Button, FormGroup, Input } from 'reactstrap';
import axios from 'api/middleware';
import RecuiterPreference from 'utils/RecuiterPreference';
import { selectColors, customSelectStyles } from 'shared/styles';

// Forms Validation
import { Formik, Form, Field } from 'formik';
import { generateHeaders } from 'api/headers';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { StyledModal as Modal } from '../PreferenceStyles';
import { getErrorByName, showError, showSuccess } from '../../../helpers';

const translationPath = 'TeamMember.';
const parentTranslationPath = 'RecruiterPreferences';

const StyledModal = styled(Modal)`
  & .modal-content {
    overflow: visible;
  }
`;

const AddTeamModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const schemaRef = useRef(
    Yup.object().shape({
      title: Yup.string()
        .nullable()
        .min(3, t(`${translationPath}team-name-greater-than-description`))
        .max(50, t(`${translationPath}team-name-less-than-description`))
        .required(t(`${translationPath}team-name-is-required`)),
      selectedUsers: Yup.array()
        .nullable()
        .min(1, t(`${translationPath}the-users-field-is-required`))
        .required(t(`${translationPath}the-users-field-is-required`)),
    }),
  );
  const [title, setTitle] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const createTeam = () => {
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setIsWorking(true);
    axios
      .post(
        RecuiterPreference.TEAM_WRITE,
        {
          title,
          status: 1,
          users: selectedUsers,
        },
        {
          headers: generateHeaders(),
        },
      )
      .then(() => {
        setIsSubmitted(false);
        setIsWorking(false);
        showSuccess(t(`${translationPath}team-added-successfully`));
        props.getTeamData();
        setTitle('');
        setSelectedUsers([]);
        props.closeModal();
      })
      .catch((err) => {
        setIsWorking(false);
        showError(
          (err?.response?.data?.errors
            && ((typeof err.response.data.errors === 'object' && (
              <ul className="mb-0">
                {Object.entries(err.response.data.errors).map((item) => (
                  <li key={item[0]}>{item[1]}</li>
                ))}
              </ul>
            ))
              || err.response.data.message
              || err.response.data.status))
            || t(`${translationPath}error-in-adding-team`),
        );
      });
  };

  const handleChange = (newValues) => {
    if (newValues) {
      setSelectedUsers([...newValues.map((user) => user.value)]);
      return;
    }
    setSelectedUsers([]);
  };
  // Spinner
  const [isWorking, setIsWorking] = useState(false);

  // a method to update errors for form on state changed
  const getErrors = useCallback(() => {
    if (!schemaRef || !schemaRef.current) return;
    getErrorByName(schemaRef, { selectedUsers, title }).then((result) => {
      setErrors(result);
    });
  }, [selectedUsers, title]);

  // to call errors checker on dependencies change
  useEffect(() => {
    getErrors();
  }, [getErrors, selectedUsers, title]);

  useEffect(() => {
    if (props.users) setUsers(props.users);
  }, [props.users]);

  return (
    <>
      <StyledModal
        className="modal-dialog-centered"
        size="md"
        isOpen={props.isOpen}
        toggle={() => props.closeModal()}
      >
        <div className="modal-header border-0">
          <h5 className="modal-title" id="exampleModalLabel">
            {props.data
              ? t(`${translationPath}edit-team`)
              : t(`${translationPath}add-new-team`)}
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => props.closeModal()}
          >
            <span aria-hidden>×</span>
          </button>
        </div>
        <Formik
          enableReinitialize
          initialValues={{
            teamName: title,
          }}
          onSubmit={() => {
            createTeam();
          }}
        >
          {({ errorsForm, touched, isValidating, submitForm }) => (
            <Form>
              <div className="modal-body">
                <FormGroup>
                  <label className="form-control-label" htmlFor="teamName">
                    {t(`${translationPath}team-name`)}
                  </label>
                  <Field
                    as={Input}
                    className="form-control-sm form-control-alternative"
                    id="name"
                    placeholder={t(`${translationPath}title`)}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.currentTarget.value);
                    }}
                  />
                  {isSubmitted && errors && errors.title && (
                    <div className="c-error py-1">
                      <span>{errors.title.message}</span>
                    </div>
                  )}
                </FormGroup>
                <div>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="users">
                      {t(`${translationPath}users`)}
                    </label>
                    <Select
                      isMulti
                      searchable
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          ...selectColors,
                        },
                      })}
                      styles={customSelectStyles}
                      placeholder={t(`${translationPath}select-users`)}
                      onChange={handleChange}
                      options={[
                        ...users.map((user) => ({
                          value: user.uuid,
                          label: user.name,
                        })),
                      ]}
                    />
                    {isSubmitted && errors && errors.selectedUsers && (
                      <div className="c-error py-1">
                        <span>{errors.selectedUsers.message}</span>
                      </div>
                    )}
                  </FormGroup>
                </div>
              </div>
              <div className="modal-footer justify-content-center border-0">
                <Button
                  className="btn btn-sm btn-icon"
                  color="secondary"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => props.closeModal()}
                >
                  {t(`${translationPath}close`)}
                </Button>
                <Button
                  className="btn btn-sm btn-primary btn-icon float-right"
                  color="primary"
                  type="button"
                  onClick={() => submitForm()}
                  disabled={isWorking}
                >
                  {isWorking && (
                    <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                  )}
                  {`${
                    isWorking
                      ? t(`${translationPath}adding-new-team`)
                      : t(`${translationPath}save-and-continue`)
                  }`}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </StyledModal>
    </>
  );
};

export default AddTeamModal;
