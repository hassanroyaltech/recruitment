import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PipelineTaskQueryActionsEnum } from '../../../../../../../../enums';
import { SharedAPIAutocompleteControl } from '../../../../../../../setups/shared';
import { GetAllEvaRecPipelineStages } from '../../../../../../../../services';

export const ActionDataItemSection = ({
  translationPath,
  parentTranslationPath,
  closePopoversHandler,
  onStateChanged,
  state,
  activePipeline,
  isSubmitted,
  localErrors,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="min-width-200px m-2">
      <div className="d-flex-column m-2">
        {state.action.key === PipelineTaskQueryActionsEnum.MOVE_CANDIDATE.key && (
          <>
            <div className="fz-13px c-gray">
              {t(`${translationPath}select-stage-popover`)}
            </div>
            <SharedAPIAutocompleteControl
              isEntireObject
              disableClearable
              searchKey="search"
              stateKey="stage"
              placeholder="select-stage"
              getDataAPI={GetAllEvaRecPipelineStages}
              dataKey="stages"
              editValue={state.action_data.stage?.uuid || ''}
              getOptionLabel={(option) => option.title}
              onValueChanged={(e) => {
                onStateChanged({
                  id: 'stage',
                  parentId: 'action_data',
                  value: e.value,
                });
                closePopoversHandler();
              }}
              controlWrapperClasses="my-2 px-0"
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                uuid: activePipeline?.origin_pipeline_uuid || activePipeline?.uuid,
                ...(state.action_data?.stage?.uuid && {
                  with_than: [state.action_data.stage.uuid],
                }),
              }}
              errors={localErrors}
              isSubmitted={isSubmitted}
              errorPath="action_data.stage"
              translationPath={translationPath}
            />
          </>
        )}
      </div>
    </div>
  );
};

ActionDataItemSection.propTypes = {
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  closePopoversHandler: PropTypes.func.isRequired,
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
  activePipeline: PropTypes.shape({
    origin_pipeline_uuid: PropTypes.string,
    uuid: PropTypes.string,
  }),
  isSubmitted: PropTypes.bool.isRequired,
  localErrors: PropTypes.shape({}).isRequired,
};
