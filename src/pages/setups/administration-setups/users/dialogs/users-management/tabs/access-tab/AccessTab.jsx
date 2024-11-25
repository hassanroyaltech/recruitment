import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  ButtonBase,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Skeleton,
} from '@mui/material';
import i18next from 'i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccessItemComponent } from './AccessItemComponent';
import '../PermissionsManagement.Style.scss';
import { GetAllSetupsBranches } from '../../../../../../../../services';

export const AccessTab = ({
  state,
  errors,
  isSubmitted,
  saveClickedCount,
  onStateChanged,
  translationPath,
  isWithoutStatus,
  isWithoutCategory,
  parentTranslationPath,
  permissionsCategories,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [expanded, setExpanded] = useState(
    (state.user_access && state.user_access.length > 0 && `panel-${1}`) || '',
  );
  const [branchesList, setBranchesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleExpandChange = (panel, item) => (event, isExpanded) => {
    if (item.toggles && item.toggles.length === 0) return;
    setExpanded(isExpanded ? panel : '');
  };

  const getBranchesHandler = useCallback(async () => {
    const companies = state.user_access.map((item) => item.company_uuid);

    setLoading(true);
    const response = await GetAllSetupsBranches({
      limit: 50,
      page: 1,
      with_than: companies,
    });
    if (response && response.status === 200) setBranchesList(response.data.results);
    setLoading(false);
  }, [state.user_access]);

  useEffect(() => {
    for (let i = 0; i < state.user_access?.length; i++)
      if (isSubmitted && Object.keys(errors)?.join('')?.includes(`[${i}]`)) {
        handleExpandChange(`panel-${i + 1}`, state.user_access[i])('', true);
        break;
      }
  }, [errors, isSubmitted, state.user_access, saveClickedCount]);

  useEffect(() => {
    getBranchesHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {state.user_access
        && state.user_access.map((item, index) => (
          <div
            key={`${index + 1}-user-access-permissions-branch`}
            className={`mb-${loading ? '2' : '4'}`}
          >
            {loading ? (
              <Skeleton height={70} />
            ) : (
              <Accordion
                expanded={expanded === `panel-${index + 1}`}
                onChange={handleExpandChange(`panel-${index + 1}`, item)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <span className="fw-bold">
                    {branchesList.find((branch) => item.company_uuid === branch.uuid)
                      ?.name?.[i18next.language]
                      || branchesList.find(
                        (branch) => item.company_uuid === branch.uuid,
                      )?.name?.en}
                  </span>
                </AccordionSummary>
                <AccordionDetails>
                  <AccessItemComponent
                    state={state}
                    errors={errors}
                    accessItem={item}
                    accessItemIndex={index}
                    isSubmitted={isSubmitted}
                    isWithoutStatus={isWithoutStatus}
                    isWithoutCategory={isWithoutCategory}
                    onStateChanged={onStateChanged}
                    permissionsCategories={permissionsCategories}
                    outerExpanded={expanded}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                </AccordionDetails>
              </Accordion>
            )}
          </div>
        ))}
      <ButtonBase
        onClick={() => {
          const accessLocalArray = {
            status: true,
            company_uuid: '',
            category_uuid: [],
            permissions: [],
            role_permissions: [],
          };
          if (isWithoutStatus) delete accessLocalArray.status;
          if (isWithoutCategory) delete accessLocalArray.category_uuid;

          state.user_access.push(accessLocalArray);
          onStateChanged({ id: 'user_access', value: state.user_access });
        }}
        className="btns theme-solid"
      >
        <span className="fas fa-plus" />
        <span className="px-1">{t(`${translationPath}add-access`)}</span>
      </ButtonBase>
    </div>
  );
};

AccessTab.propTypes = {
  state: PropTypes.shape({
    user_access: PropTypes.instanceOf(Array).isRequired,
  }).isRequired,
  permissionsCategories: PropTypes.instanceOf(Array).isRequired,
  translationPath: PropTypes.string,
  isSubmitted: PropTypes.bool.isRequired,
  saveClickedCount: PropTypes.number.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  isWithoutStatus: PropTypes.bool,
  isWithoutCategory: PropTypes.bool,
};
AccessTab.defaultProps = {
  translationPath: 'UsersInfoDialog.',
  isWithoutStatus: false,
  isWithoutCategory: false,
};
