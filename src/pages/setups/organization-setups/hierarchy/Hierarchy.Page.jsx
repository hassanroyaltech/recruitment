/* eslint-disable no-param-reassign */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { TabsComponent } from '../../../../components';
import { SetupsReducer, SetupsReset } from '../../shared';
import { HierarchyTabs } from '../../shared/tabs-data';
import {
  GetAllSetupsHierarchyLevels,
  getSetupsHierarchy,
  UpdateSetupsHierarchy,
} from '../../../../services';
import {
  generateUUIDV4,
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../helpers';

const translationPath = 'HierarchyPage.';
const parentTranslationPath = 'SetupsPage';

// eslint-disable-next-line func-names
yup.addMethod(yup.array, 'uniqueRecursive', function (message, childrenKey, mapper) {
  return this.test('uniqueRecursive', message, (list) => {
    const flatArray = [];
    const recursiveHandler = (items) =>
      items
        .filter((item) => !item.is_deleted)
        .map((item) => {
          flatArray.push(item);
          if (item[childrenKey] && item[childrenKey].length > 0)
            recursiveHandler(item[childrenKey]);
          return undefined;
        });
    recursiveHandler(list);
    return flatArray.length === new Set(flatArray.map(mapper)).size;
  });
});

const HierarchyPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [HierarchyTabsData] = useState(() => HierarchyTabs);
  const selectedBranchReducer = useSelector(
    (reducerState) => reducerState?.selectedBranchReducer,
  );
  const accountReducer = useSelector((reducerState) => reducerState?.accountReducer);
  const [activeTab, setActiveTab] = useState(0);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userReducer = useSelector((state) => state?.userReducer);
  const [hierarchyLevelsData, setHierarchyLevelsData] = useState([]);
  const [filters] = useState({
    page: 1,
    limit: 10,
  });

  const schema = useRef(null);

  const stateInitRef = useRef({
    initHierarchy: [],
    hierarchy: [],
  });
  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param hierarchyList
   * @param parent_uuid
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @enhanced_by Aladdin Al-Awadat
   * @Description this method is to group hierarchy by parent uuid
   */
  const groupHierarchyByParentUuid = useCallback(
    (hierarchyList, parent_uuid = null) =>
      hierarchyList.reduce((nodeList, node) => {
        if (parent_uuid === node.parent_uuid) {
          const localNode = node;
          const children = groupHierarchyByParentUuid(hierarchyList, node.uuid);
          if (children.length) localNode.children = children;
          nodeList.push(localNode);
        }
        return nodeList;
      }, []),
    [],
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
    if (!isChanged) setIsChanged(true);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is change isChanged state from child
   */
  const onIsChangedChanged = () => {
    setIsChanged(true);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    if (schema.current)
      getErrorByName(schema, state).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [state]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all hierarchy levels
   */
  const getAllSetupsHierarchyLevels = useCallback(
    async (account_uuid) => {
      const response = await GetAllSetupsHierarchyLevels({
        ...filters,
        account_uuid,
      });
      setIsLoading(false);
      if (response && response.status === 200)
        setHierarchyLevelsData(response.data.results);
      else showError(t('Shared:failed-to-get-saved-data', response));
    },
    [filters, t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await getSetupsHierarchy({ use_for: 'list', to_list: true });
    if (response && response.status === 200)
      setState({
        id: 'edit',
        value: {
          initHierarchy: groupHierarchyByParentUuid(response.data.results),
          hierarchy: groupHierarchyByParentUuid(response.data.results),
        },
      });
    else {
      setIsLoading(false);
      setState({
        id: 'edit',
        value: {
          initHierarchy: [],
          hierarchy: [],
        },
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [groupHierarchyByParentUuid, t]);

  /**
   * @param elements
   * @param index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to filter the languages before send it to the autocomplete
   */
  const getNotSelectedLanguage = useMemo(
    () => (elements, index) =>
      languages.filter(
        (item) =>
          elements.findIndex(
            (el, itemIndex) => el && el === item.code && index !== itemIndex,
          ) === -1,
      ),
    [languages],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add new language to all hierarchy
   * name
   */
  const addLanguageHandler = useCallback(() => {
    setIsChanged(true);
    let localHierarchy = [...(state.hierarchy || [])];
    const nameToAdd = {
      [getNotSelectedLanguage(Object.keys(localHierarchy[0].name), -1)[0].code]:
        null,
    };

    const recursiveAdder = (hierarchyToLoop) =>
      hierarchyToLoop.map((item) => {
        if (item.children && item.children.filter((el) => !el.is_deleted).length > 0)
          item.children = recursiveAdder(item.children);
        if (item.name) item.name = { ...item.name, ...nameToAdd };
        else item.name = nameToAdd;
        return item;
      });

    localHierarchy = recursiveAdder(localHierarchy);

    setState({
      id: 'hierarchy',
      value: localHierarchy,
    });
  }, [getNotSelectedLanguage, state.hierarchy]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove language key by code
   */
  const removeLanguageHandler = useCallback(
    (code) => () => {
      setIsChanged(true);
      let localHierarchy = [...(state.hierarchy || [])];
      const recursiveRemover = (hierarchyToLoop) =>
        hierarchyToLoop.map((item) => {
          if (
            item.children
            && item.children.filter((el) => !el.is_deleted).length > 0
          )
            item.children = recursiveRemover(item.children);
          if (item.name)
            delete item.name[
              code
              // this commented is to remove the latest code
              // Object.keys(item.name)[Object.keys(item.name).length - 1]
            ];
          return item;
        });

      localHierarchy = recursiveRemover(localHierarchy);

      setState({
        id: 'hierarchy',
        value: localHierarchy,
      });
    },
    [state.hierarchy],
  );

  /**
   * @param itemUUID - represent the node uuid
   * @param newValue - represent state value that include the new parent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove item (node) by uuid to mater
   * at what child his location is.
   */
  const onRemoveItemClicked = useCallback(
    (itemUUID) => () => {
      setIsChanged(true);
      let localHierarchy = [...(state.hierarchy || [])];
      const recursiveRemover = (hierarchyToLoop) =>
        hierarchyToLoop.filter((item) => {
          if (
            item.children
            && item.children.filter((el) => !el.is_deleted).length > 0
            && item.uuid !== itemUUID
          )
            item.children = recursiveRemover(item.children);
          if (item.uuid === itemUUID && !item.isNotSaved) item.is_deleted = true;
          return item.uuid !== itemUUID || !item.isNotSaved;
        });
      localHierarchy = recursiveRemover(localHierarchy);

      setState({
        id: 'hierarchy',
        value: localHierarchy,
      });
    },
    [state.hierarchy],
  );

  /**
   * @param currentItem - represent the item to move
   * @param newValue - represent state value that include the new parent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change item parent
   */
  const changeItemParentHandler = useCallback(
    (currentItem) => (newValue) => {
      setIsChanged(true);
      let localHierarchy = [...(state.hierarchy || [])];
      // remove it from the old location
      const recursiveRemover = (hierarchyToLoop) =>
        hierarchyToLoop.filter((item) => {
          if (
            item.children
            && item.children.filter((el) => !el.is_deleted).length > 0
            && item.uuid !== currentItem.uuid
          )
            item.children = recursiveRemover(item.children);
          return item.uuid !== currentItem.uuid;
        });
      localHierarchy = recursiveRemover(localHierarchy);

      if (newValue.value) {
        // move it to the new location
        const recursiveAdder = (hierarchyToLoop) =>
          hierarchyToLoop.map((item) => {
            if (
              item.children
              && item.children.filter((el) => !el.is_deleted).length > 0
            )
              item.children = recursiveAdder(item.children);
            if (item.uuid === newValue.value)
              if (item.children)
                item.children.push({ ...currentItem, parent_uuid: newValue.value });
              else item.children = [{ ...currentItem, parent_uuid: newValue.value }];
            return item;
          });
        if (selectedBranchReducer && newValue.value === selectedBranchReducer.uuid)
          localHierarchy.push({ ...currentItem, parent_uuid: newValue.value });
        else localHierarchy = recursiveAdder(localHierarchy);
      } else localHierarchy.push({ ...currentItem, parent_uuid: null });

      setState({
        id: 'hierarchy',
        value: localHierarchy,
      });
    },
    [selectedBranchReducer, state.hierarchy],
  );

  /**
   * @param parentUUID - required parent uuid if needed
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add an item and connect
   * it with its parent
   */
  const onAddItemClicked = (parentUUID) => {
    const localHierarchy = [...(state.hierarchy || [])];
    const itemToAdd = {
      parent_uuid:
        parentUUID
        || ((localHierarchy.length === 0 || localHierarchy[0].is_deleted)
          && selectedBranchReducer.uuid)
        || null,
      company_uuid: (selectedBranchReducer && selectedBranchReducer.uuid) || null,
      uuid: generateUUIDV4(),
      isNotSaved: true,
      org_group_uuid: null,
      level_uuid: null,
      name: {},
      children: [],
    };
    if (
      localHierarchy.length > 0
      && localHierarchy[0].name
      && Object.keys(localHierarchy[0].name).length > 0
    )
      Object.keys(localHierarchy[0].name).map((item) => {
        itemToAdd.name[item] = null;
        return undefined;
      });
    else
      itemToAdd.name = {
        en: null,
      };
    if (parentUUID) changeItemParentHandler(itemToAdd)({ value: parentUUID });
    else {
      localHierarchy.splice(0, 0, itemToAdd);
      setState({ id: 'hierarchy', value: localHierarchy });
    }
  };

  // /**
  //  * @param currentUUID
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is get active title if filled same
  //  * as language of system if not get the first any filled if not
  //  * return 'N/A'
  //  */
  // const getActiveTitle = useMemo(
  //   () => (titles) => {
  //     if (!titles || !titles.some((item) => item.value)) return 'N/A';
  //     const currentLanguage = languages.find(
  //       (item) => item.code === i18next.language,
  //     );
  //     if (!currentLanguage) return 'N/A';
  //     const currentTitle = titles.find(
  //       (item) => item.language_uuid === currentLanguage.uuid,
  //     );
  //     if (currentTitle && currentTitle.value) return currentTitle.value;
  //     return titles.find((item) => item.value).value;
  //   },
  //   [languages],
  // );

  /**
   * @param currentUUID
   * @param isEqualToTheCurrent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to flat all hierarchy and exclude
   * the current uuid if needed
   */
  const getAvailableParents = useCallback(
    (currentUUID, isEqualToTheCurrent, isWithDeleted = false) => {
      const localHierarchy = [...state.hierarchy];
      let flattenArray = [];
      const recursiveFlatten = (arrayToFlat) =>
        arrayToFlat
          .filter((item) => isWithDeleted || !item.is_deleted)
          .map((item) => {
            const localItem = { ...item };
            delete localItem.children;
            flattenArray.push(localItem);
            if (
              item.children
              && item.children.filter((el) => isWithDeleted || !el.is_deleted).length
                > 0
            )
              recursiveFlatten(item.children);
            return item;
          });
      recursiveFlatten(localHierarchy);
      if (currentUUID)
        flattenArray = flattenArray.filter(
          (item) =>
            (isEqualToTheCurrent && item.parent_uuid === currentUUID)
            || (!isEqualToTheCurrent && item.uuid !== currentUUID),
        );
      // if (!isEqualToTheCurrent)
      //   flattenArray = flattenArray.map((item) => ({
      //     ...item,
      //     activeTitle: item.name[i18next.language],
      //   }));
      return flattenArray;
    },
    [state.hierarchy],
  );

  /**
   * @param languageCode
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get language title
   */
  const getLanguageTitle = useMemo(
    () => (languageCode) =>
      languages.find((item) => languageCode === item.code)?.title || 'N/A',
    [languages],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.hierarchy) showError(errors.hierarchy.message);
      return;
    }
    setIsLoading(true);
    const response = await UpdateSetupsHierarchy(
      getAvailableParents(undefined, undefined, true),
    );
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      setState({
        id: 'initHierarchy',
        value: groupHierarchyByParentUuid(response.data.results),
      });
      setState({
        id: 'hierarchy',
        value: groupHierarchyByParentUuid(response.data.results),
      });
      setIsSubmitted(false);
      setIsChanged(false);
      showSuccess(
        t(
          `${translationPath}${
            (state.initHierarchy
              && state.initHierarchy.length > 0
              && 'hierarchy-updated-successfully')
            || 'hierarchy-created-successfully'
          }`,
        ),
      );
    } else
      showError(
        t(
          `${translationPath}${
            (state.initHierarchy
              && state.initHierarchy.length > 0
              && 'hierarchy-update-failed')
            || 'hierarchy-create-failed'
          }`,
        ),
        response,
      );
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on init
  useEffect(() => {
    getEditInit();
  }, [getEditInit]);

  // this to get languages
  useEffect(() => {
    if (userReducer && userReducer.results && userReducer.results.language)
      setLanguages(userReducer.results.language);
    else showError(t('Shared:failed-to-get-languages'));
  }, [t, userReducer]);

  // this to init errors schema
  useEffect(() => {
    const itemSchema = yup.object({
      org_group_uuid: yup.string().nullable(),
      level_uuid: yup.string().nullable().required(t('this-field-is-required')),
      code: yup.string().nullable().required(t('this-field-is-required')),
      name: yup.lazy((obj) =>
        yup
          .object()
          .shape(
            Object.keys(obj).reduce(
              (newMap, key) => ({
                ...newMap,
                [key]: yup
                  .string()
                  .nullable()
                  .required(t('this-field-is-required'))
                  .trim(t('trim-description')),
              }),
              {},
            ),
          )
          .nullable()
          .test(
            'isRequired',
            `${t('please-add-at-least')} ${1} ${t('name')}`,
            (value) => value && Object.keys(value).length > 0,
          ),
      ),
      children: yup.array().of(yup.lazy(() => itemSchema.default(undefined))),
    });

    schema.current = yup.object().shape({
      hierarchy: yup
        .array()
        .of(itemSchema)
        .uniqueRecursive(t('code-is-duplicated'), 'children', (a) => a.code)
        .min(1, `${t('please-add-at-least')} ${1} ${t('node')}`)
        .required(`${t('please-add-at-least')} ${1} ${t('node')}`),
    });
  }, [t]);

  useEffect(() => {
    if (accountReducer && accountReducer.account_uuid)
      getAllSetupsHierarchyLevels(accountReducer.account_uuid);
  }, [accountReducer, getAllSetupsHierarchyLevels]);

  return (
    <div className="hierarchy-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">{t('hierarchy')}</span>
        <span className="description-text">
          {t(`${translationPath}hierarchy-description`)}
        </span>
      </div>
      <form noValidate onSubmit={saveHandler} className="page-body-wrapper">
        <TabsComponent
          data={HierarchyTabsData}
          currentTab={activeTab}
          labelInput="label"
          idRef="hierarchyTabsRef"
          isWithLine
          isPrimary
          onTabChanged={(event, currentTab) => {
            setActiveTab(currentTab);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          dynamicComponentProps={{
            state,
            onStateChanged,
            onIsChangedChanged,
            onAddItemClicked,
            onRemoveItemClicked,
            isChanged,
            languages,
            getNotSelectedLanguage,
            getLanguageTitle,
            addLanguageHandler,
            getAvailableParents,
            // changeItemParentHandler,
            removeLanguageHandler,
            errors,
            isSubmitted,
            isLoading,
            hierarchyLevelsData,
            parentTranslationPath,
            translationPath,
          }}
        />
      </form>
    </div>
  );
};

export default HierarchyPage;
