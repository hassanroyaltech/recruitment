import React, { useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
} from '../../../../setups/shared';
import { PipelineQueryItem } from './pipeline-task-query/PipelineTaskQueryItem.Component';

export const PipelineTaskCard = ({
  parentTranslationPath,
  translationPath,
  activePipeline,
  data,
}) => {
  const stateInitRef = useRef({});

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  useEffect(() => {
    if (data) onStateChanged({ id: 'edit', value: data });
  }, [data]);

  return (
    <div className="details-body-wrapper">
      <SharedInputControl
        isFullWidth
        stateKey="title"
        placeholder="untitled-dots"
        editValue={state.title}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClass="theme-transparent"
        textFieldWrapperClasses="w-100"
        fieldClasses="w-100"
        isReadOnly
      />
      {/* List queries */}
      {state.tasks?.map((pipelineTaskItem, idx) => (
        <PipelineQueryItem
          key={`query-item-${idx}-${pipelineTaskItem.uuid}`}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          index={idx}
          queryData={pipelineTaskItem}
          viewMode={true}
          activePipeline={activePipeline}
          // setActiveEditQueryNewData={setActiveEditQueryNewData}
          cardMode
        />
      ))}
    </div>
  );
};

PipelineTaskCard.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  activePipeline: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  jobUUID: PropTypes.string,
  data: PropTypes.shape({}),
};
