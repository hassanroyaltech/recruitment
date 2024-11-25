// /* eslint-disable react/prop-types */
// /**
//  * ----------------------------------------------------------------------------------
//  * @title ChooseAssessmentType.jsx
//  * ----------------------------------------------------------------------------------
//  * This component displays a modal where we choose the appropriate type of
//  * assessment (or category).
//  * ----------------------------------------------------------------------------------
//  */
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   Card, CardBody, CardHeader, Col, Row,
// } from 'reactstrap';
//
// // React and reactstrap
// import ContentLoader from 'react-content-loader';
// import ReactHtmlParser from 'react-html-parser';
// import { useTranslation } from 'react-i18next';
// import { StandardModal } from 'components/Modals/StandardModal';
// import { ModalButtons } from 'components/Buttons/ModalButtons';
//
// /**
//  * Choose assessment type modal (category)
//  * @param isOpen
//  * @param onClose
//  * @param onSave
//  * @param Categories
//  * @param selected
//  * @param modalTitle
//  * @param preSelected
//  * @returns {JSX.Element}
//  * @constructor
//  */
// const ChooseAssessmentType = ({
//   isOpen,
//   onClose,
//   onSave,
//   Categories,
//   selected,
//   modalTitle,
//   preSelected,
//   setLoading,
//   proceed,
//   parentTranslationPath,
//   translationPath,
// }) => {
//   const { t } = useTranslation(parentTranslationPath);
//   const [selectedCategory, setSelected] = useState(selected || '');
//   const [preSelectedCategory] = useState(preSelected);
//   const [assessmentCategories] = useState(Categories);
//
//   const handleProceed = () => {
//     // Added setLoading so once the user select the category => render the stepper.
//     // onClose();
//     proceed(); // Replace the onClose Function.
//     setLoading(false);
//   };
//
//   /**
//    * Handler to set a preselected category in case this dialog is requested
//    * while 'editing' an assessment rather than creating a new one.
//    */
//   const handlePreselectedCategory = useCallback(() => {
//     if (preSelectedCategory) setSelected(preSelectedCategory);
//   }, [preSelectedCategory]);
//
//   /**
//    * Run the preselection handler during the Effect hook.
//    */
//   useEffect(() => {
//     handlePreselectedCategory();
//   }, [handlePreselectedCategory]);
//
//   // Return JSX
//   return (
//     <StandardModal
//       className="modal-dialog-centered choose-assessment-type"
//       title={t(`${translationPath}${modalTitle}`)}
//       subtitle={t(`${translationPath}choose-assessment-type-description`)}
//       isOpen={isOpen}
//       onClose={onClose}
//       buttons={(
//         <ModalButtons
//           saveButton
//           saveButtonHandler={handleProceed}
//           saveButtonDisabled={!selectedCategory}
//         />
//       )}
//     >
//       <div className="pl-4 pr-4 pb-3">
//         <h6 className="h6 px-2 mt-5">{t(`${translationPath}category`)}</h6>
//         <Row className="mt-4 mx--4 pb-4">
//           <Col sm="12" md="8" className="px-4">
//             <Row className="mx--2">
//               {assessmentCategories.map((category, index) => (
//                 <Col
//                   xs="6"
//                   lg="4"
//                   key={`assessmentCategoriesKey${index + 1}`}
//                   className="px-2"
//                 >
//                   <Card
//                     className={`card-shadow assessment-type-card cursor-pointer ${
//                       category.uuid === selectedCategory?.uuid
//                         ? 'card-selected category-image-card'
//                         : ''
//                     }`}
//                     onClick={() => {
//                       setSelected(category);
//                       onSave(category);
//                     }}
//                   >
//                     {category.media ? (
//                       <div className="card-img-wrapper">
//                         <img src={category.media} alt={category.title} />
//                       </div>
//                     ) : (
//                       <ContentLoader
//                         speed={2}
//                         width="100%"
//                         height={80}
//                         viewBox="0 0 600 475"
//                         backgroundColor="#e9e9e9"
//                         foregroundColor="#fff"
//                       >
//                         <rect x="0" y="0" rx="3" ry="3" width="100%" height="100%" />
//                       </ContentLoader>
//                     )}
//                     <div
//                       className={`h7 text-uppercase text-center mt-3 mb-2 font-weight-bold ${
//                         category.uuid === selectedCategory?.uuid
//                           ? 'text-primary'
//                           : 'text-gray'
//                       }`}
//                     >
//                       {category.title}
//                     </div>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//           </Col>
//           <Col sm="12" md="4" className="pr-4">
//             {selectedCategory && (
//               <Card
//                 id="category-description-card"
//                 className="card-shadow assessment-type-card cursor-pointer card-selected"
//               >
//                 <CardHeader>
//                   <h6 className="h6">{selectedCategory.title}</h6>
//                 </CardHeader>
//                 <CardBody>
//                   <div className="h7 text-gray">
//                     {ReactHtmlParser(selectedCategory.description)}
//                   </div>
//                 </CardBody>
//               </Card>
//             )}
//           </Col>
//         </Row>
//       </div>
//     </StandardModal>
//   );
// };
//
// export default ChooseAssessmentType;
