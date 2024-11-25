// Import React Components
import React, {
  lazy,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import './DataFlowPage.Style.scss';
import { GetDataFlowCases } from 'services';
import { SharedInputControl, SetupsReducer, SetupsReset } from 'pages/setups/shared';
import { showError } from 'helpers';
import TablesComponent from 'components/Tables/Tables.Component';
import { SystemActionsEnum } from 'enums';
import { DialogComponent } from 'components';
const DataFlowViewPage = lazy(() => import('./DataFlowView.Page'));

const parentTranslationPath = 'DataFlowPage';

const DataFlowTablePage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenViewDialog, setIsOpenViewDialog] = useState(false);

  const stateInitRef = useRef({
    results: [],
    totalCount: 0,
  });
  const [filter, setFilters] = useState({
    limit: 25,
    page: 1,
    use_for: 'list',
    crn: null,
    name: null,
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is send new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const GetDataFlowCasesHandler = useCallback(async () => {
    setIsLoading(true);
    const res = await GetDataFlowCases(filter);
    setIsLoading(false);
    if (res.status === 200) {
      onStateChanged({ id: 'results', value: res.data?.results });
      onStateChanged({ id: 'totalCount', value: res.data?.paginate?.total || 0 });
    } else showError('Failed to get cases!');
  }, [filter]);

  const onPageIndexChanged = (newIndex) => {
    onStateChanged({ id: 'page', value: newIndex + 1 });
  };
  const onPageSizeChanged = (newPageSize) => {
    onStateChanged({ id: 'page', value: newPageSize });
  };

  const onActionClicked = (action, row) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.view.key) setIsOpenViewDialog(true);
  };

  useEffect(() => {
    GetDataFlowCasesHandler();
  }, [GetDataFlowCasesHandler, filter]);

  return (
    <div className="m-4">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">{t('tack-cases')}</span>
        <span className="description-text">{t('track-cases-description')}</span>
      </div>
      <div className="px-2">
        <div className="w-50 d-flex">
          <SharedInputControl
            isHalfWidth
            idRef="searchRef"
            title="search-by-name"
            placeholder="search-by-name"
            themeClass="theme-filled"
            stateKey="search"
            endAdornment={
              <span className="end-adornment-wrapper">
                <span className="fas fa-search" />
              </span>
            }
            onValueChanged={(newValue) => {
              setFilters({
                ...filter,
                page: 1,
                name: newValue.value,
              });
            }}
            parentTranslationPath={parentTranslationPath}
            editValue={filter.search}
          />
          <SharedInputControl
            isHalfWidth
            idRef="searchRef"
            title="search-by-crn"
            placeholder="search-by-crn"
            themeClass="theme-filled"
            stateKey="search"
            endAdornment={
              <span className="end-adornment-wrapper">
                <span className="fas fa-search" />
              </span>
            }
            onValueChanged={(newValue) => {
              setFilters({
                ...filter,
                page: 1,
                crn: newValue.value,
              });
            }}
            parentTranslationPath={parentTranslationPath}
            editValue={filter.search}
          />
        </div>
        <TablesComponent
          headerData={[
            {
              id: 1,
              label: t(`name`),
              input: 'name',
            },
            {
              id: 2,
              label: t(`package`),
              input: 'package',
            },
            {
              id: 3,
              label: t(`stage`),
              input: 'stage',
            },
            {
              id: 4,
              label: t(`DFREFNUMBER`),
              input: 'DFREFNUMBER',
            },
            {
              id: 5,
              label: t(`CRN`),
              input: 'CRN',
            },
            {
              id: 6,
              label: t(`amount`),
              input: 'AMOUNT',
            },
            // {
            //   id: 5,
            //   label: t(`candidate-uuid`),
            //   input: 'candidate_uuid',
            // },
          ]}
          data={state.results || []}
          isLoading={isLoading}
          pageIndex={filter.page - 1}
          pageSize={filter.limit}
          totalItems={state.totalCount}
          isDynamicDate
          uniqueKeyInput="CRN"
          getIsDisabledRow={(row) => row.can_delete === false}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
          isWithTableActions
          onActionClicked={onActionClicked}
          tableActions={[SystemActionsEnum.view]}
        />
      </div>
      {isOpenViewDialog && (
        <DialogComponent
          maxWidth="lg"
          titleText={t('view-case-details')}
          contentClasses="px-0"
          dialogContent={<DataFlowViewPage activeItem={activeItem} />}
          wrapperClasses="lookups-management-dialog-wrapper"
          isOpen={isOpenViewDialog}
          isEdit={(activeItem && true) || undefined}
          onCloseClicked={() => setIsOpenViewDialog(false)}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

export default DataFlowTablePage;
