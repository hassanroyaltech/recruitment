import React, { useState, useEffect, useCallback } from 'react';

import axios from 'api/middleware';
import { connect, useSelector } from 'react-redux';
import urls from 'api/urls';
import SimpleHeader from 'components/Headers/SimpleHeader';
import { getLastURLSegment, kebabToTitle, getFullURL } from 'shared/utils';
import { generateHeaders } from 'api/headers';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import QuestionnaireTable from './QuestionnaireTable';
import { useTitle } from '../../../hooks';
import { Inputs } from '../../../components';
import { getIsAllowedPermissionV2, showError } from '../../../helpers';
import { QuestionnairesPermissions } from '../../../permissions';

const translationPath = 'Questionnaire.';
const mainParentTranslationPath = 'RecruiterPreferences';

const Questionnaire = (props) => {
  const { t } = useTranslation(mainParentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [questionnaires, setQuestionnaires] = useState({
    results: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    limit: 10,
    page: 0,
  });
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );

  useTitle(t(`${translationPath}questionnaires-list`));

  const getQuestionnaires = useCallback(
    async (search) => {
      setIsLoading(true);
      const queryList = [];
      if (filter.limit || filter.limit === 0)
        queryList.push(`limit=${filter.limit}`);
      if (filter.page || filter.page === 0)
        queryList.push(`page=${filter.page + 1}`);
      if (search && search !== '') queryList.push(`query=${search}`);
      await axios
        .get(`${urls.questionnaire.questionnaire_GET}?${queryList.join('&')}`, {
          headers: generateHeaders(),
        })
        .then((res) => {
          setQuestionnaires(() => ({
            results: res.data.results.data || [],
            totalCount: res.data.results.total ? res.data.results.total : 0,
          }));
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    },
    [t, filter.limit, filter.page],
  );

  useEffect(() => {
    getQuestionnaires();
  }, [getQuestionnaires, filter]);

  const handleView = (e, row) => {
    props.history.push(
      `/recruiter/recruiter-preference/questionnaire/questions/${row.uuid}`,
      {
        questionnaire: { ...row },
      },
    );
  };
  const removeQuestionnaire = () => {
    setIsLoading(true);
    setFilter((items) => ({ ...items, page: 0 }));
  };

  const jobSearchHandler = () => {
    setIsLoading(true);
    getQuestionnaires(searchValue);
  };

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change active page
   */
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex }));
  };

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change page size
   */
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  const fullURL = getFullURL();
  const lastURLSegment = getLastURLSegment();
  const isOnQuestions = fullURL.includes('questions');

  return (
    <>
      {/* Header */}
      <SimpleHeader
        name={
          isOnQuestions
            ? t(`${translationPath}edit-question`)
            : kebabToTitle(lastURLSegment)
        }
        parentName="Preferences"
      />
      {/* Header */}
      <div className="px-4 mt--8 pt-4">
        <div className="pl-2-reversed d-flex align-items-center pb-2 justify-content-between">
          <div className="d-flex align-items-center">
            <div className="d-inline-flex px-2 mb-2">
              <Inputs
                idRef="searchRef"
                value={searchValue}
                themeClass="theme-solid"
                label="search"
                translationPath={translationPath}
                parentTranslationPath={mainParentTranslationPath}
                onInputChanged={(event) => {
                  if (event.target.value === '') getQuestionnaires();
                  setSearchValue(event.target.value);
                }}
                endAdornment={
                  <div className="end-adornment-wrapper">
                    <ButtonBase
                      className="btns-icon theme-transparent"
                      disabled={isLoading}
                      onClick={jobSearchHandler}
                    >
                      <span className="fas fa-search" />
                    </ButtonBase>
                  </div>
                }
              />
            </div>
          </div>

          <ButtonBase
            className="btns theme-solid px-4"
            disabled={
              !getIsAllowedPermissionV2({
                permissionId: QuestionnairesPermissions.AddQuestionnaires.key,
                permissions: permissionsReducer,
              })
            }
            onClick={() =>
              props.history.push('/recruiter/recruiter-preference/questionnaire/add')
            }
          >
            <i className="fas fa-plus pr-2-reversed" />
            {t(`${translationPath}add-new-questionnaire`)}
          </ButtonBase>
        </div>
        <QuestionnaireTable
          filter={filter}
          isLoading={isLoading}
          data={questionnaires}
          handleView={handleView}
          history={props.history}
          onPageSizeChanged={onPageSizeChanged}
          onPageIndexChanged={onPageIndexChanged}
          removeQuestionnaire={removeQuestionnaire}
          onDataChanged={(newValue) => {
            setQuestionnaires((items) => ({ ...items, results: newValue }));
          }}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.Account,
  configs: state.Configs,
});
export default connect(mapStateToProps)(Questionnaire);
