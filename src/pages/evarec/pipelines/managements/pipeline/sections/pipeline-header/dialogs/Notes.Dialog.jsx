import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
import {
  getErrorByName,
  showError,
  showSuccess,
  globalSelectedRowsHandler,
  globalSelectedRowHandler,
} from '../../../../../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
  SharedUploaderControl,
  ConfirmDeleteDialog,
} from '../../../../../../../setups/shared';
import { DialogComponent } from '../../../../../../../../components';
import {
  CreatePipelineNote,
  GetAllEvaRecPipelineNotes,
  DeleteEvaRecPipelineNote,
} from '../../../../../../../../services';
import { UploaderPageEnum, SystemActionsEnum } from '../../../../../../../../enums';
import TablesComponent from '../../../../../../../../components/Tables/Tables.Component';

const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'NotesManagementDialog.';

export const NotesDialog = ({ jobUUID, isOpen, isOpenChanged }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const isCodeDisabled = useRef(Boolean(jobUUID));
  const [tableColumns] = useState([
    {
      id: 1,
      label: 'first-name',
      input: 'user.first_name',
      isSortable: true,
    },
    {
      id: 2,
      label: 'last-name',
      input: 'user.last_name',
      isSortable: true,
    },
    {
      id: 3,
      label: 'notes',
      input: 'note',
      isSortable: true,
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const schema = useRef(null);
  const stateInitRef = useRef({
    note: '',
    media_uuids: [],
    media_data: [],
  });
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: false,
    use_for: 'list',
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is send new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the errors list
   */
  const getErrors = useCallback(() => {
    if (schema.current)
      getErrorByName(schema, state).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [state]);

  const GetAllEvaRecPipelineNotesHandler = useCallback(
    async (uuid) => {
      setIsLoading(true);
      const response = await GetAllEvaRecPipelineNotes({
        ...filter,
        job_uuid: uuid,
      });
      setIsLoading(false);
      if (response && response.status === 200)
        setNotes({
          results: response.data.results.data,
          totalCount: response.data.results.total,
        });
      else {
        setNotes({
          results: [],
          totalCount: 0,
        });
        showError(t('Shared:failed-to-get-saved-data'), response); // test
      }
    },
    [filter, t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change active page
   */
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change page size
   */
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsReload(true);
    setIsLoading(true);
    const response = await CreatePipelineNote({ ...state, job_uuid: jobUUID });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      setIsSubmitted(false);
      onStateChanged({ id: 'note', value: '' });
      onStateChanged({ id: 'media_uuids', value: [] });
      onStateChanged({ id: 'media_data', value: [] });
      showSuccess(t(`${translationPath}note-created-successfully`));
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}note-create-failed`), response);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (jobUUID && isOpen) GetAllEvaRecPipelineNotesHandler(jobUUID);
  }, [jobUUID, GetAllEvaRecPipelineNotesHandler, isOpen, filter, isReload]);

  // this to init errors schema
  useEffect(() => {
    schema.current = yup.object().shape({
      note: yup
        .string()
        .nullable()
        .min(5, `${t('Shared:please-add-at-least')} ${5} ${t(`Shared:characters`)}`)
        .required(t('this-field-is-required')),
    });
  }, [jobUUID, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open dialog of management or delete
   */
  const onActionClicked = (action, row) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.delete.key) setIsOpenDeleteDialog(true);
    // if (action.key === SystemActionsEnum.download.key) downloadAttachmentsHandler(row.)
  };

  return (
    <>
      <DialogComponent
        maxWidth="md"
        titleText="notes"
        contentClasses="px-0"
        dialogContent={
          <div className="notes-management-content-dialog-wrapper">
            <SharedInputControl
              parentTranslationPath={parentTranslationPath}
              title={t(`${translationPath}note`)}
              editValue={state.note}
              isDisabled={isLoading || (isCodeDisabled && isCodeDisabled.current)}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath="note"
              stateKey="note"
              onValueChanged={onStateChanged}
              fullWidth
              multiline
              rows={5}
            />
            <div className="shared-control-wrapper">
              <SharedUploaderControl
                editValue={state?.media_data || []}
                onValueChanged={(uploaded) => {
                  const uploadedValue
                    = (uploaded.value?.length && uploaded.value) || [];
                  onStateChanged({
                    id: 'media_uuids',
                    value: uploaded.value
                      ? (uploadedValue.length
                          && uploadedValue.map((val) => val.uuid))
                        || uploadedValue
                      : uploaded,
                  });
                  onStateChanged({
                    id: 'media_data',
                    value: uploadedValue,
                  });
                }}
                stateKey="media_data"
                labelValue="media-uuids"
                isSubmitted={isSubmitted}
                errors={errors}
                errorPath="media_data"
                labelClasses="theme-primary"
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                fileTypeText="files"
                isFullWidth
                uploaderPage={UploaderPageEnum.PipelineNoteAttachment}
                multiple
              />
            </div>
            {notes.totalCount ? (
              <>
                <div className="body-actions-wrapper d-flex-v-center-h-end px-3">
                  {selectedRows && selectedRows.length > 0 && (
                    <div className="d-inline-flex mb-2 mx-1">
                      <ButtonBase
                        className="btns-icon theme-transparent c-warning"
                        onClick={() => {
                          setIsBulkDelete(true);
                          setIsOpenDeleteDialog(true);
                        }}
                      >
                        <span className={SystemActionsEnum.delete.icon} />
                      </ButtonBase>
                    </div>
                  )}
                </div>
                <div className="px-2">
                  <TablesComponent
                    data={notes.results}
                    isLoading={isLoading}
                    headerData={tableColumns}
                    pageIndex={filter.page - 1}
                    pageSize={filter.limit}
                    totalItems={notes.totalCount}
                    selectedRows={selectedRows}
                    isWithCheckAll
                    isWithCheck
                    isDynamicDate
                    uniqueKeyInput="uuid"
                    getIsDisabledRow={(row) => row.can_delete === false}
                    onSelectAllCheckboxChanged={() => {
                      setSelectedRows((items) =>
                        globalSelectedRowsHandler(
                          items,
                          notes.results.filter((item) => item.can_delete !== false),
                        ),
                      );
                    }}
                    onSelectCheckboxChanged={({ selectedRow }) => {
                      if (!selectedRow) return;
                      setSelectedRows((items) =>
                        globalSelectedRowHandler(items, selectedRow),
                      );
                    }}
                    isWithTableActions
                    onActionClicked={onActionClicked}
                    tableActions={[
                      // SystemActionsEnum.download,
                      SystemActionsEnum.delete,
                    ]}
                    tableActionsOptions={{
                      // eslint-disable-next-line max-len
                      getTooltipTitle: ({ row, actionEnum }) =>
                        (actionEnum.key === SystemActionsEnum.delete.key
                          && row.can_delete === false
                          && t('Shared:can-delete-description')) // test
                        || '',
                    }}
                    onPageIndexChanged={onPageIndexChanged}
                    onPageSizeChanged={onPageSizeChanged}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                  />
                </div>
              </>
            ) : null}
          </div>
        }
        wrapperClasses="notes-management-dialog-wrapper"
        isSaving={isLoading}
        isOpen={isOpen}
        isEdit={(jobUUID && true) || undefined}
        onSubmit={saveHandler}
        onCloseClicked={isOpenChanged}
        onCancelClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          activeItem={activeItem}
          successMessage="note-deleted-successfully"
          onSave={() => {
            setFilter((items) => ({ ...items, page: 1 }));
            if (isBulkDelete) setSelectedRows([]);
            else {
              const localSelectedRows = [...selectedRows];
              const selectedRowIndex = selectedRows.findIndex(
                (item) => item.uuid === activeItem.uuid,
              );
              if (selectedRowIndex !== -1) {
                localSelectedRows.splice(selectedRowIndex, 1);
                setSelectedRows(localSelectedRows);
              }
            }
          }}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
            if (isBulkDelete) {
              setIsBulkDelete(false);
              setSelectedRows([]);
            }
          }}
          descriptionMessage="note-delete-description"
          deleteApi={DeleteEvaRecPipelineNote}
          apiProps={{
            job_uuid: jobUUID,
            uuid:
              (isBulkDelete // api doesn't have bulk delete
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]),
          }}
          errorMessage="note-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
    </>
  );
};

NotesDialog.propTypes = {
  jobUUID: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
};
NotesDialog.defaultProps = {
  isOpenChanged: undefined,
  jobUUID: undefined,
};
