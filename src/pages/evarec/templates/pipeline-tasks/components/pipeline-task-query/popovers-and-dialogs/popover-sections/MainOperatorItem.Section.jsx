import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';

export const MainOperatorItemSection = ({
  translationPath,
  parentTranslationPath,
  popoverAttachedWith,
  closePopoversHandler,
  onStateChanged,
  filtersList,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="min-width-200px m-2">
      <div className="d-flex-column">
        <div className="mx-2">
          <div className="my-2 fz-13px c-gray-dark">
            {t(`${translationPath}select-operator`)}
          </div>
          <div className="d-flex-column">
            {filtersList.main_operators?.map((op, idx) => (
              <ButtonBase
                key={`${idx}-sourceGroup-operator-${op.key}`}
                onClick={() => {
                  onStateChanged({
                    id: 'main_operator',
                    value: op,
                    parentId: 'filters',
                    parentIndex: popoverAttachedWith.id,
                  });
                  closePopoversHandler();
                }}
                className="popover-item-justify btns theme-transparent"
                disabled={
                  !op.allow_to_be_first_filter
                  && popoverAttachedWith.id?.toString() === '0'
                }
              >
                <span className="mx-2">{op.value}</span>
              </ButtonBase>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

MainOperatorItemSection.propTypes = {
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  popoverAttachedWith: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  closePopoversHandler: PropTypes.func.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  filtersList: PropTypes.shape({
    filter_groups: PropTypes.array,
    main_operators: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.number,
        value: PropTypes.string,
        allow_to_be_first_filter: PropTypes.bool,
      }),
    ),
  }).isRequired,
};
