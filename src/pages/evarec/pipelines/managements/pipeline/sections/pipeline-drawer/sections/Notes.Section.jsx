import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  CreatePipelineNote,
  GetAllEvaRecPipelineNotes,
} from '../../../../../../../../services';
import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../../helpers';
import { useEventListener } from '../../../../../../../../hooks';
import { LoadableImageComponant } from '../../../../../../../../components';
import moment from 'moment/moment';
import i18next from 'i18next';
import { SharedInputControl } from '../../../../../../../setups/shared';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';

export const NotesSection = ({
  jobUUID,
  parentTranslationPath,
  translationPath,
  onOpenedDetailsSectionChanged,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const bodyRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const [note, setNote] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
  });
  const [notes, setNotes] = useState({
    results: [],
    totalCount: 0,
  });

  const LoadMoreHandler = useCallback(() => {
    setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the errors list
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          note: yup
            .string()
            .nullable()
            .min(
              5,
              `${t('Shared:please-add-at-least')} ${5} ${t(`Shared:characters`)}`,
            )
            .required(t('Shared:this-field-is-required')),
        }),
      },
      { note },
    ).then((result) => {
      setErrors(result);
    });
  }, [note, t]);

  const onAddNoteHandler = async () => {
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    const response = await CreatePipelineNote({ note, job_uuid: jobUUID });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      setIsSubmitted(false);
      setNote(null);
      setFilter((items) => ({ ...items, page: 1 }));
      showSuccess(t(`${translationPath}note-created-successfully`));
    } else showError(t(`${translationPath}note-create-failed`), response);
  };

  const GetAllNotesHandler = useCallback(
    async (job_uuid) => {
      setIsLoading(true);
      const response = await GetAllEvaRecPipelineNotes({
        ...filter,
        job_uuid,
      });
      isLoadingRef.current = false;
      setIsLoading(false);
      if (response && response.status === 200) {
        const { results } = response.data;

        if (filter.page === 1)
          setNotes({
            results: results?.data || [],
            totalCount: results.total || 0,
          });
        else
          setNotes((items) => ({
            results: [...items.results, ...(results?.data || [])],
            totalCount: results.total || 0,
          }));
      } else {
        setNotes({
          results: [],
          totalCount: 0,
        });
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    },
    [filter, t],
  );

  useEffect(() => {
    if (jobUUID) {
      isLoadingRef.current = true;
      GetAllNotesHandler(jobUUID);
    }
  }, [GetAllNotesHandler, filter, jobUUID]);

  const onScrollHandler = useCallback(() => {
    if (
      (bodyRef.current.scrollHeight <= bodyRef.current.clientHeight
        || bodyRef.current.scrollTop + bodyRef.current.clientHeight
          >= bodyRef.current.firstChild.clientHeight - 5)
      && notes.results.length < notes.totalCount
      && !isLoadingRef.current
      && LoadMoreHandler
    )
      LoadMoreHandler();
  }, [bodyRef, notes.results.length, notes.totalCount, LoadMoreHandler]);

  useEventListener('scroll', onScrollHandler, bodyRef.current);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, note]);
  useEffect(() => {
    if (!isLoading) onScrollHandler();
  }, [isLoading, onScrollHandler]);

  return (
    <>
      <div className="details-header-wrapper">
        <div className="px-2">
          <ButtonBase
            className="btns theme-transparent miw-0 mx-0"
            id="detailsCloserIdRef"
            onClick={() => onOpenedDetailsSectionChanged(null)}
          >
            <span className="fas fa-angle-double-right" />
          </ButtonBase>
          <label htmlFor="detailsCloserIdRef" className="px-2">
            {t(`${translationPath}notes`)}
          </label>
        </div>
      </div>
      <div className="details-body-wrapper">
        <div className="notes-tab-wrapper">
          <SharedInputControl
            isFullWidth
            placeholder="add-note"
            themeClass="theme-transparent"
            stateKey="note"
            errors={errors}
            editValue={note}
            errorPath="note"
            isSubmitted={isSubmitted}
            isLoading={isLoading}
            startAdornment={
              <span
                className="d-inline-flex mt-1"
                style={{
                  alignSelf: 'flex-start',
                }}
              >
                <span
                  className="far fa-edit px-3 c-gray-primary"
                  style={{ zIndex: -1 }}
                />
              </span>
            }
            onValueChanged={({ value }) => {
              setNote(value);
            }}
            multiline
            rows={4}
            // onKeyDown={(event) => {
            //   if (event.key === 'Enter') onAddNoteHandler();
            // }}
            executeOnInputBlur
            onInputBlur={onAddNoteHandler}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            wrapperClasses="m-0"
          />
          <div className="separator-h mb-3" />
          <div
            style={{
              flex: '0 1 100%',
              overflowY: 'auto',
              flexWrap: 'wrap',
              maxHeight: 'calc(100vh - 315px)',
            }}
            ref={bodyRef}
          >
            <div>
              {notes.results.map((item) => (
                <>
                  <div className="d-flex m-3" key={item.uuid}>
                    <LoadableImageComponant
                      src={item.user.profile_image.url}
                      classes="user-image-wrapper"
                      alt={`${t(translationPath)}user-image`}
                    />
                    <div className="d-flex-column mt-2">
                      <div className="d-flex mb-1">
                        <span className="mx-1">{`${item.user.first_name} ${
                          (item.user.last_name && ` ${item.user.last_name}`) || ''
                        }`}</span>
                      </div>
                      <div className="d-flex px-3 mb-3">{item.note}</div>
                      <div className="text-gray">
                        {moment(item?.created_at).locale(i18next.language).fromNow()}
                      </div>
                    </div>
                  </div>
                  <div className="separator-h mb-3" />
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

NotesSection.propTypes = {
  jobUUID: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onOpenedDetailsSectionChanged: PropTypes.func,
};

NotesSection.defaultProps = {
  jobUUID: undefined,
};
