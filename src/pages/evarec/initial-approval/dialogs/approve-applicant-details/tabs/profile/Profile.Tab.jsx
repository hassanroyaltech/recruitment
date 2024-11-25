import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'reactstrap';
import OverviewCard from '../../../../../../../components/Views/CandidateModals/evarecCandidateModal/SummaryTab/OverviewCard';
import AboutCard from '../../../../../../../components/Views/CandidateModals/evarecCandidateModal/SummaryTab/AboutCard';
import SkillsCard from '../../../../../../../components/Views/CandidateModals/evarecCandidateModal/SummaryTab/SkillsCard';
import ProfileCard from '../../../../../../../components/Views/CandidateModals/evarecCandidateModal/SummaryTab/ProfileCard';
import { ProfileManagementComponent } from '../../../../../../../components/ProfileManagement/ProfileManagement.Component';
import { ProfileManagementFeaturesEnum } from '../../../../../../../enums';
import { PreScreeningApprovalPermissions } from '../../../../../../../permissions';

export const ProfileTab = ({
  profile,
  profile_uuid,
  mode,
  isEditProfile,
  onEditProfileClicked,
  onProfileSaved,
  initDataProfile,
  parentTranslationPath,
  translationPath,
  hideImage,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [showMoreWork, setShowMoreWork] = useState(false);

  /**
   * Mapping Language Proficiency with IRL scale
   * @param {Number} value
   * @returns {String} IRL Scale
   * @note API returns Language Proficiency as Number need
   * to transform it into IRL scale to display it in candidate profile
   */
  const languageLevelsDictionary = (value) => {
    const options = [
      { uuid: 0, title: t(`${translationPath}no-proficiency`) },
      { uuid: 1, title: t(`${translationPath}elementary-proficiency`) },
      { uuid: 2, title: t(`${translationPath}limited-working-proficiency`) },
      { uuid: 3, title: t(`${translationPath}professional-working-proficiency`) },
      { uuid: 4, title: t(`${translationPath}full-professional-proficiency`) },
      { uuid: 5, title: t(`${translationPath}native-or-bilingual-proficiency`) },
    ];
    for (let i = 0; i < options.length; i += 1)
      if (value === options[i].uuid) return options[i].title;
    return '';
  };

  return (
    (!isEditProfile && (
      <div className="w-100">
        <div className="mb-3">
          <OverviewCard
            profile={profile}
            mode={mode}
            onEditProfileClicked={onEditProfileClicked}
            hideImage={hideImage}
          />
        </div>
        {mode && (
          <div className="mb-3">
            <AboutCard profile={profile} />
          </div>
        )}
        <div className="mb-3">
          <SkillsCard profile={profile} />
        </div>
        <div className="mb-3">
          <ProfileCard
            title={t(`${translationPath}work-experience`)}
            items={profile?.experience
              ?.slice(0, !showMoreWork ? 3 : profile?.work_experience?.length)
              .map((item) => ({
                title: item.role,
                options: [
                  item.company_name,
                  item.industry.title,
                  item.career_level.title,
                ].join(' . '),
                subtitle: [
                  item.from_date,
                  item.to_date ? item.to_date : t(`${translationPath}now`),
                  item.country?.title?.emoji,
                  item.country?.title?.name,
                  item.locations,
                ].join(' - '),
                description: item.description,
              }))}
            footer={
              <>
                {profile?.experience?.length > 3 && (
                  <NavLink
                    color="primary"
                    onClick={() => setShowMoreWork(!showMoreWork)}
                    className="font-12 font-weight-bold p-0"
                  >
                    {showMoreWork
                      ? t(`${translationPath}show-less`)
                      : t(`${translationPath}show-more`)}
                  </NavLink>
                )}
                <div className="d-flex flex-row">
                  <div
                    style={{ width: 100 }}
                    className="font-14 mt-2 font-weight-bold"
                  >
                    {t(`${translationPath}locations`)}:
                  </div>
                  {profile.experience
                    && profile.experience.length !== 0
                    && profile.experience[0].locations?.map((item, index) => (
                      <div
                        className="chip-item mr-2 mb-3 font-12"
                        key={`experienceLocationsKey${index + 1}`}
                      >
                        <span className="font-weight-bold">{item}</span>
                      </div>
                    ))}
                </div>
              </>
            }
            avatarIcon={<i className="far fa-building" />}
            company_uuid={
              profile && profile.identity && profile.identity.company_uuid
            }
          />
        </div>
        <div className="mb-3">
          <ProfileCard
            title={t(`${translationPath}education`)}
            items={profile.education?.map((item) => ({
              title: item.institution,
              options: [item.degree_type.title, item.major.title, item.gpa].join(
                ' . ',
              ),
              subtitle: [
                item.from_date,
                item.to_date ? item.to_date : t(`${translationPath}now`),
                item.country?.title?.emoji,
                item.country?.title?.name,
              ].join(' - '),
              description: item.description,
            }))}
            footer={
              <div className="d-flex flex-row">
                <div
                  style={{ width: 100 }}
                  className="font-14 mt-2 font-weight-bold"
                >
                  {t(`${translationPath}languages`)}:
                </div>
                {profile?.language_proficiency?.map((language, index) => (
                  <div
                    className="chip-item mr-2 mb-3 font-12"
                    key={`languageProficiencyKey${index + 1}`}
                  >
                    <span className="font-weight-bold">{language.name}</span>

                    <span>
                      {' / '}
                      {languageLevelsDictionary(language.value) || ' '}
                    </span>
                  </div>
                ))}
              </div>
            }
            avatarIcon={<i className="fas fa-school" />}
            company_uuid={
              profile && profile.identity && profile.identity.company_uuid
            }
          />
        </div>
        {profile && profile?.extra && (
          <div className="mb-3">
            <ProfileCard
              isEdit={isEditProfile}
              title={t(`${translationPath}extra-info`)}
              items={[{ extra: profile.extra }]}
              avatarIcon={<i className="fa fa-asterisk" />}
              company_uuid={
                profile && profile.identity && profile.identity.company_uuid
              }
            />
          </div>
        )}
        {profile
          && (profile?.tag
            || profile?.free_tags?.length > 0
            || profile?.candidate_property?.length > 0) && (
          <div className="mb-3">
            <ProfileCard
              title={t(`${translationPath}tags`)}
              items={[
                {
                  tags: profile.tag,
                  free_tags: profile.free_tags,
                  candidate_property: profile.candidate_property,
                },
              ]}
              avatarIcon="none"
              company_uuid={
                profile && profile.identity && profile.identity.company_uuid
              }
            />
          </div>
        )}
        {profile
          && profile?.dynamic_properties
          && profile?.dynamic_properties?.length > 0 && (
          <div className="mb-3">
            <ProfileCard
              title={t(`${translationPath}dynamic-properties`)}
              items={[
                {
                  dynamic_properties: profile.dynamic_properties,
                },
              ]}
              avatarIcon="none"
              company_uuid={
                profile && profile.identity && profile.identity.company_uuid
              }
            />
          </div>
        )}
        <div className="mb-3">
          <ProfileCard
            title={t(`${translationPath}references`)}
            items={
              Array.isArray(profile?.references)
              && profile?.references?.map((item) => ({
                title: item.name,
                options: [item.email, item.position].join(' . '),
                badge: item.objective,
                description: item.description,
                video: item.video,
              }))
            }
            footer={
              <div className="d-flex flex-row">
                <div
                  style={{ width: 100 }}
                  className="font-14 mt-2 font-weight-bold"
                >
                  {t(`${translationPath}extras`)}
                </div>
                {/* {profile?.desires */}
                {/*  && Object.keys(profile?.desires)?.map((item, index) => ( */}
                {/*    <div key={index}> */}
                {/*      {profile.desires[item] && ( */}
                {/*        <div className="chip-item mr-2 mb-2 font-12"> */}
                {/*          {profile.desires[item] && kebabToTitle(item)} */}
                {/*        </div> */}
                {/*      )} */}
                {/*    </div> */}
                {/*  ))} */}
                {profile?.desires?.willing_to_travel && (
                  <div className="chip-item mr-2 mb-2 font-12">
                    {t(`${translationPath}willing-to-travel`)}
                  </div>
                )}
                {profile?.desires?.willing_to_relocate && (
                  <div className="chip-item mr-2 mb-2 font-12">
                    {t(`${translationPath}willing-to-relocate`)}
                  </div>
                )}
                {profile?.desires?.owns_a_vehicle && (
                  <div className="chip-item mr-2 mb-2 font-12">
                    {t(`${translationPath}owns-a-vehicle`)}
                  </div>
                )}
                {profile?.desires?.right_to_work
                  && profile?.desires?.right_to_work?.country_uuid
                  && profile?.desires?.right_to_work?.document_type && (
                  <div className="chip-item mr-2 mb-2 font-12">
                    {t(`${translationPath}right-to-work`)}
                  </div>
                )}
              </div>
            }
            avatarIcon={<i className="fas fa-user" />}
            company_uuid={
              profile && profile.identity && profile.identity.company_uuid
            }
          />
        </div>
      </div>
    )) || (
      <ProfileManagementComponent
        onSave={onProfileSaved}
        onFailed={onEditProfileClicked}
        isFullWidthFields
        initDataProfile={initDataProfile} // only if there is no profile (on create a new profile)
        candidate_uuid={profile && profile.identity && profile.identity.uuid}
        company_uuid={profile && profile.identity && profile.identity.company_uuid}
        profile_uuid={profile_uuid}
        from_feature={ProfileManagementFeaturesEnum.DrApproval.key}
        componentPermission={PreScreeningApprovalPermissions}
      />
    )
  );
};

ProfileTab.propTypes = {
  profile: PropTypes.instanceOf(Object),
  initDataProfile: PropTypes.instanceOf(Object),
  profile_uuid: PropTypes.string,
  mode: PropTypes.bool,
  isEditProfile: PropTypes.bool,
  onEditProfileClicked: PropTypes.func,
  onProfileSaved: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  hideImage: PropTypes.bool,
};
ProfileTab.defaultProps = {
  profile: undefined,
  profile_uuid: undefined,
  mode: undefined,
  isEditProfile: undefined,
  onEditProfileClicked: undefined,
  onProfileSaved: undefined,
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: '',
  hideImage: undefined,
};