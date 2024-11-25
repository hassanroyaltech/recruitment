export const RemoveDuplicatesByUuid = (arr) => {
  const localeArray = arr.map((item) => ({
    ...item,
    uuid: item?.uuid || item?.id,
  }));
  const uniqueMap = new Map();
  return localeArray.filter((item) => {
    if (!uniqueMap.has(item.uuid)) {
      uniqueMap.set(item.uuid, true);
      return true;
    }
    return false;
  });
};
