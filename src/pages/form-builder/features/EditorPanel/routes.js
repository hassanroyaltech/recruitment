import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Edit from './Edit';
import Info from './Info';
import Customizing from './Customizing';
import Vars from './Vars';
import Settings from './Settings';
import Flow from './Flow';
import History from './History';

export default function PanelRouter({
  preview,
  lastTimeChanged,
  templateCreationTime,
  dataSectionItems,
  setDataSectionItems,
  templateData,
  setTemplateData,
  setFieldsItems,
  handleAddSection,
  customFields,
  fieldsItems,
  customSections,
  setErrors,
  offerData,
  UpdateDownLoadPDFSenderHandler,
  UpdateDownLoadPDFRecipientHandler,
  UpdateDownLoadFilesSenderHandler,
  pdfDownLoad,
  isGlobalLoading,
  pdfRef,
  isFromBulkSelect,
  errors,
  isSubmitted,
  parentTranslationPath,
}) {
  return (
    <Switch>
      <Route exact path="/form-builder">
        <Redirect to="/form-builder/edit" />
      </Route>
      <Route
        exact
        path="/form-builder/info"
        render={() => (
          <Info
            preview={preview}
            lastTimeChanged={lastTimeChanged}
            templateCreationTime={templateCreationTime}
            templateData={templateData}
            setTemplateData={setTemplateData}
            offerData={offerData}
            // UpdateDownLoadPDFSenderHandler={UpdateDownLoadPDFSenderHandler}
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
        )}
      />
      <Route exact path="/form-builder/flow" render={() => <Flow />} />
      {!['sender'].includes(templateData.editorRole) && !preview.isActive && (
        <>
          <Route
            exact
            path="/form-builder/edit"
            render={() => (
              <Edit
                templateData={templateData}
                setTemplateData={setTemplateData}
                fieldsItems={fieldsItems}
                customFields={customFields}
                customSections={customSections}
                setDataSectionItems={setDataSectionItems}
                handleAddSection={handleAddSection}
                setErrors={setErrors}
              />
            )}
          />
          <Route
            exact
            path="/form-builder/customizing"
            render={() => (
              <Customizing
                fieldsItems={fieldsItems}
                setFieldsItems={setFieldsItems}
              />
            )}
          />
          <Route exact path="/form-builder/vars" render={() => <Vars />} />
          <Route
            exact
            path="/form-builder/settings"
            render={() => (
              <Settings
                setTemplateData={setTemplateData}
                templateData={templateData}
                dataSectionItems={dataSectionItems}
                errors={errors}
                setErrors={setErrors}
                isSubmitted={isSubmitted}
              />
            )}
          />
          <Route exact path="/form-builder/history" render={() => <History />} />
        </>
      )}
    </Switch>
  );
}
