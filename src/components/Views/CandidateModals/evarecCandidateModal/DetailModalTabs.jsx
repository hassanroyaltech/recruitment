/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from 'reactstrap';
// import SendOffer from '../../../../pages/evarec/SendOffer';
// Permissions
import { Can } from 'utils/functions/permissions';
import SendQuestionnaire from 'pages/evassess/pipeline/SendQuestionnaire';
import SendOffer from '../../OfferModal/index';
import SendVideoAssessment from '../../../../pages/evassess/pipeline/SendVideoAssessment';

const DetailModalTabs = ({
  activeItem,
  profile,
  onChange,
  stageOptions,
  onStageChange,
  reportUrl,
  evaluations,
  video_url,
  jobUuid,
  selectedCandidates,
  share,
}) => {
  // Get user object from localStorage
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const [dialog, setDialog] = useState(null);
  const closeDialog = () => setDialog(null);

  const showSendOfferModal = () => {
    setDialog(
      <SendOffer
        isOpen
        closeModal={closeDialog}
        pipeline={localStorage.getItem('pipeLineUuid')}
        match
        user={user}
        relation={1}
        relation_uuid={jobUuid}
        relation_candidate_uuid={selectedCandidates}
      />,
    );
  };
  const showSendVideoAssessmentModal = () => {
    setDialog(
      <SendVideoAssessment
        isOpen
        closeModal={closeDialog}
        pipeline={localStorage.getItem('pipeLineUuid')}
        jobUuid={jobUuid}
        selectedCandidates={selectedCandidates}
        type="popup"
      />,
    );
  };
  const showSendQuestionnaireModal = () => {
    setDialog(
      <SendQuestionnaire
        isOpen
        closeModal={closeDialog}
        pipeline={localStorage.getItem('pipeLineUuid')}
        jobUuid={jobUuid}
        match={jobUuid}
        selectedCandidates={[selectedCandidates]}
        candidates={profile?.basic_information}
        type="ats"
        popup
      />,
    );
  };

  return (
    <Nav
      tabs
      className="d-flex clearfix align-items-center justify-content-between position-relative tabs-with-actions bg-light-gray"
    >
      <Nav tabs className="d-flex border-0 first-tab">
        {video_url && (
          <NavItem>
            <NavLink
              active={activeItem === 'video'}
              onClick={() => onChange('video')}
            >
              Video
            </NavLink>
          </NavItem>
        )}

        {/* {profile && ( */}
        <NavItem>
          <NavLink
            active={activeItem === 'summary'}
            onClick={() => onChange('summary')}
          >
            Summary
          </NavLink>
        </NavItem>
        {/* )} */}

        <NavItem>
          <NavLink
            active={activeItem === 'attachments'}
            onClick={() => onChange('attachments')}
          >
            Attachments
          </NavLink>
        </NavItem>

        {evaluations && evaluations.length !== 0 && (
          <NavItem>
            <NavLink
              active={activeItem === 'evaluation'}
              onClick={() => onChange('evaluation')}
            >
              Evaluation
            </NavLink>
          </NavItem>
        )}

        {/* {questionnaires */}
        {/* && ( */}
        <NavItem>
          <NavLink
            active={activeItem === 'questionnaire'}
            onClick={() => onChange('questionnaire')}
          >
            Questionnaire
          </NavLink>
        </NavItem>
        {/* )} */}

        <NavItem>
          <NavLink
            active={activeItem === 'video_assessment'}
            onClick={() => onChange('video_assessment')}
          >
            Video assessment
          </NavLink>
        </NavItem>
      </Nav>
      <Nav className="float-right d-flex align-items-center last-tab">
        {!reportUrl ? null : (
          <NavItem
            className="cursor-pointer nav-link form-control-alternative px-2 font-weight-normal btn btn- bg-brand-light-blue"
            disabled={!reportUrl}
          >
            <a
              href={reportUrl}
              color="link"
              className="text-white font-14"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa fa-users" />
              <span className="px-1">Personality Report</span>
            </a>
          </NavItem>
        )}
        <NavItem className="float-right ml-2-reversed">
          <UncontrolledDropdown>
            <DropdownToggle
              color=""
              className="bg-brand-primary nav-link form-control-alternative px-2 font-weight-normal text-white"
            >
              <i className="fas fa-random mr-2-reversed" />
              Move Stage
              <i className="fas fa-angle-down ml-2-reversed" />
            </DropdownToggle>
            {stageOptions && stageOptions.length > 0 && (
              <DropdownMenu end>
                {stageOptions
                  && stageOptions.map((s, index) => (
                    <DropdownItem
                      key={`stageOptionsKey${index + 1}`}
                      onClick={() => {
                        // handleStageChange(s);
                        // Check if the modal opened from shared card
                        if (share) onStageChange(s.uuid);
                        else onStageChange(s.id);
                      }}
                    >
                      <div className="custom-control">
                        <label className="text-capitalize" htmlFor={s.title}>
                          {s.title}
                        </label>
                      </div>
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            )}
          </UncontrolledDropdown>
        </NavItem>
        {(Can('edit', 'ats') || Can('create', 'ats')) && (
          <NavItem className="float-right ml-2">
            {dialog}
            <UncontrolledDropdown>
              <DropdownToggle
                color=""
                className="nav-link text-white form-control-alternative px-2 font-weight-normal bg-brand-pink"
              >
                <i className="fas fa-list" />
                Action
                <i className="fa fa-angle-down ml-2" />
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem
                  onClick={(e) => {
                    showSendVideoAssessmentModal();
                  }}
                  color="link"
                  className="btn-sm justfiy-self-end text-dark"
                >
                  Send Video assessment
                </DropdownItem>
                <DropdownItem
                  onClick={(e) => {
                    showSendQuestionnaireModal();
                  }}
                  color="link"
                  className="btn-sm justfiy-self-end text-dark"
                >
                  Send Questionnaire
                </DropdownItem>
                <DropdownItem
                  onClick={(e) => {
                    showSendOfferModal();
                  }}
                  color="link"
                  className="btn-sm justfiy-self-end text-dark"
                >
                  Send Offer
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </NavItem>
        )}
      </Nav>
    </Nav>
  );
};

export default DetailModalTabs;
