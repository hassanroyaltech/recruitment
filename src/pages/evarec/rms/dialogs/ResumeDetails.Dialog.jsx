import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../components';
import { Divider } from '@mui/material';
import Chip from '@mui/material/Chip';

export const ResumeDetailsDialog = ({
  data,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <DialogComponent
      maxWidth="md"
      titleText="resume-details"
      contentClasses="px-0"
      dialogContent={
        <div>
          {data ? (
            <>
              {data.basic_information && (
                <div className="mx-4 mb-4 mt-2">
                  <div>
                    <span className="fw-bold fz-20px my-2">
                      {t('basic-information')}
                    </span>
                  </div>
                  <div className="my-2">
                    {data.basic_information.personal_name && (
                      <div className="my-1">
                        <span className="fw-bold fz-16px">{t('name')}</span>
                        <span className="fz-16px">
                          <span className="mx-2">:</span>
                          {data.basic_information.personal_name}
                        </span>
                      </div>
                    )}
                    {data.basic_information.gender && (
                      <div className="my-1">
                        <span className="fw-bold fz-16px">{t('gender')}</span>
                        <span className="fz-16px">
                          <span className="mx-2">:</span>
                          {data.basic_information.gender}
                        </span>
                      </div>
                    )}
                    {data.basic_information.dob && (
                      <div className="my-1">
                        <span className="fw-bold fz-16px">{t('dob')}</span>
                        <span className="fz-16px">
                          <span className="mx-2">:</span>
                          {data.basic_information.dob}
                        </span>
                      </div>
                    )}
                    {data.basic_information.email?.[0] && (
                      <div className="my-1">
                        <span className="fw-bold fz-16px">{t('email')}</span>
                        <span className="fz-16px">
                          <span className="mx-2">:</span>
                          {data.basic_information.email[0]}
                        </span>
                      </div>
                    )}
                    {data.basic_information.phone_number?.[0] && (
                      <div className="my-1">
                        <span className="fw-bold fz-16px">{t('phone-number')}</span>
                        <span className="fz-16px">
                          <span className="mx-2">:</span>
                          {data.basic_information.phone_number[0]}
                        </span>
                      </div>
                    )}
                    {data.basic_information.description && (
                      <div className="my-1">
                        <span className="fw-bold fz-16px">{t('description')}</span>
                        <span className="fz-16px">
                          <span className="mx-2">:</span>
                          {data.basic_information.description}
                        </span>
                      </div>
                    )}
                    {data.basic_information.address && (
                      <div className="my-1">
                        <span className="fw-bold fz-16px">{t('address')}</span>
                        <span className="fz-16px">
                          <span className="mx-2">:</span>
                          {data.basic_information.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="m-4">
                <Divider color="gray" />
              </div>
              {data.education?.length > 0 && (
                <div className="m-4">
                  <div>
                    <span className="fw-bold fz-20px my-2">{t('education')}</span>
                  </div>
                  <div className="my-2">
                    {data.education.map((edu, idx) => (
                      <div
                        key={idx + 'education'}
                        className="my-2 p-3"
                        style={{ border: '1px solid #dadde2', borderRadius: 10 }}
                      >
                        {edu.major && (
                          <div className="my-1">
                            <span className="fw-bold fz-16px">{t('major')}</span>
                            <span className="fz-16px">
                              <span className="mx-2">:</span>
                              {edu.major}
                            </span>
                          </div>
                        )}
                        {edu.degree_type && (
                          <div className="my-1">
                            <span className="fw-bold fz-16px">
                              {t('degree-type')}
                            </span>
                            <span className="fz-16px">
                              <span className="mx-2">:</span>
                              {edu.degree_type}
                            </span>
                          </div>
                        )}
                        {edu.institution && (
                          <div className="my-1">
                            <span className="fw-bold fz-16px">
                              {t('institution')}
                            </span>
                            <span className="fz-16px">
                              <span className="mx-2">:</span>
                              {edu.institution}
                            </span>
                          </div>
                        )}
                        {edu.type && (
                          <div className="my-1">
                            <span className="fw-bold fz-16px">{t('type')}</span>
                            <span className="fz-16px">
                              <span className="mx-2">:</span>
                              {edu.type}
                            </span>
                          </div>
                        )}
                        {(edu.from_date || edu.to_date) && (
                          <div className="my-1">
                            <span className="fw-bold fz-16px">{t('date')}</span>
                            <span className="fz-16px">
                              <span className="mx-2">:</span>
                              {`${edu.from_date}${
                                edu.from_date && edu.to_date && ' - '
                              }${edu.to_date}`}
                            </span>
                          </div>
                        )}
                        {edu.gpa !== 0 && (
                          <div className="my-1">
                            <span className="fw-bold fz-16px">{t('gpa')}</span>
                            <span className="fz-16px">
                              <span className="mx-2">:</span>
                              {edu.gpa}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="m-4">
                <Divider color="gray" />
              </div>
              {data.experience?.length > 0 && (
                <div className="m-4">
                  <div>
                    <span className="fw-bold fz-20px my-2">{t('experience')}</span>
                  </div>
                  <div className="my-2">
                    {data.experience.map((exp, idx) => (
                      <div
                        key={idx + 'experience'}
                        className="my-2 p-3"
                        style={{ border: '1px solid #dadde2', borderRadius: 10 }}
                      >
                        {exp.position_type && (
                          <div className="my-1">
                            <span className="fw-bold fz-16px">
                              {t('position-type')}
                            </span>
                            <span className="fz-16px">
                              <span className="mx-2">:</span>
                              {exp.position_type}
                            </span>
                          </div>
                        )}
                        {exp.job_title && (
                          <div className="my-1">
                            <span className="fw-bold fz-16px">{t('job-title')}</span>
                            <span className="fz-16px">
                              <span className="mx-2">:</span>
                              {exp.job_title}
                            </span>
                          </div>
                        )}
                        {exp.company && (
                          <div className="my-1">
                            <span className="fw-bold fz-16px">{t('company')}</span>
                            <span className="fz-16px">
                              <span className="mx-2">:</span>
                              {exp.company}
                            </span>
                          </div>
                        )}
                        {exp.career_level && (
                          <div className="my-1">
                            <span className="fw-bold fz-16px">
                              {t('career-level')}
                            </span>
                            <span className="fz-16px">
                              <span className="mx-2">:</span>
                              {exp.career_level}
                            </span>
                          </div>
                        )}
                        {(exp.from_date || exp.to_date) && (
                          <div className="my-1">
                            <span className="fw-bold fz-16px">{t('date')}</span>
                            <span className="fz-16px">
                              <span className="mx-2">:</span>
                              {`${exp.from_date}${
                                exp.from_date && exp.to_date && ' - '
                              }${exp.to_date}`}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="m-4">
                <Divider color="gray" />
              </div>
              {data.language_proficiency && (
                <div className="m-4">
                  <div className="fw-bold fz-20px my-2">
                    {t('language-proficiency')}
                  </div>
                  {data.language_proficiency.map((lang, idx) => (
                    <Chip label={lang} className="m-1" key={idx + lang} />
                  ))}
                </div>
              )}
              <div className="m-4">
                <Divider color="gray" />
              </div>
              {data.skills.length > 0 && (
                <div className="m-4">
                  <div className="fw-bold fz-20px my-2">{t('skills')}</div>
                  {data.skills.map((skill, idx) => (
                    <Chip label={skill} className="m-1" key={idx + skill} />
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      }
      wrapperClasses="setups-management-dialog-wrapper"
      isOpen={isOpen}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
    />
  );
};

ResumeDetailsDialog.propTypes = {
  data: PropTypes.shape({
    basic_information: PropTypes.shape({
      personal_name: PropTypes.string,
      email: PropTypes.array,
      phone_number: PropTypes.array,
      dob: PropTypes.string,
      description: PropTypes.string,
      gender: PropTypes.string,
      address: PropTypes.string,
    }),
    education: PropTypes.array,
    experience: PropTypes.array,
    language_proficiency: PropTypes.array,
    skills: PropTypes.array,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string,
};
ResumeDetailsDialog.defaultProps = {
  isOpenChanged: undefined,
  parentTranslationPath: '',
};
