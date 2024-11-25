export const PipelineQuickFilterTypesEnum = {
  CategoryUuid: {
    key: 'category_uuid',
    value: 'category',
  },
  JobType: {
    key: 'job_type',
    value: 'job-type',
  },
  DegreeType: {
    key: 'degree_type',
    value: 'degree-type',
  },
  Major: {
    key: 'major',
    value: 'job-major',
  },
  CareerLevel: {
    key: 'career_level',
    value: 'career-level',
  },
  Country: {
    key: 'country',
    value: 'country',
  },
  Industry: {
    key: 'industry',
    value: 'industry',
  },
  Nationality: {
    key: 'nationality',
    value: 'nationality',
  },
  NationalID: {
    key: 'national_id',
    value: 'national-id',
  },
  Gender: {
    key: 'gender',
    value: 'gender',
  },
  Skills: {
    key: 'skills',
    value: 'skills',
  },
  JobPosition: {
    key: 'job_position',
    value: 'job-position',
  },
  SourceType: {
    key: 'source_type',
    childKeys: ['source_uuid'],
    value: 'source-type',
  },
  SourceUuid: {
    key: 'source_uuid',
    parentKeys: ['source_type'],
    value: 'source',
  },
  CandidateName: {
    key: 'candidate_name',
    value: 'candidate-name',
  },
  ReferenceNumber: {
    key: 'reference_number',
    value: 'candidate-reference-number',
  },
  ApplicantNumber: {
    key: 'applicant_number',
    value: 'application-reference-number',
  },
  HasAssignee: {
    key: 'has_assignee',
    value: 'has-assignee',
  },
  AssignedUserUuid: {
    key: 'assigned_user_uuid',
    value: 'user-recruiter',
    type: 'checkbox',
  },
  AssignedEmployeeUuid: {
    key: 'assigned_employee_uuid',
    value: 'employee-recruiter',
  },
  LanguagesProficiency: {
    key: 'languages_proficiency',
    value: 'language-proficiency',
  },
  AssessmentTestStatus: {
    key: 'assessment_test_status',
    value: 'assessment-test-status',
  },
  VaAssessmentUuid: {
    key: 'va_assessment_uuid',
    value: 'video-assessment',
  },
  VaAssessmentStatus: {
    key: 'va_assessment_status',
    value: 'video-assessment-status',
  },
  QuestionnaireUuid: {
    key: 'questionnaire_uuid',
    value: 'questionnaire',
  },
  QuestionnaireStatus: {
    key: 'questionnaire_status',
    value: 'questionnaire-status',
  },
  FromHeight: {
    key: 'from_height',
    value: 'from-height',
  },
  ToHeight: {
    key: 'to_height',
    value: 'to-height',
  },
  FromWeight: {
    key: 'from_weight',
    value: 'from-weight',
  },
  ToWeight: {
    key: 'to_weight',
    value: 'to-weight',
    type: 'checkbox',
  },
  Score: {
    key: 'score',
    value: 'score',
  },
  YearsOfExperience: {
    key: 'years_of_experience',
    value: 'years-of-experience',
  },
  CandidateType: {
    key: 'candidate_type',
    value: 'candidate-type',
  },
  Language: {
    key: 'language',
    value: 'language-proficiency',
  },
  AcademicCertificate: {
    key: 'academic_certificate',
    value: 'dr-certificates',
  },
  InterestedPositionTitle: {
    key: 'interested_position_title',
    value: 'position-title',
  },
  RightToWork: {
    key: 'right_to_work',
    value: 'right-to-work',
  },
  WillingToTravel: {
    key: 'willing_to_travel',
    value: 'willing-to-travel',
  },
  WillingToRelocate: {
    key: 'willing_to_relocate',
    value: 'willing-to-relocate',
  },
  OwnsACar: {
    key: 'owns_a_car',
    value: 'owns-a-car',
  },
  CandidateApplied: {
    key: 'candidate_applied',
    childKeys: ['date_filter_type'],
    value: 'candidate-applied',
  },
  CandidateRegistered: {
    key: 'candidate_registered',
    childKeys: ['date_filter_type'],
    value: 'candidate-registered',
  },
  DateFilterType: {
    key: 'date_filter_type',
    parentKeys: ['candidate_applied', 'candidate_registered'],
    childKeys: ['from_date', 'to_date'],
    value: 'date-range-filter',
  },
  FromDate: {
    key: 'from_date',
    parentKeys: ['date_filter_type'],
    value: 'from-date',
  },
  ToDate: {
    key: 'to_date',
    parentKeys: ['date_filter_type'],
    value: 'to-date',
  },
  IsCompletedProfile: {
    key: 'is_completed_profile',
    value: 'is-completed-profile',
  },
  UncompletedProfile: {
    key: 'un_completed_profile',
    value: 'un-completed-profile',
  },
  FromAge: {
    key: 'age_lte',
    value: 'age_lte',
  },
  ToAge: {
    key: 'age_gte',
    value: 'age_gte',
  },
};
