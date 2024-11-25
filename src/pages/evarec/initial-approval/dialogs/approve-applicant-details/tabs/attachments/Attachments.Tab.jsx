import React, { useEffect, useState, useRef, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import Loader from 'components/Elevatus/Loader';
import { showError, showSuccess } from '../../../../../../../helpers';
import { UploaderPageEnum, SystemActionsEnum } from '../../../../../../../enums';
import {
  SharedUploaderControl,
  SetupsReducer,
  SetupsReset,
} from '../../../../../../setups/shared';
import { TooltipsComponent } from '../../../../../../../components';
import {
  GetAllApprovalAttachments,
  GetMultipleMedias,
  SaveApprovalAttachment,
} from '../../../../../../../services';

export const AttachmentTab = ({
  approval_uuid,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const stateInitRef = useRef({
    media_uuids: [],
    media_data: [],
    attachments_list: [],
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const [activeTooltip, setActiveTooltip] = useState({
    rowIndex: -1,
    actionIndex: -1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [listIsLoading, setListIsLoading] = useState(false);

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  const getAttachmentsDetails = useCallback(
    async (attachmentsUUIDs = []) => {
      if (attachmentsUUIDs.length === 0) return;
      let arr = [];
      attachmentsUUIDs.map((media) => {
        arr.push(media.media_uuid);
        return undefined;
      });
      const mediaResponse = await GetMultipleMedias({
        uuids: arr,
      });
      if (
        mediaResponse
        && mediaResponse.status === 200
        && mediaResponse.data.results.data.length > 0
      )
        setState({
          id: 'attachments_list',
          value: mediaResponse.data.results.data,
        });
      else showError(t('Shared:failed-to-get-uploaded-file'), mediaResponse);
    },
    [t],
  );
  const getAttachmentsHandler = useCallback(async () => {
    setListIsLoading(true);
    const response = await GetAllApprovalAttachments({
      pre_candidate_approval_uuid: approval_uuid,
    });
    if (response && response.status === 200) {
      onStateChanged({ id: 'attachments_list', value: response.data.results });
      getAttachmentsDetails(response.data.results);
      setListIsLoading(false);
      setIsLoading(false);
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setListIsLoading(false);
      setIsLoading(false);
    }
  }, [approval_uuid, t, getAttachmentsDetails]);

  const onAttachmentClicked = useCallback(
    (actionKey, media_uuid) => async () => {
      const mediaResponse = await GetMultipleMedias({
        uuids: [media_uuid],
      });
      if (
        mediaResponse
        && mediaResponse.status === 200
        && mediaResponse.data.results.data.length > 0
      ) {
        const localFile = mediaResponse.data.results.data[0].original;
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.download = localFile.url;
        link.href = localFile.url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else showError(t('Shared:failed-to-get-uploaded-file'), mediaResponse);
    },
    [t],
  );

  useEffect(() => {
    if (approval_uuid) {
      setIsLoading(true);
      getAttachmentsHandler();
    }
  }, [approval_uuid, getAttachmentsHandler]);

  const saveApprovalAttachment = useCallback(
    async (media_uuid) => {
      setListIsLoading(true);
      const response = await SaveApprovalAttachment({
        pre_candidate_approval_uuid: approval_uuid,
        media_uuid,
      });
      setListIsLoading(false);
      if (response && response.status === 201) {
        showSuccess(t('Shared:updated-successfully'));
        await getAttachmentsHandler();
      } else showError(t('Shared:update-failed'), response);
    },
    [approval_uuid, getAttachmentsHandler, t],
  );

  return (
    <div className="candidate-assessment-tab-wrapper questionnaires-tab-wrapper">
      {isLoading ? (
        <Loader width="730px" height="49vh" speed={1} color="primary" />
      ) : (
        <div className="shared-control-wrapper">
          <SharedUploaderControl
            editValue={state?.media_data || []}
            onValueChanged={(uploaded) => {
              if (uploaded.value.length > 0)
                saveApprovalAttachment(uploaded.value.map((item) => item.uuid));
              onStateChanged({ id: 'media_data', value: [] });
            }}
            stateKey="media_data"
            errorPath="media_data"
            labelClasses="theme-primary"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            fileTypeText="files"
            isFullWidth
            uploaderPage={UploaderPageEnum.InitialApprovalAttachments}
            multiple
          />
          {listIsLoading ? (
            <Loader width="730px" height="49vh" speed={1} color="primary" />
          ) : (
            <div className="attachments-list-wrapper">
              {state.attachments_list
                && state.attachments_list.map((item, index) => (
                  <div
                    key={`${index + 1}-attachments`}
                    className="attachments-list-item"
                  >
                    <div className="d-inline-flex">
                      <div>
                        <a
                          download
                          rel="noreferrer"
                          target="_blank"
                          className="attachment-file-icon"
                          href={item?.media_uuid}
                        >
                          <span className={SystemActionsEnum.file.icon} />
                        </a>
                      </div>
                      <div className="info-wrapper">
                        <p className="info-type">{item?.original?.name}</p>
                        {/*<div>*/}
                        {/*  {t(`${translationPath}uploader`)}*/}
                        {/*  <span className="px-1">:</span>*/}
                        {/*  {item?.relation === 2 ? 'Recruiter' : 'Candidate'}*/}
                        {/*</div>*/}
                      </div>
                    </div>
                    <div className="attachments-actions">
                      {[
                        // SystemActionsEnum.download,
                        SystemActionsEnum.view,
                      ].map((action, actionIndex) => (
                        <TooltipsComponent
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          key={`${action.key}-${index + 1}`}
                          isOpen={
                            activeTooltip.index === index
                            && activeTooltip.actionIndex === actionIndex
                          }
                          title={t(action.value)}
                          contentComponent={
                            <span
                              onMouseOver={() =>
                                setActiveTooltip({
                                  actionIndex,
                                  index,
                                })
                              }
                              onMouseOut={() =>
                                setActiveTooltip({
                                  actionIndex: -1,
                                  index: -1,
                                })
                              }
                              onFocus={() =>
                                setActiveTooltip({
                                  actionIndex,
                                  index,
                                })
                              }
                              onBlur={() =>
                                setActiveTooltip({
                                  actionIndex: -1,
                                  index: -1,
                                })
                              }
                              role="button"
                              tabIndex={-1}
                            >
                              <ButtonBase
                                className="btns-icon theme-transparent"
                                onClick={onAttachmentClicked(
                                  action.key,
                                  item.original && item.original.uuid,
                                )}
                              >
                                <span className={action.icon} />
                              </ButtonBase>
                            </span>
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

AttachmentTab.propTypes = {
  approval_uuid: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};

AttachmentTab.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: '',
};
