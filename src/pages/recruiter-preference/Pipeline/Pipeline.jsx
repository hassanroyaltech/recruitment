import React from 'react';
import axios from 'api/middleware';
import RecuiterPreference from 'utils/RecuiterPreference';
import { ToastProvider } from 'react-toast-notifications';
import SimpleHeader from 'components/Headers/SimpleHeader';
import { Route, Switch } from 'react-router-dom';
import { getLastURLSegment, kebabToTitle, getFullURL } from 'shared/utils';
import { Helmet } from 'react-helmet';
import { generateHeaders } from 'api/headers';
import { useTranslation } from 'react-i18next';
import PipelineTable from './PipelineTable.jsx';
import { showError } from '../../../helpers';

const translationPath = 'Pipeline.';
const parentTranslationPath = 'RecruiterPreferences';

const Pipeline = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const user = JSON.parse(localStorage.getItem('user'))?.results;

  const handlePipelineEdit = async (pipelineUUID, newTitle) => {
    await axios
      .put(
        RecuiterPreference.pipelines_WRITE,
        { uuid: pipelineUUID, title: newTitle },
        {
          headers: generateHeaders(),
        },
      )
      .then((res) => {})
      .catch((error) => showError(t('Shared:failed-to-get-saved-data'), error));
  };

  const handleEdit = (e, pipeline) => {
    props.history.push({
      pathname: `/recruiter/recruiter-preference/pipeline/edit-pipeline/${pipeline.uuid}`,
      state: { pipeline },
    });
  };

  const fullURL = getFullURL();
  const lastURLSegment_ = getLastURLSegment();
  const isStage = fullURL.includes('edit-pipeline');
  const TITLE = t(`${translationPath}pipeline`);
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <ToastProvider placement="top-center">
        {/* Header */}
        <SimpleHeader
          name={
            isStage
              ? t(`${translationPath}edit-stages`)
              : kebabToTitle(lastURLSegment_)
          }
          parentName="Preferences"
        />

        {/* Header */}

        <div className="mt--8 container-fluid">
          <div className="row pb-4 flex-mobile-row-reverse-2">
            <div className="col-12 card_0 tab-content pt-4">
              <Switch>
                <Route exact path="/recruiter/recruiter-preference/pipeline">
                  <div className="tab-pane active" id="e_rp_1" role="tabpanel">
                    <div className="mb-lg-0 h-100 hide-content1 hide-content2 show-content">
                      {/* Table - Start */}
                      <PipelineTable
                        handleEdit={handleEdit}
                        handlePipelineEdit={handlePipelineEdit}
                        user={user}
                        {...props}
                      />
                      {/* Table - End */}
                    </div>
                  </div>
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </ToastProvider>
    </>
  );
};

export default Pipeline;
