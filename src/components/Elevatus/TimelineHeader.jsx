// Import react, proptypes and redux
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setAdminNavbarTitle } from 'stores/actions/navActions.js';

// import { Breadcrumb, BreadcrumbItem, Container, Row, Col } from 'reactstrap';

class TimelineHeader extends React.Component {
  // eslint-disable-next-line camelcase
  componentDidMount() {
    if (this.props.setAdminNavbarTitle)
      this.props.setAdminNavbarTitle({
        name: this.props.name,
        parentName: this.props.parentName,
        child_name: this.props.child_name,
      });
  }

  componentDidUpdate() {
    if (this.props.setAdminNavbarTitle)
      this.props.setAdminNavbarTitle({
        name: this.props.name,
        parentName: this.props.parentName,
        child_name: this.props.child_name,
      });
  }

  // Render JSX
  render() {
    return <div className="align-items-center pb-8" />;
    /**
     * Deprecated for now to hide TimelineHeader
     * Instead shows the breadcrumbs on AdminNavbar
     */
    /* return (
      <React.Fragment>
        <div className='header header-dark pb-6 content__title content__title--calendar'>
          <Container fluid>
            <div className='header-body'>
              <Row className='align-items-center py-4'>
                <Col lg='6' xs='7'>
                  <h6 className='fullcalendar-title h2 d-inline-block mb-0'>
                    {this.props.name}
                  </h6>{' '}
                  <Breadcrumb
                    className='d-none d-md-inline-block ml-lg-4'
                    listClassName='breadcrumb-links'
                  >
                    <BreadcrumbItem>
                      <a href='#pablo' onClick={(e) => e.preventDefault()}>
                        <i className='fas fa-home' />
                      </a>
                    </BreadcrumbItem>
                    {this.props.parentName ? (
                      <BreadcrumbItem>
                        <a href='#pablo' onClick={(e) => e.preventDefault()}>
                          {this.props.parentName}
                        </a>
                      </BreadcrumbItem>
                    ) : (
                      ''
                    )}
                    <BreadcrumbItem aria-current='page' className='active'>
                      {this.props.child_name}
                    </BreadcrumbItem>
                  </Breadcrumb>
                </Col>
                <Col className='mt-3 mt-md-0 text-md-right' lg='6' xs='5'>
                  {this.props.children}
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </React.Fragment>
    ); */
  }
}

TimelineHeader.propTypes = {
  name: PropTypes.string,
  parentName: PropTypes.string,
};

const mapDispatchToProps = {
  setAdminNavbarTitle,
};

export default connect(null, mapDispatchToProps)(TimelineHeader);
