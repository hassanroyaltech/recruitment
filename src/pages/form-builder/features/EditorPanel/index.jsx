import React from 'react';
import { Grid, styled } from '@mui/material';
import Drawer from '../Navigation/Drawer';
import PanelRoute from './routes';
import Info from './Info';

const PanelGridLayout = styled(Grid)(({ theme }) => ({
  maxHeight: '100%',
  overflowY: 'auto',
  maxWidth: '336px',
  width: '100%',
  background: theme.palette.light.main,
}));

export default function EditorPanel({
  preview,
  isOpenSideMenu,
  lastTimeChanged,
  templateCreationTime,
  templateData,
  setTemplateData,
  dataSectionItems,
  setDataSectionItems,
  fieldsItems,
  customFields,
  customSections,
  setFieldsItems,
  handleAddSection,
  setErrors,
  offerData,
  headerHeight,
  UpdateDownLoadPDFSenderHandler,
  UpdateDownLoadPDFRecipientHandler,
  UpdateDownLoadFilesSenderHandler,
  isGlobalLoading,
  pdfDownLoad,
  pdfRef,
  isFromBulkSelect,
  isSubmitted,
  parentTranslationPath,
  errors,
}) {
  return (
    <Grid
      item
      xs="auto"
      container
      className={`editor-panel-wrapper d-inline-flex ${
        (!['recipient'].includes(templateData.editorRole)
          && (!['recipient'].includes(preview.role) || !preview.isActive)
          && 'panel-items-section')
        || 'panel-info-section'
      }${(isOpenSideMenu && ' is-open') || ''}`}
      sx={{
        // maxWidth: '336px!important',
        // width: '100%!important',
        top: headerHeight,
        height: `calc(100vh - ${headerHeight}px)`,
        flexWrap: 'nowrap',
        order: ['recipient'].includes(templateData.editorRole) && 1,
      }}
    >
      {!['recipient'].includes(templateData.editorRole)
      && (!['recipient'].includes(preview.role) || !preview.isActive) ? (
          <>
            <Drawer preview={preview} templateData={templateData} />
            <PanelGridLayout className="panel-items-wrapper">
              <PanelRoute
                preview={preview}
                lastTimeChanged={lastTimeChanged}
                templateCreationTime={templateCreationTime}
                dataSectionItems={dataSectionItems}
                setDataSectionItems={setDataSectionItems}
                templateData={templateData}
                setTemplateData={setTemplateData}
                customFields={customFields}
                fieldsItems={fieldsItems}
                customSections={customSections}
                setFieldsItems={setFieldsItems}
                handleAddSection={handleAddSection}
                setErrors={setErrors}
                offerData={offerData}
                UpdateDownLoadPDFSenderHandler={UpdateDownLoadPDFSenderHandler}
                UpdateDownLoadPDFRecipientHandler={UpdateDownLoadPDFRecipientHandler}
                UpdateDownLoadFilesSenderHandler={UpdateDownLoadFilesSenderHandler}
                pdfDownLoad={pdfDownLoad}
                isGlobalLoading={isGlobalLoading}
                pdfRef={pdfRef}
                isFromBulkSelect={isFromBulkSelect}
                errors={errors}
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
              />
            </PanelGridLayout>
          </>
        ) : (
          <PanelGridLayout className="info-wrapper">
            <Info
              lastTimeChanged={lastTimeChanged}
              templateCreationTime={templateCreationTime}
              templateData={templateData}
              preview={preview}
              offerData={offerData}
              UpdateDownLoadPDFSenderHandler={UpdateDownLoadPDFSenderHandler}
              UpdateDownLoadPDFRecipientHandler={UpdateDownLoadPDFRecipientHandler}
              UpdateDownLoadFilesSenderHandler={UpdateDownLoadFilesSenderHandler}
              pdfDownLoad={pdfDownLoad}
              isGlobalLoading={isGlobalLoading}
              pdfRef={pdfRef}
              isFromBulkSelect={isFromBulkSelect}
              errors={errors}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
            />
          </PanelGridLayout>
        )}
    </Grid>
  );
}
