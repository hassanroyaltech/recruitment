import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PopoverComponent } from '../../../../../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import { NestedFilterIcon } from '../../../../../../../assets/icons';

export const QueryFilterPopover = ({
  translationPath,
  parentTranslationPath,
  filterPopoverAttachedWith,
  setFilterPopoverAttachedWith,
  onStateChanged,
  state,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <PopoverComponent
      idRef="addFilterPopoverRef"
      attachedWith={filterPopoverAttachedWith}
      handleClose={() => {
        setFilterPopoverAttachedWith(null);
      }}
      popoverClasses=""
      component={
        <div>
          <div className="d-flex-column">
            <ButtonBase
              onClick={() => {
                setFilterPopoverAttachedWith(null);
                onStateChanged({
                  id: 'filters',
                  value: [
                    ...(state.filters || []),
                    {
                      main_operator: null,
                      filter_key: null,
                      filter_group: null,
                      filter_operator: null,
                      filter_value: null,
                      is_grouped: false,
                    },
                  ],
                });
              }}
              className="popover-item-justify btns theme-transparent m-2"
            >
              <NestedFilterIcon with_circle />
              <span className="mx-2">{t(`${translationPath}add-filter`)}</span>
            </ButtonBase>
          </div>
        </div>
      }
    />
  );
};

QueryFilterPopover.propTypes = {
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  filterPopoverAttachedWith: PropTypes.shape({}).isRequired,
  setFilterPopoverAttachedWith: PropTypes.func.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.shape({
    source: PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    source_value: PropTypes.shape({}),
    source_group: PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    filters: PropTypes.array,
    action: PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    action_data: PropTypes.shape({
      stage: PropTypes.shape({
        uuid: PropTypes.string,
      }),
    }),
  }).isRequired,
};
