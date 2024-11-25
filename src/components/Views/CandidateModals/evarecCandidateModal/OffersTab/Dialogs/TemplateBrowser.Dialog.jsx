import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent, PopoverComponent } from '../../../../..';
import { ButtonBase, Divider, Skeleton } from '@mui/material';
import '../Offers.Style.scss';
import { SharedInputControl } from 'pages/setups/shared';
import { useEventListener } from 'hooks';
import { showError } from 'helpers';
import { useHistory } from 'react-router-dom';
import { DefaultFormsTypesEnum } from '../../../../../../enums';

export const TemplateBrowserDialog = ({
  isOpen,
  candidate_uuid,
  onSave,
  onClose,
  getAllData,
  getAllTypes,
  getAllTags,
  selectedTemplateType,
  setSelectedTemplateType,
  templateType,
  isDisabledOfferType,
  parentTranslationPath,
  translationPath,
}) => {
  const history = useHistory();
  const { t } = useTranslation(parentTranslationPath);
  const bodyRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const [templateTypesList, setTemplateTypesList] = useState([]);
  const [templateTagsList, setTemplateTagsList] = useState([]);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
  });
  const [templatesList, setTemplatesList] = useState({
    results: [],
    totalCount: 0,
  });

  const onPopoverAttachedWithChanged = useCallback((key, newValue) => {
    setPopoverAttachedWith((items) => ({ ...items, [key]: newValue }));
  }, []);

  const popoverToggleHandler = useCallback(
    (popoverKey, event) => {
      onPopoverAttachedWithChanged(
        popoverKey,
        (event && event.currentTarget) || null,
      );
    },
    [onPopoverAttachedWithChanged],
  );

  const getOfferTagsHandler = useCallback(async () => {
    setIsLoading(true);
    const res = await getAllTags({
      // change to new call that gets all tags
      candidate_uuid,
      type_uuid: selectedTemplateType?.uuid,
    });
    if (res && res.status === 200) setTemplateTagsList(res.data?.results);
    else setTemplateTagsList([]);
    setIsLoading(false);
  }, [candidate_uuid, getAllTags, selectedTemplateType]);

  const getTypesHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await getAllTypes({});
    if (response && response.status === 200)
      setTemplateTypesList(response.data?.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
    setIsLoading(false);
  }, [getAllTypes, t]);

  const getTemplatesHandler = useCallback(async () => {
    // setIsLoading(true);
    const response = await getAllData({
      ...filter,
      form_type_uuid: selectedTemplateType?.uuid,
    });
    if (response && response.status === 200)
      if (filter.page === 1)
        setTemplatesList({
          results: response.data.results.data || response.data.results || [],
          totalCount: response.data.results?.total || response.data.paginate?.total,
        });
      else
        setTemplatesList((items) => ({
          results: items.results.concat(
            response.data.results?.data || response.data.results || [],
          ),
          totalCount:
            response.data.results.total || response.data.paginate?.total || 0,
        }));
    else setTemplatesList({ results: [], totalCount: 0 });
    // setIsLoading(false);
  }, [getAllData, filter, selectedTemplateType]);

  useEffect(() => {
    if (getAllTags) getOfferTagsHandler();
    if (getAllTypes) getTypesHandler();
  }, [getAllTypes, getOfferTagsHandler, getTypesHandler, getAllTags]);

  useEffect(() => {
    if (getAllData) getTemplatesHandler();
  }, [getTemplatesHandler, filter, selectedTemplateType, getAllData]);

  const onScrollHandler = useCallback(() => {
    if (
      bodyRef.current.offsetHeight + bodyRef.current.scrollTop
        >= bodyRef.current.scrollHeight - 5
      && templatesList.results.length < templatesList.totalCount
      && !isLoading
    )
      setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, [isLoading, templatesList.results.length, templatesList.totalCount]);

  useEventListener('scroll', onScrollHandler, bodyRef.current);

  return (
    <DialogComponent
      maxWidth="lg"
      titleText={`browse-${templateType}-templates`}
      contentClasses="px-0"
      dialogContent={
        <div className="mx-4 browse-templates-cont">
          <div className="p-2">
            <ButtonBase
              className="btns theme-solid"
              onClick={() => {
                if (templateType === 'email')
                  history.push(
                    '/recruiter/recruiter-preference/email-templates?openModal=true',
                  );
                else if (templateType === 'offer')
                  history.push('/recruiter/form-builder');
              }}
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}create-new`)}</span>
            </ButtonBase>
            {templateTagsList && getAllTags && (
              <div className="my-3 scrollabe-list-cl">
                <div>{t(`${translationPath}available-tags`)}</div>
                <div className="full-width my-2">
                  {templateTagsList.map((tag, idx) => (
                    <ButtonBase
                      key={idx}
                      className={`btns theme-transparent reset-btn-cl${
                        filter.tag === tag ? ' is-active' : ''
                      }`}
                      onClick={() => {
                        setFilter((items) => ({
                          ...items,
                          tag: filter.tag === tag ? undefined : tag,
                        }));
                      }}
                    >
                      <div className="d-flex flex-h-start">
                        <span className="fas fa-tag" />
                        <span className="px-1 text-start-al">{tag}</span>
                      </div>
                    </ButtonBase>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="d-flex-h-between full-width">
              <div>
                {getAllTypes && (
                  <ButtonBase
                    onClick={(e) => {
                      popoverToggleHandler('templateType', e);
                    }}
                    className="btns theme-transparent"
                  >
                    {selectedTemplateType?.name}
                    <span className="fas fa-chevron-down px-2" />
                  </ButtonBase>
                )}
                {/* <ButtonBase onClick={() => {}} className="btns theme-transparent">
                  {t(`${translationPath}all-categories`)}
                  <span className="fas fa-chevron-down px-2" />
                </ButtonBase> */}
              </div>
              <div className="d-inline-flex-v-center ">
                <ButtonBase className="btns-icon theme-transparent">
                  <span className="fas fa-search" />
                </ButtonBase>
                <div>
                  <SharedInputControl
                    idRef="searchRef"
                    title="search"
                    placeholder="search"
                    stateKey="search"
                    themeClass="theme-filled"
                    onValueChanged={(newValue) => {
                      setFilter((items) => ({
                        ...items,
                        page: 1,
                        search: newValue.value,
                      }));
                    }}
                    parentTranslationPath={parentTranslationPath}
                    wrapperClasses="m-0"
                  />
                </div>
                {/* <ButtonBase className="btns theme-transparent sm-btn">
                  <span>{t(`${translationPath}sort`)}</span>
                </ButtonBase> */}
              </div>
            </div>

            <Divider className="my-3" />

            {/* Template list */}
            <div className="scrollabe-list-cl" ref={bodyRef}>
              {templatesList
                && !isLoading
                && templatesList.results
                && templatesList.results.map((template) => (
                  <div key={template.id || template.uuid}>
                    <div className="d-flex-h-between full-width">
                      <div className="d-flex">
                        <div className="mx-2">
                          <span className="fa-2x fas fa-file" />
                        </div>
                        <div className="mx-2">
                          <div className="template-title">{template.title}</div>
                          <div className="template-details">
                            <span className="fz-12px">
                              {`${t(`${translationPath}created-at`)} ${
                                template.created_at
                              }`}
                            </span>
                          </div>
                          {template.tags && (
                            <div className="template-tags">
                              {template.tags?.map((tag) => (
                                <span
                                  key={tag}
                                  className="fz-12px p-1 mx-1"
                                  style={{ backgroundColor: '#24253314' }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="d-flex fa-start fj-end max-width-fit">
                        <ButtonBase
                          className="btns theme-outline sm-btn"
                          onClick={() => onSave(template)}
                          disabled={
                            templateType === 'email' && !template.translation?.length
                          }
                        >
                          <span className="px-1">{t(`${translationPath}view`)}</span>
                        </ButtonBase>
                      </div>
                    </div>
                    <div className="my-3 full-width">
                      <Divider />
                    </div>
                  </div>
                ))}
            </div>
            {isLoading && (
              <div>
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
              </div>
            )}
          </div>
          {getAllTypes && (
            <PopoverComponent
              idRef="customViewPopoverRef"
              attachedWith={popoverAttachedWith?.templateType}
              handleClose={() => popoverToggleHandler('templateType')}
              component={
                <div className="d-flex-column">
                  {templateTypesList
                    && templateTypesList.map((type) => (
                      <ButtonBase
                        key={type.uuid}
                        className="btns theme-transparent fj-start"
                        onClick={() => {
                          popoverToggleHandler('templateType');
                          setSelectedTemplateType(type);
                        }}
                        disabled={
                          isDisabledOfferType
                          && type.code === DefaultFormsTypesEnum.Offers.key
                        }
                      >
                        <span className="px-2">{type.name}</span>
                      </ButtonBase>
                    ))}
                </div>
              }
            />
          )}
        </div>
      }
      wrapperClasses="move-to-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      onCloseClicked={onClose}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

TemplateBrowserDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  candidate_uuid: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  selectedTemplateType: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string,
  }),
  setSelectedTemplateType: PropTypes.func,
  getAllData: PropTypes.func,
  isDisabledOfferType: PropTypes.bool,
  getAllTags: PropTypes.func,
  getAllTypes: PropTypes.func,
  templateType: PropTypes.oneOf(['email', 'offer']).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
TemplateBrowserDialog.defaultProps = {
  onSave: undefined,
  onClose: undefined,
  translationPath: '',
  selectedTemplateType: undefined,
  setSelectedTemplateType: undefined,
  getAllData: undefined,
  getAllTags: undefined,
  getAllTypes: undefined,
};
