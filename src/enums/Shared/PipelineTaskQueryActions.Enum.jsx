export const PipelineTaskQueryActionsEnum = {
  CREATE_TASK: {
    key: 401,
    value: 'Create task', // TODO: Change to object
    validations: ['title', 'type_uuid', 'has_notification'],
  },
  MOVE_CANDIDATE: {
    key: 402,
    value: 'Move candidate to', // TODO: Change to object
    validations: ['stage_uuid'],
  },
};
