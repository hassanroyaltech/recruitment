export const sources_list = [
  {
    source_key: 303,
    source_value: 'Candidate and actions',
    source_operator_groups: [
      {
        key: 201,
        value: 'Stages',
        operators: {
          101: 'Is in',
          102: 'Is not in',
        },
      },
      {
        key: 202,
        value: 'Offers',
        operators: {
          103: 'Has completed',
          104: 'Has not completed',
        },
      },
      {
        key: 203,
        value: 'Questionnaire',
        operators: {
          103: 'Has completed',
          104: 'Has not completed',
        },
      },
      {
        key: 204,
        value: 'Video assessment',
        operators: {
          103: 'Has completed',
          104: 'Has not completed',
        },
      },
      {
        key: 206,
        value: 'Profile',
        operators: {
          112: 'Has',
        },
      },
    ],
  },
];
export const actions_list = [
  {
    key: 401,
    value: 'Create task',
    validations: ['title', 'type_uuid', 'has_notification'],
  },
  {
    key: 402,
    value: 'Move candidate to',
    validations: ['stage_uuid'],
  },
];

export const filters_list = {
  main_operators: {
    107: 'And',
    108: 'Or',
  },
  filter_groups: [
    {
      key: 507,
      value: 'Profile',
      properties: {
        'candidate.ai_matching': {
          value: 'A.I. Matching',
          options: {
            type: 'string',
          },
        },
      },
      operators: {
        113: 'Greater than',
        114: 'Less than',
        115: 'Equal to',
        116: 'Not equal',
        117: 'In between',
      },
    },
    {
      key: 501,
      value: 'Candidate',
      properties: {
        'candidate.gender': {
          value: 'Gender',
          options: {
            type: 'dropdown',
            has_access: 'true',
            end_point:
              'https://pdew4adapiv1.elevatustesting.xyz/api/v1/service/gender',
            method: 'get',
          },
        },
        'candidate.nationality': {
          value: 'Nationality',
          options: {
            type: 'dropdown',
            has_access: 'true',
            end_point:
              'https://pdew4adapiv1.elevatustesting.xyz/api/v1/service/nationality',
            method: 'get',
          },
        },
        'candidate.experience.career_level': {
          value: 'Career Level',
          options: {
            type: 'dropdown',
            has_access: 'true',
            end_point:
              'https://pdew4adapiv1.elevatustesting.xyz/api/v1/service/career',
            method: 'get',
          },
        },
        'candidate.extra.interested_position_title': {
          value: 'Position title',
          options: {
            type: 'string',
          },
        },
      },
      operators: {
        110: 'Is',
        111: 'Is not',
      },
    },
  ],
};

export const view_api_response = {
  uuid: '6a08afe5-e62b-45d1-8ab7-5159f25eff15',
  pipeline_uuid: 'c4ce7b67-6f48-4070-b358-0738f84f0cb6',
  tasks: [
    {
      uuid: '7d86a896-445d-4769-97a5-264bb62b0de7',
      pipeline_template_uuid: '6a08afe5-e62b-45d1-8ab7-5159f25eff15',
      source: 303,
      source_group: 201,
      source_operator: 101,
      source_value: {
        uuid: '62f3655d-dffb-4c2e-af42-b38e46e01aa0',
        title: 'Source value title',
      },
      filters: [
        {
          main_operator: 107,
          filter_key: 'candidate.gender',
          filter_group: 501,
          filter_operator: 110,
          filter_value: {
            uuid: 'e9677c3e-9637-11ed-a1eb-0242ac120002',
            name: { en: 'Female' },
          },
        },
      ],
      action: 402,
      action_data: {
        stage_uuid: {
          uuid: '3340e844-1d7b-4350-b8e8-ecc3282b5cb8',
          title: 'Applied Stage',
        },
      },
      parent_uuid: null,
      created_by: '308c0667-b46d-4df5-9b6d-032347e377d1',
      created_at: '2023-01-23T12:03:00.370000Z',
      updated_at: '2023-01-23T12:03:00.370000Z',
    },
    {
      uuid: 'fdfsfefe-445d-4769-97a5-264bb62b0de7',
      pipeline_template_uuid: '6a08afe5-e62b-45d1-8ab7-5159f25eff15',
      source: 303,
      source_group: 201,
      source_operator: 101,
      source_value: {
        uuid: '62f3655d-dffb-4c2e-af42-b38e46e01aa0',
        title: 'Source value title',
      },
      filters: [],
      action: 401,
      action_data: {
        title: 'Task title',
        type_uuid: {
          uuid: 'add valid type uuid here',
          name: { en: 'Task type' },
        },
        has_notification: true,
      },
      parent_uuid: '7d86a896-445d-4769-97a5-264bb62b0de7',
      created_by: '308c0667-b46d-4df5-9b6d-032347e377d1',
      created_at: '2023-01-23T12:03:00.370000Z',
      updated_at: '2023-01-23T12:03:00.370000Z',
    },
  ],
  title: 'Dummy title',
  is_published: false,
  created_by: '308c0667-b46d-4df5-9b6d-032347e377d1',
  created_at: '2023-01-23T12:01:38.872000Z',
  updated_at: '2023-01-23T12:01:38.872000Z',
};

