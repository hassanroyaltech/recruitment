// React and reactstrap
import React from 'react';
import { Button, Card } from 'reactstrap';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvarecRecModals';

/**
 * UploadingCard component
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const UploadingCard = (props) => {
  const { t } = useTranslation(parentTranslationPath);

  const {
    filesCount,
    completed,
    dueSeconds,
    onClose,
    onSuccess,
    collapsed,
    onToggle,
    NumberOfFiles,
  } = props;
  const percentage
    = filesCount === 0 ? 0 : Math.floor((filesCount * 100) / NumberOfFiles);

  const seconds = completed === 0 ? 0 : Math.floor(dueSeconds / completed);

  /**
   * Return the JSX component
   */
  return (
    <Card className="uploading-card">
      <div className="uploading-background" style={{ width: `${percentage}%` }} />
      <div className="w-100 h-100" style={{ zIndex: 1 }}>
        {percentage >= 100 ? (
          <div className="h5 my-4">
            {t(`${translationPath}uploaded`)} {filesCount}
            {' / '}
            {NumberOfFiles} file(s)
          </div>
        ) : (
          <React.Fragment>
            <div className="h5 mb-0">
              {t(`${translationPath}uploading-1`)} {filesCount}
              {' / '}
              {NumberOfFiles} {t(`${translationPath}file(s)`)}
            </div>
            <div className="mt-3 h5 text-gray mb-0">{percentage}%</div>
            <div className="uploading-progress-wrapper mt-3">
              <div
                className="uploading-progress"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </React.Fragment>
        )}
        <div className="uploading-actions">
          <React.Fragment>
            <Button onClick={onToggle}>
              {collapsed ? (
                <i className="fa fa-expand" />
              ) : (
                <i className="fa fa-compress" />
              )}
            </Button>
          </React.Fragment>
        </div>
      </div>
    </Card>
  );
};

export default UploadingCard;
