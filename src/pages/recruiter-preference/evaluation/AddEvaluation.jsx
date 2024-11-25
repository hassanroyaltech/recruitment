// import React components
import React, { useState, useEffect, useCallback } from 'react';

// import Reactstrap components
import {
  Button,
  Input,
  FormGroup,
  Card,
  Col,
  Row,
  CardBody,
  Container,
} from 'reactstrap';

// import Select
import Select from 'react-select';

// import Styled components
import { selectColors, customSelectStyles } from 'shared/styles';
import styled from 'styled-components';

// import Shared components
import { IconButton as CoreIconButton } from 'shared/icons';
// import preferences API
import { preferencesAPI } from 'api/preferences';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import EvaluationCard from './components/EvaluationCard';
import { CheckboxesComponent } from '../../../components';
import { getErrorByName, showError, showSuccess } from '../../../helpers';
import { SharedInputControl } from '../../setups/shared';

const translationPath = 'Evaluations.';
const parentTranslationPath = 'RecruiterPreferences';

const StyledFormGroup = styled(FormGroup)`
  align-items: center;
  background-color: ${(props) =>
    props.checked ? 'rgba(3, 57, 108, 0.1)' : 'transparent'};
  border-radius: 0.25rem;
  display: flex;
  height: 100%;
  padding: 0 12px;
  & label {
    font-size: 14px;
    margin-bottom: 0;
  }
`;

const FieldsGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(2, 1fr);
`;

const IconButton = styled(CoreIconButton)`
  position: absolute;
  right: -40px;
  top: 0;
`;
const TitleRow = styled.div`
  align-items: center;
  display: flex;
  & > * {
    font-weight: bold;
  }
