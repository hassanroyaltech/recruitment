export const LookupsImportStatusEnum = {
  pending: {
    key: 'pending',
    value: 'pending',
    isDisabled: true,
    color: "c-accent-secondary",
  },
  validation: {
    key: 'validation',
    value: 'validating',
    isDisabled: true,
    color: "c-yellow"
  },
  validation_done: {
    key: 'validation_done',
    value: 'validation-done',
    isWithStartImport: true,
    color: "c-secondary"
  },
  in_progress: {
    key: 'in_progress',
    value: 'in-progress',
    isDisabled: true,
    color: "c-accent-secondary"
  },
  done: {
    key: 'done',
    value: 'done',
    color: "c-green"
  },
  error: {
    key: 'error',
    value: 'error',
    color: "c-error"
  },
};
