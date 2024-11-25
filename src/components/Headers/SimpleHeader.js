// import React from 'react';
// // nodejs library to set properties for components
// import PropTypes from 'prop-types';
// // reactstrap components
// import { Breadcrumb, BreadcrumbItem, Container, Row, Col } from 'reactstrap';

// const TimelineHeader = (props) => {
//   return (
//     <React.Fragment>
//       <div className='header header-dark pb-6 content__title content__title--calendar'>
//         <Container fluid>
//           <div className='header-body'>
//             <Row className='align-items-center py-4'>
//               <Col lg='6' xs='7'>
//                 <h6 className='fullcalendar-title h2 d-inline-block mb-0'>
//                   {props.name}
//                 </h6>
//                 <Breadcrumb
//                   className='d-none d-md-inline-block ml-lg-4'
//                   listClassName='breadcrumb-links'
//                 >
//                   <BreadcrumbItem>
//                     <a href='#' onClick={(e) => e.preventDefault()}>
//                       <i className='fas fa-home' />
//                     </a>
//                   </BreadcrumbItem>
//                   {props.parentName ? (
//                     <BreadcrumbItem>
//                       <a href='#' onClick={(e) => e.preventDefault()}>
//                         {props.parentName}
//                       </a>
//                     </BreadcrumbItem>
//                   ) : (
//                     ''
//                   )}
//                   <BreadcrumbItem aria-current='page' className='active'>
//                     {props.name}
//                   </BreadcrumbItem>
//                 </Breadcrumb>
//               </Col>
//               <Col className='mt-3 mt-md-0 text-md-right' lg='6' xs='5'>
//                 {/* Buttons on left will appear here as prop.children */}
//                 {props.children}
//               </Col>
//             </Row>
//           </div>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// TimelineHeader.propTypes = {
//   name: PropTypes.string,
//   parentName: PropTypes.string,
// };

// export default TimelineHeader;

import TimelineHeader from '../Elevatus/TimelineHeader';

export default TimelineHeader;
