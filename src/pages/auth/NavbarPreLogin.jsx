// React and reactstrap
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Col,
  Container,
  Navbar,
  NavbarBrand,
  Row,
  UncontrolledCollapse,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { storageService } from 'utils/functions/storage';
import { LanguageChangeComponent } from '../../components/Navbars/Sections';

// Import Logo
import ElevatusLogo from '../../assets/img/logo/logo.png';
import { SystemVariablesEnum } from '../../enums';

// Main class component

const translationPath = 'LoginView.';
class NavbarPreLogin extends React.Component {
  // If the URL contains redirect_to='zoom, set the item in local storage
  componentDidMount() {
    let param = null;
    if (window.location.search.includes('redirect_to')) {
      param = 'zoom';
      localStorage.setItem('redirect_to', param);
    }
    const lastSelectedBranchTheme
      = (localStorage.getItem('lastSelectedBranchTheme')
        && JSON.parse(localStorage.getItem('lastSelectedBranchTheme')))
      || {};
    if (lastSelectedBranchTheme.mainColor) {
      const root = document.querySelector(':root');
      Object.values(SystemVariablesEnum)
        .filter((item) => item.isReflected)
        .map((item) =>
          root.style.setProperty(item.key, lastSelectedBranchTheme.mainColor),
        );
    }
  }

  // Login handler
  handleLogin = () => {
    storageService.clearLocalStorage();
    this.props.history.push('/el/login');
    window.location.reload();
  };

  // Registration handler
  // handleRegistration = () => {
  //   storageService.clearLocalStorage();
  //   this.props.history.push('/el/registration');
  // };

  // Render JSX
  render() {
    const { t } = this.props;
    const lastSelectedBranchTheme
      = (localStorage.getItem('lastSelectedBranchTheme')
        && JSON.parse(localStorage.getItem('lastSelectedBranchTheme')))
      || {};

    return (
      <>
        <Navbar
          color="none"
          className="flex-wrap navbar-horizontal navbar-dark navbar-transparent pre-login-navbar-wrapper"
          expand="lg"
        >
          <Container className="d-flex-v-center-h-between flex-wrap">
            <div className="d-inline-flex-v-center flex-wrap">
              <NavbarBrand>
                <img
                  src={lastSelectedBranchTheme.logo || ElevatusLogo}
                  alt="logo"
                  style={{ maxWidth: '200px' }}
                />
              </NavbarBrand>
              <NavbarBrand onClick={this.handleLogin} className="btn btn-link">
                {t(`${translationPath}login`)}
              </NavbarBrand>
              {/*<NavbarBrand*/}
              {/*  onClick={this.handleRegistration}*/}
              {/*  className="btn btn-link"*/}
              {/*>*/}
              {/*  {t(`${translationPath}register`)}*/}
              {/*</NavbarBrand>*/}
            </div>
            <div className="d-inline-flex-v-center">
              <UncontrolledCollapse
                className="navbar-collapse-wrapper"
                navbar
                toggler="#navbar-danger"
              >
                <div className="navbar-collapse-header">
                  <Row>
                    <Col className="collapse-brand" xs="6">
                      <Link to="/">
                        <img alt="..." src={require('assets/img/brand/blue.png')} />
                      </Link>
                    </Col>
                    <Col className="collapse-close" xs="6">
                      <button
                        aria-controls="navbar-danger"
                        aria-expanded={false}
                        aria-label="Toggle navigation"
                        className="navbar-toggler"
                        data-target="#navbar-danger"
                        data-toggle="collapse"
                        id="navbar-danger"
                        type="button"
                      >
                        <span />
                        <span />
                      </button>
                    </Col>
                  </Row>
                </div>
                {/* Removed social media links due to new requirements.
                    Uncomment the following section to re-enable
                */}
                {/*<Nav className="ml-auto" navbar>*/}
                {/*  <NavItem>*/}
                {/*    <NavLink*/}
                {/*      className="nav-link-icon"*/}
                {/*      target="_blank"*/}
                {/*      href="https://www.facebook.com/Elevatus.io"*/}
                {/*      rel="noreferrer"*/}
                {/*    >*/}
                {/*      <i className="fab fa-facebook-square" />*/}
                {/*      <span className="nav-link-inner--text d-lg-none">*/}
                {/*        Facebook*/}
                {/*      </span>*/}
                {/*    </NavLink>*/}
                {/*  </NavItem>*/}
                {/*  <NavItem>*/}
                {/*    <NavLink*/}
                {/*      className="nav-link-icon"*/}
                {/*      target="_blank"*/}
                {/*      href="https://www.instagram.com/elevatus.io/"*/}
                {/*      rel="noreferrer"*/}
                {/*    >*/}
                {/*      <i className="fab fa-instagram" />*/}
                {/*      <span className="nav-link-inner--text d-lg-none">*/}
                {/*        Instagram*/}
                {/*      </span>*/}
                {/*    </NavLink>*/}
                {/*  </NavItem>*/}
                {/*  <NavItem>*/}
                {/*    <NavLink*/}
                {/*      className="nav-link-icon"*/}
                {/*      target="_blank"*/}
                {/*      href="https://www.linkedin.com/company/elevatusio"*/}
                {/*      rel="noreferrer"*/}
                {/*    >*/}
                {/*      <i className="fab fa-linkedin-in" />*/}
                {/*      <span className="nav-link-inner--text d-lg-none">*/}
                {/*        LinkedIn*/}
                {/*      </span>*/}
                {/*    </NavLink>*/}
                {/*  </NavItem>*/}
                {/*  /!* Removed twitter link due to problems with account.*/}
                {/*    Change address and Uncomment the following section to re-enable*/}
                {/*  /!* <NavItem> *!/*/}
                {/*  /!*  <NavLink *!/*/}
                {/*  /!*    className='nav-link-icon' *!/*/}
                {/*  /!*    target='_blank' *!/*/}
                {/*  /!*    href='https://twitter.com/elevatus_jobs?lang=en' *!/*/}
                {/*  /!*  > *!/*/}
                {/*  /!*    <i className='fab fa-twitter' /> *!/*/}
                {/*  /!*    <span className='nav-link-inner--text d-lg-none'>Twitter</span> *!/*/}
                {/*  /!*  </NavLink> *!/*/}
                {/*  /!* </NavItem> *!/*/}
                {/*</Nav>*/}
              </UncontrolledCollapse>
              <LanguageChangeComponent />
            </div>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default withTranslation('Shared')(NavbarPreLogin);
