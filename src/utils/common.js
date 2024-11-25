export const makeArray = (...list) => [...list];

export const getParam = (param) =>
  new URL(window.location.href).searchParams.get(param);
export const toKebabCase = (str) =>
  str
  && str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('-');
export const getLastURLSegment = () => window.location.pathname.split('/').pop();

export const getFullURL = () => window.location.pathname;

export const kebabToTitle = (kebabStr) => {
  if (kebabStr)
    return kebabStr
      .replace(/-/g, ' ')
      .split(' ')
      .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
      .join(' ');
};

// dnd utils

export const initialData = {
  candidates: {
    'candidate-1': {
      id: 'candidate-1',
      name: "Muhammad Juma'a",
      isSelected: false,
      new: true,
      status: 'Pending',
    },
    'candidate-2': {
      id: 'candidate-2',
      name: 'Muhammad Salahat',
      isSelected: false,
      new: false,
      status: 'Incomplete',
    },
    'candidate-3': {
      id: 'candidate-3',
      name: 'Suha Hijawi',
      isSelected: false,
      new: false,
      status: 'Incomplete',
    },
    'candidate-4': {
      id: 'candidate-4',
      name: 'Rami M',
      isSelected: false,
      new: false,
      status: 'Incomplete',
    },
    'candidate-5': {
      id: 'candidate-5',
      name: 'Yacoub Z',
      isSelected: false,
      new: false,
    },
    'candidate-6': {
      id: 'candidate-6',
      name: 'Muhammad S',
      isSelected: false,
      new: false,
    },
    'candidate-7': {
      id: 'candidate-7',
      name: 'David H',
      isSelected: false,
      new: false,
    },
    'candidate-8': {
      id: 'candidate-8',
      name: 'Jade S',
      isSelected: false,
      new: false,
    },
    'candidate-9': {
      id: 'candidate-9',
      name: 'Hailie E',
      isSelected: false,
      new: false,
    },
    'candidate-10': {
      id: 'candidate-10',
      name: 'Chris J',
      isSelected: false,
      new: false,
    },
    'candidate-11': {
      id: 'candidate-11',
      name: 'Artour B',
      isSelected: false,
      new: false,
    },
    'candidate-12': {
      id: 'candidate-12',
      name: 'Henrik A',
      isSelected: false,
      new: false,
    },
    'candidate-13': {
      id: 'candidate-13',
      name: 'Gustav M',
      isSelected: false,
      new: false,
    },
    'candidate-14': {
      id: 'candidate-14',
      name: 'Loda B',
      isSelected: false,
      new: false,
    },
    'candidate-15': {
      id: 'candidate-15',
      name: 'Mason V',
      isSelected: false,
      new: false,
    },
  },
  stages: {
    'stage-1': {
      id: 'stage-1',
      title: 'Applied',
      icon: 'far fa-user',
      candidatesIds: ['candidate-1', 'candidate-2', 'candidate-3'],
    },
    'stage-2': {
      id: 'stage-2',
      title: 'Interviewed',
      candidatesIds: ['candidate-4', 'candidate-5'],
    },
    'stage-3': {
      id: 'stage-3',
      title: 'Offer',
      icon: 'fas fa-gift',
      candidatesIds: ['candidate-6', 'candidate-7'],
    },
    'stage-4': {
      id: 'stage-4',
      title: 'Hired',
      icon: 'fas fa-trophy',
      candidatesIds: ['candidate-8', 'candidate-9', 'candidate-10', 'candidate-11'],
    },
    'stage-5': {
      id: 'stage-5',
      title: 'Disqualified',
      candidatesIds: [
        'candidate-12',
        'candidate-13',
        'candidate-14',
        'candidate-15',
      ],
    },
  },
  stageOrder: ['stage-1', 'stage-2', 'stage-3', 'stage-4', 'stage-5'],
};

