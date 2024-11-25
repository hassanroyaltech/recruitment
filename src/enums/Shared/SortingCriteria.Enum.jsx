import { SortingCriteriaCallLocationsEnum } from './SortingCriteriaCallLocations.Enum';

export const SortingCriteriaEnum = {
  ScoreLowToHigh: {
    id: 0,
    title: 'score-low-to-high',
    order_type: 'ASC',
    order_by: 1,
    hiddenIn: [SortingCriteriaCallLocationsEnum.VisaPipelineHeader.key],
  },
  ScoreHighToLow: {
    id: 1,
    title: 'score-high-to-low',
    order_type: 'DESC',
    order_by: 1,
    hiddenIn: [SortingCriteriaCallLocationsEnum.VisaPipelineHeader.key],
  },
  AppliedOldToNew: {
    id: 2,
    title: 'applied-date-old-to-new',
    order_type: 'ASC',
    order_by: 2,
    hiddenIn: [],
  },
  AppliedNewToOld: {
    id: 3,
    title: 'applied-date-new-to-old',
    order_type: 'DESC',
    order_by: 2,
    hiddenIn: [],
  },
  ExpiryOldToNew: {
    id: 4,
    title: 'expiry-date-old-to-new',
    order_type: 'ASC',
    order_by: 2,
    hiddenIn: [SortingCriteriaCallLocationsEnum.PipelineHeader.key],
  },
  ExpiryNewToOld: {
    id: 5,
    title: 'expiry-date-new-to-old',
    order_type: 'DESC',
    order_by: 2,
    hiddenIn: [SortingCriteriaCallLocationsEnum.PipelineHeader.key],
  },
  WeightLowToHigh: {
    id: 6,
    title: 'weight-low-to-high',
    order_type: 'ASC',
    order_by: 3,
    hiddenIn: [SortingCriteriaCallLocationsEnum.VisaPipelineHeader.key],
  },
  WeightHighToLow: {
    id: 7,
    title: 'weight-high-to-low',
    order_type: 'DESC',
    order_by: 3,
    hiddenIn: [SortingCriteriaCallLocationsEnum.VisaPipelineHeader.key],
  },
  HeightLowToHigh: {
    id: 8,
    title: 'height-low-to-high',
    order_type: 'ASC',
    order_by: 4,
    hiddenIn: [SortingCriteriaCallLocationsEnum.VisaPipelineHeader.key],
  },
  HeightHighToLow: {
    id: 9,
    title: 'height-high-to-low',
    order_type: 'DESC',
    order_by: 4,
    hiddenIn: [SortingCriteriaCallLocationsEnum.VisaPipelineHeader.key],
  },
};
