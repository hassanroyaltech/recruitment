/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Card } from 'reactstrap';
// Import Shared Function
import { kebabToTitle } from 'shared/utils';
import docxIcon from '../../../../../assets/images/FileTypes/icon_docx.svg';
import videoIcon from '../../../../../assets/images/FileTypes/icon_video.svg';
import pdfIcon from '../../../../../assets/images/FileTypes/icon_pdf.svg';
import otherFileIcon from '../../../../../assets/images/FileTypes/icon_other_file.svg';

const ThumbnailItemCard = ({ inactive, title, img, onClick, extension }) => {
  const [fileTypeImg, setFileTypeImg] = useState(docxIcon);

  useEffect(() => {
    if (extension) {
      let fileImage = otherFileIcon;
      if (extension?.split('/')[1].includes('pdf')) fileImage = pdfIcon;
      else if (extension?.split('/')[1].includes('png')) fileImage = videoIcon;
      else if (extension?.split('/')[1].includes('document')) fileImage = docxIcon;
      setFileTypeImg(fileImage);
    }
  }, [extension]);

  return (
    <Card
      className={`m-0 thumbnail-item-card ${!inactive ? 'active' : ''}`}
      style={{ cursor: 'pointer' }}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <div className="text-center">
        <img src={fileTypeImg} alt="file-type" />
        {title && (
          <h6 className="h6" style={{ zIndex: 1 }}>
            {kebabToTitle(title)}
          </h6>
        )}
      </div>
    </Card>
  );
};

export default ThumbnailItemCard;
