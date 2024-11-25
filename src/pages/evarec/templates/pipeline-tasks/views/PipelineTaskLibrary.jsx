import ButtonBase from '@mui/material/ButtonBase';
import { PipelineTasksViewsEnum } from '../../../../../enums';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// import { SharedInputControl } from '../../../../setups/shared';
// import { TooltipsComponent } from '../../../../../components';
// import { pipeline_tasks_library_res } from './fakeData';

export const PipelineTaskLibrary = ({
  parentTranslationPath,
  translationPath,
  onOpenedDetailsSectionChanged,
  setView,
  setIsOpen,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  // const [filters, setFilters] = useState({
  //   search: null,
  // });
  // const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <>
      <div className="details-header-wrapper mb-0">
        <div className="px-2">
          <ButtonBase
            className="btns theme-transparent miw-0 mx-0 c-gray"
            id="detailsCloserIdRef"
            onClick={() => {
              if (onOpenedDetailsSectionChanged) onOpenedDetailsSectionChanged(null);
              if (setIsOpen) setIsOpen(null);
            }}
          >
            <span className="fas fa-angle-double-right" />
          </ButtonBase>
          <label htmlFor="detailsCloserIdRef" className="px-2 c-gray">
            {t(`${translationPath}automations-library`)}
          </label>
        </div>
      </div>
      <div className="details-body-wrapper mx-3 px-2">
        <div className="d-flex-v-center-h-between fw-simi-bold">
          <div className="fz-14px">{t(`${translationPath}choose-or-create`)}</div>
          <div>
            <ButtonBase
              className="btns theme-transparent"
              onClick={() =>
                setView({ key: PipelineTasksViewsEnum.CREATE.key, data: {} })
              }
            >
              <span className="fas fa-plus" />
              <span className="mx-2">{t(`${translationPath}create-custom`)}</span>
            </ButtonBase>
          </div>
        </div>
        {/*<div>*/}
        {/*  <SharedInputControl*/}
        {/*    isFullWidth*/}
        {/*    stateKey="search"*/}
        {/*    placeholder="search-for-template-dots"*/}
        {/*    editValue={filters.search || ''}*/}
        {/*    // isDisabled={isLoading}*/}
        {/*    onValueChanged={(e) =>*/}
        {/*      setFilters((items) => ({ ...items, search: e.value }))*/}
        {/*    }*/}
        {/*    parentTranslationPath={parentTranslationPath}*/}
        {/*    translationPath={translationPath}*/}
        {/*    themeClass="theme-transparent"*/}
        {/*    textFieldWrapperClasses="w-100 pt-3"*/}
        {/*    fieldClasses="w-100"*/}
        {/*    isReadOnly*/}
        {/*  />*/}
        {/*</div>*/}
        {/*<div>*/}
        {/*  <TooltipsComponent*/}
        {/*    parentTranslationPath={parentTranslationPath}*/}
        {/*    translationPath={translationPath}*/}
        {/*    isOpen={isTooltipOpen}*/}
        {/*    onOpen={() => setIsTooltipOpen(true)}*/}
        {/*    onClose={() => setIsTooltipOpen(false)}*/}
        {/*    title="coming-soon"*/}
        {/*    contentComponent={*/}
        {/*      <div className="my-3 pipeline-task-library-wrapper">*/}
        {/*        {pipeline_tasks_library_res.map((item, idx) => (*/}
        {/*          <div*/}
        {/*            // role="button"*/}
        {/*            tabIndex={idx}*/}
        {/*            key={`pipeline-task-template-${item.uuid}-${idx}`}*/}
        {/*            className="pipeline-task-card-wrapper p-3 d-flex my-2"*/}
        {/*            // onClick={() => {}}*/}
        {/*            // onKeyDown={() => {}}*/}
        {/*            style={{*/}
        {/*              pointerEvents: 'none',*/}
        {/*            }}*/}
        {/*          >*/}
        {/*            <div>*/}
        {/*              <ButtonBase className="btns theme-transparent miw-0 bg-gray-lighter p-2">*/}
        {/*                <span className="fas fa-random" />*/}
        {/*              </ButtonBase>*/}
        {/*            </div>*/}
        {/*            <div className="mx-3">*/}
        {/*              <div>*/}
        {/*                <span className="mx-half c-gray">*/}
        {/*                  {t(`${translationPath}if-statement`)}*/}
        {/*                </span>*/}
        {/*                <span className="mx-half c-black">{item.source.title}</span>*/}
        {/*                <span className="mx-half c-gray">*/}
        {/*                  {item.source.operator.title}*/}
        {/*                </span>*/}
        {/*                <span className="mx-half c-black">*/}
        {/*                  {item.source.source_value.title}*/}
        {/*                </span>*/}
        {/*              </div>*/}
        {/*              {item.filters.map((filter, filterIdx) => (*/}
        {/*                <div key={`${filterIdx}-filter`}>*/}
        {/*                  <span className="mx-half c-gray">*/}
        {/*                    {filter.main_operator.title}*/}
        {/*                  </span>*/}
        {/*                  <span className="mx-half c-black">*/}
        {/*                    {filter.filter_key.title}*/}
        {/*                  </span>*/}
        {/*                  <span className="mx-half c-gray">*/}
        {/*                    {filter.filter_operator.title}*/}
        {/*                  </span>*/}
        {/*                  <span className="mx-half c-black">*/}
        {/*                    {filter.filter_value.title}*/}
        {/*                  </span>*/}
        {/*                </div>*/}
        {/*              ))}*/}
        {/*              <div>*/}
        {/*                <span className="mx-half c-gray">*/}
        {/*                  {t(`${translationPath}then`)}*/}
        {/*                </span>*/}
        {/*                <span className="mx-half c-black">{item.action.title}</span>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*        ))}*/}
        {/*      </div>*/}
        {/*    }*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
    </>
  );
};

PipelineTaskLibrary.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onOpenedDetailsSectionChanged: PropTypes.func,
  setView: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func,
};
