import React from 'react';
import { Card } from 'reactstrap';
import Empty from 'pages/recruiter-preference/components/Empty';
import ProfileCardItem from './ProfileCardItem';

const ProfileCard = ({ title, items, footer, avatarIcon, isEdit, company_uuid }) => (
  <Card className="profile-tab-card">
    <div className="font-weight-bold font-14 mb-1">{title}</div>
    {items?.length ? (
      <div>
        {items
          && items.map((item, index) => (
            <React.Fragment
              key={`profileCardItemKeys${item.title}${title}${index + 1}`}
            >
              {index > 0 && <hr className="profile-item-divider" />}
              <div className="mt-2 mb-4">
                <ProfileCardItem
                  avatar={item.avatar?.url}
                  avatarIcon={avatarIcon}
                  title={item.title}
                  badge={item.badge}
                  subOptions={item.options}
                  subtitle={item.subtitle}
                  description={item.description}
                  video={item.video}
                  extra={item.extra}
                  tags={item.tags}
                  free_tags={item.free_tags}
                  candidate_property={item.candidate_property}
                  dynamic_properties={item.dynamic_properties}
                  isEdit={isEdit}
                  company_uuid={company_uuid}
                />
              </div>
            </React.Fragment>
          ))}
      </div>
    ) : (
      <Empty
        style={{ width: '50px', height: '50px' }}
        message={`No ${title} Added`}
      />
    )}
    {footer && (
      <>
        <hr className="profile-footer-divider" />
        <div className="mt-4">{footer}</div>
      </>
    )}
  </Card>
);

export default ProfileCard;