const reorderList = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const withNewTaskIds = (column, candidatesIds) => ({
  id: column.id,
  title: column.title,
  candidatesIds,
});
const reorderSingleDrag = ({ data, selectedTaskIds, source, destination }) => {
  if (source.droppableId === destination.droppableId) {
    const column = data.stages[source.droppableId];
    const reordered = reorderList(
      column.candidatesIds,
      source.index,
      destination.index,
    );
    const updated = {
      ...data,
      stages: {
        ...data.stages,
        [column.id]: withNewTaskIds(column, reordered),
      },
    };
    console.log(updated);

    return {
      newData: updated,
      newSelectedTaskIds: selectedTaskIds,
    };
  }

  // moving ito new list
  const home = data.stages[source.droppableId];
  const foreign = data.stages[destination.droppableId];

  const taskId = home.candidatesIds[source?.index];

  // remove from home
  const newHomeTaskIds = [...home.candidatesIds];
  newHomeTaskIds.splice(source?.index, 1);

  // add to foreign
  const newForeignTasksIds = [...foreign.candidatesIds];
  newForeignTasksIds.splice(destination?.index, 0, taskId);

  const updated = {
    ...data,
    stages: {
      ...data.stages,
      [home.id]: withNewTaskIds(home, newHomeTaskIds),
      [foreign.id]: withNewTaskIds(foreign, newForeignTasksIds),
    },
  };

  return {
    newData: updated,
    newSelectedTaskIds: selectedTaskIds,
  };
};

const getHomeColumn = (data, taskId) => {
  const columnId = data.stageOrder.find((id) => {
    const column = data.stages[id];
    return column.candidatesIds.includes(taskId);
  });

  return data.stages[columnId];
};
const reorderMultiDrag = ({ data, selectedTaskIds, source, destination }) => {
  const start = data.stages[source.droppableId];
  const dragged = start.candidatesIds[source?.index];

  const insertAtIndex = (() => {
    const destinationIndexOffset = selectedTaskIds.reduce((previous, current) => {
      if (current === dragged) return previous;
      const final = data.stages[destination.droppableId];
      const column = getHomeColumn(data, current);

      if (column !== final) return previous;

      const index = column.candidatesIds.indexOf(current);
      if (index >= destination?.index) return previous;

      return previous + 1;
    }, 0);

    const results = destination?.index - destinationIndexOffset;
    return results;
  })();

  // doing the ordering now as we are required to look up columns
  // and know original ordering

  const orderedSelectedTaskIds = [...selectedTaskIds];
  orderedSelectedTaskIds.sort((a, b) => {
    if (a === dragged) return -1;
    if (b === dragged) return 1;

    // sorting by their natural indexes
    const columnForA = getHomeColumn(data, a);

    const indexOfA = columnForA.candidatesIds.indexOf(a);
    const columnForB = getHomeColumn(data, b);
    const indexOfB = columnForB.candidatesIds.indexOf(b);

    if (indexOfA !== indexOfB) return indexOfA - indexOfB;

    // sorting by their order in the selectedTaskIds list
    return -1;
  });

  // we need to remove all of the selected tasks from their columns
  const withRemovedTasks = data.stageOrder.reduce((previous, columnId) => {
    const column = data.stages[columnId];
    // remove the id's of the items that are selected
    const remainingTaskIds = column.candidatesIds.filter(
      (id) => !selectedTaskIds.includes(id),
    );

    previous[column.id] = withNewTaskIds(column, remainingTaskIds);
    return previous;
  }, data.stages);

  const final = withRemovedTasks[destination.droppableId];
  const withInserted = (() => {
    const base = [...final.candidatesIds];
    base.splice(insertAtIndex, 0, ...orderedSelectedTaskIds);
    return base;
  })();

  const withAddedTasks = {
    ...withRemovedTasks,
    [final.id]: withNewTaskIds(final, withInserted),
  };
  const updated = {
    ...data,
    stages: withAddedTasks,
  };
  return {
    newData: updated,
    newSelectedTaskIds: orderedSelectedTaskIds,
  };

  // Finally
};

export const reorder = (args) => {
  console.log('Args', args);

  if (args.selectedTaskIds.length > 1) return reorderMultiDrag(args);

  return reorderSingleDrag(args);
};
