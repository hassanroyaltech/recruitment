import React, { useState } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {
  Nav,
  NavItem,
  NavLink as CoreNavLink,
  TabPane,
  TabContent,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import EmailTemplateTable from './EmailTemplateTable';
import SystemTemplateTable from './SystemTemplateTable';

const translationPath = 'EmailTemplates.';
const parentTranslationPath = 'RecruiterPreferences';

const NavLink = styled(CoreNavLink)`
  cursor: pointer;
  user-select: none;
`;

/**
 * Email template table
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const TablesWrapper = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  // Navs
  const [selectedTab, setSelectedTab] = useState('non-system');

  const toggleNavs = (e, state, keyword) => {
    e.preventDefault();
    setSelectedTab(keyword);
  };

  return (
    <>
      {props.match.params.pathParam !== 'root' && (
        <div className="table-responsive">
          <EmailTemplateTable
            {...props}
            openEditModal={props.openEditModal}
            openModal={props.openModal}
            reloadData={props.reloadData}
            closeModal={props.closeModal}
            setSelectedTab={setSelectedTab}
          />
        </div>
      )}
      {props.match.params.pathParam === 'root' && (
        <>
          <Nav tabs className="px-4 pt-4">
            <NavItem>
              <NavLink
                aria-selected={selectedTab === 'non-system'}
                className={classnames('font-weight-bold', {
                  active: selectedTab === 'non-system',
                })}
                onClick={(e) => toggleNavs(e, 'tabs', 'non-system')}
                role="tab"
              >
                {t(`${translationPath}email-templates`)}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                aria-selected={selectedTab === 'system'}
                className={classnames('font-weight-bold', {
                  active: selectedTab === 'system',
                })}
                onClick={(e) => toggleNavs(e, 'tabs', 'system')}
                role="tab"
              >
                {t(`${translationPath}system-emails`)}
              </NavLink>
            </NavItem>
          </Nav>
          <div className="table-responsive">
            <TabContent activeTab={selectedTab}>
              <TabPane tabId="non-system">
                <EmailTemplateTable
                  {...props}
                  reloadData={props.reloadData}
                  openEditModal={props.openEditModal}
                  openModal={props.openModal}
                  closeModal={props.closeModal}
                />
              </TabPane>
              <TabPane tabId="system">
                <SystemTemplateTable
                  {...props}
                  activeEditLanguage={props.activeEditLanguage}
                  onActiveEditLanguageChanged={props.onActiveEditLanguageChanged}
                  isSelected={selectedTab === 'system'}
                  reloadData={props.reloadData}
                  openEditModal={props.openEditModal}
                />
              </TabPane>
            </TabContent>
          </div>
        </>
      )}
    </>
  );
};

export default TablesWrapper;
