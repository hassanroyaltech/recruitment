import React, { useState, useEffect } from 'react';
import axios from 'api/middleware';
import { connect } from 'react-redux';
import Helpers from 'utils/Helpers';
import SimpleHeader from 'components/Headers/SimpleHeader';
import { getLastURLSegment, kebabToTitle } from 'shared/utils';
import { generateHeaders } from 'api/headers';
import { useTranslation } from 'react-i18next';
import EditModal from './EditModal';
import AddModal from './AddModal';
import TablesWrapper from './TablesWrapper';
import './EmailTemplates.Style.scss';
import { useQuery, useTitle } from '../../../hooks';

const translationPath = 'EmailTemplates.';
const parentTranslationPath = 'RecruiterPreferences';

const EmailTemplates = (props) => {
  const query = useQuery();

  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const [reloadData, setReloadData] = useState({ reload: false });
  const { t } = useTranslation(parentTranslationPath);
  const [activeEditLanguage, setActiveEditLanguage] = useState(null);
  const [languages, setLanguages] = useState();
  useTitle(t(`${translationPath}email-templates`));
  useEffect(() => {
    const getLanguages = async () => {
      await axios
        .get(Helpers.LANGUAGES, {
          headers: generateHeaders(),
        })
        .then((res) => {
          setLanguages(res.data.results);
        });
    };
    getLanguages();
  }, [user.company_id, user.token]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [template, setTemplate] = useState();
  const openModal = (row) => {
    setIsAddModalOpen(true);
  };
  const openEditModal = (row) => {
    setTemplate(row);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setIsAddModalOpen(false);
  };
  const onSaveHandler = () => {
    setReloadData((item) => ({ ...item, reload: !item.reload }));
  };

  useEffect(() => {
    if (query.get('openModal')) setIsAddModalOpen(true);
  }, [query]);

  return (
    <>
      {/* Header */}
      <SimpleHeader
        name={kebabToTitle(getLastURLSegment())}
        parentName="Preferences"
      />

      {/* Header */}
      <div className="w-100 mt--8 px-4 pb-4">
        {template && languages && isModalOpen && (
          <EditModal
            template={template}
            isOpen={isModalOpen}
            closeModal={closeModal}
            user={user}
            onSave={onSaveHandler}
            activeEditLanguage={activeEditLanguage}
            languages={languages}
            {...props}
          />
        )}

        {languages && isAddModalOpen && isAddModalOpen && (
          <AddModal
            isOpen={isAddModalOpen}
            closeModal={closeModal}
            onSave={onSaveHandler}
            user={user}
            languages={languages}
            {...props}
          />
        )}
        {/* View Modal */}
        {/* Email Tables Wrapper */}
        <TablesWrapper
          openEditModal={openEditModal}
          openModal={openModal}
          closeModal={closeModal}
          reloadData={reloadData}
          {...props}
          activeEditLanguage={activeEditLanguage}
          onActiveEditLanguageChanged={(newValue) => setActiveEditLanguage(newValue)}
        />
        {/* Email Tables Wrapper */}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.Account,
  configs: state.Configs,
});
export default connect(mapStateToProps)(EmailTemplates);
