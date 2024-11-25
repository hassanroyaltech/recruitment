/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'api/middleware';
import { connect } from 'react-redux';
import RecuiterPreference from 'utils/RecuiterPreference';

import { Button, UncontrolledTooltip } from 'reactstrap';

import '../Preference.scss';
// react plugin that prints a given react component

// react component for creating dynamic tables
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {
  Search,
} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';

// react component used to create sweet alerts

// core components
import { getParam } from 'shared/utils';
import { generateHeaders } from 'api/headers';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { Actions } from '../PreferenceStyles';
import Loader from '../components/Loader';
import Empty from '../components/Empty';

const translationPath = 'EmailTemplates.';
const parentTranslationPath = 'RecruiterPreferences';

const { SearchBar } = Search;
const SystemTemplateTable = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [totalSize, setTotalSize] = useState();
  const [systemTemplates, setSystemTemplates] = useState();
  // method  to send current active language to parent
  const activeEditLanguageClicked = useCallback(
    (currentLanguage) => () => {
      if (props.onActiveEditLanguageChanged)
        props.onActiveEditLanguageChanged(currentLanguage);
    },
    [props.onActiveEditLanguageChanged],
  );
  useEffect(() => {
    if (!props.isSelected || systemTemplates) return;
    const getSystemTemplates = async () =>
      await axios
        .get(RecuiterPreference.SYSTEM_TEMPLATES, {
          params: {
            limit: 100,
          },
          headers: generateHeaders(),
        })
        .then((res) => {
          setTotalSize(res.data.results.total);
          setSystemTemplates(res.data.results.data);
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    getSystemTemplates();
  }, [props.isSelected]);
  return (
    <>
      {!systemTemplates && <Loader />}
      {systemTemplates && (
        <ToolkitProvider
          data={systemTemplates}
          keyField="id"
          columns={[
            {
              dataField: 'index',
              text: '#',
              isDummyField: true,
              editable: false,
              formatter: (cellContent, row, rowIndex) => <span>{rowIndex + 1}</span>,
            },
            {
              dataField: 'title',
              text: t(`${translationPath}system-template-name`),
              sort: true,
            },

            {
              dataField: 'language',
              text: t(`${translationPath}languages`),
              isDummyField: true,
              editable: false,

              formatter: (cellContent, row) => (
                <div className="avatar-group">
                  {row.translation &&
                    row.translation.map((translation, i) => (
                      <ButtonBase
                        className={`btns-icon theme-solid mx-1${
                          (props.activeEditLanguage &&
                            props.activeEditLanguage.id ===
                              translation.language.id &&
                            ' bg-secondary') ||
                          ''
                        }`}
                        onClick={activeEditLanguageClicked(translation.language)}
                        key={`activeTranslationLanguageKey${i + 1}${
                          translation.language.code
                        }`}
                      >
                        <span>{translation.language.code}</span>
                      </ButtonBase>
                    ))}
                </div>
              ),
              formatExtraData: props.activeEditLanguage,
            },

            {
              editable: false,
              dataField: 'actions',
              text: t(`${translationPath}actions`),
              isDummyField: true,
              formatter: (cellContent, row) => (
                <Actions>
                  <Button
                    id="action-edit"
                    className="btn-icon btn mr--2 bg-transparent"
                    size="sm"
                    color="transparent"
                    type="button"
                    onClick={(e) => props.openEditModal(row)}
                  >
                    <span className="btn-inner--icon ">
                      <i className="fas fa-pen" />
                    </span>
                  </Button>
                  <UncontrolledTooltip target="action-edit">
                    {t(`${translationPath}edit-template`)}
                  </UncontrolledTooltip>
                </Actions>
              ),
            },
          ]}
          search
        >
          {(tableProps) => (
            <>
              {systemTemplates.length ? (
                <div
                  id="datatable-basic_filter"
                  className="dataTables_filter px-4 float-left mt-3 mb-2"
                >
                  <SearchBar
                    className="form-control-sm"
                    placeholder="Search"
                    {...tableProps.searchProps}
                  />
                </div>
              ) : (
                ''
              )}
              <div className="w-100 table-responsive">
                {!systemTemplates.length ? (
                  <Empty
                    message={t(`${translationPath}no-system-templates-found`)}
                  />
                ) : (
                  <BootstrapTable
                    {...tableProps.baseProps}
                    bootstrap4
                    bordered
                    striped
                    hover
                    condensed
                    pagination={paginationFactory({
                      page: parseInt(getParam('page')) || 1,
                      sizePerPage: parseInt(getParam('limit')) || 10,
                      alwaysShowAllBtns: true,
                      showTotal: true,
                      withFirstAndLast: false,
                      totalSize,

                      onPageChange: async (page, sizePerPage) => {
                        props.history.push({
                          search: `?limit=${sizePerPage}&page=${page}`,
                        });
                      },
                      onSizePerPageChange: async (sizePerPage, page) => {
                        props.history.push({
                          search: `?limit=${sizePerPage}&page=${page}`,
                        });
                      },
                      sizePerPageRenderer: ({
                        options,
                        currSizePerPage,
                        onSizePerPageChange,
                      }) => (
                        <div
                          className="dataTables_length"
                          id="datatable-basic_length"
                        >
                          <label>
                            {t(`${translationPath}show`)}{' '}
                            {
                              <select
                                name="datatable-basic_length"
                                aria-controls="datatable-basic"
                                className="form-control form-control-sm"
                                onChange={(e) => onSizePerPageChange(e.target.value)}
                              >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                              </select>
                            }{' '}
                            {t(`${translationPath}entries`)}.
                          </label>
                        </div>
                      ),
                    })}
                  />
                )}
              </div>
            </>
          )}
        </ToolkitProvider>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.Account,
});
export default connect(mapStateToProps)(SystemTemplateTable);