// export const view_api_response = {
//   uuid: '6a08afe5-e62b-45d1-8ab7-5159f25eff15',
//   pipeline_uuid: 'c4ce7b67-6f48-4070-b358-0738f84f0cb6',
//   tasks: [],
//   title: 'Dummy title',
//   is_published: false,
//   created_by: '308c0667-b46d-4df5-9b6d-032347e377d1',
//   created_at: '2023-01-23T12:01:38.872000Z',
//   updated_at: '2023-01-23T12:01:38.872000Z',
// };

export const all_pipeline_tasks_res = {
  paginate: {
    page: 1,
    limit: 10,
    total: 3,
    lastPage: 1,
  },
  message: 'Data is retrieved successfully',
  results: [
    {
      uuid: '6a08afe5-e62b-45d1-8ab7-5159f25eff15',
      pipeline_uuid: 'c4ce7b67-6f48-4070-b358-0738f84f0cb6',
      tasks: [
        {
          uuid: '7d86a896-445d-4769-97a5-264bb62b0de7',
          pipeline_template_uuid: '6a08afe5-e62b-45d1-8ab7-5159f25eff15',
          source: 303,
          source_group: 201,
          source_operator: 101,
          source_value: {
            uuid: '62f3655d-dffb-4c2e-af42-b38e46e01aa0',
            title: 'Source value title',
          },
          filters: [
            {
              main_operator: 107,
              filter_key: 'candidate.gender',
              filter_group: 501,
              filter_operator: 110,
              filter_value: {
                uuid: 'e9677c3e-9637-11ed-a1eb-0242ac120002',
                name: { en: 'Female' },
              },
            },
          ],
          action: 402,
          action_data: {
            stage_uuid: {
              uuid: '3340e844-1d7b-4350-b8e8-ecc3282b5cb8',
              title: 'Applied Stage',
            },
          },
          parent_uuid: null,
          created_by: '308c0667-b46d-4df5-9b6d-032347e377d1',
          created_at: '2023-01-23T12:03:00.370000Z',
          updated_at: '2023-01-23T12:03:00.370000Z',
        },
      ],
      title: 'Dummy title',
      is_published: false,
      created_by: '308c0667-b46d-4df5-9b6d-032347e377d1',
      created_at: '2023-01-23T12:01:38.872000Z',
      updated_at: '2023-01-23T12:01:38.872000Z',
    },
    {
      uuid: '05935c86-c976-4202-83af-e7fce08a9dea',
      pipeline_uuid: 'c4ce7b67-6f48-4070-b358-0738f84f0cb6',
      tasks: [
        {
          uuid: '7d86a896-445d-4769-97a5-264bb62b0de7',
          pipeline_template_uuid: '6a08afe5-e62b-45d1-8ab7-5159f25eff15',
          source: 303,
          source_group: 201,
          source_operator: 101,
          source_value: {
            uuid: '62f3655d-dffb-4c2e-af42-b38e46e01aa0',
            title: 'Source value title',
          },
          filters: [
            {
              main_operator: 107,
              filter_key: 'candidate.gender',
              filter_group: 501,
              filter_operator: 110,
              filter_value: {
                uuid: 'e9677c3e-9637-11ed-a1eb-0242ac120002',
                name: { en: 'Female' },
              },
            },
          ],
          action: 402,
          action_data: {
            stage_uuid: {
              uuid: '3340e844-1d7b-4350-b8e8-ecc3282b5cb8',
              title: 'Applied Stage',
            },
          },
          parent_uuid: null,
          created_by: '308c0667-b46d-4df5-9b6d-032347e377d1',
          created_at: '2023-01-23T12:03:00.370000Z',
          updated_at: '2023-01-23T12:03:00.370000Z',
        },
        {
          uuid: '7d86a896-445d-4769-97a5-264bb62b0de7',
          pipeline_template_uuid: '6a08afe5-e62b-45d1-8ab7-5159f25eff15',
          source: 303,
          source_group: 201,
          source_operator: 101,
          source_value: {
            uuid: '62f3655d-dffb-4c2e-af42-b38e46e01aa0',
            title: 'Source value title',
          },
          filters: [],
          action: 401,
          action_data: {
            title: 'Task title',
            type_uuid: {
              uuid: 'add valid type uuid here',
              name: { en: 'Task type' },
            },
            has_notification: true,
          },
          parent_uuid: '7d86a896-445d-4769-97a5-264bb62b0de7',
          created_by: '308c0667-b46d-4df5-9b6d-032347e377d1',
          created_at: '2023-01-23T12:03:00.370000Z',
          updated_at: '2023-01-23T12:03:00.370000Z',
        },
      ],
      title: 'Dummy title',
      is_published: false,
      created_by: '308c0667-b46d-4df5-9b6d-032347e377d1',
      created_at: '2023-01-23T12:11:32.880000Z',
      updated_at: '2023-01-23T12:14:37.495000Z',
    },
    {
      uuid: '6a08afe5-e62b-45d1-8ab7-5159f25eff15',
      pipeline_uuid: 'c4ce7b67-6f48-4070-b358-0738f84f0cb6',
      tasks: [],
      title: 'Dummy title',
      is_published: false,
      created_by: '308c0667-b46d-4df5-9b6d-032347e377d1',
      created_at: '2023-01-23T12:01:38.872000Z',
      updated_at: '2023-01-23T12:01:38.872000Z',
    },
  ],
};

