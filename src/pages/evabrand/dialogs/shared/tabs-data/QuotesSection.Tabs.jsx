import { QuotesTab, QuotesContentsTab } from '../../quotes-section';
import { LayoutsTab } from '../layouts';

export const QuotesSectionTabs = [
  {
    label: 'content',
    key: 1,
    component: QuotesContentsTab,
  },
  {
    label: 'quotes',
    key: 2,
    component: QuotesTab,
  },
  {
    label: 'layouts',
    key: 3,
    component: LayoutsTab,
  },
];
