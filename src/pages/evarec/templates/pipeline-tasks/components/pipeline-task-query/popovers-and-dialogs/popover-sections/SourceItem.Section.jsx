import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';

export const SourceItemSection = ({
  translationPath,
  parentTranslationPath,
  closePopoversHandler,
  sourcesList,
  onStateChanged,
  queryData,
  state,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="min-width-200px m-2">
      <div className="d-flex-column m-2">
        <div className="mt-2 fz-13px c-gray">
          {t(`${translationPath}select-property-source`)}
        </div>
        {sourcesList?.map((sourceItem, idx) => (
          <ButtonBase
            key={`${idx}-source-item-${sourceItem.source_key}`}
            onClick={() => {
              onStateChanged({
                id: 'edit',
                value: {
                  source: {
                    ...sourceItem,
                    key: sourceItem.source_key,
                    value: sourceItem.source_value,
                  },
                  is_grouped: state.is_grouped || false,
                  ...(queryData?.uuid && { uuid: queryData.uuid }),
                  // Reference uuid is returned from API when source is 304
                  ...(sourceItem.reference_uuid && {
                    reference_uuid: sourceItem.reference_uuid,
                  }),
                },
              });
              closePopoversHandler();
            }}
            className="popover-item-justify btns theme-transparent my-2 mx-0 px-0"
          >
            <span className="fas fa-user" />
            <span className="mx-2">{sourceItem.source_value}</span>
          </ButtonBase>
        ))}
      </div>
    </div>
  );
};

SourceItemSection.propTypes = {
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  closePopoversHandler: PropTypes.func.isRequired,
  sourcesList: PropTypes.array.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  queryData: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  state: PropTypes.shape({
    is_grouped: PropTypes.bool,
  }).isRequired,
};
