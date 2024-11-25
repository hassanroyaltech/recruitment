import { DataSecurityRulesFeaturesEnum } from './DataSecurityRulesFeatures.Enum';

export const CategoriesRulesTypesEnum = {
  rule_position: {
    key: 'rule_position',
    value: 'rule_position',
    features: [DataSecurityRulesFeaturesEnum.vacancy_report.key],
  },
  rule_hierarchy: {
    key: 'rule_hierarchy',
    value: 'rule_hierarchy',
    features: [DataSecurityRulesFeaturesEnum.vacancy_report.key],
  },
  rule_job_title: {
    key: 'rule_job_title',
    value: 'rule_job_title',
    features: [
      DataSecurityRulesFeaturesEnum.job_report.key,
      DataSecurityRulesFeaturesEnum.vacancy_report.key,
    ],
  },
  rule_job_family: {
    key: 'rule_job_family',
    value: 'rule_job_family',
    features: [
      DataSecurityRulesFeaturesEnum.job_report.key,
      DataSecurityRulesFeaturesEnum.vacancy_report.key,
    ],
  },
  rule_organization_group: {
    key: 'rule_organization_group',
    value: 'rule_organization_group',
    features: [DataSecurityRulesFeaturesEnum.vacancy_report.key],
  },
  rule_hierarchy_level: {
    key: 'rule_hierarchy_level',
    value: 'rule_hierarchy_level',
    features: [DataSecurityRulesFeaturesEnum.vacancy_report.key],
  },
  rule_org_group: {
    key: 'rule_org_group',
    value: 'organization-group',
    features: [DataSecurityRulesFeaturesEnum.vacancy_report.key],
  },
  rule_single_hierarchy: {
    key: 'rule_single_hierarchy',
    value: 'rule-single-hierarchy',
    features: [DataSecurityRulesFeaturesEnum.vacancy_report.key],
  },
  rule_company: {
    key: 'rule_company',
    value: 'company',
    features: [DataSecurityRulesFeaturesEnum.candidate_report.key],
  },
};
