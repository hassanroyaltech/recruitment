/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to get all controls that has the same
 * parent_key (if exist)
 */
export const GroupControlsByParentKey = (controlItem, controls) =>
  (controlItem.parent_key
    && controls.filter(
      (item) => item.parent_key && item.parent_key === controlItem.parent_key,
    ))
  || [];