`;
const AddEvaluation = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isClickedPlus, setIsClickedPlus] = useState(false);
  const [score, setScore] = useState('');
  const [evaluationTitle, setEvaluationTitle] = useState('');
  const [active, setActive] = useState(1);
  const [errors, setErrors] = useState(() => ({}));
  const [scoreOptions] = useState([
    { value: 1, label: t(`${translationPath}1-to-5`) },
    { value: 2, label: t(`${translationPath}percentage`) },
  ]);
  const [hasComments, setHasComments] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 2

  const [labelTitle, setLabelTitle] = useState('');
  const [numberOfFields, setNumberOfFields] = useState(null);

  // Fields
  const [fields, setFields] = useState([]);
  // List Of Items
  const [groups, setGroups] = useState([]);

  const addNewItem = (newItem) => {
    setGroups((previousItems) => [...previousItems, { ...newItem }]);
  };

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const list = [...fields];
    list[index] = value;
    setFields(list);
  };

  // change title depends on action update || Create
  const title = props.match?.params?.uuid
    ? t(`${translationPath}update`)
    : t(`${translationPath}new`);

  // a method to update errors for form on state changed
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          evaluationTitle: yup
            .string()
            .nullable()
            .min(
              2,
              `${t(
                `${translationPath}evaluation-title-must-be-greater-than-or-equal`,
              )} ${2}`,
            )
            .max(
              500,
              `${t(
                `${translationPath}evaluation-title-must-be-less-than-or-equal`,
              )} ${500}`,
            )
            .required(t(`${translationPath}evaluation-title-is-required`)),
          score: yup
            .object()
            .nullable()
            .required(t(`${translationPath}score-is-required`)),
          labelTitle: yup
            .string()
            .nullable()
            .max(
              255,
              `${t(
                `${translationPath}label-title-must-be-less-than-or-equal`,
              )} ${255}`,
            )
            .test(
              'required',
              t(`${translationPath}label-title-is-required`),
              (value) =>
                value
                || (groups
                  && groups.length > 0
                  && !value
                  && (!numberOfFields || numberOfFields.value === 0)
                  && !isClickedPlus),
            )
            .test(
              'min',
              `${t(
                `${translationPath}label-title-must-be-greater-than-or-equal`,
              )} ${2}`,
              (value) => !value || value.length >= 2,
            ),
          numberOfFields: yup
            .object()
            .nullable()
            .test(
              'required',
              t(`${translationPath}number-of-fields-is-required`),
              (value) =>
                value
                || (groups && groups.length > 0 && !labelTitle && !isClickedPlus),
            ),
          fields: yup
            .array()
            .nullable()
            .of(
              yup
                .string()
                .nullable()
                .min(
                  2,
                  `${t(
                    `${translationPath}label-title-must-be-greater-than-or-equal`,
                  )} ${2}`,
                )
                .max(
                  500,
                  `${t(
                    `${translationPath}label-must-be-less-than-or-equal`,
                  )} ${500}`,
                )
                .required(t(`${translationPath}label-is-required`)),
            ),
          groups: yup
            .array()
            .nullable()
            .of(
              yup.object().shape({
                labelTitle: yup
                  .string()
                  .min(
                    2,
                    `${t(
                      `${translationPath}label-title-must-be-greater-than-or-equal`,
                    )} ${2}`,
                  )
                  .max(
                    255,
                    `${t(
                      `${translationPath}label-title-must-be-less-than-or-equal`,
                    )} ${255}`,
                  )
                  .required(t(`${translationPath}label-title-is-required`)),
                fields: yup
                  .array()
                  .nullable()
                  .of(
                    yup
                      .string()
                      .min(
                        2,
                        `${t(
                          `${translationPath}label-must-be-greater-than-or-equal`,
                        )} ${2}`,
                      )
                      .nullable()
                      .max(
                        500,
                        `${t(
                          `${translationPath}label-must-be-less-than-or-equal`,
                        )} ${500}`,
                      )
                      .required(t(`${translationPath}label-is-required`)),
                  ),
                numberOfFields: yup
                  .object()
                  .nullable()
                  .required(t(`${translationPath}number-of-fields-is-required`)),
              }),
            ),
        }),
      },
      {
        evaluationTitle,
        score,
        labelTitle,
        numberOfFields,
        fields,
        groups,
      },
    ).then((result) => {
      setErrors(result);
    });
  }, [
    t,
    evaluationTitle,
    score,
    labelTitle,
    numberOfFields,
    fields,
    groups,
    isClickedPlus,
  ]);

  /**
   * @param index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove item from group list
   * (frontend remove)
   */
  const deleteGroupItemHandler = useCallback(
    (index) => (event) => {
      event.preventDefault();
      event.stopPropagation();
      setGroups((items) => {
        const localItem = [...items];
        localItem.splice(index, 1);
        return localItem;
      });
    },
    [],
  );

  // save button functionality => add items => change items state => call useEffect function
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (
      errors
      && ((Object.keys(errors).length > 0 && !isClickedPlus)
        || Object.keys(errors).some((key) => key.includes('groups')))
    )
      return;
    setIsClickedPlus(false);
    const localGroups = [...groups];
    if (labelTitle)
      localGroups.push({
        labelTitle,
        numberOfFields,
        fields,
      });
    let func;
    const savingDto = {
      title: evaluationTitle,
      score: score.value,
      group: localGroups.map((item) => ({
        title: item.labelTitle,
        labels: item.fields,
      })),
      has_comments: hasComments,
      comment,
      uuid: props.match?.params?.uuid,
    };
    setLoading(true);
    if (props.match?.params?.uuid) func = preferencesAPI.UpdateEvaluation(savingDto);
    else func = preferencesAPI.CreateEvaluation(savingDto);

    func
      .then((res) => {
        if (res.data?.statusCode === 201 || res.data?.statusCode === 200) {
          if (props.match?.params?.uuid)
            showSuccess(t(`${translationPath}evaluation-updated-successfully`));
          else {
            showSuccess(t(`${translationPath}evaluation-created-successfully`));
            window?.ChurnZero?.push([
              'trackEvent',
              'Create evaluation form',
              'Create evaluation form from recruiter preferences',
              1,
              {},
            ]);
          }
          props.history.push('/recruiter/recruiter-preference/evaluation');
          setLoading(false);
        }
      })
      .catch((error) => {
        showError(
          t(
            `Shared:failed-to-${
              (props.match?.params?.uuid && 'update') || 'create'
            }`,
            error,
          ),
        );
        setLoading(false);
      });
  };
  // this is to call validations checker on state changed
  useEffect(() => {
    getErrors();
  }, [
    getErrors,
    evaluationTitle,
    score,
    labelTitle,
    numberOfFields,
    fields,
    groups,
  ]);

  useEffect(() => {
    setIsClickedPlus(false);
  }, [labelTitle, numberOfFields]);

  useEffect(() => {
    if (numberOfFields)
      setFields((item) => {
        const localItem = [...item];
        if (numberOfFields.value > localItem.length)
          Array.from({ length: numberOfFields.value - localItem.length }).map(() =>
            localItem.push(''),
          );
        else localItem.length = numberOfFields.value;
        return localItem;
      });
    else setFields([]);
  }, [numberOfFields]);

  useEffect(() => {
    if (props.match?.params?.uuid)
      preferencesAPI
        .FindEvaluation(props.match?.params?.uuid)
        .then((res) => {
          setEvaluationTitle(res.data?.results.title);
          setHasComments(res.data?.results.has_comments);
          if (res.data?.results?.score === 2)
            setScore({ value: 2, label: t(`${translationPath}percentage`) });
          else setScore({ value: 1, label: t(`${translationPath}1-to-5`) });

          setComment(res.data?.results.comment);
          setGroups(
            res.data?.results?.group.map((item) => ({
              labelTitle: item.title,
              fields: item.labels,
              numberOfFields: {
                label: item.labels.length,
                value: item.labels.length,
              },
            })),
          );
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
  }, [props.match.params.uuid, t]);

  return (
    <form noValidate onSubmit={handleSubmit} className="content-page">
      <div className="content">
        <Container fluid>
          <div
            className="content-page  p-sm-5 p-1 pt-5 overflow-hidden"
            style={{ background: 'inherit' }}
          >
            {active === 1 && (
              <TitleRow className=" my-5">
                <div className="header-text-x2 d-inline-block mr-1-reversed">
                  {title} {t(`${translationPath}evaluation`)}
                </div>
              </TitleRow>
            )}
            {/* Step 1 */}
            {active === 1 && (
              <>
                <Row>
                  <Col lg="6">
                    <FormGroup className="mb-2">
                      <Input
                        className="form-control-alternative"
                        type="text"
                        name="major"
                        placeholder={t(`${translationPath}evaluation-title`)}
                        value={evaluationTitle}
                        onChange={(e) => {
                          setEvaluationTitle(e.currentTarget.value);
                        }}
                      />
                      {isSubmitted && errors.evaluationTitle && (
                        <div className="c-error py-1">
                          <span>{errors.evaluationTitle.message}</span>
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col lg={6}>
                    <Select
                      isClearable
                      styles={customSelectStyles}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          ...selectColors,
                        },
                      })}
                      name="score"
                      onChange={(o) => {
                        setScore(o);
                      }}
                      value={
                        score
                          ? {
                            label: score.label,
                            value: score.value,
                          }
                          : ''
                      }
                      placeholder={t(`${translationPath}evaluation-score`)}
                      options={scoreOptions}
                    />
                    {isSubmitted && errors.score && (
                      <div className="c-error py-1">
                        <span>{errors.score.message}</span>
                      </div>
                    )}
                  </Col>
                </Row>
                <div className="d-flex justify-content-center mt-4">
                  <Button
                    color="secondary"
                    onClick={() => {
                      props.history.push(
                        '/recruiter/recruiter-preference/evaluation',
                      );
                    }}
                  >
                    {t(`${translationPath}back`)}
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      if (errors.evaluationTitle || errors.score) {
                        setIsSubmitted(true);
                        return;
                      }
                      setIsSubmitted(false);
                      setActive(2);
                    }}
                  >
                    {t(`${translationPath}continue`)}
                  </Button>
                </div>
              </>
            )}
            {/* Step 2 */}
            {active === 2 && (
              <Row>
                <Col xl="12">
                  <div className="header-text-x2 mb-4 d-inline-block mr-1-reversed">
                    {evaluationTitle}
                  </div>
                  <Card className="px-6 py-6">
                    <Row className="mb-2 position-relative">
                      <Col lg="6">
                        <FormGroup className="mb-2">
                          <Input
                            className="form-control-alternative"
                            type="text"
                            name="labelTitle"
                            placeholder={t(`${translationPath}label-title`)}
                            value={labelTitle}
                            onChange={(e) => {
                              setLabelTitle(e.currentTarget.value);
                            }}
                          />
                        </FormGroup>
                        {isSubmitted && errors.labelTitle && (
                          <div className="c-error py-1">
                            <span>{errors.labelTitle.message}</span>
                          </div>
                        )}
                      </Col>
                      <Col lg={6}>
                        <Select
                          isClearable
                          isDisabled
                          styles={customSelectStyles}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              ...selectColors,
                            },
                          })}
                          name="score"
                          value={{
                            label: score.label,
                            value: score.value,
                          }}
                          placeholder={t(`${translationPath}score`)}
                          options={scoreOptions}
                        />
                      </Col>
                      <IconButton
                        onClick={() => {
                          if (!labelTitle && !numberOfFields) setIsClickedPlus(true);
                          if (
                            !labelTitle
                            || !numberOfFields
                            || numberOfFields.value === 0
                            || errors.labelTitle
                            || errors.numberOfFields
                            || Object.keys(errors).some((key) => key.includes('fields'))
                          ) {
                            setIsSubmitted(true);
                            return;
                          }
                          setIsClickedPlus(false);
                          if (!errors.groups) setIsSubmitted(false);
                          addNewItem({
                            labelTitle,
                            numberOfFields,
                            fields,
                          });
                          setLabelTitle('');
                          setNumberOfFields(null);
                          setFields([]);
                        }}
                        className="ml-auto-reversed p-2 mr-0-reversed w-auto"
                        icon={<i className="fas fa-plus fa-2x" />}
                      />
                    </Row>

                    <Row className="mb-2">
                      <Col lg={6}>
                        <Select
                          isClearable
                          styles={customSelectStyles}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              ...selectColors,
                            },
                          })}
                          name="numberOfFields"
                          onChange={(o) => {
                            setNumberOfFields(o);
                          }}
                          value={
                            numberOfFields
                              ? {
                                label: numberOfFields.label,
                                value: numberOfFields.value,
                              }
                              : ''
                          }
                          placeholder={t(`${translationPath}#-of-fields`)}
                          options={[
                            { value: '1', label: '1' },
                            { value: '2', label: '2' },
                            { value: '3', label: '3' },
                            { value: '4', label: '4' },
                            { value: '5', label: '5' },
                            { value: '6', label: '6' },
                          ]}
                        />
                        {isSubmitted && errors.numberOfFields && (
                          <div className="c-error py-1">
                            <span>{errors.numberOfFields.message}</span>
                          </div>
                        )}
                      </Col>
                    </Row>
                    {fields.length > 0 && (
                      <FieldsGrid className="mt-4 pt-4 border-top">
                        {fields.map((f, i) => (
                          <div
                            key={`fieldsKey${i + 1}`}
                            className="d-inline-flex flex-wrap"
                          >
                            <Input
                              type="text"
                              placeholder={`${t(`${translationPath}label`)} ${
                                i + 1
                              }`}
                              onChange={(e) => handleInputChange(e, i)}
                            />
                            {isSubmitted
                              && Object.keys(errors).some((key) =>
                                key.includes('fields'),
                              )
                              && errors[`fields[${i}]`] && (
                              <div className="c-error py-1">
                                <span>{errors[`fields[${i}]`].message}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </FieldsGrid>
                    )}
                  </Card>
                  {groups.length > 0
                    && groups.map((item, i) => (
                      <EvaluationCard
                        key={`evaluationCardKey${i + 1}`}
                        item={item}
                        errors={errors}
                        isSubmitted={isSubmitted}
                        index={i}
                        deleteGroupItemClicked={deleteGroupItemHandler(i)}
                        onValueChanged={(newValue) => {
                          setGroups((items) => {
                            const localItem = [...items];
                            localItem[i][newValue.id] = newValue.value;
                            return localItem;
                          });
                        }}
                      />
                    ))}

                  <Card className="px-6 py-6">
                    <StyledFormGroup checked={hasComments}>
                      <CheckboxesComponent
                        idRef="hasComments"
                        singleChecked={hasComments}
                        labelValue={t(`${translationPath}has-comment`)}
                        onSelectedCheckboxClicked={() => {
                          setHasComments((items) => !items);
                        }}
                      />
                    </StyledFormGroup>

                    {hasComments && (
                      <CardBody
                        className="border border-gray d-flex-center p-3 bg-white"
                        style={{ borderRadius: 27, flex: 'unset' }}
                      >
                        <SharedInputControl
                          rows={3}
                          multiline
                          isFullWidth
                          wrapperClasses="mb-0"
                          stateKey="comment"
                          editValue={comment}
                          onValueChanged={({ value }) => {
                            setComment(value);
                          }}
                          title="type-your-comment"
                          translationPath={translationPath}
                          parentTranslationPath={parentTranslationPath}
                        />
                      </CardBody>
                    )}
                  </Card>
                  <div className="d-flex justify-content-center">
                    <Button
                      onClick={() => {
                        setActive(1);
                        if (isSubmitted) setIsSubmitted(false);
                        if (isClickedPlus) setIsClickedPlus(false);
                      }}
                    >
                      {t(`${translationPath}back`)}
                    </Button>

                    <Button color="primary" type="submit" disabled={loading}>
                      {t(`${translationPath}save`)}
                    </Button>
                  </div>
                </Col>
              </Row>
            )}
          </div>
        </Container>
      </div>
    </form>
  );
};
export default AddEvaluation;
