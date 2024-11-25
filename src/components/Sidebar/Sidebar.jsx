/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/*!

=========================================================
* Argon Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this
// permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from 'react';
// react library for routing
import { NavLink as NavLinkRRD, Link } from 'react-router-dom';
// nodejs library that concatenates classes
import classnames from 'classnames';
// nodejs library to set properties for components
import { PropTypes } from 'prop-types';
// react library that creates nice scrollbar on windows devices
import PerfectScrollbar from 'react-perfect-scrollbar';
// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  UncontrolledTooltip,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

const Sidebar = (props) => {
  const { t } = useTranslation();
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.js - route /admin/regular-forms
  const getCollapseInitialState = (routes) =>
    routes.some(
      (item) =>
        (item.collapse && getCollapseInitialState(item.views))
        || window.location.href.indexOf(item.layout + item.path) !== -1,
    );
  // this creates the initial state of this component based on the collapse routes
  // that it gets through props.routes
  const getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((item, key) => {
      if (item.collapse)
        initialState = {
          [item.state]: getCollapseInitialState(item.views),
          ...getCollapseStates(item.views),
          ...initialState,
        };

      return null;
    });
    return initialState;
  };
  const [state, setState] = useState({
    collapseOpen: false,
    ...getCollapseStates(props.routes),
  });

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) =>
    props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';

  // makes the sidenav normal on hover (actually when mouse enters on it)
  const onMouseEnterSidenav = () => {
    if (!document.body.classList.contains('g-sidenav-pinned'))
      document.body.classList.add('g-sidenav-show');
  };

  // makes the sidenav mini on hover (actually when mouse leaves from it)
  const onMouseLeaveSidenav = () => {
    if (!document.body.classList.contains('g-sidenav-pinned'))
      document.body.classList.remove('g-sidenav-show');
  };

  // toggles collapse between opened and closed (true/false)
  // const toggleCollapse = () => {
  //   setState({
  //     collapseOpen: !state.collapseOpen,
  //   });
  // };

  // // closes the collapse
  // const closeCollapse = () => {
  //   setState({
  //     collapseOpen: false,
  //   });
  // };

  // this is used on mobile devices, when a user navigates
  // the sidebar will autoclose
  const closeSidenav = () => {
    if (window.innerWidth < 1200) props.toggleSidenav();
  };

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) =>
    routes.map((prop, key) => {
      if (prop.redirect) return null;

      if (prop.is_active === 'false')
        return (
          <NavItem key={`${key + 1}-menu-item-${key + 1}-key`}>
            <NavLink
              id={prop.tooltip_target}
              to="/recruiter/no-subscriptions"
              activeClassName=""
              onClick={closeSidenav}
              tag={NavLinkRRD}
            >
              {prop.icon !== undefined ? (
                <>
                  <i className={prop.icon} />
                  <span
                    className={
                      prop.isDisabled ? 'nav-link-text nav-link-inner--text' : ''
                    }
                  >
                    {t(prop.name)}
                  </span>
                </>
              ) : prop.miniName !== undefined ? (
                <>
                  <span
                    className={
                      prop.isDisabled ? 'sidenav-mini-icon nav-link-inner--text' : ''
                    }
                  >
                    {prop.miniName}
                  </span>
                  <span
                    className={
                      prop.isDisabled ? 'sidenav-normal nav-link-inner--text' : ''
                    }
                  >
                    {t(prop.name)}
                  </span>
                </>
              ) : (
                <span
                  className={
                    prop.isDisabled ? 'nav-link-text nav-link-inner--text' : ''
                  }
                >
                  {t(prop.name)}
                </span>
              )}
            </NavLink>
          </NavItem>
        );

      if (prop.collapse) {
        const st = {};
        st[prop.state] = !state[prop.state];
        return (
          <NavItem key={`${key + 1}-menu-item-${key + 1}-sub`}>
            <NavLink
              href="#pablo"
              data-toggle="collapse"
              aria-expanded={state[prop.state]}
              className={`${
                (getCollapseInitialState(prop.views) && 'active') || ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                setState(st);
              }}
            >
              {prop.icon ? (
                <>
                  <i className={prop.icon} />
                  <span className="nav-link-inner--text">{t(prop.name)}</span>
                </>
              ) : <span className="nav-link-inner--text">{prop.miniName}</span> ? (
                <>
                  <span className="sidenav-mini-icon nav-link-inner--text">
                    {prop.miniName}
                  </span>
                  <span className="sidenav-normal nav-link-inner--text">
                    {t(prop.name)}
                  </span>
                </>
              ) : null}
            </NavLink>
            <Collapse isOpen={state[prop.state]}>
              <Nav className="nav-sm flex-column">{createLinks(prop.views)}</Nav>
            </Collapse>
          </NavItem>
        );
      }
      return (
        <NavItem
          className={activeRoute(prop.layout + prop.path)}
          key={`${key + 1}-menu-item-${key + 1}-main`}
        >
          <NavLink
            id={prop.tooltip_target}
            disabled={prop.isDisabled}
            to={prop.layout + prop.path}
            activeClassName=""
            onClick={closeSidenav}
            tag={NavLinkRRD}
          >
            {prop.icon !== undefined ? (
              <>
                <i className={prop.icon} />
                <span
                  className={
                    prop.isDisabled ? 'nav-link-text nav-link-inner--text' : ''
                  }
                >
                  {t(prop.name)}
                </span>
              </>
            ) : prop.miniName !== undefined ? (
              <>
                <span
                  className={
                    prop.isDisabled ? 'sidenav-mini-icon nav-link-inner--text' : ''
                  }
                >
                  {prop.miniName}
                </span>
                <span
                  className={
                    prop.isDisabled ? 'sidenav-normal nav-link-inner--text' : ''
                  }
                >
                  {t(prop.name)}
                </span>
              </>
            ) : (
              <span
                className={
                  prop.isDisabled ? 'nav-link-text nav-link-inner--text' : ''
                }
              >
                {t(prop.name)}
              </span>
            )}
          </NavLink>
          {prop.isDisabled && (
            <UncontrolledTooltip
              delay={0}
              placement="top"
              target={prop.tooltip_target}
            >
              <p className="text-left font-12">
                Insufficient permissions, please refer to your administrator.
              </p>
            </UncontrolledTooltip>
          )}
        </NavItem>
      );
    });

  const { routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink)
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  else if (logo && logo.outterLink)
    navbarBrandProps = {
      href: logo.outterLink,
      target: '_blank',
    };

  const scrollBarInner = (
    <div className="scrollbar-inner">
      <div className="sidenav-header d-flex align-items-center">
        {logo ? (
          <NavbarBrand {...navbarBrandProps}>
            <img alt={logo.imgAlt} className="navbar-brand-img" src={logo.imgSrc} />
          </NavbarBrand>
        ) : null}
        <div className="ml-auto">
          <div
            className={classnames('sidenav-toggler d-xl-block', {
              active: props.sidenavOpen,
            })}
            role="button"
            tabIndex="-1"
            onKeyPress={() => {}}
            onClick={props.toggleSidenav}
          >
            <div className="sidenav-toggler-inner">
              {/* <i className="fas fa-arrows-alt-h text-white" /> */}
              <i className="fas fa-dot-circle" />
              {/* <i className="sidenav-toggler-line bg-white" /> */}
              {/* <i className="sidenav-toggler-line bg-white" /> */}
              {/* <i className="sidenav-toggler-line bg-white" /> */}
            </div>
          </div>
        </div>
      </div>
      <div className="navbar-inner">
        <Collapse navbar isOpen>
          <Nav navbar>{createLinks(routes)}</Nav>
        </Collapse>
      </div>
    </div>
  );
  return (
    <Navbar
      className={`sidenav navbar-vertical navbar-expand-xs navbar-dark bg-primary ${
        props.rtlActive ? '' : 'fixed-left'
      }`}
      onMouseEnter={onMouseEnterSidenav}
      onMouseLeave={onMouseLeaveSidenav}
    >
      {navigator.platform.indexOf('Win') > -1 ? (
        <PerfectScrollbar>{scrollBarInner}</PerfectScrollbar>
      ) : (
        scrollBarInner
      )}
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
  toggleSidenav: () => {},
  sidenavOpen: false,
  rtlActive: false,
};

Sidebar.propTypes = {
  // function used to make sidenav mini or normal
  toggleSidenav: PropTypes.func,
  // prop to know if the sidenav is mini or normal
  sidenavOpen: PropTypes.bool,
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  // logo
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
  // rtl active, this will make the sidebar to stay on the right side
  rtlActive: PropTypes.bool,
};
Sidebar.defaultProps = {
  logo: undefined,
};

export default Sidebar;
