/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  CardBody,
  Col,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  Row,
} from 'reactstrap';
import Loader from 'components/Elevatus/Loader';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import { CreatNote, getNotesList } from 'shared/APIs/VideoAssessment/Notes';
import { commonAPI } from 'api/common';
import { useTranslation } from 'react-i18next';
import NotesList from '../../../pages/NotesList';
import { DeleteNote } from '../../../shared/APIs/VideoAssessment/Notes';
import urls from '../../../api/urls';
import { UploaderPageEnum } from '../../../enums/Pages/UploaderPage.Enum';
import { UploaderComponent } from '../../Uploader/Uploader.Component';
import { showError, showSuccess } from '../../../helpers';

const translationPath = 'AddNoteModalComponent.';
const AddNoteModal = (props) => {
  const { match, onClose, isOpen, uuid, type_panel, parentTranslationPath } = props;
  const { t } = useTranslation('EvaSSESSPipeline');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(4);
  const [errors, setErrors] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalNotes, setTotalNotes] = useState(0);

  const handleFileChange = useCallback(async (data) => {
    setFiles(data);
    setSelectedFile(data?.map((item) => item.uuid));
  }, []);

  const deleteMedia = async (ObjectToDelete) => {
    setIsDeleting(true);
    commonAPI
      .deleteMedia({
        uuid: ObjectToDelete.uuid,
      })
      .then(() => {
        setIsDeleting(false);
        setFiles('');
      })
      .catch(() => {
        setIsDeleting(false);
      });
  };

  const getAllNotesList = useCallback(() => {
    setLoadingList(true);
    let params = null;
    // eslint-disable-next-line camelcase
    const url
      = type_panel === 'prep_assessment'
        ? urls.evassess.NOTES_LIST
        : urls.evarec.ats.NOTES_GET;

    // eslint-disable-next-line camelcase
    if (type_panel === 'prep_assessment')
      params = {
        assessment_uuid: match?.params?.id ? match?.params?.id : uuid,
        limit: limit || 4,
        page: currentPage,
      };
    else
      params = {
        job_uuid: match?.params?.id ? match?.params?.id : uuid,
        limit: limit || 4,
        page: currentPage,
      };

    getNotesList(url, params).then((res) => {
      if (res.data.statusCode === 200) {
        if (res.data.results.data) {
          setTotalNotes(res?.data?.results?.total);
          setNotes(res.data.results.data);
          setCurrentPage((items) => items + 1);
        } else setNotes(res.data.results);

        setLoadingList(false);
      }
    });
  }, [match.params.id, type_panel, uuid]);

  const handleSaveNote = async () => {
    setLoading(true);
    setSaving(true);
    setLoadingList(true);
    let params = null;
    // eslint-disable-next-line camelcase
    const url
      = type_panel === 'prep_assessment'
        ? urls.evassess.NOTES_WRITE
        : urls.evarec.ats.NOTES_WRITE;

    // eslint-disable-next-line camelcase
    if (type_panel === 'prep_assessment')
      params = {
        prep_assessment_uuid: match?.params?.id ? match?.params?.id : uuid,
        note,
        media_uuid: selectedFile,
      };
    else
      params = {
        job_uuid: match?.params?.id ? match?.params?.id : uuid,
        note,
        media_uuid: selectedFile,
      };

    CreatNote(url, params)
      .then(({ data }) => {
        notes.push(data.results);
        getAllNotesList();
        setLoadingList(false);
        setSaving(false);
        setNote('');
        setFiles([]);
        setSelectedFile([]);
        showSuccess(t(`${translationPath}note-created-successfully`));
        setLoading(false);
        setErrors([]);
      })
      .catch((error) => {
        setErrors(error?.response?.data?.errors);
        setSaving(false);
        showError(t(`${translationPath}note-create-failed`), error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllNotesList();
  }, [getAllNotesList]);

  const loadMore = async () => {
    setIsLoadingMore(true);
    setLoadingList(true);
    let params = null;
    // eslint-disable-next-line camelcase
    const url
      = type_panel === 'prep_assessment'
        ? urls.evassess.NOTES_GET
        : urls.evarec.ats.NOTES_GET;

    // eslint-disable-next-line camelcase
    if (type_panel === 'prep_assessment')
      params = {
        prep_assessment_uuid: match?.params?.id ? match?.params?.id : uuid,
        limit: limit || 4,
        page: currentPage,
      };
    else
      params = {
        job_uuid: match?.params?.id ? match?.params?.id : uuid,
        limit: limit || 4,
        page: currentPage,
      };

    getNotesList(url, params)
      .then((res) => {
        setNotes((items) => {
          items.push(...res.data.results.data);
          const uniqueArr = items.filter(
            (thing, index, self) =>
              index === self.findIndex((el) => el.uuid === thing.uuid),
          );
          return [...uniqueArr];
        });
        setCurrentPage((items) => items + 1);
        setIsLoadingMore(false);
        setLoadingList(false);
      })
      .catch(() => {
        setIsLoadingMore(false);
      });
  };

  const confirmAlert = (localUuid, index) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}are-you-sure`)}
        onConfirm={() => confirmedAlert(localUuid, index)}
        onCancel={() => hideAlert()}
        showCancel
        confirmBtnBsStyle="danger"
        cancelBtnText={t(`${translationPath}cancel`)}
        cancelBtnBsStyle="success"
        confirmBtnText={t(`${translationPath}yes-delete-it`)}
        btnSize=""
      >
        {t(`${translationPath}revert-description`)}
      </ReactBSAlert>,
    );
  };
  const confirmedAlert = (localUuid, index) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}deleting`)}
        showConfirm={false}
        showCancel={false}
        onConfirm={() => {}}
      />,
    );
    handleDeleteNote(localUuid, index);
  };

  const handleDeleteNote = (UUID, index) => {
    let params = null;
    const url
      = type_panel === 'prep_assessment'
        ? urls.evassess.NOTES_WRITE
        : urls.evarec.ats.NOTES_WRITE;

    if (type_panel === 'prep_assessment')
      params = {
        prep_assessment_uuid: match?.params?.id ? match?.params?.id : uuid,
        uuid: UUID,
      };
    else
      params = {
        job_uuid: match?.params?.id ? match?.params?.id : uuid,
        uuid: [UUID],
      };

    DeleteNote(url, params).then((res) => {
      notes.splice(index, 1);
      getAllNotesList();
      setAlert(
        <ReactBSAlert
          success
          style={{ display: 'block' }}
          title={t(`${translationPath}deleted`)}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="primary"
          confirmBtnText={t(`${translationPath}ok`)}
          btnSize=""
        >
          {t(`${translationPath}note-deleted-successfully`)}
        </ReactBSAlert>,
      );
    });
  };

  const hideAlert = () => {
    setAlert(null);
  };
  return (
    <Modal
      className="modal-dialog-centered"
      size="md"
      isOpen={isOpen}
      toggle={onClose}
    >
      {alert}
      <div className="modal-header border-0">
        <h3 className="h3 mb-0">{t(`${translationPath}add-note`)}</h3>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-hidden="true"
          onClick={onClose}
        >
          <i className="fas fa-times" />
        </button>
      </div>
      <ModalBody className="modal-body pt-0">
        {loading ? (
          <CardBody className="text-center">
            <Row>
              <Col xl="12">
                <Loader width="50%" height="50vh" speed={1} color="primary" />
              </Col>
            </Row>
          </CardBody>
        ) : (
          <>
            {!loadingList && (
              <NotesList
                notes={notes}
                loading={loadingList}
                loadMore={loadMore}
                totalNotes={totalNotes}
                isLoadingMore={isLoadingMore}
                getAllNotesList={getAllNotesList}
                parentTranslationPath={parentTranslationPath}
                ondelete={(localUuid, index) => confirmAlert(localUuid, index)}
              />
            )}

            <div className="mx-4">
              <Row>
                <Col xs={12}>
                  <h4 className="heading-small mt-3">
                    {t(`${translationPath}create-your-note`)}
                  </h4>
                  <FormGroup>
                    <Input
                      className="mt-1"
                      placeholder={t(`${translationPath}type-your-note-here`)}
                      type="textarea"
                      rows={8}
                      value={note}
                      onChange={(event) => setNote(event.currentTarget.value)}
                    />
                  </FormGroup>
                  {errors && errors.note ? (
                    errors.note?.length > 1 ? (
                      errors.note?.map((error, index) => (
                        <p
                          key={`noteErrorsKey${index + 1}`}
                          className="mb-0 mt-1 text-xs text-danger"
                        >
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className="mb-0 mt-1 text-xs text-danger">{errors.note}</p>
                    )
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col xs={12}>
                  <UploaderComponent
                    labelValue="upload-attachments"
                    uploadedFiles={files}
                    parentTranslationPath="EmailTemplatesPage"
                    translationPath=""
                    uploaderPage={UploaderPageEnum.EmailTemplates}
                    uploadedFileChanged={(newFiles) => handleFileChange(newFiles)}
                  />
                </Col>
              </Row>
            </div>
            <Row className="mt-5 d-flex justify-content-center">
              <Button
                color="primary"
                style={{ width: '220px' }}
                onClick={() => handleSaveNote(note, files)}
                disabled={saving}
              >
                {saving && (
                  <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                )}
                {`${
                  saving
                    ? t(`${translationPath}saving`)
                    : t(`${translationPath}save`)
                }`}
              </Button>
            </Row>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default AddNoteModal;
