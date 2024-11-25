import { AnalyticsChartTypesEnum } from './AnalyticsChartTypes.Enum';
import React from 'react';
import i18next, { t } from 'i18next';
import moment from 'moment';
import { GlobalSavingDateFormat, GlobalDisplayDateTimeFormat } from '../../helpers';
export const AnalyticsStaticDashboardEnum = {
  candidate: {
    total_candidates: {
      title: 'candidate-total-candidates-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'candidate-total-candidates-description',
      formula: 'candidate-total-candidates-formula',
      withCharType: true,
      generateReport: true,
      detailedView: true,
      dialogTitleKey: 'candidate-total-candidates-title',
      customDetailsSlug: 'all_candidates_detailed_view', //this key used when the details slug is different from the original slug
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'name',
          input: 'name',
        },
        {
          id: 2,
          isSortable: false,
          label: 'email',
          input: 'email',
        },
        {
          id: 3,
          isSortable: false,
          label: 'applicant-number',
          input: 'applicant_number',
        },
        {
          id: 4,
          isSortable: false,
          label: 'gender',
          input: 'gender',
        },
        {
          id: 5,
          isSortable: false,
          label: 'assigned-user',
          input: 'assigned_user',
        },
        {
          id: 6,
          isSortable: false,
          label: 'source-type',
          input: 'source_type',
        },

        {
          id: 7,
          isSortable: false,
          label: 'created-at',
          component: (cellContent) => (
            <span>
              {moment(cellContent.created_at)
                .locale(i18next.language || 'en')
                .format(GlobalDisplayDateTimeFormat)}
            </span>
          ),
        },
      ],
    },
    hired_candidates: {
      title: 'candidate-hired-candidates-title',
      subtitle: 'hired-candidates',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'candidate-hired-candidates-description',
      formula: 'candidate-hired-candidates-formula',
      withCharType: true,
      generateReport: true,
      detailedView: true,
      dialogTitleKey: 'candidate-hired-candidates-title',
      customDetailsSlug: 'hired_candidates_detailed_view',
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'name',
          input: 'name',
        },
        {
          id: 2,
          isSortable: false,
          label: 'email',
          input: 'email',
        },
        {
          id: 3,
          isSortable: false,
          label: 'applicant-number',
          input: 'applicant_number',
        },
        {
          id: 4,
          isSortable: false,
          label: 'gender',
          input: 'gender',
        },
        {
          id: 5,
          isSortable: false,
          label: 'assigned-user',
          input: 'assigned_user',
        },
        {
          id: 6,
          isSortable: false,
          label: 'source-type',
          input: 'source_type',
        },
        {
          id: 7,
          isSortable: false,
          label: 'created-at',
          component: (cellContent) => (
            <span>
              {moment(cellContent.created_at)
                .locale(i18next.language || 'en')
                .format(GlobalDisplayDateTimeFormat)}
            </span>
          ),
        },
        {
          id: 8,
          isSortable: false,
          label: 'branch-name',
          input: 'branch_name',
        },
        {
          id: 9,
          isSortable: false,
          label: 'job-title',
          input: 'job_title',
        },
        {
          id: 10,
          isSortable: false,
          label: 'recruiter-name',
          input: 'recruiter_name',
        },
        {
          id: 11,
          isSortable: false,
          label: 'nationality',
          input: 'nationality',
        },
      ],
    },
    disqualified_candidates: {
      title: 'candidate-disqualified-candidates-title',
      subtitle: 'disqualified-candidates',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'candidate-disqualified-candidates-description',
      formula: 'candidate-disqualified-candidates-formula',
      withCharType: true,
      generateReport: true,
      detailedView: true,
      dialogTitleKey: 'candidate-disqualified-candidates-title',
      customDetailsSlug: 'disqualified_candidates_detailed_view',
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'name',
          input: 'name',
        },
        {
          id: 2,
          isSortable: false,
          label: 'email',
          input: 'email',
        },
        {
          id: 3,
          isSortable: false,
          label: 'applicant-number',
          input: 'applicant_number',
        },
        {
          id: 4,
          isSortable: false,
          label: 'gender',
          input: 'gender',
        },
        {
          id: 5,
          isSortable: false,
          label: 'assigned-user',
          input: 'assigned_user',
        },
        {
          id: 6,
          isSortable: false,
          label: 'source-type',
          input: 'source_type',
        },

        {
          id: 7,
          isSortable: false,
          label: 'created-at',
          component: (cellContent) => (
            <span>
              {moment(cellContent.created_at)
                .locale(i18next.language || 'en')
                .format(GlobalDisplayDateTimeFormat)}
            </span>
          ),
        },
      ],
    },
    candidates_origins: {
      title: 'candidate-candidates-origins-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'candidate-candidates-origins-description',
      formula: 'candidate-candidates-origins-formula',
    },
    candidates_assessments: {
      title: 'candidate-candidates-assessments-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'candidate-candidates-assessments-description',
      formula: 'candidate-candidates-assessments-formula',
      withCharType: true,
      generateReport: true,
      detailedView: true,
      dialogTitleKey: 'candidate-candidates-assessments-title',
      customDetailsSlug: 'candidates_assessments_detailed_view',
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'name',
          input: 'name',
        },
        {
          id: 2,
          isSortable: false,
          label: 'email',
          input: 'email',
        },
        {
          id: 3,
          isSortable: false,
          label: 'reference-number',
          input: 'reference_number',
        },
        {
          id: 4,
          isSortable: false,
          label: 'status',
          input: 'status',
        },
        {
          id: 5,
          isSortable: false,
          label: 'created-at',
          component: (cellContent) => (
            <span>
              {moment(cellContent.created_at)
                .locale(i18next.language || 'en')
                .format(GlobalDisplayDateTimeFormat)}
            </span>
          ),
        },
      ],
    },
    candidates_sourcing_overtime: {
      title: 'candidate-candidates_sourcing_overtime-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.LINE.value,
      description: 'candidate-candidates_sourcing_overtime-description',
      formula: 'candidate-candidates_sourcing_overtime-formula',
    },
    interview_to_offer_ratio: {
      title: 'interview-to-offer-ratio-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'interview-to-offer-ratio-description',
      formula: 'interview-to-offer-ratio-formula',
    },
    number_of_qualified_candidates: {
      title: 'number-of-qualified-candidates-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'number-of-qualified-candidates-description',
      formula: 'number-of-qualified-candidates-formula',
    },
    offer_acceptance_rate: {
      title: 'offer-acceptance-rate-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'offer-acceptance-rate-description',
      formula: 'offer-acceptance-rate-formula',
    },
    sourcing_channels_efficiency: {
      title: 'sourcing-channels-efficiency-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'sourcing-channels-efficiency-description',
      formula: 'sourcing-channels-efficiency-formula',
    },
    submit_to_interview_ratio: {
      title: 'submit-to-interview-ratio-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'submit-to-interview-ratio-description',
      formula: 'submit-to-interview-ratio-formula',
    },
    website_social_listening_kpi: {
      title: 'website-social-listening-kpi-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'website-social-listening-kpi-description',
      formula: 'website-social-listening-kpi-formula',
    },
    hired_candidates_by_nationality: {
      title: 'hired-candidates-by-nationality-title',
      subtitle: 'hired-candidates-by-nationality-desc',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'hired-candidates-by-nationality-desc',
      customDetailsSlug: 'hired_candidates_detailed_view',
      withCharType: true,
      detailedView: true,
      generateReport: true,
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            input: 'nationality',
            label: 'nationality',
          },
          {
            id: 2,
            isSortable: false,
            label: 'ratio',
            component: (cellContent) => `${cellContent.ratio} %`,
          },
          {
            id: 3,
            isSortable: false,
            label: 'count',
            input: 'count',
          },
        ],
      },
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'name',
          input: 'name',
        },
        {
          id: 2,
          isSortable: false,
          label: 'assigned-user',
          input: 'assigned_user',
        },
        {
          id: 3,
          isSortable: false,
          label: 'branch-name',
          input: 'branch_name',
        },
        {
          id: 4,
          isSortable: false,
          label: 'created-at',
          input: 'created_at',
        },
        {
          id: 5,
          isSortable: false,
          label: 'email',
          input: 'email',
        },
        {
          id: 6,
          isSortable: false,
          label: 'job-title',
          input: 'job_title',
        },
        {
          id: 7,
          isSortable: false,
          label: 'applicant-number',
          input: 'applicant_number',
        },
        {
          id: 8,
          isSortable: false,
          label: 'nationality',
          input: 'nationality',
        },
      ],
    },
    hired_candidates_by_gender: {
      title: 'hired-candidates-by-gender-title',
      subtitle: 'hired-candidates-by-gender-desc',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'hired-candidates-by-gender-desc',
      customDetailsSlug: 'hired_candidates_detailed_view',
      detailedView: true,
      generateReport: true,
      withCharType: true,
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'name',
          input: 'name',
        },
        {
          id: 2,
          isSortable: false,
          label: 'assigned-user',
          input: 'assigned_user',
        },
        {
          id: 3,
          isSortable: false,
          label: 'branch-name',
          input: 'branch_name',
        },
        {
          id: 4,
          isSortable: false,
          label: 'created-at',
          input: 'created_at',
        },
        {
          id: 5,
          isSortable: false,
          label: 'email',
          input: 'email',
        },

        {
          id: 6,
          isSortable: false,
          label: 'job-title',
          input: 'job_title',
        },
        {
          id: 7,
          isSortable: false,
          label: 'applicant-number',
          input: 'applicant_number',
        },
        {
          id: 8,
          isSortable: false,
          label: 'nationality',
          input: 'nationality',
        },
      ],
    },
    average_cv_hit_rate: {
      title: 'average-cv-hit-rate-title',
      subtitle: 'average-cv-hit-rate-subtitle',
      description: 'average-cv-hit-rate-description',
      formula: 'average-cv-hit-rate-formula',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
    },
    job_specific_cv_hit_rate: {
      title: 'job-specific-cv-hit-rate-title',
      subtitle: 'job-specific-cv-hit-rate-subtitle',
      description: 'job-specific-cv-hit-rate-description',
      formula: 'job-specific-cv-hit-rate-formula',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
    },
    total_number_of_shared_candidates: {
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      title: 'total-number-of-shared-candidates-title',
      subtitle: 'total-number-of-shared-candidates-subtitle',
      description: 'total-number-of-shared-candidates-description',
      formula: 'total-number-of-shared-candidates-formula',
    },
    shared_candidates_grouped_by: {
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      title: 'shared-candidates-grouped-by-title',
      subtitle: 'shared-candidates-grouped-by-subtitle',
      description: 'shared-candidates-grouped-by-description',
      formula: 'shared-candidates-grouped-by-formula',
    },
  },
  pipeline: {
    time_to_hire: {
      title: 'pipeline-time-to-hire-title',
      subtitle: 'pipeline',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      small_size: true,
      description: 'pipeline-time-to-hire-description',
      formula: 'pipeline-time-to-hire-formula',
      show_job_details: true,
    },
    time_to_disqualify: {
      title: 'pipeline-time-to-disqualify-title',
      subtitle: 'pipeline',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      small_size: true,
      description: 'pipeline-time-to-disqualify-description',
      formula: 'pipeline-time-to-disqualify-formula',
      show_job_details: true,
    },
    pipeline_breakdown: {
      title: 'pipeline-pipeline-breakdown-title',
      subtitle: 'pipeline-stages',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'pipeline-pipeline-breakdown-description',
      formula: 'pipeline-pipeline-breakdown-formula',
      show_job_details: true,
      generateReport: true,
      detailedView: true,
      dialogTitleKey: 'pipeline-pipeline-breakdown-title',
      extraReportFilters: (widget) =>
        widget?.uuid && {
          card_uuid: widget?.uuid,
          pipeline_uuid: widget?.payload?.pipeline_uuid || '',
          job_uuid: widget?.payload?.job_uuid || '',
        },
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'first-name',
          input: 'first_name',
        },
        {
          id: 2,
          isSortable: false,
          label: 'last-name',
          input: 'last_name',
        },
        {
          id: 3,
          isSortable: false,
          label: 'email',
          input: 'email',
        },
        {
          id: 4,
          isSortable: false,
          label: 'job',
          input: 'job_uuid',
        },
        {
          id: 5,
          isSortable: false,
          label: 'stage',
          input: 'stage_uuid',
        },
        {
          id: 6,
          isSortable: false,
          label: 'company',
          input: 'company_uuid',
        },
        {
          id: 7,
          isSortable: false,
          label: 'applicant-number',
          input: 'applicant_number',
        },
      ],
    },
    time_to_fill: {
      title: 'pipeline-time-to-fill-title',
      subtitle: 'pipeline',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      small_size: true,
      description: 'pipeline-time-to-fill-description',
      formula: 'pipeline-time-to-fill-formula',
      show_job_details: true,
    },
    time_frame: {
      title: 'pipeline-time-frame-title',
      subtitle: 'time-frame',
      chart_type: AnalyticsChartTypesEnum.MULTIPLE_CARDS.value,
      description: 'pipeline-time-frame-description',
      formula: 'pipeline-time-frame-formula',
      show_job_details: true,
    },
    average_for_each_stage: {
      title: 'average_for_each_stage',
      subtitle: 'pipeline',
      chart_type: AnalyticsChartTypesEnum.MULTIPLE_CARDS.value,
      description: 'average_for_each_stage',
      small_size: true,
      show_job_details: true,
    },
  },
  job: {
    total_jobs: {
      title: 'job-total-jobs-title',
      subtitle: 'total-applications',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'job-total-jobs-description',
      formula: 'job-total-jobs-formula',
      generateReport: true,
      detailedView: true,
      dialogTitleKey: 'job-detailed-view',
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'title',
          input: 'title',
        },
        {
          id: 2,
          isSortable: false,
          label: 'status',
          input: 'job_status',
        },
        {
          id: 3,
          isSortable: false,
          label: 'vacancy-status',
          input: 'vacancy_status',
        },
        {
          id: 4,
          isSortable: false,
          label: 'country',
          input: 'country_uuid',
        },
        {
          id: 5,
          isSortable: false,
          label: 'gender',
          input: 'gender',
        },
        {
          id: 6,
          isSortable: false,
          label: 'type',
          component: (cellContent) => (
            <span>
              {(Array.isArray(cellContent?.type_uuid)
                && cellContent?.type_uuid.join(', '))
                || cellContent?.type_uuid
                || ''}
            </span>
          ),
        },
      ],
    },
    time_hire_per_branch: {
      title: 'time-hire-per-branch',
      subtitle: 'time',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'time-hire-per-branch',
      small_size: true,
      // formula: 'job-total-jobs-formula',
    },
    time_to_fill_per_branch: {
      title: 'time-fill-per-branch',
      subtitle: 'time',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'time-fill-per-branch',
      small_size: true,
      // formula: 'job-total-jobs-formula',
    },
    job_status_overview: {
      title: 'job-job-status-overview-title',
      subtitle: 'job-applications',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'job-job-status-overview-description',
      formula: 'job-job-status-overview-formula',
    },
    job_type: {
      title: 'job-job-type-title',
      subtitle: 'total-applications',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'job-job-type-description',
      formula: 'job-job-type-formula',
    },
    vacancy_status: {
      title: 'job-vacancy-status-title',
      subtitle: 'total-applications',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'job-vacancy-status-description',
      formula: 'job-vacancy-status-formula',
      generateReport: true,
      detailedView: true,
      dialogTitleKey: 'job-vacancy-status-title',
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'title',
          input: 'title',
        },
        {
          id: 2,
          isSortable: false,
          label: 'vacancy-status',
          input: 'vacancy_status',
        },
        {
          id: 3,
          isSortable: false,
          label: 'status',
          input: 'job_status',
        },
        {
          id: 4,
          isSortable: false,
          label: 'country',
          input: 'country_uuid',
        },
        {
          id: 5,
          isSortable: false,
          label: 'is-external',
          component: (cellContent) => (
            <span>{t(`Analytics:${(!!cellContent.is_external).toString()}`)}</span>
          ),
        },
        {
          id: 6,
          isSortable: false,
          label: 'gender',
          input: 'gender',
        },
        {
          id: 7,
          isSortable: false,
          label: 'type',
          component: (cellContent) => (
            <span>
              {(Array.isArray(cellContent?.type_uuid)
                && cellContent?.type_uuid.join(', '))
                || cellContent?.type_uuid
                || ''}
            </span>
          ),
        },
        {
          id: 8,
          isSortable: false,
          label: 'archived-at',
          component: (cellContent) => (
            <span>
              {(cellContent.deleted_at
                && moment(cellContent.deleted_at)
                  .locale(i18next.language || 'en')
                  .format(GlobalDisplayDateTimeFormat))
                || ''}
            </span>
          ),
        },
      ],
    },
  },
  job_requisition: {
    total_job_requisition: {
      title: 'job-requisition-total-job-requisition-title',
      subtitle: 'total-number-of-job-requisitions',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'job-requisition-total-job-requisition-description',
      formula: 'job-requisition-total-job-requisition-formula',
      generateReport: true,
      detailedView: true,
      dialogTitleKey: 'job-requisition-total-job-requisition-title',
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'title',
          input: 'job_title_name',
        },
        {
          id: 2,
          isSortable: false,
          label: 'company',
          input: 'company_uuid',
        },
        {
          id: 3,
          isSortable: false,
          label: 'detailed-approved-status',
          input: 'approved_status',
        },
        {
          id: 4,
          isSortable: false,
          label: 'is-posted',
          component: (cellContent) => (
            <span>{t(`Analytics:${(!!cellContent.is_posted).toString()}`)}</span>
          ),
        },
        {
          id: 5,
          isSortable: false,
          label: 'is-budgeted',
          component: (cellContent) => (
            <span>{t(`Analytics:${(!!cellContent.is_budgeted).toString()}`)}</span>
          ),
        },
      ],
    },
    approved_status: {
      title: 'job-requisition-approved-status-title',
      subtitle: 'job-requisitions-status',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'job-requisition-approved-status-description',
      formula: 'job-requisition-approved-status-formula',
    },
    is_budgeted: {
      title: 'job-requisition-is-budgeted-title',
      subtitle: 'job-requisitions',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'job-requisition-is-budgeted-description',
      formula: 'job-requisition-is-budgeted-formula',
    },
    is_posted: {
      title: 'job-requisition-is-posted-title',
      subtitle: 'job-requisitions',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'job-requisition-is-posted-description',
      formula: 'job-requisition-is-posted-formula',
    },
  },
  questionnaire: {
    total_questionnaire: {
      title: 'questionnaire-total-questionnaire-title',
      subtitle: 'total-number-of-questionnaires',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'questionnaire-total-questionnaire-description',
      formula: 'questionnaire-total-questionnaire-formula',
    },
    questionnaire_response: {
      title: 'questionnaire-questionnaire-response-title',
      subtitle: 'questionnaires',
      chart_type: AnalyticsChartTypesEnum.LINE.value,
      description: 'questionnaire-questionnaire-response-description',
      formula: 'questionnaire-questionnaire-response-formula',
    },
  },
  approval: {
    number_of_requests: {
      title: 'approval-number-of-requests-title',
      subtitle: 'total-number-of-requests',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'approval-number-of-requests-description',
      formula: 'approval-number-of-requests-formula',
      generateReport: true,
      detailedView: true,
      withCharType: true,
      dialogTitleKey: 'approval-number-of-requests-title',
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'request-type',
          input: 'transaction_type',
        },
        {
          id: 2,
          isSortable: false,
          label: 'approval-status',
          input: 'approval_status',
        },
        {
          id: 3,
          isSortable: false,
          label: 'company-name',
          input: 'company_name',
        },
        {
          id: 4,
          isSortable: false,
          label: 'created-by',
          input: 'created_by',
        },
        {
          id: 5,
          isSortable: false,
          label: 'created-at',
          component: (cellContent) => (
            <span>
              {moment(cellContent.created_at)
                .locale(i18next.language || 'en')
                .format(GlobalDisplayDateTimeFormat)}
            </span>
          ),
        },
      ],
    },
    requests_types: {
      title: 'approval-requests-types-title',
      subtitle: 'total-requests',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'approval-requests-types-description',
      formula: 'approval-requests-types-formula',
    },
    requests_status: {
      title: 'approval-requests-status-title',
      subtitle: 'requests-status',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'approval-requests-status-description',
      formula: 'approval-requests-status-formula',
    },
    avg_time_for_job_requisition_approval: {
      title: 'avg-time-for-job-requisition-approval-title',
      subtitle: 'avg-time-for-job-requisition-approval-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'avg-time-for-job-requisition-approval-description',
      customDetailsSlug: 'avg_time_for_requisition_approval_dv',
      detailedView: true,
      withCharType: true,
      generateReport: true,
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'request-name',
          input: 'request_name',
        },
        {
          id: 2,
          isSortable: false,
          label: 'is-approved',
          input: 'is_approved',
        },
        {
          id: 3,
          isSortable: false,
          label: 'requester',
          input: 'requestor',
        },
        {
          id: 4,
          isSortable: false,
          label: 'days-to-approve',
          input: 'days_to_approve',
        },
        {
          id: 5,
          isSortable: false,
          label: 'date-requested',
          input: 'date_requested',
        },
        {
          id: 6,
          isSortable: false,
          label: 'date-of-approval',
          input: 'date_of_approval',
        },
        {
          id: 7,
          isSortable: false,
          label: 'requested-from',
          input: 'requested_from',
        },
      ],
    },
    avg_time_for_offer_approval: {
      title: 'avg-time-for-job-offer-approval-title',
      subtitle: 'avg-time-for-job-offer-approval-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'avg-time-for-job-offer-approval-description',
      detailedView: true,
      generateReport: true,
      withCharType: true,
      customDetailsSlug: 'avg_time_for_offer_approval_dv',
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'request-name',
          input: 'request_name',
        },
        {
          id: 2,
          isSortable: false,
          label: 'is-approved',
          input: 'is_approved',
        },
        {
          id: 3,
          isSortable: false,
          label: 'requester',
          input: 'requestor',
        },
        {
          id: 4,
          isSortable: false,
          label: 'days-to-approve',
          input: 'days_to_approve',
        },
        {
          id: 5,
          isSortable: false,
          label: 'date-requested',
          input: 'date_requested',
        },
        {
          id: 6,
          isSortable: false,
          label: 'date-of-approval',
          input: 'date_of_approval',
        },
        {
          id: 7,
          isSortable: false,
          label: 'requested-from',
          input: 'requested_from',
        },
      ],
    },
    avg_time_for_job_post_approval: {
      title: 'avg-time-for-job-post-approval-title',
      subtitle: 'avg-time-for-job-post-approval-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'avg-time-for-job-post-approval-description',
      customDetailsSlug: 'avg_time_for_post_approval_dv',
      detailedView: true,
      generateReport: true,
      withCharType: true,
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'request-name',
          input: 'request_name',
        },
        {
          id: 2,
          isSortable: false,
          label: 'is-approved',
          input: 'is_approved',
        },
        {
          id: 3,
          isSortable: false,
          label: 'requester',
          input: 'requestor',
        },
        {
          id: 4,
          isSortable: false,
          label: 'days-to-approve',
          input: 'days_to_approve',
        },
        {
          id: 5,
          isSortable: false,
          label: 'date-requested',
          input: 'date_requested',
        },
        {
          id: 6,
          isSortable: false,
          label: 'date-of-approval',
          input: 'date_of_approval',
        },
        {
          id: 7,
          isSortable: false,
          label: 'requested-from',
          input: 'requested_from',
        },
      ],
    },
  },
  assessment: {
    total_assessments: {
      title: 'assessment-total-assessments-title',
      subtitle: 'total-number-of-assessments',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'assessment-total-assessments-description',
      formula: 'assessment-total-assessments-formula',
      generateReport: true,
      detailedView: true,
      dialogTitleKey: 'assessment-total-assessments-title',
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'title',
          input: 'title',
        },
        {
          id: 2,
          isSortable: false,
          label: 'deadline',
          // input: 'deadline',
          component: (cellContent) => (
            <span>
              {moment(cellContent.deadline)
                .locale(i18next.language || 'en')
                .format(GlobalSavingDateFormat)}
            </span>
          ),
        },
        {
          id: 3,
          isSortable: false,
          label: 'language',
          input: 'language_id',
        },
        {
          id: 4,
          isSortable: false,
          label: 'company',
          input: 'company_uuid',
        },
        {
          id: 5,
          isSortable: false,
          label: 'is-expired',
          component: (cellContent) => (
            <span>{t(`Analytics:${cellContent.is_expired.toString()}`)}</span>
          ),
        },
        {
          id: 6,
          isSortable: false,
          label: 'is-public',
          component: (cellContent) => (
            <span>{t(`Analytics:${cellContent?.is_public.toString()}`)}</span>
          ),
        },
      ],
    },
    expired_assessments: {
      title: 'assessment-expired-assessments-title',
      subtitle: 'expired-assessments',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'assessment-expired-assessments-description',
      formula: 'assessment-expired-assessments-formula',
    },
    public_private_assessments: {
      title: 'assessment-public-private-assessments-title',
      subtitle: 'assessments',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'assessment-public-private-assessments-description',
      formula: 'assessment-public-private-assessments-formula',
    },
    total_assessments_templates: {
      title: 'assessment-video-assessments-title',
      subtitle: 'assessments',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'assessment-video-description',
      formula: '',
      generateReport: true,
      detailedView: true,
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'title',
          input: 'title',
        },
        {
          id: 2,
          isSortable: false,
          label: 'company',
          input: 'company_uuid',
        },
        {
          id: 3,
          isSortable: false,
          label: 'questions-count',
          input: 'questions',
        },
        {
          id: 4,
          isSortable: false,
          label: 'created-at',
          input: 'created_at',
        },
      ],
    },
  },
  vacancy: {
    vacancy_count: {
      title: 'vacancy-count-title',
      subtitle: 'vacancy-count-description',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'vacancy-count-description',
      formula: 'vacancy-count-formula',
      generateReport: true,
      detailedView: true,
      dialogTitleKey: 'vacancy-count-title',
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'position',
          input: 'position_uuid',
        },
        {
          id: 2,
          isSortable: false,
          label: 'company',
          input: 'company_uuid',
        },
        {
          id: 3,
          isSortable: false,
          label: 'vacancy-status',
          input: 'vacancy_status',
        },
        {
          id: 4,
          isSortable: false,
          label: 'number-of-available',
          input: 'number_of_available',
        },
        {
          id: 5,
          isSortable: false,
          label: 'number-of-occupied',
          input: 'number_of_occupied',
        },
        {
          id: 6,
          isSortable: false,
          label: 'created-by',
          input: 'created_by',
        },
        {
          id: 7,
          isSortable: false,
          label: 'is-requested',
          component: (cellContent) => (
            <span>{t(`Analytics:${(!!cellContent.is_requested).toString()}`)}</span>
          ),
        },
        {
          id: 8,
          isSortable: false,
          label: 'requested-at',
          component: (cellContent) => (
            <span>
              {cellContent.requested_at
                ? moment(cellContent.requested_at)
                  .locale(i18next.language || 'en')
                  .format(GlobalDisplayDateTimeFormat)
                : ''}
            </span>
          ),
        },
        {
          id: 9,
          isSortable: false,
          label: 'is-posted',
          component: (cellContent) => (
            <span>{t(`Analytics:${(!!cellContent.is_posted).toString()}`)}</span>
          ),
        },
        {
          id: 10,
          isSortable: false,
          label: 'posted-at',
          component: (cellContent) => (
            <span>
              {cellContent.posted_at
                ? moment(cellContent.posted_at)
                  .locale(i18next.language || 'en')
                  .format(GlobalDisplayDateTimeFormat)
                : ''}
            </span>
          ),
        },
        {
          id: 11,
          isSortable: false,
          label: 'created-at',
          component: (cellContent) => (
            <span>
              {moment(cellContent.created_at)
                .locale(i18next.language || 'en')
                .format(GlobalDisplayDateTimeFormat)}
            </span>
          ),
        },
        {
          id: 12,
          isSortable: false,
          label: 'closed-at',
          component: (cellContent) => (
            <span>
              {cellContent.closed_at
                ? moment(cellContent.closed_at)
                  .locale(i18next.language || 'en')
                  .format(GlobalDisplayDateTimeFormat)
                : ''}
            </span>
          ),
        },
      ],
    },
    vacant_by_companies: {
      title: 'vacant-by-companies-title',
      subtitle: 'vacancy-count-description',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'vacant-by-companies-description',
      formula: 'vacant-by-companies-formula',
    },
    vacant_by_job_category: {
      title: 'vacant-by-job-category-title',
      subtitle: 'vacancy-count-description',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'vacant-by-job-category-description',
      formula: 'vacant-by-job-category-formula',
    },
  },
  custom_queries: {
    approved_candidates_by_job_titles: {
      title: 'approved-candidates-by-job-titles-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'approved-candidates-by-job-titles-description',
      formula: 'approved-candidates-by-job-titles-formula',
    },
    offers_by_company: {
      title: 'offers-by-company-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'offers-by-company-description',
      formula: 'offers-by-company-formula',
    },
    hired_candidates_by_job_titles: {
      title: 'hired-candidates-by-job-titles-title',
      subtitle: 'total-candidates',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'hired-candidates-by-job-titles-description',
      formula: 'hired-candidates-by-job-titles-formula',
    },
  },
  visa: {
    allocated_status: {
      title: 'visa-allocated-status-title',
      subtitle: 'allocated-status',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'visa-allocated-status-description',
      formula: 'visa-allocated-status-formula',
    },
    block_count: {
      title: 'visa-block-count-title',
      subtitle: 'block-count',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'visa-block-count-description',
      formula: 'visa-block-count-formula',
    },
    reserved_status: {
      title: 'visa-reserved-status-title',
      subtitle: 'reserved-status',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'visa-reserved-status-description',
      formula: 'visa-reserved-status-formula',
    },
    stages: {
      title: 'visa-stages-title',
      subtitle: 'stages',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'visa-stages-description',
      formula: 'visa-stages-formula',
    },
  },
  workflow_offers: {
    approved_offers_per_company: {
      title: 'approved-offers-per-company',
      subtitle: 'workflow-offers',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'approved-offers-per-company-description',
    },
    total_approved_rejected: {
      title: 'total-approved-rejected',
      subtitle: 'workflow-offers',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'total-approved-rejected-description',
    },
    rejected_offers_per_company: {
      title: 'rejected-offers-per-company',
      subtitle: 'workflow-offers',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'rejected-offers-per-company-description',
    },
    rejected_offers_per_position: {
      title: 'rejected-offers-per-position',
      subtitle: 'workflow-offers',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'rejected-offers-per-position-description',
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            label: 'name',
            component: (cellContent) => (
              <span>{`${
                cellContent?.user_name?.first_name?.[i18next.language]
                || cellContent?.user_name?.first_name?.en
                || ''
              } ${
                cellContent?.user_name?.last_name?.[i18next.language]
                || cellContent?.user_name?.last_name?.en
                || ''
              }`}</span>
            ),
          },
          {
            id: 2,
            isSortable: false,
            label: 'position-name',
            input: 'position_name',
          },
          {
            id: 3,
            isSortable: false,
            label: 'count',
            input: 'count',
          },
        ],
      },
    },
    approved_offers_per_position: {
      title: 'approved-offers-per-position',
      subtitle: 'workflow-offers',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'approved-offers-per-position-description',
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            label: 'name',
            component: (cellContent) => (
              <span>{`${
                cellContent?.user_name?.first_name?.[i18next.language]
                || cellContent?.user_name?.first_name?.en
                || ''
              } ${
                cellContent?.user_name?.last_name?.[i18next.language]
                || cellContent?.user_name?.last_name?.en
                || ''
              }`}</span>
            ),
          },
          {
            id: 2,
            isSortable: false,
            label: 'position-name',
            input: 'position_name',
          },
          {
            id: 3,
            isSortable: false,
            label: 'count',
            input: 'count',
          },
        ],
      },
    },
  },
  task_management: {
    task_count: {
      title: 'total-tasks-title',
      subtitle: 'total-tasks',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'total-tasks-description',
    },
    task_type: {
      title: 'task-type-title',
      subtitle: 'task-type-subtitle',
      chart_type: AnalyticsChartTypesEnum.DOUGHNUT.value,
      description: 'task-type-description',
    },
    task_status: {
      title: 'task-status-title',
      subtitle: 'task-status-subtitle',
      chart_type: AnalyticsChartTypesEnum.BAR.value,
      description: 'task-status-description',
    },
    created_by: {
      title: 'created-tasks-per-user',
      subtitle: 'created-tasks-user',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'created-tasks-per-user-description',
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            label: 'name',
            input: 'user_name',
          },
          {
            id: 2,
            isSortable: false,
            label: 'count',
            input: 'count',
          },
        ],
      },
    },
    assigned_by: {
      title: 'assigned-tasks-per-user',
      subtitle: 'assigned-tasks-user',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'assigned-tasks-per-user-description',
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            label: 'name',
            input: 'user_name',
          },
          {
            id: 2,
            isSortable: false,
            label: 'count',
            input: 'count',
          },
        ],
      },
    },
    avg_time_to_complete_all_tasks: {
      title: 'avg-time-to-complete-all-tasks-title',
      subtitle: 'avg-time-to-complete-all-tasks-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'avg-time-to-complete-all-tasks-description',
      small_size: true,
      generateReport: true,
      detailedView: true,
      // customDetailsSlug: 'avg_time_to_complete_all_tasks',
      dialogTitleKey: 'avg-time-to-complete-all-tasks-title-details',
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'id',
          input: 'slug',
        },
        {
          id: 2,
          isSortable: false,
          label: 'assigned-user',
          input: 'responsibility_uuid',
        },
        {
          id: 3,
          isSortable: false,
          label: 'type',
          input: 'type',
        },
        {
          id: 4,
          isSortable: false,
          label: 'assigned-user-type',
          input: 'responsibility_type',
        },
        {
          id: 5,
          isSortable: false,
          label: 'candidate-name',
          input: 'relation_uuid',
        },
        {
          id: 6,
          isSortable: false,
          label: 'title',
          input: 'title',
        },
        {
          id: 7,
          isSortable: false,
          label: 'status',
          input: 'status_uuid',
        },
        {
          id: 8,
          isSortable: false,
          label: 'start-date',
          input: 'start_date',
          isDate: true,
        },
        {
          id: 9,
          isSortable: false,
          label: 'due-date',
          input: 'due_date',
          isDate: true,
        },
        {
          id: 10,
          isSortable: false,
          label: 'created-by',
          input: 'created_by',
        },
        {
          id: 11,
          isSortable: false,
          label: 'updated-at',
          input: 'updated_at',
          isDate: true,
        },
        {
          id: 12,
          isSortable: false,
          label: 'created-at',
          input: 'created_at',
          isDate: true,
        },
      ],
    },
  },
  onboarding: {
    total_spaces_count: {
      title: 'total-spaces-title',
      subtitle: 'total-spaces',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'total-spaces-description',
    },
    total_folder_count: {
      title: 'total-folder-title',
      subtitle: 'total-folders',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'total-folders-description',
    },
    total_flow_count: {
      title: 'total-flows-title',
      subtitle: 'total-flows',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'total-flows-description',
    },
    total_member_count: {
      title: 'total-member-title',
      subtitle: 'total-member',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'total-member-description',
    },
    total_response_count: {
      title: 'total-response-title',
      subtitle: 'total-response',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'total-response-description',
    },
    total_variables_count: {
      title: 'total-variables-title',
      subtitle: 'total-variables',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'total-variables-description',
    },
    space_created_by: {
      title: 'created-spaces-per-user',
      subtitle: 'created-spaces-user',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'created-spaces-per-user-description',
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            label: 'name',
            input: 'user_name',
          },
          {
            id: 2,
            isSortable: false,
            label: 'count',
            input: 'count',
          },
        ],
      },
    },
    folder_created_by: {
      title: 'created-folders-per-user',
      subtitle: 'created-folders-user',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'created-folders-per-user-description',
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            label: 'name',
            input: 'user_name',
          },
          {
            id: 2,
            isSortable: false,
            label: 'count',
            input: 'count',
          },
        ],
      },
    },
    flow_created_by: {
      title: 'created-flows-per-user',
      subtitle: 'created-flows-user',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'created-flows-per-user-description',
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            label: 'name',
            input: 'user_name',
          },
          {
            id: 2,
            isSortable: false,
            label: 'count',
            input: 'count',
          },
        ],
      },
    },
    number_of_surveyed_candidates: {
      title: 'number-of-surveyed-candidates-title',
      subtitle: 'number-of-surveyed-candidates-subtitle',
      description: 'number-of-surveyed-candidates-description',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
    },
    number_of_completed_surveys: {
      title: 'number-of-completed-surveys-title',
      subtitle: 'number-of-completed-surveys-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'number-of-completed-surveys-description',
    },
    total_survey_count: {
      title: 'total-survey-count-title',
      subtitle: 'total-survey-count-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'total-survey-count-description',
    },
    avg_satisfaction_per_form: {
      title: 'avg-satisfaction-per-flow-title',
      subtitle: 'avg-satisfaction-per-flow-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'avg-satisfaction-per-flow-description',
    },
    avg_satisfaction_per_survey: {
      title: 'avg-satisfaction-per-survey-title',
      subtitle: 'avg-satisfaction-per-survey-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'avg-satisfaction-per-survey-description',
    },
    avg_satisfaction_per_candidate: {
      title: 'avg-satisfaction-per-candidate-title',
      subtitle: 'avg-satisfaction-per-candidate-subtitle',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'avg-satisfaction-per-candidate-description',
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            label: 'candidate-name',
            input: 'candidate_name',
          },
          {
            id:2,
            isSortable: false,
            label: 'avg-ratings',
            input: 'avg_rating',
          },
          {
            id: 3,
            isSortable: false,
            label: 'rating-range',
            input: 'rating_range',
            // component: (cellContent) => <span>{cellContent?.rating_range}%</span>,
          },
        ],
      },

    },
  },
  scorecard: {
    attached_scorecards_count: {
      title: 'attached-scorecards-title',
      subtitle: 'attached-scorecards-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'attached-scorecards-description',
    },
    scorecard_template_count: {
      title: 'scorecard-template-count-title',
      subtitle: 'scorecard-template-count-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'scorecard-template-count-description',
    },
    scorecards_decided_count: {
      title: 'scorecards-decided-count-title',
      subtitle: 'scorecards-decided-count-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'scorecards-decided-count-description',
    },
    scorecards_evaluated_count: {
      title: 'scorecards-evaluated-count-title',
      subtitle: 'scorecards-evaluated-count-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'scorecards-evaluated-count-description',
    },
    scorecards_sent_to_candidates_count: {
      title: 'scorecards-sent-to-candidates-count-title',
      subtitle: 'scorecards-sent-to-candidates-count-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'scorecards-sent-to-candidates-count-description',
    },
    completed_decisions_count: {
      title: 'completed-decisions-count-per-user-title',
      subtitle: 'completed-decisions-count-per-user-subtitle',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'completed-decisions-count-per-user-description',
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            label: 'name',
            input: 'user_name',
          },
          {
            id: 2,
            isSortable: false,
            label: 'count',
            input: 'count',
          },
        ],
      },
    },
    completed_evaluations_count: {
      title: 'completed-evaluations-count-per-user-title',
      subtitle: 'completed-evaluations-count-per-user-subtitle',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'completed-evaluations-count-per-user-description',
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            label: 'name',
            input: 'user_name',
          },
          {
            id: 2,
            isSortable: false,
            label: 'count',
            input: 'count',
          },
        ],
      },
    },
    decision_maker_assigned_count: {
      title: 'decision-maker-assigned-count-per-user-title',
      subtitle: 'decision-maker-assigned-count-per-user-subtitle',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'decision-maker-assigned-count-per-user-description',
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            label: 'name',
            input: 'user_name',
          },
          {
            id: 2,
            isSortable: false,
            label: 'count',
            input: 'count',
          },
        ],
      },
    },
    evaluator_assigned_count: {
      title: 'evaluator-assigned-count-per-user-title',
      subtitle: 'evaluator-assigned-count-per-user-subtitle',
      chart_type: AnalyticsChartTypesEnum.TABLE.value,
      description: 'evaluator-assigned-count-per-user-description',
      tableData: {
        autoPaginate: true,
        headerData: [
          {
            id: 1,
            isSortable: false,
            label: 'name',
            input: 'user_name',
          },
          {
            id: 2,
            isSortable: false,
            label: 'count',
            input: 'count',
          },
        ],
      },
    },
  },
  candidate_feedback: {
    avg_time_to_respond: {
      title: 'avg-time-to-respond-title',
      subtitle: 'avg-time-to-respond-subtitle',
      chart_type: AnalyticsChartTypesEnum.CARD.value,
      description: 'avg-time-to-respond-description',
      detailedView: true,
      generateReport: true,
      detailsTableColumns: [
        {
          id: 1,
          isSortable: false,
          label: 'average-time-to-respond',
          input: 'avg_time_to_respond',
        },
        {
          id: 3,
          isSortable: false,
          label: 'feedback-by-uuid',
          input: 'feedback_by_uuid',
        },
        {
          id: 4,
          isSortable: false,
          label: 'job-uuid',
          input: 'job_uuid',
        },
        {
          id: 5,
          isSortable: false,
          label: 'profiles-shared-with-user',
          input: 'profiles_shared_with_user',
        },
      ],
    },
  },
};
