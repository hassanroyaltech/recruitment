/**
 * Mutation constructor
 * @param results
 */
export function mutateTestimonials(results) {
  const tasks = {
    ...results.reduce(
      (obj, c) => (
        (obj[c.uuid] = {
          ...c,
        }),
        obj
      ),
      {},
    ),
  };
  const columns = {
    'column-1': {
      id: 'column-1',
      tasksIds: results.map((o) => o.uuid),
    },
  };
  const columnOrder = ['column-1'];

  // Mutate results
  return {
    tasks,
    columns,
    columnOrder,
  };
}

/**
 * Mutation constructor
 * @param results
 */
export function mutateTeams(results) {
  const tasks = {
    ...results.reduce(
      (obj, c) => (
        (obj[c.uuid] = {
          ...c,
        }),
        obj
      ),
      {},
    ),
  };
  const columns = {
    'column-1': {
      id: 'column-1',
      tasksIds: results.map((o) => o.uuid),
    },
  };
  const columnOrder = ['column-1'];

  // Mutate results
  return {
    tasks,
    columns,
    columnOrder,
  };
}

/**
 * Export mutatorService
 * @type {{}}
 */
export const mutatorService = {
  mutateTeams,
  mutateTestimonials,
};
