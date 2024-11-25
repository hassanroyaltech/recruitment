import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { PipelineTaskMainConditionOperatorsEnum } from '../../../../../../../../enums';

export const IsGroupedSection = ({
  translationPath,
  parentTranslationPath,
  closePopoversHandler,
  onStateChanged,
  queryData,
  allTasks,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const parentTask = useMemo(() => {
    if (!queryData?.uuid && queryData.parent_uuid)
      return allTasks[allTasks.findIndex((it) => it.uuid === queryData.parent_uuid)];
  }, [queryData, allTasks]);

  return (
    <div className="min-width-200px m-2">
      <div className="d-flex-column m-2">
        <div className="mt-2 fz-13px c-gray">
          {t(`${translationPath}select-main-condition-operator`)}
        </div>
        {Object.values(PipelineTaskMainConditionOperatorsEnum).map(
          (conditionOperator, idx) => (
            <ButtonBase
              key={`${idx}-main-condition-operator-${conditionOperator.key}`}
              onClick={() => {
                onStateChanged({
                  id: 'edit',
                  value: {
                    is_grouped: conditionOperator.value,
                    ...(queryData?.uuid && { uuid: queryData.uuid }),
                    ...(conditionOperator.key
                      === PipelineTaskMainConditionOperatorsEnum.ELSE.key
                      && parentTask && {
                      source_value: parentTask.source_value,
                      source: parentTask.source,
                    }),
                  },
                });
                closePopoversHandler();
              }}
              className="popover-item-justify btns theme-transparent my-2 mx-0 px-0"
              disabled={
                !queryData.parent_uuid
                && conditionOperator.key
                  === PipelineTaskMainConditionOperatorsEnum.ELSE.key
              }
            >
              <span className="mx-2">
                {t(`${translationPath}${conditionOperator.label}`)}
              </span>
            </ButtonBase>
          ),
        )}
      </div>
    </div>
  );
};

IsGroupedSection.propTypes = {
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  closePopoversHandler: PropTypes.func.isRequired,
  sourcesList: PropTypes.array.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  queryData: PropTypes.shape({
    uuid: PropTypes.string,
    parent_uuid: PropTypes.string,
  }),
  allTasks: PropTypes.array,
};
