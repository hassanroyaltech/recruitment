import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Chip, IconButton } from '@mui/material';
import { DialogComponent } from '../../../components';

export const AssessmentTestCard = ({ assessments }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const dialogOpenHandler = useCallback((assessment) => {
    setSelectedAssessment(assessment);
    setIsDialogOpen(true);
  }, []);

  const dialogCloseHandler = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  return (
    <div className="assessment-test-cards-wrapper">
      {assessments
        && assessments.map((item, index) => (
          <div
            className="assessment-test-card-item card-wrapper"
            key={`${index + 1}-${item.key}-${item.title}-card-item`}
          >
            <div className="assessment-card-content">
              <div className="assessment-card-image">
                {item.image && (
                  <img
                    src={item.image}
                    alt={`${index + 1}-${item.title}-assessment-card`}
                  />
                )}
              </div>
              <div className="assessment-card-title">{item.title}</div>
              <div className="assessment-card-body">{item.description}</div>
              <div className="assessment-card-footer">
                {item.questionsNumber && (
                  <div className="footer-item">{`${item.questionsNumber} Questions`}</div>
                )}
                {item.timeLimit && (
                  <div className="footer-item">{`${item.timeLimit} Minutes (timed)`}</div>
                )}
                {item.languages && (
                  <div className="footer-item">
                    {item.languages.map((el, i) => (
                      <Chip label={el} key={`${i + 1}-${item}-language`} />
                    ))}
                  </div>
                )}
              </div>
              {item.sampleReport && (
                <div className="footer-action">
                  <IconButton onClick={() => dialogOpenHandler(item)}>
                    <i className="fas fa-eye" />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
        ))}
      <DialogComponent
        dialogContent={
          <div className="d-flex-column-center">
            {selectedAssessment && (
              <div className="assessment-dialog-content w-100">
                <iframe
                  width="100%"
                  height="700px"
                  allow="autoplay"
                  title={selectedAssessment.title}
                  src={selectedAssessment.sampleReport}
                />
              </div>
            )}
          </div>
        }
        isOpen={isDialogOpen}
        onCloseClicked={dialogCloseHandler}
      />
    </div>
  );
};

AssessmentTestCard.propTypes = {
  assessments: PropTypes.instanceOf(Array).isRequired,
};

export default AssessmentTestCard;
