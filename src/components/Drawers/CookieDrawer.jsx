// import React, { useState } from 'react';
// // import { default as CoreDrawer } from 'rc-drawer';
// import styled from 'styled-components';
// import { IconButton } from 'shared/icons';
// import CustomToggle from 'components/Inputs/CustomToggle';
// import { Button } from 'reactstrap';
// import PropTypes from 'prop-types';
// import ButtonBase from "@mui/material/ButtonBase";

// const Drawer = styled(CoreDrawer)`
//   & .drawer-content-wrapper {
//     background: #03396c;
//     padding: 24px;
//     @media (max-width: 770px) {
//       padding: 14px;
//     }
//     h1,
//     h2,
//     h3,
//     h4,
//     h5 {
//       color: #fff;
//       font-weight: 500;
//     }
//     p {
//       color: #fff;
//       font-weight: 400;
//     }
//     a {
//       color: #fff;
//       text-decoration: underline;
//     }
//   }
// `;
// const CookieDrawer = ({ onIsCookieAcceptedChanged }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   return (
//     <Drawer
//       wrapperClassName="cookie-drawer"
//       open={isOpen}
//       handler={(
//         <ButtonBase
//           className="drawer-handle"
//           onClick={() => {
//             setIsOpen((item) => !item);
//           }}
//         >
//           {isOpen && <i className="fas fa-times" />}
//           {!isOpen && <i className="fas fa-arrow-right" />}
//         </ButtonBase>
//       )}
//       level={null}
//       onChange={(newState) => {
//         setIsOpen(newState);
//       }}
//       onClose={() => {
//         setIsOpen(false);
//       }}
//       showMask
//     >
//       <div className="d-flex">
//         <h3>This site uses cookies.</h3>
//         <div className="show-on-mobile ml-auto">
//           <IconButton
//             onClick={() => {
//               setIsOpen(false);
//             }}
//             className="ml-auto plain-icon"
//             icon={<i className="fas fa-times fa-2x text-white" />}
//           />
//         </div>
//       </div>
//       <p>
//         Some of these cookies are essential, while others help us to improve your
//         experience by providing insights into how the site is being used.
//       </p>
//       <p>
//         For more detailed information on the cookies we use, please check our
//         {' '}
//         <a
//           href="https://elevatus.io/legal/privacy-policy"
//           target="_blank"
//           rel="noreferrer"
//         >
//           Privacy Policy.
//         </a>
//       </p>
//       <div className="d-flex">
//         <Button
//           onClick={onIsCookieAcceptedChanged}
//           color="default"
//           className="bg-white border-0 text-default rounded"
//         >
//           Accept Recommended Settings
//         </Button>
//         <Button
//           onClick={onIsCookieAcceptedChanged}
//           color="default"
//           className="text-white rounded"
//         >
//           I Don&apos;t Accept
//         </Button>
//       </div>
//       <hr className="border-top w-100 opacity-3" />

//       {/* 1 */}
//       <div className="d-flex flex-column">
//         <div className="d-flex mb-2">
//           <h5>Necessary Cookies</h5>
//         </div>
//         <p className="mb-0">
//           Necessary cookies enable core functionality. The website cannot function
//           properly without these cookies, and can only be disabled by changing your
//           browser preferences.
//         </p>
//       </div>

//       <hr className="border-top w-100 opacity-3" />
//       {/* 2 */}
//       <div className="d-flex flex-column">
//         <div className="d-flex mb-2">
//           <h5>Analytical Cookies</h5>
//           <div className="ml-auto d-flex align-items-center">
//             <CustomToggle />
//           </div>
//         </div>
//         <p className="mb-0">
//           Analytical cookies help us to improve our website by collecting and
//           reporting information on its usage.
//         </p>
//       </div>

//       <hr className="border-top w-100 opacity-3" />
//       {/* 3 */}
//       <div className="d-flex flex-column">
//         <div className="d-flex mb-2">
//           <h5>Social Sharing Cookies</h5>
//           <div className="ml-auto d-flex align-items-center">
//             <CustomToggle defaultChecked />
//           </div>
//         </div>
//         <p className="mb-0">
//           We use some social sharing plugins, to allow you to share certain pages of
//           our website on social media. These plugins place cookies so that you can
//           correctly view how many times a page has been shared.
//         </p>
//       </div>
//     </Drawer>
//   );
// };

// CookieDrawer.propTypes = {
//   onIsCookieAcceptedChanged: PropTypes.func.isRequired,
// };

// export default CookieDrawer;
