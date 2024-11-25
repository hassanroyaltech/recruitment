/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { Card } from 'reactstrap';
import classnames from 'classnames';
import moment from 'moment';
import EvassessCandidateModal from 'components/Views/CandidateModals/evassessCandidateModal/EvassessCandidateModal';
import { EleModal } from 'components/Elevatus/EleModal';
import Team4 from 'assets/img/theme/team-4.jpg';

const Pill = styled.div`
  align-items: center;
  background: var(--bgprimary);
  border-radius: 100%;
  color: white;
  display: flex;
  font-size: 18px;
  height: 40px;
  justify-content: center;
  position: absolute;
  right: -10px;
  top: -10px;
  width: 40px;
  z-index: 99;
`;

const Grid = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const GridRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Img = styled.img`
  min-width: 36px;
`;
const SharedCard = (props) => (
  <>
    {/* Modal States */}
    <Card
      className={classnames(
        'm-2 stage-card pipeline-stage-card',
        props.isGhosting && 'ghosting',
        props.isSelected && 'selected',
      )}
    >
      {props.selectionCount && <Pill>{props.selectionCount}</Pill>}
      <Grid>
        <GridRow style={{ alignItems: 'flex-start' }}>
          <Img
            className="avatar  avatar-sm  rounded-circle text-white img-circle"
            src={props.profile_image?.url || Team4}
          />
          <div className="ml-2-reversed d-flex flex-column flex-grow-1">
            <h4 className="m-0 mt-1" role="button" onClick={props.onClick}>
              {props.title}
            </h4>
            {props.subtitle && (
              <div className="h7 text-gray" style={{ overflowWrap: 'anywhere' }}>
                {props.subtitle}
              </div>
            )}
          </div>
        </GridRow>
        <GridRow>
          <div className="w-100 text-gray">
            <small className="m-0 h7">
              {props.comments ? props.comments : 0}
              <i className="far fa-comment-alt m-1" />
            </small>
            <small className="m-0 h7 ml-3-reversed">
              <i className="far fa-clock" />
              {moment(Date.parse(props.register_at)).format('DD MMM YYYY')}
            </small>
          </div>
        </GridRow>
      </Grid>
    </Card>
    {props.VAModal && (
      <EleModal
        show={props.VAModal}
        handleClose={() => props.setVAModal(false)}
        children={
          <EvassessCandidateModal
            assessment_uuid={props.assessmentUUID}
            selected_candidates={props.uuid}
            assessmentEvaluation={props?.assessmentEvaluation}
            parentTranslationPath="EvaSSESSPipeline"
            isCompleted={props.is_completed}
            show={props.VAModal}
            reloadData={() => {
              if (props.reloadData) props.reloadData();
              props.setVAModal(!props.VAModal);
            }}
            handleClose={() => {
              props.setVAModal(!props.VAModal);
            }}
            share
          />
        }
      />
    )}
  </>
);
export default SharedCard;
