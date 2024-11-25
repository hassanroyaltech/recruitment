import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';

import i18next from 'i18next';

import { useTranslation } from 'react-i18next';
import { StringToColor } from '../../../../helpers';
import defaultUserImage from '../../../../assets/icons/user-avatar.svg';
import { LoadableImageComponant } from '../../../../components';
import './MemberCard.Style.scss';
import { ButtonBase } from '@mui/material';
import { TrashIcon } from '../../../form-builder/icons';
import { FormsRolesEnum } from '../../../../enums';
import { NavLink } from 'reactstrap';
export const MemberCard = memo(
  ({
    name,
    profile_img,
    email,
    removeItem,
    index,
    preview,
    role,
    phone,
    isLoading,
    parentTranslationPath,
    linkedin,
    positionTitle,
    headOfDepartment,
    isDisabled,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    return (
      <div className="card-member-wrapper p-3 ">
        <div className="card-header-wrapper">
          <span className="d-inline-flex-v-center  px-2">
            {(profile_img && (
              <Avatar
                classes="user-avatar-wrapper"
                alt={name}
                src={profile_img || defaultUserImage}
                sx={{ '& img': { objectFit: 'cover' } }}
              />
            )) || (
              <Avatar
                sx={{
                  backgroundColor: StringToColor(name),
                }}
                className="user-avatar-wrapper"
              >
                {name
                  .split(' ')
                  .slice(0, 2)
                  .map((word) => word[0]) || ''}
              </Avatar>
            )}
            <span className="header-text fz-14px px-2">{name}</span>
          </span>
        </div>

        <div className="card-body-wrapper">
          {headOfDepartment ? (
            <div className="body-item-wrapper mb-1">
              <span className="header-text fz-14px px-2">
                {' '}
                {t('head-of-department')}
              </span>
            </div>
          ) : null}

          {positionTitle ? (
            <div className="body-item-wrapper mb-1">
              <span className="header-text fz-14px px-2"> {positionTitle}</span>
            </div>
          ) : null}

          <div className="body-item-wrapper mb-1">
            <span className="header-text fz-14px px-2 far fa-envelope"> </span>
            <span className="px-1 wb-break-all"> {email}</span>
          </div>
          {/*<div className="body-item-wrapper ">*/}
          {/*  <span className="px-2 wb-break-all"> {email}</span>*/}
          {/*</div>*/}

          <div className="body-item-wrapper mb-1">
            <span className="header-text fz-14px px-2 far fa-phone"> </span>
            <span className="px-1 wb-break-all"> {phone || '-'}</span>
          </div>
          {linkedin ? (
            <div className="body-item-wrapper   ">
              <NavLink
                className="nav-link-icon  "
                target="_blank"
                href={linkedin}
                rel="noreferrer"
              >
                {/*<i className="fab fa-linkedin header-text  " style={{ fontSize:'20px' }} />*/}
                <span className="  fz-14px px-2 fab fa-linkedin header-text ">
                  {' '}
                </span>
                <span className="px-1 wb-break-all">{t('linkedin')} </span>
              </NavLink>
            </div>
          ) : null}

          {/*<div className="body-item-wrapper">*/}
          {/*  <span className="px-2"> test </span>*/}
          {/*</div>*/}
          <div className="body-item-wrapper">
            {/*<span className="px-1">*/}
            {/*  /!*<span className="fas fa-cube mx-1 " />*!/*/}
            {/*  <span className="wb-break-all">email</span>*/}
            {/*</span>*/}
          </div>
        </div>
        <div className="card-footer-wrapper"> </div>
        {!preview && !isDisabled && index >= 0 && (
          <ButtonBase
            disabled={isLoading || preview}
            className="btns theme-transparent btns-icon mx-auto"
            onClick={() => removeItem(index)}
          >
            <TrashIcon />
          </ButtonBase>
        )}
      </div>
    );
  },
);
MemberCard.displayName = 'MemberCard';
MemberCard.propTypes = {
  removeItem: PropTypes.func.isRequired,
  index: PropTypes.number,
  preview: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  phone: PropTypes.string,
  linkedin: PropTypes.string,
  positionTitle: PropTypes.string,
  headOfDepartment: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
};
MemberCard.defaultProps = {};
