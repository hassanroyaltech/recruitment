import { EvaBrandSectionsEnum } from '../../../enums';
import { GlobalTranslate } from '../../../helpers';
import { UploaderTypesEnum } from '../../../enums/Shared/UploderTypes.Enum';

/**
 * @param sections
 * @param currentSection
 * @param parentTranslationPath
 * @param translationPath
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to get current section dynamic title
 */
export const GetSectionTitle = (
  sections,
  currentSection,
  parentTranslationPath,
  translationPath = 'SectionsAddDialog.',
) => {
  if (!currentSection.uuid)
    return GlobalTranslate.t(
      `${parentTranslationPath}:${translationPath}unknown-section-type`,
    );
  const currentSectionLocationInSameTypesIndex = sections
    .filter((item) => item.type === currentSection.type)
    .findIndex((item) => item.uuid === currentSection.uuid);
  const currentSectionTypeEnum = Object.values(EvaBrandSectionsEnum).find(
    (item) => item.key === currentSection.type,
  );
  if (!currentSectionTypeEnum || currentSectionLocationInSameTypesIndex === -1)
    return GlobalTranslate.t(
      `${parentTranslationPath}:${translationPath}unknown-section-type`,
    );
  return `${GlobalTranslate.t(
    `${parentTranslationPath}:${translationPath}${currentSectionTypeEnum.name}`,
  )} 
  #${currentSectionLocationInSameTypesIndex + 1}`;
};

/**
 * @param dropEvent
 * @param toReorderItems
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to get current section dynamic title
 */
export const GetReorderDraggedItems = (dropEvent, toReorderItems = []) => {
  if (toReorderItems.length < 2) return false;
  if (!dropEvent.destination) return false;
  if (dropEvent.destination.droppableId !== dropEvent.source.droppableId)
    return false;
  const localReorderItems = [...toReorderItems];
  localReorderItems.splice(
    dropEvent.destination.index,
    0,
    localReorderItems.splice(dropEvent.source.index, 1)[0],
  );
  return localReorderItems;
};

/**
 * @param type
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to get type enum based on backend get type
 */
export const GetMediaType = (type) =>
  Object.values(UploaderTypesEnum).find(
    (element) => element.key === type || element.keyNumber === type,
  );
