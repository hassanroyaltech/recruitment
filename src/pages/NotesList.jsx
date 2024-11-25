/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import { Button, CardBody, Col, Row } from 'reactstrap';

import Loader from 'components/Elevatus/Loader';
import moment from 'moment';
import styled from 'styled-components';
import LetterAvatar from 'components/Elevatus/LetterAvatar';
import { useOverlayedAvatarStyles } from 'utils/constants/colorMaps';
import ThumbnailItemCard from 'components/Views/CandidateModals/evarecCandidateModal/VideoAssessmentTab/ThumbnailItemCard';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';

const translationPath = 'NotesListComponent.';
const NotesList = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  const classes = useOverlayedAvatarStyles();
  const [notes] = useState(props.notes);
  const [loading] = useState(props.loading);
  const userReducer = useSelector((state) => state.userReducer);
  const InfiniteScrollWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
  `;

  return (
    <>
      {loading ? (
        <CardBody className="text-center">
          <Row>
            <Col xl="12">
              <Loader width="730px" height="49vh" speed={1} color="primary" />
            </Col>
          </Row>
        </CardBody>
      ) : (
        <>
          <div className="scroll_content_y_40 ">
            <Row>
              <Col xs={12}>
                {notes
                  && notes?.map(
                    (note, index) =>
                      note && (
                        <React.Fragment key={`notesKey${index + 1}`}>
                          <div className="mb-2 media-comment ">
                            <div
                              className="mr-2-reversed text-right font-12"
                              style={{ color: '#bebdbd' }}
                            >
                              {note.created_at
                                ? moment(Date.parse(note.created_at))
                                  .locale(i18next.language)
                                  .fromNow()
                                : ''}
                            </div>

                            <div className="d-flex flex-row align-items-start comment-item">
                              <div className={classes.root} style={{ margin: 6 }}>
                                <LetterAvatar
                                  name={`${note?.user?.first_name} ${note?.user?.last_name}`}
                                />
                              </div>
                              <div
                                className="flex-grow-1 d-flex-h-between px-3 py-2 position-relative"
                                style={{ borderRadius: 20 }}
                              >
                                <div className="d-inline-flex-column mb-1">
                                  {note.user && (
                                    <h6 className="h6 mt-0">
                                      {note.user.first_name} {note.user.last_name}
                                    </h6>
                                  )}
                                  <p>{note.note}</p>
                                  {note?.media && note?.media.length > 0
                                    ? note?.media?.map(
                                      (item, index) =>
                                        item
                                          && item.original
                                          && item?.original?.url && (
                                          <Col
                                            xs={6}
                                            sm={6}
                                            md={4}
                                            lg={3}
                                            className="mb-2"
                                            key={`nodeMediaKey${index + 1}`}
                                            style={{ width: 200, height: 92 }}
                                          >
                                            <a
                                              download
                                              rel="noreferrer"
                                              target="_blank"
                                              href={item?.original?.url}
                                            >
                                              <ThumbnailItemCard
                                                img={item?.original?.url}
                                                title={item?.original?.type}
                                                extension={
                                                  item?.original?.extension
                                                }
                                              />
                                            </a>
                                          </Col>
                                        ),
                                    )
                                    : note
                                      && note?.media
                                      && note?.media?.original && (
                                      <Col
                                        xs={6}
                                        sm={6}
                                        md={4}
                                        lg={3}
                                        className="mb-2"
                                        key={`nodeKey${index + 1}`}
                                        style={{ width: 200, height: 92 }}
                                      >
                                        <a
                                          download
                                          rel="noreferrer"
                                          target="_blank"
                                          href={note?.media?.original?.url}
                                        >
                                          <ThumbnailItemCard
                                            img={note?.media?.original?.url}
                                            title={note?.media?.original?.type}
                                            extension={
                                              note?.media?.original?.extension
                                            }
                                          />
                                        </a>
                                      </Col>
                                    )}
                                </div>
                                <ButtonBase
                                  className="btns-icon theme-transparent c-danger"
                                  onClick={() => props.ondelete(note.uuid, index)}
                                  disabled={
                                    note?.user?.uuid
                                    !== userReducer?.results?.user?.uuid
                                  }
                                >
                                  <i className="fas fa-trash fa-xs text-danger" />
                                </ButtonBase>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ),
                  )}
                {notes && notes.length < props.totalNotes && (
                  <InfiniteScrollWrapper>
                    <Button
                      disabled={props.isLoadingMore}
                      onClick={props.loadMore}
                      color="primary"
                      className="btn-sm mt-2"
                    >
                      {props.isLoadingMore && (
                        <>
                          <i className="fas fa-circle-notch fa-spin mr-1-reversed" />
                          <span>{t(`${translationPath}loading`)}</span>
                        </>
                      )}
                      {!props.isLoadingMore && (
                        <>
                          <i className="fas fa-sync-alt mr-1-reversed" />
                          <span>{t('Shared:load-more')}</span>
                        </>
                      )}
                    </Button>
                  </InfiniteScrollWrapper>
                )}
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
};
export default NotesList;
