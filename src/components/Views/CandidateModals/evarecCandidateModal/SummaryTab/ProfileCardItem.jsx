import React from 'react';
import { Col, Row } from 'reactstrap';
import defaultAvatar from 'assets/img/theme/team-6.jpg';
import ProfileVideoCard from './ProfileVideoCard';
import {
  DynamicPropertiesSection,
  ExtrasSection,
  TagsSection,
} from '../../../../ProfileManagement/sections';

const ProfileCardItem = ({
  avatar,
  avatarAlt,
  avatarIcon,
  title,
  badge,
  subOptions,
  subtitle,
  description,
  video,
  extra,
  tags,
  free_tags,
  candidate_property,
  isEdit,
  company_uuid,
  dynamic_properties,
}) => (
  <div className="profile-card-item d-flex flex-row align-items-start">
    {avatarIcon !== 'none' && (
      <div className="profile-card-avatar p-1 mr-4">
        {avatarIcon || (
          <img
            className="avatar rounded-circle text-white img-circle gray-avatar"
            src={avatar || defaultAvatar}
            alt={avatarAlt || ''}
          />
        )}
      </div>
    )}
    <Row className="flex-grow-1">
      <Col sm={12} md={video ? 6 : 12} className="font-12">
        <div className="d-flex flex-row">
          <span className="font-weight-bold">{title}</span>
          {badge && (
            <div className="ml-3 chip-item small-item bg-medium-gray text-white">
              {badge}
            </div>
          )}
        </div>
        <div className="font-weight-bold text-gray">
          {subOptions && Array.isArray(subOptions)
            ? subOptions.map((item, index) => (
              <div key={`subOptionsKey${index + 1}`}>{item}</div>
            ))
            : subOptions}
        </div>
        <div className="text-gray mt-1">{subtitle}</div>
        <div className="text-gray mt-2">{description}</div>
      </Col>
      {video && (
        <Col sm={12} md={6}>
          <div className="h-100" style={{ maxHeight: 400 }}>
            <ProfileVideoCard video={video} />
          </div>
        </Col>
      )}
      {extra && (
        <ExtrasSection
          state={{ extra }}
          errors={{}}
          isLoading={false}
          isSubmitted={false}
          onStateChanged={() => {}}
          parentTranslationPath=""
          isEdit={isEdit}
          isFullWidth
          company_uuid={company_uuid}
        />
      )}
      {(tags || candidate_property || free_tags) && (
        <TagsSection
          state={{ tags, candidate_property, free_tags }}
          isSubmitted={false}
          isLoading={false}
          errors={{}}
          onStateChanged={() => {}}
          parentTranslationPath=""
          isEdit={isEdit}
          company_uuid={company_uuid}
        />
      )}
      {dynamic_properties && (
        <DynamicPropertiesSection
          state={{ dynamic_properties }}
          isSubmitted={false}
          isLoading={false}
          errors={{}}
          onStateChanged={() => {}}
          parentTranslationPath=""
          isEdit={isEdit}
          company_uuid={company_uuid}
        />
      )}
    </Row>
  </div>
);

export default ProfileCardItem;
