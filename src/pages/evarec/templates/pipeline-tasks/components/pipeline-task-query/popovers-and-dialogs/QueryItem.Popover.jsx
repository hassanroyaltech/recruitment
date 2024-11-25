import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { PopoverComponent } from '../../../../../../../components';
import { PipelineTaskQueryItemsEnum } from '../../../../../../../enums';
import {
  ActionDataItemSection,
  ActionItemSection,
  FilterItemSection,
  FilterOperatorItemSection,
  MainOperatorItemSection,
  SourceItemSection,
  SourceOperatorItemSection,
  SourceValueItemSection,
  FilterValueItemSection,
  SourceAttributeItemSection,
  SourceAttributeValueSection,
  IsGroupedSection,
  SourceOperatorValueItemSection,
} from './popover-sections';

export const QueryItemPopover = ({
  popoverAttachedWith,
  closePopoversHandler,
  translationPath,
  parentTranslationPath,
  sourcesList,
  onStateChanged,
  queryData,
  state,
  isSubmitted,
  localErrors,
  getDynamicServicePropertiesHandler,
  GetDynamicAPIOptionLabel,
  filtersList,
  actions_list,
  activePipeline,
  activeItem,
  allTasks,
}) => {
  const PopoverContentHandler = useMemo(() => {
    if (popoverAttachedWith && activeItem) {
      const PipelineTaskQueryPopoverSectionsData = {
        [PipelineTaskQueryItemsEnum.IS_GROUPED.key]: IsGroupedSection,
        [PipelineTaskQueryItemsEnum.SOURCE.key]: SourceItemSection,
        [PipelineTaskQueryItemsEnum.SOURCE_OPERATOR.key]: SourceOperatorItemSection,
        [PipelineTaskQueryItemsEnum.SOURCE_OPERATOR_VALUE.key]:
          SourceOperatorValueItemSection,
        [PipelineTaskQueryItemsEnum.SOURCE_VALUE.key]: SourceValueItemSection,
        [PipelineTaskQueryItemsEnum.ACTION.key]: ActionItemSection,
        [PipelineTaskQueryItemsEnum.ACTION_DATA.key]: ActionDataItemSection,
        [PipelineTaskQueryItemsEnum.MAIN_OPERATOR.key]: MainOperatorItemSection,
        [PipelineTaskQueryItemsEnum.FILTER_KEY.key]: FilterItemSection,
        [PipelineTaskQueryItemsEnum.FILTER_OPERATOR.key]: FilterOperatorItemSection,
        [PipelineTaskQueryItemsEnum.FILTER_VALUE.key]: FilterValueItemSection,
        [PipelineTaskQueryItemsEnum.SOURCE_ATTRIBUTE.key]:
          SourceAttributeItemSection,
        [PipelineTaskQueryItemsEnum.SOURCE_ATTRIBUTE_VALUE.key]:
          SourceAttributeValueSection,
      };
      return PipelineTaskQueryPopoverSectionsData[activeItem];
    }
  }, [activeItem, popoverAttachedWith]);

  return (
    <PopoverComponent
      idRef="pipelineTaskQueryPopoverRef"
      attachedWith={popoverAttachedWith}
      handleClose={() => closePopoversHandler()}
      popoverClasses="stages-display-popover"
      component={
        <div className="min-width-200px m-2">
          {PopoverContentHandler && (
            <PopoverContentHandler
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              closePopoversHandler={closePopoversHandler}
              sourcesList={sourcesList}
              onStateChanged={onStateChanged}
              queryData={queryData}
              state={state}
              isSubmitted={isSubmitted}
              localErrors={localErrors}
              getDynamicServicePropertiesHandler={getDynamicServicePropertiesHandler}
              GetDynamicAPIOptionLabel={GetDynamicAPIOptionLabel}
              popoverAttachedWith={popoverAttachedWith}
              filtersList={filtersList}
              actions_list={actions_list}
              activePipeline={activePipeline}
              allTasks={allTasks}
            />
          )}
        </div>
      }
    />
  );
};

QueryItemPopover.propTypes = {
  popoverAttachedWith: PropTypes.shape({}).isRequired,
  closePopoversHandler: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  sourcesList: PropTypes.array.isRequired,
  filterPopoverAttachedWith: PropTypes.shape({}),
  setFilterPopoverAttachedWith: PropTypes.func,
  onStateChanged: PropTypes.func.isRequired,
  queryData: PropTypes.shape({
    uuid: PropTypes.string,
  }),
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
  isSubmitted: PropTypes.bool.isRequired,
  localErrors: PropTypes.shape({}),
  getDynamicServicePropertiesHandler: PropTypes.func.isRequired,
  GetDynamicAPIOptionLabel: PropTypes.func.isRequired,
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
  actions_list: PropTypes.array.isRequired,
  activePipeline: PropTypes.shape({
    origin_pipeline_uuid: PropTypes.string,
    uuid: PropTypes.string,
  }),
  activeItem: PropTypes.string,
  allTasks: PropTypes.array,
};
