// This component not imported anywhere!

import React, { useState } from 'react';
import { Button, CardBody, Col, Row } from 'reactstrap';
import Loader from 'components/Elevatus/Loader';
import ChatSender from 'components/Elevatus/ChatSender';
import { DiscussionsList } from 'components/Elevatus/DiscussionsList';
import RatingPanel from 'components/Elevatus/RatingPanel';
import { useTranslation } from 'react-i18next';
import { rated_candidates } from '../../../../pages/evarec/services/mockData';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

const JobDiscussionForm = ({
  uuid,
  candidateUuid,
  getDiscussion,
  addDiscussion,
  confirmAlert,
  rating = 4.0,
  avgRating = 4.7,
  ratedUsers = rated_candidates,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [show, setShow] = useState(false);
  const [discussion, setDiscussion] = useState([]);
  const [replies, setReplies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [errors, setErrors] = useState({});
  const [ratingLoader, setRatingLoader] = useState(false);

  const handleToggleDiscussion = async () => {
    setShow(!show);
    setDiscussion([]);
    if (!show && getDiscussion) {
      setLoading(true);
      try {
        const res = await getDiscussion({
          candidate_uuid: candidateUuid,
          page,
          limit: 40,
        });
        setDiscussion(res.data?.results?.data);
        setTotal(res.data?.results?.total);
        setPage(res.data?.results?.page);
        setPageSize(res.data?.results?.per_page);
      } catch (error) {
        setErrors(error?.response?.data?.errors);
      }
      setLoading(false);
    }
  };

  const handleAddDiscussion = async (discussion) => {
    setLoading(true);
    setAdding(true);
    try {
      const res = await addDiscussion({
        candidate_uuid: candidateUuid,
        comment: discussion.comment ? discussion.comment : 'Attached File',
        media_uuid: discussion.attachment && discussion.attachment.uuid,
      });

      discussion.push({
        ...res.data.results,
      });
      setDiscussion([...discussion]);
      window?.ChurnZero?.push([
        'trackEvent',
        'Send a message in a discussion',
        'EVA-REC send a message in a discussion a candidate modal',
        1,
        {},
      ]);
    } catch (error) {
      setErrors(error?.response?.data?.errors);
    }
    setAdding(false);
    setLoading(false);
  };

  const handleRating = () => {};

  return (
    <div className="discussion-form">
      <Button className="discussion-button" onClick={handleToggleDiscussion}>
        {t(`${translationPath}discussion`)}
        &nbsp;
        <i className={show ? 'fa fa-chevron-down' : 'fa fa-chevron-up'} />
      </Button>
      {show && (
        <div className="discussion-content">
          <div className="discussion-rating">
            <RatingPanel
              title="Rate this Candidate"
              ratedUsers={ratedUsers}
              rating={rating}
              onRating={handleRating}
              loading={ratingLoader}
              avgRating={avgRating}
            />
          </div>
          <div className="discussion-list">
            <div className="mb-3 scroll_comments">
              {loading ? (
                <CardBody className="text-center">
                  <Row>
                    <Col xl="12">
                      <Loader
                        width="730px"
                        height="49vh"
                        speed={1}
                        color="primary"
                      />
                    </Col>
                  </Row>
                </CardBody>
              ) : (
                discussion
                && (discussion.length === 0 ? (
                  <p className="text-lead text-muted">
                    {t(`${translationPath}no-discussions-yet`)}
                  </p>
                ) : (
                  discussion.map((item, i) => (
                    <DiscussionsList
                      t={t}
                      confirmAlert={(uuid) => {
                        confirmAlert(uuid, i, 'discussion');
                      }}
                      candidate_uuid={candidateUuid}
                      assessment_uuid={uuid}
                      uuid={item.uuid}
                      onChange={(value) => {
                        setDiscussion(value);
                      }}
                      replies={replies}
                      discussion={item}
                      key={i}
                      add_discussion_loader={adding}
                    />
                  ))
                ))
              )}
            </div>
            <ChatSender
              uuid={uuid}
              candidate_uuid={candidateUuid}
              assessment_uuid={uuid}
              // onChange={(value) => setDiscussion(value)}
              onSubmit={handleAddDiscussion}
              isSending={adding}
              hasAttach
              hasReply={false}
              placeholder={t(`${translationPath}type-your-discussion`)}
            />

            {errors?.discussion ? (
              errors.discussion.length > 1 ? (
                errors.discussion.map((error, key) => (
                  <p className="m-0 text-xs text-danger">{error}</p>
                ))
              ) : (
                <p className="m-o text-xs text-danger">{errors.discussion}</p>
              )
            ) : (
              ''
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDiscussionForm;
