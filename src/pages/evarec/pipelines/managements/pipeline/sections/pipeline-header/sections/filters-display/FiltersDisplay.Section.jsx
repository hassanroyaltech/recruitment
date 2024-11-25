import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import i18next from 'i18next';
import { CustomCandidatesFilterTagsEnum } from '../../../../../../../../../enums/Pages/CandidateFilterTags.Enum';
import { useTranslation } from 'react-i18next';
import {
  PagesFilterInitValue,
  ShallowEqual,
} from '../../../../../../../../../helpers';

export const FiltersDisplaySection = ({
  filters,
  onFiltersResetClicked,
  onFiltersChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="filters-display-section">
      {(!ShallowEqual(filters.filters, PagesFilterInitValue)
        || filters.tags.filter(Boolean).length > 0) && (
        <ButtonBase
          className="btns btns-transparent mx-0"
          onClick={onFiltersResetClicked}
        >
          <span>{t(`${translationPath}reset-filters`)}</span>
        </ButtonBase>
      )}

      {[
        'job_type',
        'degree_type',
        'career_level',
        'country',
        'industry',
        'language',
        'major',
        'nationality',
        'assigned_user_uuid',
        'assigned_employee_uuid',
        'va_assessment_uuid',
        'questionnaire_uuid',
      ].map((chip) =>
        filters.filters?.[chip]?.map((subItem, i) => (
          <ButtonBase
            key={`${subItem}Key${i + 1}`}
            className="btns theme-transparent"
            onClick={() => {
              onFiltersChanged({
                ...filters,
                filters: {
                  ...filters.filters,
                  [chip]: filters.filters?.[chip]?.filter((item) => {
                    if (chip === 'questionnaire_uuid')
                      return (
                        item.job_questionnaire_uuid
                        !== subItem.job_questionnaire_uuid
                      );
                    else return item.uuid !== subItem.uuid;
                  }),
                },
              });
            }}
          >
            <span>
              {chip === 'assigned_employee_uuid'
                && `${
                  subItem?.first_name
                  && (subItem?.first_name[i18next.language] || subItem?.first_name.en)
                }${
                  subItem?.last_name
                  && ` ${subItem?.last_name[i18next.language] || subItem?.last_name.en}`
                }`}
              {chip === 'assigned_user_uuid'
                && `${
                  subItem?.first_name
                  && (subItem?.first_name[i18next.language] || subItem?.first_name.en)
                }${
                  subItem?.last_name
                  && ` ${subItem?.last_name[i18next.language] || subItem?.last_name.en}`
                }`}
              {(chip === 'va_assessment_uuid' || chip === 'questionnaire_uuid')
                && subItem?.title}
              {chip !== 'assigned_employee_uuid'
                && chip !== 'assigned_user_uuid'
                && chip !== 'va_assessment_uuid'
                && (subItem?.name?.[i18next.language] || subItem?.name?.en)}
            </span>
            <span className="fas fa-times px-2" />
          </ButtonBase>
        )),
      )}
      {filters.filters?.national_id && (
        <ButtonBase
          className="btns theme-transparent"
          onClick={() => {
            onFiltersChanged({
              ...filters,
              page: 1,
              filters: {
                ...filters?.filters,
                national_id: null,
              },
            });
          }}
        >
          <span>{filters.filters?.national_id}</span>
          <span className="fas fa-times px-2" />
        </ButtonBase>
      )}
      {filters.filters?.candidate_name && (
        <ButtonBase
          className="btns theme-transparent"
          onClick={() => {
            onFiltersChanged({
              ...filters,
              page: 1,
              filters: {
                ...filters?.filters,
                candidate_name: null,
              },
            });
          }}
        >
          <span>{filters.filters?.candidate_name}</span>
          <span className="fas fa-times px-2" />
        </ButtonBase>
      )}
      {filters.filters?.applicant_number && (
        <ButtonBase
          className="btns theme-transparent"
          onClick={() => {
            onFiltersChanged({
              ...filters,
              page: 1,
              filters: {
                ...filters?.filters,
                applicant_number: null,
              },
            });
          }}
        >
          <span>{filters.filters?.applicant_number}</span>
          <span className="fas fa-times px-2" />
        </ButtonBase>
      )}
      {filters.filters?.reference_number && (
        <ButtonBase
          className="btns theme-transparent"
          onClick={() => {
            onFiltersChanged({
              ...filters,
              page: 1,
              filters: {
                ...filters?.filters,
                reference_number: null,
              },
            });
          }}
        >
          <span>{filters.filters?.reference_number}</span>
          <span className="fas fa-times px-2" />
        </ButtonBase>
      )}
      {['va_assessment_status', 'questionnaire_status'].map((chip, i) =>
        filters.filters?.[chip]?.value ? (
          <ButtonBase
            key={`${chip}Key${i + 1}`}
            className="btns theme-transparent"
            onClick={() => {
              onFiltersChanged({
                ...filters,
                page: 1,
                filters: {
                  ...filters.filters,
                  [chip]: null,
                },
              });
            }}
          >
            {t(`${translationPath}${chip.replaceAll('_', '-')}`)}:
            <span className="px-1">{filters.filters?.[chip]?.value}</span>
            <span className="fas fa-times px-2" />
          </ButtonBase>
        ) : null,
      )}
      {filters.filters?.gender && Object.keys(filters.filters?.gender)?.length ? (
        <ButtonBase
          className="btns theme-transparent"
          onClick={() => {
            onFiltersChanged({
              ...filters,
              page: 1,
              filters: {
                ...filters.filters,
                gender: '',
              },
            });
          }}
        >
          <span>
            {filters.filters?.gender.name?.[i18next.language]
              || filters.filters?.gender.name?.en}
          </span>
          <span className="fas fa-times px-2" />
        </ButtonBase>
      ) : null}
      {(filters.filters?.from_height || filters.filters?.to_height) && (
        <ButtonBase
          className="btns theme-transparent"
          onClick={() => {
            onFiltersChanged({
              ...filters,
              filters: {
                ...filters?.filters,
                from_height: null,
                to_height: null,
              },
            });
          }}
        >
          <span>
            {t(`${translationPath}height`)}
            {(filters.filters?.from_height
              || filters.filters?.from_height === 0) && (
              <span className="mx-2">{`${t(`${translationPath}from`)}: ${
                filters.filters?.from_height
              }`}</span>
            )}
            {filters.filters?.from_height && filters.filters?.to_height && (
              <span>-</span>
            )}
            {(filters.filters?.to_height || filters.filters?.to_height === 0) && (
              <span className="mx-2">{`${t(`${translationPath}to`)}: ${
                filters.filters?.to_height
              }`}</span>
            )}
          </span>
          <span className="fas fa-times px-2" />
        </ButtonBase>
      )}
      {(filters.filters?.from_weight || filters.filters?.to_weight) && (
        <ButtonBase
          className="btns theme-transparent"
          onClick={() => {
            onFiltersChanged({
              ...filters,
              filters: {
                ...filters?.filters,
                from_weight: null,
                to_weight: null,
              },
            });
          }}
        >
          <span>
            {t(`${translationPath}weight`)}
            {(filters.filters?.from_weight
              || filters.filters?.from_weight === 0) && (
              <span className="mx-2">{`${t(`${translationPath}from`)}: ${
                filters.filters?.from_weight
              }`}</span>
            )}
            {filters.filters?.from_weight && filters.filters?.to_weight && (
              <span>-</span>
            )}
            {(filters.filters?.to_weight || filters.filters?.to_weight === 0) && (
              <span className="mx-2">{`${t(`${translationPath}to`)}: ${
                filters.filters?.to_weight
              }`}</span>
            )}
          </span>
          <span className="fas fa-times px-2" />
        </ButtonBase>
      )}
      {(filters.filters?.age_lte || filters.filters?.age_gte) && (
        <ButtonBase
          className="btns theme-transparent"
          onClick={() => {
            onFiltersChanged({
              ...filters,
              filters: {
                ...filters?.filters,
                age_lte: null,
                age_gte: null,
              },
            });
          }}
        >
          <span>
            {(filters.filters?.age_lte
              || filters.filters?.age_lte === 0) && (
              <span className="mx-2">{`${t(`${translationPath}from-age`)}: ${
                filters.filters?.age_lte
              }`}</span>
            )}
            {filters.filters?.age_lte && filters.filters?.age_lte && (
              <span>-</span>
            )}
            {(filters.filters?.age_gte || filters.filters?.age_gte === 0) && (
              <span className="mx-2">{`${t(`${translationPath}to-age`)}: ${
                filters.filters?.age_gte
              }`}</span>
            )}
          </span>
          <span className="fas fa-times px-2" />
        </ButtonBase>
      )}

      {filters.filters?.source_type
      && Object.keys(filters.filters?.source_type)?.length ? (
          <ButtonBase
            className="btns theme-transparent"
            onClick={() => {
              onFiltersChanged({
                ...filters,
                page: 1,
                filters: {
                  ...filters.filters,
                  source_type: null,
                  source: null,
                },
              });
            }}
          >
            <span>
              {filters.filters?.source_type.value
              || filters.filters?.source_type.value}
            </span>
            <span className="fas fa-times px-2" />
          </ButtonBase>
        ) : null}

      {filters.filters?.source && Object.keys(filters.filters?.source)?.length ? (
        <ButtonBase
          className="btns theme-transparent"
          onClick={() => {
            onFiltersChanged({
              ...filters,
              page: 1,
              filters: {
                ...filters.filters,
                source: null,
              },
            });
          }}
        >
          <span>
            {`${
              (filters.filters?.source.first_name
                && ((typeof filters.filters?.source.first_name === 'string'
                  && filters.filters?.source.first_name)
                  || (typeof filters.filters?.source.first_name !== 'string'
                    && (filters.filters?.source.first_name[i18next.language]
                      || filters.filters?.source.first_name.en))))
              || ''
            }${
              (filters.filters?.source.last_name
                && ((typeof filters.filters?.source.last_name === 'string'
                  && ` ${filters.filters?.source.last_name}`)
                  || (typeof filters.filters?.source.last_name !== 'string'
                    && ` ${
                      filters.filters?.source.last_name[i18next.language]
                      || filters.filters?.source.last_name.en
                    }`)))
              || ''
            }` || 'N/A'}
          </span>
          <span className="fas fa-times px-2" />
        </ButtonBase>
      ) : null}

      {['skills', 'job_position', 'query'].map((chip) =>
        filters.filters?.[chip]?.map((subItem, i) => (
          <ButtonBase
            key={`${subItem}Key${i + 1}`}
            className="btns theme-transparent"
            onClick={() => {
              onFiltersChanged({
                ...filters,
                filters: {
                  ...filters.filters,
                  [chip]: filters.filters?.[chip]?.filter(
                    (item) => item !== subItem,
                  ),
                },
              });
            }}
          >
            <span>{subItem}</span>
            <span className="fas fa-times px-2" />
          </ButtonBase>
        )),
      )}
      {/* ['right_to_work', 'willing_to_travel', 'willing_to_relocate', 'owns_a_car', 'is_completed_profile', 'un_completed_profile'] */}
      {filters.filters?.checkboxFilters
      && Object.keys(filters.filters?.checkboxFilters)?.length
        ? Object.keys(filters.filters?.checkboxFilters)
          ?.filter((item) => filters.filters?.checkboxFilters?.[item])
          .map((chip, i) => (
            <ButtonBase
              key={`${chip}Key${i + 1}`}
              className="btns theme-transparent"
              onClick={() => {
                const copyPrevFilter = { ...filters?.filters?.checkboxFilters };
                delete copyPrevFilter?.[chip];
                onFiltersChanged({
                  ...filters,
                  filters: {
                    ...filters.filters,
                    checkboxFilters: copyPrevFilter,
                  },
                });
              }}
            >
              <span>{t(`${translationPath}${chip.replaceAll('_', '-')}`)}</span>
              <span className="fas fa-times px-2" />
            </ButtonBase>
          ))
        : null}

      {/* Tags */}
      {filters.tags
        ?.filter((item) => item?.key)
        .map((item, i) => (
          <ButtonBase
            key={`${item}Key${i + 1}`}
            className="btns theme-transparent"
            onClick={() => {
              onFiltersChanged({
                ...filters,
                tags: filters.tags?.filter((tag) => tag?.key !== item?.key),
              });
            }}
          >
            <span>
              {item?.value
                ?.map((val) => {
                  if (item.key === CustomCandidatesFilterTagsEnum.user.key)
                    return `${
                      val.first_name
                      && (val.first_name[i18next.language] || val.first_name.en)
                    }${
                      val.last_name
                      && ` ${val.last_name[i18next.language] || val.last_name.en}`
                    }`;
                  else if (item.key === CustomCandidatesFilterTagsEnum.employee.key)
                    return `${
                      val.first_name
                      && (val.first_name[i18next.language] || val.first_name.en)
                    }${
                      val.last_name
                      && ` ${val.last_name[i18next.language] || val.last_name.en}`
                    }${
                      (!val.has_access && ` ${t('Shared:dont-have-permissions')}`)
                      || ''
                    }`;
                  return val?.name?.[i18next.language] || val?.name?.en;
                })
                .join(', ')}
            </span>
            <span className="fas fa-times px-2" />
          </ButtonBase>
        ))}
      {filters.filters?.candidate_property
        && filters.filters?.candidate_property.map(
          (item, index) =>
            (!Object.hasOwn(item, 'lookup')
              && item.value.map((element, elementIndex) => (
                <ButtonBase
                  className="btns theme-transparent"
                  key={`${item.uuid}-${element}`}
                  onClick={() => {
                    const copyPrevFilter = { ...filters };
                    if (
                      Array.isArray(
                        copyPrevFilter.filters.candidate_property[index].value,
                      )
                    )
                      copyPrevFilter.filters.candidate_property[index].value.splice(
                        elementIndex,
                        1,
                      );
                    onFiltersChanged({
                      ...copyPrevFilter,
                      page: 1,
                      filters: {
                        ...copyPrevFilter.filters,
                        candidate_property:
                          copyPrevFilter.filters.candidate_property,
                      },
                    });
                  }}
                >
                  <span>{element}</span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              )))
            || item.lookup.map((element, elementIndex) => (
              <ButtonBase
                className="btns theme-transparent"
                key={`${item.uuid}-${element.uuid}`}
                onClick={() => {
                  const copyPrevFilter = { ...filters };
                  if (
                    Array.isArray(
                      copyPrevFilter.filters.candidate_property[index].value,
                    )
                  )
                    copyPrevFilter.filters.candidate_property[index].value.splice(
                      elementIndex,
                      1,
                    );
                  if (
                    !Array.isArray(
                      copyPrevFilter.filters.candidate_property[index].value,
                    )
                    || copyPrevFilter.filters.candidate_property[index].value.length
                      === 0
                  )
                    copyPrevFilter.filters.candidate_property.splice(index, 1);
                  else
                    copyPrevFilter.filters.candidate_property[index].lookup.splice(
                      elementIndex,
                      1,
                    );
                  onFiltersChanged({
                    ...copyPrevFilter,
                    page: 1,
                    filters: {
                      ...copyPrevFilter.filters,
                      candidate_property: copyPrevFilter.filters.candidate_property,
                    },
                  });
                }}
              >
                <span>{element.title}</span>
                <span className="fas fa-times px-2" />
              </ButtonBase>
            )),
        )}
      {filters?.filters?.has_assignee?.value ? (
        <ButtonBase
          className="btns theme-transparent"
          onClick={() => {
            onFiltersChanged({
              ...filters,
              page: 1,
              filters: {
                ...filters.filters,
                has_assignee: null,
              },
            });
          }}
        >
          <span>
            {t(`${translationPath}has-assignee`)}:{' '}
            {filters?.filters?.has_assignee?.value || ''}
          </span>
          <span className="fas fa-times px-2" />
        </ButtonBase>
      ) : null}
    </div>
  );
};

FiltersDisplaySection.propTypes = {
  filters: PropTypes.shape({
    filters: PropTypes.instanceOf(Object),
    tags: PropTypes.instanceOf(Array),
  }),
  onFiltersChanged: PropTypes.func.isRequired,
  onFiltersResetClicked: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
