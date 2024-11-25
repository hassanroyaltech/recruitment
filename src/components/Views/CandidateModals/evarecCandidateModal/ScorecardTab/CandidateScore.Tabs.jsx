import { AssignBoardTab, RatingByBlocksTab, RatingByMembers } from './tabs';
import { ScorecardPermissions } from '../../../../../permissions';

export const CandidateScoreTabs = [
  {
    label: 'rating-by-blocks',
    key: 1,
    component: RatingByBlocksTab,
    permissionId: ScorecardPermissions.ViewRatingByBlocks.key,
  },
  {
    label: 'rating-by-members',
    key: 2,
    component: RatingByMembers,
    permissionId: ScorecardPermissions.ViewRatingByMembers.key,
  },
  {
    label: 'assign-board',
    key: 3,
    component: AssignBoardTab,
    permissionId: ScorecardPermissions.ViewAssignBoard.key,
  },
];
