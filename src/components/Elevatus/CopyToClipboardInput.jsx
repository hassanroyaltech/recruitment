import Card from '@mui/material/Card';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';

const translationPath = 'CongratulationsComponent.';
const CopyToClipboardInput = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESS');
  const [copied, setCopied] = useState(false);

  return (
    <div className="copy-to-clipboard">
      <CopyToClipboard text={props?.link} onCopy={() => setCopied(true)}>
        <Card className="d-flex flex-row align-items-center justify-content-between mb-2 p-2">
          <div className="flex-grow-1 d-flex flex-row overflow-hidden">
            <div className="text-gray">{t(`${translationPath}link`)}</div>
            <div
              className="ml-2-reversed text-black w-100"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {props?.link}
            </div>
          </div>
          <div
            className="text-gray mx-3 btn-clip"
            data-clipboard-demo=""
            data-clipboard-target="#foo"
          >
            <i className="far fa-clone" style={{ cursor: 'pointer' }} />
          </div>
        </Card>
      </CopyToClipboard>
      {copied && props?.showAlert !== false ? (
        <p className="text-center text-primary">
          {t(`${translationPath}link-successfully-copied`)}
        </p>
      ) : null}
    </div>
  );
};

export default CopyToClipboardInput;