export const pipeline_tasks_library_res = [
  {
    source: {
      title: 'candidate',
      operator: {
        title: 'is in',
      },
      source_value: {
        title: 'Applied stage',
      },
    },
    filters: [
      {
        main_operator: {
          title: 'and',
          value: 107,
        },
        filter_key: {
          title: 'Gender',
          value: 'candidate.gender',
        },
        filter_group: 501,
        filter_operator: { title: 'is', value: 110 },
        filter_value: {
          title: 'Male',
          value: 'e9677c3e-9637-11ed-a1eb-0242ac120002',
        },
      },
      {
        main_operator: {
          title: 'or',
          value: 105,
        },
        filter_key: {
          title: 'Nationality',
          value: 'candidate.nationality',
        },
        filter_group: 501,
        filter_operator: { title: 'is not', value: 109 },
        filter_value: {
          title: 'Jordanian',
          value: 'fd5f4d5-9637-11ed-a1eb-0242ac120002',
        },
      },
    ],
    action: {
      value: 401,
      title: 'Create a task',
      action_data: {
        title: 'Dummy task',
        type: {
          uuid: '167a9d82-9638-11ed-a1eb-0242ac120002',
          title: 'Type',
        },
        has_notification: false,
      },
    },
  },
  {
    source: {
      title: 'candidate',
      operator: {
        title: 'is in',
      },
      source_value: {
        title: 'Applied stage',
      },
    },
    filters: [
      {
        main_operator: {
          title: 'and',
          value: 107,
        },
        filter_key: {
          title: 'Gender',
          value: 'candidate.gender',
        },
        filter_group: 501,
        filter_operator: { title: 'is', value: 110 },
        filter_value: {
          title: 'Male',
          value: 'e9677c3e-9637-11ed-a1eb-0242ac120002',
        },
      },
      {
        main_operator: {
          title: 'or',
          value: 105,
        },
        filter_key: {
          title: 'Nationality',
          value: 'candidate.nationality',
        },
        filter_group: 501,
        filter_operator: { title: 'is not', value: 109 },
        filter_value: {
          title: 'Jordanian',
          value: 'fd5f4d5-9637-11ed-a1eb-0242ac120002',
        },
      },
    ],
    action: {
      value: 401,
      title: 'Create a task',
      action_data: {
        title: 'Dummy task',
        type: {
          uuid: '167a9d82-9638-11ed-a1eb-0242ac120002',
          title: 'Type',
        },
        has_notification: false,
      },
    },
  },
  {
    source: {
      title: 'candidate',
      operator: {
        title: 'is in',
      },
      source_value: {
        title: 'Applied stage',
      },
    },
    filters: [
      {
        main_operator: {
          title: 'and',
          value: 107,
        },
        filter_key: {
          title: 'Gender',
          value: 'candidate.gender',
        },
        filter_group: 501,
        filter_operator: { title: 'is', value: 110 },
        filter_value: {
          title: 'Male',
          value: 'e9677c3e-9637-11ed-a1eb-0242ac120002',
        },
      },
      {
        main_operator: {
          title: 'or',
          value: 105,
        },
        filter_key: {
          title: 'Nationality',
          value: 'candidate.nationality',
        },
        filter_group: 501,
        filter_operator: { title: 'is not', value: 109 },
        filter_value: {
          title: 'Jordanian',
          value: 'fd5f4d5-9637-11ed-a1eb-0242ac120002',
        },
      },
    ],
    action: {
      value: 401,
      title: 'Create a task',
      action_data: {
        title: 'Dummy task',
        type: {
          uuid: '167a9d82-9638-11ed-a1eb-0242ac120002',
          title: 'Type',
        },
        has_notification: false,
      },
    },
  },
  {
    source: {
      title: 'candidate',
      operator: {
        title: 'is in',
      },
      source_value: {
        title: 'Applied stage',
      },
    },
    filters: [
      {
        main_operator: {
          title: 'and',
          value: 107,
        },
        filter_key: {
          title: 'Gender',
          value: 'candidate.gender',
        },
        filter_group: 501,
        filter_operator: { title: 'is', value: 110 },
        filter_value: {
          title: 'Male',
          value: 'e9677c3e-9637-11ed-a1eb-0242ac120002',
        },
      },
      {
        main_operator: {
          title: 'or',
          value: 105,
        },
        filter_key: {
          title: 'Nationality',
          value: 'candidate.nationality',
        },
        filter_group: 501,
        filter_operator: { title: 'is not', value: 109 },
        filter_value: {
          title: 'Jordanian',
          value: 'fd5f4d5-9637-11ed-a1eb-0242ac120002',
        },
      },
    ],
    action: {
      value: 401,
      title: 'Create a task',
      action_data: {
        title: 'Dummy task',
        type: {
          uuid: '167a9d82-9638-11ed-a1eb-0242ac120002',
          title: 'Type',
        },
        has_notification: false,
      },
    },
  },
  {
    source: {
      title: 'candidate',
      operator: {
        title: 'is in',
      },
      source_value: {
        title: 'Applied stage',
      },
    },
    filters: [
      {
        main_operator: {
          title: 'and',
          value: 107,
        },
        filter_key: {
          title: 'Gender',
          value: 'candidate.gender',
        },
        filter_group: 501,
        filter_operator: { title: 'is', value: 110 },
        filter_value: {
          title: 'Male',
          value: 'e9677c3e-9637-11ed-a1eb-0242ac120002',
        },
      },
      {
        main_operator: {
          title: 'or',
          value: 105,
        },
        filter_key: {
          title: 'Nationality',
          value: 'candidate.nationality',
        },
        filter_group: 501,
        filter_operator: { title: 'is not', value: 109 },
        filter_value: {
          title: 'Jordanian',
          value: 'fd5f4d5-9637-11ed-a1eb-0242ac120002',
        },
      },
    ],
    action: {
      value: 401,
      title: 'Create a task',
      action_data: {
        title: 'Dummy task',
        type: {
          uuid: '167a9d82-9638-11ed-a1eb-0242ac120002',
          title: 'Type',
        },
        has_notification: false,
      },
    },
  },
  {
    source: {
      title: 'candidate',
      operator: {
        title: 'is in',
      },
      source_value: {
        title: 'Applied stage',
      },
    },
    filters: [
      {
        main_operator: {
          title: 'and',
          value: 107,
        },
        filter_key: {
          title: 'Gender',
          value: 'candidate.gender',
        },
        filter_group: 501,
        filter_operator: { title: 'is', value: 110 },
        filter_value: {
          title: 'Male',
          value: 'e9677c3e-9637-11ed-a1eb-0242ac120002',
        },
      },
      {
        main_operator: {
          title: 'or',
          value: 105,
        },
        filter_key: {
          title: 'Nationality',
          value: 'candidate.nationality',
        },
        filter_group: 501,
        filter_operator: { title: 'is not', value: 109 },
        filter_value: {
          title: 'Jordanian',
          value: 'fd5f4d5-9637-11ed-a1eb-0242ac120002',
        },
      },
    ],
    action: {
      value: 401,
      title: 'Create a task',
      action_data: {
        title: 'Dummy task',
        type: {
          uuid: '167a9d82-9638-11ed-a1eb-0242ac120002',
          title: 'Type',
        },
        has_notification: false,
      },
    },
  },
  {
    source: {
      title: 'candidate',
      operator: {
        title: 'is in',
      },
      source_value: {
        title: 'Applied stage',
      },
    },
    filters: [
      {
        main_operator: {
          title: 'and',
          value: 107,
        },
        filter_key: {
          title: 'Gender',
          value: 'candidate.gender',
        },
        filter_group: 501,
        filter_operator: { title: 'is', value: 110 },
        filter_value: {
          title: 'Male',
          value: 'e9677c3e-9637-11ed-a1eb-0242ac120002',
        },
      },
      {
        main_operator: {
          title: 'or',
          value: 105,
        },
        filter_key: {
          title: 'Nationality',
          value: 'candidate.nationality',
        },
        filter_group: 501,
        filter_operator: { title: 'is not', value: 109 },
        filter_value: {
          title: 'Jordanian',
          value: 'fd5f4d5-9637-11ed-a1eb-0242ac120002',
        },
      },
    ],
    action: {
      value: 401,
      title: 'Create a task',
      action_data: {
        title: 'Dummy task',
        type: {
          uuid: '167a9d82-9638-11ed-a1eb-0242ac120002',
          title: 'Type',
        },
        has_notification: false,
      },
    },
  },
];
