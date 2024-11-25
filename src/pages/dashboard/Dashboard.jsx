import React, { useState, useEffect, useRef, useCallback } from 'react';

// core components
import { useHistory } from 'react-router-dom';
import AdminNavbar from '../../components/Navbars/AdminNavbar';

import { DashboardRouter, routes } from './routesMenu';
import { SideMenu } from '../../components/SideMenu/SideMenu';
import './Dashboard.Style.scss';

const Dashboard = (props) => {
  const [isOpenSideMenu, setIsOpenSideMenu] = useState(false);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const mainContentRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    history.listen(() => {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
    });
  }, [history]);

  /**
   * @param newValue - text message for failed
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle changing the menu status
   */
  const onSideMenuToggle = useCallback((newValue = null) => {
    setIsOpenSideMenu((item) => (newValue === null ? !item : newValue));
  }, []);

  /**
   * @param newValue - text message for failed
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle changing the mobile menu status
   */
  const onIsOpenMobileMenuChange = useCallback(() => {
    setIsOpenMobileMenu((item) => !item);
  }, []);

  /**
   * @param newValue - text message for failed
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle changing the cookies' status
   */

  return (
    <div className="wrapper">
      <AdminNavbar
        {...props}
        toggleSidenav={onSideMenuToggle}
        onIsOpenMobileMenuChange={onIsOpenMobileMenuChange}
        isOpenMobileMenu={isOpenMobileMenu}
      />
      <div className="menu-and-content-wrapper">
        <SideMenu
          routes={routes}
          isOpenMobileMenu={isOpenMobileMenu}
          onSideMenuToggle={onSideMenuToggle}
        />
        <div
          className={`contents-wrapper${
            (isOpenSideMenu && ' is-open-side-menu') || ''
          }`}
          ref={mainContentRef}
        >
          <DashboardRouter />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
