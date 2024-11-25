import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { UploaderPageEnum } from '../../../../../../../enums';
import { SharedUploaderControl } from '../../../../controls';
import i18next from 'i18next';
import {
  CheckboxesComponent,
  CollapseComponent,
  TooltipsComponent
} from '../../../../../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import TablesComponent from '../../../../../../../components/Tables/Tables.Component';
import { useTranslation } from 'react-i18next';

const LookupsImportTab = ({
  state,
  onStateChanged,
  isSubmitted,
  errors,
  validatedItem,
  getTableHeaderByCol,
  parentTranslationPath,
  // translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenValidateCollapse, setIsOpenValidateCollapse] = useState(false);
  return (
    <div className="lookups-import-tab tab-content-wrapper">
      <div className="d-inline-flex pt-1 mb-2">
        <CheckboxesComponent
          idRef="isValidate"
          singleChecked={state.is_validate}
          label="validate"
          parentTranslationPath={parentTranslationPath}
          onSelectedCheckboxChanged={(_e, isChecked) => {
            onStateChanged({
              id: 'is_validate',
              value: isChecked,
            });
          }}
        />
      </div>
      <SharedUploaderControl
        editValue={state?.file}
        onValueChanged={(newValue) => {
          onStateChanged({
            id: 'file_uuid',
            value: (newValue.value.length > 0 && newValue.value[0].uuid) || null,
          });
          onStateChanged(newValue);
        }}
        stateKey="file"
        labelValue="upload-csv"
        translationPath=""
        isSubmitted={isSubmitted}
        errors={errors}
        errorPath="file"
        labelClasses="theme-primary"
        fileTypeText="files"
        isFullWidth
        uploaderPage={UploaderPageEnum.LookupsImport}
      />
      <div className="lookups-import-body-wrapper">
        {validatedItem && (
          <div className="lookups-import-item-wrapper">
            <div className="lookups-import-item-header">
              <span>
                <span>{t(`created-by`)}</span>
                <span className="c-gray">
                  <span>:</span>
                  <span className="px-1">
                    {validatedItem.created_by?.name?.[i18next.language]
                      || validatedItem.created_by?.name?.en}
                  </span>
                </span>
              </span>
              <span>
                <TooltipsComponent
                  contentComponent={
                    <span className="px-1">{validatedItem.summary.total_rows}</span>
                  }
                  title="total-rows"
                  parentTranslationPath={parentTranslationPath}
                />
                <TooltipsComponent
                  contentComponent={
                    <span className="px-1">
                      {validatedItem.summary.total_create}
                    </span>
                  }
                  title="total-created"
                  parentTranslationPath={parentTranslationPath}
                />
                <TooltipsComponent
                  contentComponent={
                    <span className="px-1">
                      {validatedItem.summary.total_update}
                    </span>
                  }
                  title="total-updated"
                  parentTranslationPath={parentTranslationPath}
                />
                <TooltipsComponent
                  contentComponent={
                    <span className="px-1">
                      {validatedItem.summary.total_errors}
                    </span>
                  }
                  title="total-errors"
                  parentTranslationPath={parentTranslationPath}
                />
                <ButtonBase
                  className="btns-icon theme-transparent"
                  onClick={() => setIsOpenValidateCollapse((item) => !item)}
                >
                  <span
                    className={`fas fa-chevron-${
                      (isOpenValidateCollapse && 'up') || 'down'
                    }`}
                  />
                </ButtonBase>
              </span>
            </div>
            <CollapseComponent
              isOpen={isOpenValidateCollapse}
              component={
                <div className="active-stage-precondition-body">
                  <TablesComponent
                    data={validatedItem.data}
                    headerData={
                      getTableHeaderByCol({
                        col: validatedItem.col,
                      }) || []
                    }
                    pageIndex={0}
                    pageSize={validatedItem.data.length}
                    totalItems={validatedItem.data.length}
                    isDynamicDate
                    themeClasses="theme-transparent"
                    // parentTranslationPath={parentTranslationPath}
                    // translationPath={translationPath}
                    // onPageIndexChanged={onPageIndexChanged}
                    // onPageSizeChanged={onPageSizeChanged}
                    // isWithCheck
                    // getIsDisabledRow={(row) =>
                    //   !!selectedRows.length && row.uuid !== selectedRows[0]?.uuid
                    // }
                    // onSelectCheckboxChanged={({ selectedRows }) =>
                    //   setSelectedRows(selectedRows)
                    // }
                  />
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

LookupsImportTab.propTypes = {
  // filter: PropTypes.object.isRequired,
  state: PropTypes.shape({
    file: PropTypes.object,
    file_uuid: PropTypes.string,
    is_validate: PropTypes.bool,
  }).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  validatedItem: PropTypes.object,
  getTableHeaderByCol: PropTypes.func,
  onStateChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  // translationPath: PropTypes.string.isRequired,
};

export default LookupsImportTab;
