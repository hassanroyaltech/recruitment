import React, { useState, useEffect } from 'react';
import { Input, FormGroup, Card, Col, Row, Collapse } from 'reactstrap';
import Select from 'react-select';
import { selectColors, customSelectStyles } from 'shared/styles';
import styled from 'styled-components';
import { IconButton } from 'shared/icons';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { SystemActionsEnum } from '../../../../enums';

const translationPath = 'Evaluations.';
const parentTranslationPath = 'RecruiterPreferences';

const FieldsGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(2, 1fr);
`;

const IconsWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 2px;
  & .flip-collapse-icon {
    pointer-events: none;
  }
`;

const EvaluationCard = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [labelTitle, setLabelTitle] = useState(props.item?.labelTitle);
  const [numberOfFields, setNumberOfFields] = useState(props.item.numberOfFields);
  const [fields, setFields] = useState(props.item?.fields);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const list = [...fields];
    list[index] = value;
    if (props.onValueChanged) props.onValueChanged({ id: 'fields', value: list });
    setFields(list);
  };

  useEffect(() => {
    if (props.onValueChanged && fields.length !== props.item.fields.length)
      props.onValueChanged({ id: 'fields', value: fields });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length]);

  useEffect(() => {
    if (props.item && props.item.labelTitle) setLabelTitle(props.item.labelTitle);
  }, [props.item]);

  return (
    <Card
      style={{ cursor: 'pointer' }}
      className={`${isOpen ? 'p-6' : 'p-4'}`}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((isOpen) => !isOpen);
      }}
    >
      {!isOpen && labelTitle && (
        <div className="d-flex-v-center-h-between">
          <div className="header-text-x2 mb-0">{labelTitle}</div>
          <ButtonBase
            className="btns-icon theme-solid bg-danger"
            onClick={props.deleteGroupItemClicked}
          >
            <span className={SystemActionsEnum.delete.icon} />
          </ButtonBase>
        </div>
      )}
      <IconsWrapper>
        <IconButton
          className="ml-auto-reversed p-2 flip-collapse-icon"
          icon={
            <i
              className={`fas fa-chevron-down ${isOpen ? 'fa-flip-vertical' : ''}`}
            />
          }
        />
      </IconsWrapper>
      <Collapse
        isOpen={isOpen}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <>
          <Row className="mb-2 position-relative">
            <Col lg={6}>
              <FormGroup className="mb-2">
                <Input
                  className="form-control-alternative"
                  type="text"
                  name="labelTitle"
                  placeholder={t(`${translationPath}label-title`)}
                  value={labelTitle}
                  onChange={(e) => {
                    const {
                      currentTarget: { value },
                    } = e;
                    setLabelTitle(value);
                    if (props.onValueChanged)
                      props.onValueChanged({ id: 'labelTitle', value });
                  }}
                />
                {props.isSubmitted
                  && Object.keys(props.errors).some((key) => key.includes('groups'))
                  && props.errors[`groups[${props.index}].labelTitle`] && (
                  <div className="c-error py-1">
                    <span>
                      {props.errors[`groups[${props.index}].labelTitle`].message}
                    </span>
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
                name="numberOfFields"
                onChange={(o) => {
                  setNumberOfFields(o);
                  if (props.onValueChanged)
                    props.onValueChanged({ id: 'numberOfFields', value: o });
                  setFields((item) => {
                    const localItem = [...item];
                    if (o && o.value > localItem.length)
                      Array.from({ length: o.value - localItem.length }).map(() =>
                        localItem.push(''),
                      );
                    else localItem.length = o ? o.value : 0;
                    return localItem;
                  });
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
              {props.isSubmitted
                && Object.keys(props.errors).some((key) => key.includes('groups'))
                && props.errors[`groups[${props.index}].numberOfFields`] && (
                <div className="c-error py-1">
                  <span>
                    {props.errors[`groups[${props.index}].numberOfFields`].message}
                  </span>
                </div>
              )}
            </Col>
          </Row>

          {fields.length > 0 && (
            <FieldsGrid className="mt-4 pt-4 border-top">
              {fields.map((f, i) => (
                <div
                  key={`groupFieldsKey${i + 1}`}
                  className="d-inline-flex flex-wrap"
                >
                  <Input
                    className="form-control-alternative"
                    type="text"
                    placeholder={`${t(`${translationPath}label`)} ${i + 1}`}
                    onChange={(e) => handleInputChange(e, i)}
                    defaultValue={f}
                  />
                  {props.isSubmitted
                    && Object.keys(props.errors).some((key) =>
                      key.includes('groups'),
                    )
                    && props.errors[`groups[${props.index}].fields[${i}]`] && (
                    <div className="c-error py-1">
                      <span>
                        {
                          props.errors[`groups[${props.index}].fields[${i}]`]
                            .message
                        }
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </FieldsGrid>
          )}
        </>
      </Collapse>
    </Card>
  );
};

export default EvaluationCard;
