// React and reactstrap
import React, { Component } from 'react';
import { Button, CardBody, Col, Row } from 'reactstrap';

// Axios
import Axios from 'axios';

// API
import urls from '../../../api/urls';
import { commonAPI } from '../../../api/common';
import { evarecAPI } from '../../../api/evarec';

// Components
import VideoCard from '../../../components/Elevatus/VideoCard';
import DropzoneWrapper from '../../../components/Elevatus/DropzoneWrapper';
import UploadIcon from '../../../assets/images/shared/upload.png';
import { withTranslation } from 'react-i18next';
import UploadingDialog from '../UploadingDialog';
import { showError } from '../../../helpers';
import { generateHeaders } from '../../../api/headers';
import { toast } from 'react-toastify';
import { VitallyTrack } from '../../../utils/Vitally';

const translationPath = '';
const parentTranslationPath = 'EvarecRecRms';

const currentLanguage = localStorage.getItem('platform_language');

/**
 * UploadResume class component
 */
class UploadResume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem('user'))?.results,
      errors: null,
      loader: false,
      deleted: false,
      resumes: [],
      uploading_files: [],
      files: 0,
      uploading: false,
      Saving: false,
    };
  }

  /**
   * Remove a resume
   * @param uuid
   */
  removeResume = (uuid) => {
    this.setState({
      deleted: true,
    });
    this.props.setVideo('');
    Axios.delete(urls.common.media, {
      params: {
        uuid,
        from_feature: 'career_portal',
        company_uuid: this.state.user.company_id,
      },
      header: {
        Accept: 'application/json',
      },
      headers: generateHeaders(),
    })
      .then(({ data }) => {
        this.setState({
          deleted: false,
        });
        document.getElementsByClassName('dz-video').innerHTML = '';
      })
      .catch(({ error }) => {
        this.setState({
          deleted: false,
          errors: error?.response?.data?.errors,
        });
      });
  };

  /**
   * When uploading a resume
   * @param files
   * @returns {Promise<void>}
   */
  onUploadResume = async (files) => {
    if (!this.props.rmsConfig.remaining) return;
    if (files?.length > 100) {
      showError(this.props.t(`note-you-can-upload-maximum-100-resumes`), undefined, {
        type: toast.TYPE.WARNING,
      });
      return;
    }
    const localFiles = files.slice(0, this.props.rmsConfig.remaining);
    localFiles.map((item) => {
      this.setState({
        uploading: true,
        files: localFiles.length,
      });
      const formData = new FormData();

      formData.append('file', item);
      formData.append('type', 'cv');
      formData.append('from_feature', 'rms--resume_upload'); // Replace the preset name with your own
      return commonAPI
        .createMedia(formData)
        .then(({ data }) => {
          this.setState((prevState) => ({
            ...prevState,
            resumes: [
              ...prevState.resumes,
              {
                uuid: data.results.original.uuid,
                data: item,
                progress: 100,
              },
            ],
            NumberOfFiles: this.state.resumes.length,
          }));
          window?.ChurnZero?.push([
            'trackEvent',
            'RMS - Add new resume',
            'Add new resume (RMS)',
            1,
            {},
          ]);
          VitallyTrack('EVA-REC - Upload CVs');
        })
        .catch((error) => {
          showError('failed-to-get-saved-data', error);
          this.setState((prevState) => ({
            ...prevState,
            resumes: [
              ...prevState.resumes,
              {
                uuid: null,
                data: item,
                progress: 0,
                errors: error?.response?.data?.errors?.file,
              },
            ],
          }));
        });
    });
  };

  /**
   * When 'Apply' is clicked
   */
  onApply = () => {
    this.setState({
      Saving: true,
    });
    evarecAPI.createResumes(this.state.resumes).then((response) => {
      if (response.data.statusCode === 201) {
        setTimeout(() => {
          this.setState({
            Saving: false,
            resumes: [],
            uploading_files: [],
            files: 0,
            uploading: false,
          });
        }, 6000);
        this.props.onClick(response?.data.results?.not_complete);
      } else
        this.setState({
          Saving: false,
          errors: response?.data.error?.response?.data?.errors,
        });
    });
  };

  /**
   * Render the Component
   * @returns {JSX.Element}
   */
  render() {
    const { t } = this.props;
    return (
      <div className="d-flex flex-column align-items-start">
        <Row>
          <Col xs="12">
            <h6 className="h5">{t(`${translationPath}upload-resumes`)}</h6>
          </Col>
        </Row>
        <div style={{ marginTop: 11 }} className="text-gray font-14 pl-3-reversed">
          {t(`${translationPath}upload-resumes-description`)}.
        </div>
        {this.state.uploading && (
          <UploadingDialog
            isOpen={this.state.uploading}
            onClose={() => {
              this.setState({
                uploading: !this.state.uploading,
                resumes: [],
                uploading_files: [],
                files: 0,
              });
            }}
            onSuccess={() => {
              this.setState({
                uploading: !this.state.uploading,
              });
            }}
            Saving={this.state.Saving}
            onApply={this.onApply}
            resumes={this.state.resumes}
            uploadings={this.state.uploading_files}
            files={this.state.files}
            seconds={60}
          />
        )}
        <div className="w-100">
          <Row className="mt-5 mb-1">
            <Col
              xs="12"
              className="mb-2"
              style={{
                display:
                  this.state.loader || !this.props.video?.url ? 'block' : 'none',
              }}
            >
              <CardBody
                className="upload-form-dz-zone"
                style={{ position: 'relative' }}
              >
                <DropzoneWrapper
                  multiple
                  onUpload={this.onUploadResume}
                  accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  maxSize={5123967}
                  className="dropzone-wrapper"
                >
                  {this.state.loader ? (
                    <>
                      <div className="h3">
                        <i className="fas fa-circle-notch fa-spin mr-2" />
                      </div>
                      <h6 className="h6 text-gray mt-3 mb-0">
                        {t(`${translationPath}uploading`)}
                      </h6>
                    </>
                  ) : this.state.deleted ? (
                    <>
                      <div className="h3">
                        <i className="fas fa-circle-notch fa-spin mr-2" />
                      </div>
                      <h6 className="h6 text-gray mt-3 mb-0">
                        {t(`${translationPath}removing`)}
                      </h6>
                    </>
                  ) : (
                    <>
                      <div>
                        <img src={UploadIcon} alt="Resume" className="upload-icon" />
                      </div>
                      <h6 className="h6 mt-3 mb-0" style={{ color: '#959595' }}>
                        {t(`${translationPath}click-here`)}
                      </h6>
                      <h6 className="h7" style={{ color: '#959595' }}>
                        {t(`${translationPath}or-drop-your-CVs-here`)}
                      </h6>
                    </>
                  )}
                </DropzoneWrapper>
              </CardBody>
            </Col>
            {!this.state.loader && this.props.video?.url && (
              <Col
                xs="12"
                className="mb-2 upload-form-card-wrapper"
                style={{
                  display:
                    !this.state.loader && this.props.video?.url ? 'block' : 'none',
                }}
              >
                <VideoCard
                  className="w-100"
                  controls={false}
                  width={520}
                  height={300}
                  {...this.props}
                  src={this.props.video?.url}
                />
                <div className="upload-form-card-buttons">
                  <Button
                    className="rounded-circle mr-2"
                    color="primary"
                    style={{
                      width: 40,
                      height: 40,
                      padding: 0,
                      opacity: 0.6,
                    }}
                    onClick={() => {
                      const uploader = document.querySelector(
                        '.dropzone-wrapper input[type="file"]',
                      );
                      if (uploader) uploader.click();
                    }}
                  >
                    <i className="fa fa-upload" />
                  </Button>
                  <Button
                    className="rounded-circle mr-2"
                    color="primary"
                    style={{
                      width: 40,
                      height: 40,
                      padding: 0,
                      opacity: 0.6,
                    }}
                    onClick={() => this.removeResume(this.props.video?.uuid || '')}
                  >
                    <i className="fa fa-trash" />
                  </Button>
                </div>
              </Col>
            )}
            {this.state.errors && this.state.errors.video_uuid ? (
              this.state.errors.video_uuid.length > 1 ? (
                this.state.errors.video_uuid.map((error, index) => (
                  <p key={index} className="m-0 text-xs text-danger">
                    {error}
                  </p>
                ))
              ) : (
                <p className="m-o text-xs text-danger">
                  {this.state.errors.video_uuid}
                </p>
              )
            ) : (
              ''
            )}
          </Row>
        </div>
        <div className="mt-2 w-100 text-right text-gray h7">
          {`${t(`${translationPath}note-you-can-upload-maximum`)} ${
            this.props.rmsConfig?.remaining || 0
          } ${t(`${translationPath}resumes`)}`}
          .
        </div>
      </div>
    );
  }
}

export default withTranslation(parentTranslationPath)(UploadResume);
