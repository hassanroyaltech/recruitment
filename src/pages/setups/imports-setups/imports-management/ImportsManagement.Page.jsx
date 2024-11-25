import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { LookupsImportEnum } from '../../../../enums';
import ButtonBase from '@mui/material/ButtonBase';
// import { LookupImportDialog } from '../../shared/dialogs/lookups-import/LookupsImport.Dialog';
import { TabsComponent } from '../../../../components';
import { getErrorByName, showError, showSuccess } from '../../../../helpers';
import { LookupsImportTabs } from '../../shared/dialogs/lookups-import/tabs-data/LookupsImport.Tabs';
import { SetupsReducer, SetupsReset } from '../../shared';
import { array, object } from 'yup';
import {
  ValidateOrImportBulkLookups,
  ValidateOrImportLookups,
} from '../../../../services';

const parentTranslationPath = 'SetupsPage';
const translationPath = 'ImportsPages.';
const ImportsManagementPage = () => {
  // const { t } = useTranslation(parentTranslationPath);
  // const [isOpenLookupImportDialog, setIsOpenLookupImportDialog] = useState();
  const { t } = useTranslation(parentTranslationPath);
  const getActiveImportEnumItem = useMemo(() => {
    const urlKey = window.location.pathname.split('/').pop();
    return Object.values(LookupsImportEnum).find((item) => item.urlKey === urlKey);
  }, []);

  const [lookupsImportTabs] = useState(
    LookupsImportTabs.filter(
      (item, index) => getActiveImportEnumItem.isBulk === item.isBulk || index === 0,
    ),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState();
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  // const [validatedItem, setValidatedItem] = useState(null);
  const stateInitRef = useRef({
    file: [],
    file_uuid: null,
    model: getActiveImportEnumItem.key,
    is_validate: true,
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the array of object for tables columns
   */
  const getTableHeaderByCol = useMemo(
    () =>
      ({ col }) => {
        if (col) {
          const localColumns = Object.entries(col).map(([key, value]) => ({
            key,
            label: value,
            input: key,
            isSortable: false,
            isSearchable: false,
          }));
          const extraColumns = [
            {
              key: 'process',
              label: t('process'),
              input: 'action',
            },
            {
              key: 'error',
              label: t('failed-reasons'),
              input: 'errors',
              component: (row) =>
                row.errors
                && row.errors.length > 0 && (
                  <ul className="c-error pl-3-reversed">
                    {row.errors.map((item) => (
                      <li key={`errorsKey${row.uuid}${item}`}>{item}</li>
                    ))}
                  </ul>
                ),
            },
          ];
          return [...localColumns, ...extraColumns];
        }
        return [];
      },
    [t],
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: object().shape({
          file: array().nullable().required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    );
    setErrors(result);
  }, [state, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    const response = await (getActiveImportEnumItem.isBulk
      ? ValidateOrImportBulkLookups
      : ValidateOrImportLookups)(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      setState({ id: 'edit', value: { ...stateInitRef.current } });
      setActiveTab(1);
      showSuccess(t('file-imported-successfully'));
    } else showError(t('file-import-failed'), response);
  };

  // this to call error's updater when state changed
  useEffect(() => {
    void getErrors();
  }, [getErrors, state]);

  return (
    <div className="imports-management-wrapper page-wrapper px-4 pb-3">
      <div className="setups-card-wrapper">
        <div className="setups-content-wrapper">
          <div className="setups-card-body-wrapper">
            <div className="body-item-wrapper">
              <span className="header-text">
                {t(`${translationPath}${getActiveImportEnumItem.value}`)}
              </span>
            </div>
            <div className="body-item-wrapper mb-3">
              <span className="description-text">
                {t(`${translationPath}${getActiveImportEnumItem.value}-description`)}
              </span>
            </div>
          </div>
          {/*<div className="setups-card-footer-wrapper">*/}
          {/*  <div></div>*/}
          {/*  <div className="d-inline-flex">*/}
          {/*    <ButtonBase*/}
          {/*      onClick={() => {*/}
          {/*        setIsOpenLookupImportDialog(true);*/}
          {/*      }}*/}
          {/*      className="btns theme-solid m-2"*/}
          {/*    >*/}
          {/*      <span className="fas fa-file-import" />*/}
          {/*      <span className="px-2">*/}
          {/*        {t(`${translationPath}import-${getActiveImportEnumItem.value}`)}*/}
          {/*      </span>*/}
          {/*    </ButtonBase>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
      <div className="separator-h mb-3" />
      <div>
        <div className="lookups-import-dialog-content-wrapper d-flex-h-center fa-start flex-wrap">
          <div className="description-text mb-3">
            <span>{t('click')}</span>
            <a
              download
              target="_blank"
              href={`https://static-elevatus.s3.eu-west-2.amazonaws.com/Imports/${getActiveImportEnumItem.url}`}
              rel="noreferrer"
              className="c-black fw-bold px-1"
            >
              {t('here')}
            </a>
            <span>{t('to-download-template')}</span>
          </div>
          <TabsComponent
            isPrimary
            isWithLine
            labelInput="label"
            tabsContentClasses="w-100"
            idRef="lookupsImportTabsRef"
            currentTab={activeTab}
            data={lookupsImportTabs}
            onTabChanged={(event, currentTab) => {
              setActiveTab(currentTab);
            }}
            parentTranslationPath={parentTranslationPath}
            dynamicComponentProps={{
              enumItem: getActiveImportEnumItem,
              // validatedItem,
              getTableHeaderByCol,
              state,
              errors,
              onStateChanged,
              isSubmitted,
              parentTranslationPath,
              // translationPath,
            }}
          />
        </div>
      </div>
      {activeTab === 0 && (
        <div className="d-flex-v-center-h-end">
          <ButtonBase
            className="btns theme-solid  mx-2"
            onClick={saveHandler}
            disabled={isLoading}
          >
            <span>{t(`import`)}</span>
          </ButtonBase>
        </div>
      )}
      {/*{isOpenLookupImportDialog && (*/}
      {/*  <LookupImportDialog*/}
      {/*    enumItem={getActiveImportEnumItem}*/}
      {/*    onSave={() => {*/}
      {/*      // setIsReload((item) => !item);*/}
      {/*    }}*/}
      {/*    isOpenChanged={() => {*/}
      {/*      setIsOpenLookupImportDialog(false);*/}
      {/*    }}*/}
      {/*    isOpen={isOpenLookupImportDialog}*/}
      {/*    translationPath={translationPath}*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  );
};
export default ImportsManagementPage;
