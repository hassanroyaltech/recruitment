// noinspection JSUnresolvedVariable

/**
 * @param values
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to handle setups entire object (lazy)
 */
export const SetupsReset = (values) => ({
  ...values,
});

/**
 * @param state
 * @param action
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to handle setups states update using reduced
 */
export const SetupsReducer = (state, action) => {
  if (action.parentIndex || action.parentIndex === 0) {
    const localState = { ...state };
    if (!localState[action.parentId][action.parentIndex] && action.id)
      localState[action.parentId][action.parentIndex] = {};
    if (!action.subParentId && !action.id) {
      localState[action.parentId][action.parentIndex] = action.value;
      return JSON.parse(JSON.stringify(localState));
    }
    if (action.subParentId) {
      if (action.subParentIndex || action.subParentIndex === 0) {
        if (
          !localState[action.parentId][action.parentIndex][action.subParentId][
            action.subParentIndex
          ]
          && action.id
        )
          localState[action.parentId][action.parentIndex] = {};
        if (!action.subSubParentId && !action.id) {
          localState[action.parentId][action.parentIndex][action.subParentId][
            action.subParentIndex
          ] = action.value;
          return JSON.parse(JSON.stringify(localState));
        }
        if (action.subSubParentId) {
          if (action.subSubParentIndex || action.subSubParentIndex === 0) {
            if (
              !localState[action.parentId][action.parentIndex][action.subParentId][
                action.subParentIndex
              ][action.subSubParentId][action.subSubParentIndex]
              && action.id
            )
              localState[action.parentId][action.parentIndex][action.subParentId][
                action.subParentIndex
              ][action.subSubParentId][action.subSubParentIndex] = {};
            if (!action.id) {
              localState[action.parentId][action.parentIndex][action.subParentId][
                action.subParentIndex
              ][action.subSubParentId][action.subSubParentIndex] = action.value;
              return JSON.parse(JSON.stringify(localState));
            }

            localState[action.parentId][action.parentIndex][action.subParentId][
              action.subParentIndex
            ][action.subSubParentId][action.subSubParentIndex] = {
              ...localState[action.parentId][action.parentIndex][action.subParentId][
                action.subParentIndex
              ][action.subSubParentId][action.subSubParentIndex],
              [action.id]: action.value,
            };
            return JSON.parse(JSON.stringify(localState));
          }
          if (!action.id) {
            localState[action.parentId][action.parentIndex][action.subParentId][
              action.subParentIndex
            ][action.subSubParentId] = action.value;
            return JSON.parse(JSON.stringify(localState));
          }
          localState[action.parentId][action.parentIndex][action.subParentId][
            action.subParentIndex
          ][action.subSubParentId] = {
            ...localState[action.parentId][action.parentIndex][action.subParentId][
              action.subParentIndex
            ][action.subSubParentId],
            [action.id]: action.value,
          };
          return JSON.parse(JSON.stringify(localState));
        }

        localState[action.parentId][action.parentIndex][action.subParentId][
          action.subParentIndex
        ] = {
          ...localState[action.parentId][action.parentIndex][action.subParentId][
            action.subParentIndex
          ],
          [action.id]: action.value,
        };
        return JSON.parse(JSON.stringify(localState));
      }
      if (!action.id) {
        localState[action.parentId][action.parentIndex][action.subParentId]
          = action.value;
        return JSON.parse(JSON.stringify(localState));
      }
      localState[action.parentId][action.parentIndex][action.subParentId] = {
        ...localState[action.parentId][action.parentIndex][action.subParentId],
        [action.id]: action.value,
      };
      return JSON.parse(JSON.stringify(localState));
    }
    localState[action.parentId][action.parentIndex] = {
      ...localState[action.parentId][action.parentIndex],
      [action.id]: action.value,
    };
    return JSON.parse(JSON.stringify(localState));
  }
  if (
    action.subSubParentId
    && (action.subSubParentIndex || action.subSubParentIndex === 0)
    && (action.subParentIndex || action.subParentIndex === 0)
    && !action.parentIndex
    && action.parentIndex !== 0
  ) {
    let elseState = { ...state };
    elseState[action.parentId][action.subParentId][action.subParentIndex][
      action.subSubParentId
    ][action.subSubParentIndex] = {
      ...elseState[action.parentId][action.subParentId][action.subParentIndex][
        action.subSubParentId
      ][action.subSubParentIndex],
      [action.id]: action.value,
    };
    return elseState;
  }
  if (action.subSubParentId)
    return {
      ...state,
      [action.parentId]: {
        ...(state[action.parentId] || {}),
        [action.subParentId]: {
          ...((state[action.parentId]
            && state[action.parentId][action.subParentId])
            || {}),
          [action.subSubParentId]: {
            ...((state[action.parentId][action.subParentId]
              && state[action.parentId][action.subParentId][action.subSubParentId])
              || {}),
            [action.id]: action.value,
          },
        },
      },
    };
  if (action.subParentId && (action.subParentIndex || action.subParentIndex === 0)) {
    let elseState = { ...state };
    elseState[action.parentId][action.subParentId][action.subParentIndex][
      action.id
    ] = action.value;
    return elseState;
  }
  if (action.subParentId)
    return {
      ...state,
      [action.parentId]: {
        ...(state[action.parentId] || {}),
        [action.subParentId]: {
          ...((state[action.parentId]
            && state[action.parentId][action.subParentId])
            || {}),
          [action.id]: action.value,
        },
      },
    };
  if (action.parentId)
    return {
      ...state,
      [action.parentId]: {
        ...state[action.parentId],
        [action.id]: action.value,
      },
    };
  if (action.id === 'reset') return SetupsReset(action.value);
  if (action.id === 'destructObject') return { ...state, ...action.value };
  if (Array.isArray(action.id)) {
    const localState = { ...state };
    action.id.map((item) => {
      localState[item] = action.value;
      return undefined;
    });
    return localState;
  }
  if (action.id !== 'edit') return { ...state, [action.id]: action.value };
  return { ...action.value };
};
