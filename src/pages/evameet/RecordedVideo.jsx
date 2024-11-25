/**
 * -----------------------------------------------------------------------------------
 * @title RecordedVideo.jsx
 * -----------------------------------------------------------------------------------
 * This module contains the RecordedVideo Component which we use it to display recorded
 * video for previous meeting.
 * -----------------------------------------------------------------------------------
 */

// Import React and reactstrap
import React, { useState, useEffect } from 'react';
import { Card, Button, Col, Row, Nav, NavItem, NavLink, CardBody } from 'reactstrap';

// Import Video Card To display Video
import VideoCard from '../../components/Elevatus/VideoCard';

// Import evameet API
import { evameetAPI } from '../../api/evameet';

// Import Loader, Simple Header Components
import Loader from '../../components/Elevatus/Loader';
import SimpleHeader from '../../components/Elevatus/TimelineHeader';

// Import LetterAvatar
import LetterAvatar from '../../components/Elevatus/LetterAvatar';
import { useOverlayedAvatarStyles } from '../../utils/constants/colorMaps';

// Import kebabToTitle Function
import { kebabToTitle } from '../../shared/utils';

// Import Empty Component
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import Tooltip from '@mui/material/Tooltip';
import Empty from '../recruiter-preference/components/Empty';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvaMeet';

export default function RecordedVideo() {
  const { t } = useTranslation(parentTranslationPath);
  /**
   * @note this constant will be removed once API is ready, it used for testing.
   */
  const classes = useOverlayedAvatarStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState({});
  /**
   * Effect to view Selected meeting Details
   */
  useEffect(() => {
    const url = window.location.pathname;
    const uuid = url.substring(url.lastIndexOf('/') + 1);
    evameetAPI.viewScheduleInterview(uuid).then((res) => {
      setMeeting(res.data.results);
      setLoading(false);
    });
  }, []);
  /**
   * @returns {JSX Element}
   */
  return (
    <React.Fragment>
      <SimpleHeader name="Recorded Meeting" parentName="EVA-Meet" />
      {loading ? (
        <CardBody className="text-center">
          <Row>
            <Col xl="12">
              <Loader width="730px" height="49vh" speed={1} color="primary" />
            </Col>
          </Row>
        </CardBody>
      ) : (
        <React.Fragment>
          {meeting?.media ? (
            <React.Fragment>
              <Row className="align-items-center mt--6">
                <Col sm="12" xl="8">
                  <div className="evameet-recorded-video">
                    <div className="w-100">
                      <Card className="p-2" style={{ borderRadius: 8 }}>
                        <div className="w-100 h-100 video-content-wrapper">
                          <div className="video-content d-flex align-items-center justify-content-center">
                            <VideoCard controls src={`${meeting?.media?.url}.mp4`} />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </Col>
                <Col sm="12" xl="3" className="align-items-center">
                  <h1 className="font-15 text-primary font-weight-600 text-center">
                    {kebabToTitle(meeting?.title)}
                  </h1>
                  <div className="font-28 mb-2 text-center">
                    {meeting.interview_Date}
                  </div>
                  <div
                    className={classnames(
                      `${classes.root}`,
                      'justify-content-center p-2',
                    )}
                  >
                    {meeting.recruiters?.length > 0
                      && meeting.recruiters.map((recruiter, i) => (
                        <LetterAvatar
                          key={`recruitersMeetingsKeys${i + 1}`}
                          name={`${recruiter?.first_name} ${recruiter?.last_name}`}
                        />
                      ))}
                    {meeting.candidates?.length > 0
                      && meeting.candidates.map((guest, i) => (
                        <img
                          key={`candidatesImgKeys${i + 1}`}
                          className="avatar avatar-sm rounded-circle text-white img-circle gray-avatar"
                          src={require('assets/img/theme/team-1.jpg')}
                          alt="Candidates"
                        />
                      ))}
                  </div>
                  <Nav className="justify-content-center p-2">
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a download target="_blank" href={meeting?.media?.url}>
                      <NavItem>
                        <NavLink
                          color="link"
                          className="btn nav-link nav-link-shadow btn-primary text-white font-weight-normal border-radius-2"
                        >
                          <i className="fa fa-download mx-1" />
                          {t(`${translationPath}download`)}
                        </NavLink>
                      </NavItem>
                    </a>
                  </Nav>
                </Col>
              </Row>
              <Tooltip title="Back to List">
                <span>
                  <Button
                    color="link"
                    className="ml-3 mt--5"
                    // style={{ width: '220px' }}
                    onClick={() => {
                      history.push('/recruiter/meetings/');
                    }}
                  >
                    <i className="fas fa-long-arrow-alt-left fa-5x" />
                  </Button>
                </span>
              </Tooltip>
            </React.Fragment>
          ) : (
            <Empty message={t(`${translationPath}no-recorded-meetings`)} />
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
