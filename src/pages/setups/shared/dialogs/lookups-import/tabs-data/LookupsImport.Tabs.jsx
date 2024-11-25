import LookupsImportTab from '../tabs/lookups-import/LookupsImport.Tab';
import LookupsImportHistoryTab from '../tabs/lookups-import-history/LookupsImportHistory.Tab';
import LookupsBulkImportHistoryTab from '../tabs/lookups-bulk-import-history/LookupsBulkImportHistory.Tab';

export const LookupsImportTabs = [
  {
    key: 1,
    label: 'import',
    component: LookupsImportTab,
  },
  {
    key: 2,
    label: 'history',
    component: LookupsImportHistoryTab,

  },
  {
    key: 3,
    label: 'history',
    component: LookupsBulkImportHistoryTab,
    isBulk: true,
  },
];
