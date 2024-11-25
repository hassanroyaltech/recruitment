import React from 'react';
import { useTranslation } from 'react-i18next';
import TablesComponent from '../../../../../components/Tables/Tables.Component';
import { showSuccess } from '../../../../../helpers';
import CopyToClipboard from 'react-copy-to-clipboard';

const translationPath = 'EmailMasking.';
const parentTranslationPath = 'SetupsPage';

const CopyCellComponent = ({ textToCopy, keyName }) => (
  <CopyToClipboard
    text={textToCopy}
    onCopy={(e, o) => {
      if (o) showSuccess(`${keyName || 'Text'} copied successfully!`);
    }}
  >
    <div className="d-flex flex-row align-items-center justify-content-between mb-2 p-2">
      <div
        className="text-gray  btn-clip"
        data-clipboard-demo=""
        data-clipboard-target="#foo"
      >
        <i className="far fa-clone" style={{ cursor: 'pointer' }} />
      </div>
      <div
        className="ml-2-reversed text-black w-100"
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {textToCopy}
      </div>
    </div>
  </CopyToClipboard>
);
const CNameTable = ({ tablData }) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <>
      <TablesComponent
        headerData={[
          {
            id: 1,
            label: 'type',
            input: 'Type',
          },
          {
            id: 2,
            label: 'name',
            component: (cellContent) => (
              <span>
                <CopyCellComponent textToCopy={cellContent.Name} keyName={'Name'} />{' '}
              </span>
            ),
          },
          {
            id: 3,
            label: 'value',
            component: (cellContent) => (
              <span>
                <CopyCellComponent
                  textToCopy={cellContent.Value}
                  keyName={'Value'}
                />{' '}
              </span>
            ),
          },
        ]}
        translationPath={translationPath}
        data={tablData}
        pageIndex={0}
        pageSize={10}
        totalItems={10}
        // isWithNumbering
        parentTranslationPath={parentTranslationPath}
      />
    </>
  );
};

export default CNameTable;
