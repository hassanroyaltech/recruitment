import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  SharedAPIAutocompleteControl,
  ConfirmDeleteDialog,
} from 'pages/setups/shared';
import '../../ProviderProfile.scss';
import {
  ButtonBase,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import i18next from 'i18next';
import moment from 'moment';
import { GlobalDateFormat, showError } from 'helpers';
import { SwitchComponent } from 'components';
import { useSelector } from 'react-redux';
import {
  GetAllProviderBranches,
  RevokeProviderMemberBranchAccess,
  GrantProviderMemberBranchAccess,
  UpdateProviderMember,
  getProviderMemberById,
} from 'services';

export const ProviderProfileTab = ({
  state,
  errors,
  onStateChanged,
  isSubmitted,
  setIsSubmitted,
  isLoading,
  setIsLoading,
  parentTranslationPath,
  translationPath,
  activeItem,
  setReload,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [canEdit, setCanEdit] = useState(false);
  const [isAddBranchOn, setIsAddBranchOn] = useState(false);
  const [grantBranchAccess, setGrantBranchAccess] = useState('');
  const [revokeAccessBranch, setrevokeBranchAccess] = useState(false);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);

  const userReducer = useSelector((state) => state?.userReducer);

  const grantBranchAccessHandler = useCallback(async () => {
    const response = await GrantProviderMemberBranchAccess({
      member_uuid: activeItem.uuid,
      branch_uuid: grantBranchAccess,
    });
    if (response && (response.status === 200 || response.status === 201)) {
      setIsAddBranchOn(false);
      setReload((items) => ({ ...items }));
    }
  }, [activeItem, grantBranchAccess, setReload]);

  const revokeAccessBranchHandler = useCallback(async () => {
    const response = await RevokeProviderMemberBranchAccess({
      member_uuid: activeItem.uuid,
      branch_uuid: revokeAccessBranch,
    });
    if (response && (response.status === 200 || response.status === 201)) {
      setIsAddBranchOn(false);
      setReload((items) => ({ ...items }));
    }
  }, [activeItem, revokeAccessBranch, setReload]);

  const toggleStatusHandler = useCallback(
    async (value) => {
      const memberRes = await getProviderMemberById({
        member_uuid: activeItem && activeItem.uuid,
      });
      if (memberRes && (memberRes.status === 200 || memberRes.status === 201)) {
        const response = await UpdateProviderMember({
          ...memberRes.data.results,
          is_active: value,
          member_uuid: activeItem.uuid,
        });
        if (response && (response.status === 200 || response.status === 201))
          setReload((items) => ({ ...items }));
      } else showError(t('Shared:failed-to-get-saved-data'), memberRes);
    },
    [activeItem, setReload],
  );

  useEffect(() => {
    const loggedInProvider = userReducer?.results?.user; // check later
    if (
      loggedInProvider
      && loggedInProvider?.uuid !== state.user_uuid
      && loggedInProvider?.member_type === 'admin'
    )
      setCanEdit(true);
    else setCanEdit(false);
  }, [state?.user_uuid, userReducer]);

  return (
    <div className="provider-profile-tab-wrapper tab-content-wrapper">
      <div className="profile-general-data-section">
        <Table
          sx={{ border: 1, borderColor: 'rgba(224, 224, 224, 1)', borderRadius: 1 }}
          aria-label="provider profile general data table"
        >
          <TableBody>
            {/* format date */}
            {/* add switch for status */}
            {state.member_type === 'admin' && (
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ width: '20%' }}>
                  {t(`${translationPath}agency-name`)}
                </TableCell>
                <TableCell sx={{ width: '80%' }}>
                  {state?.first_name || '-'}
                </TableCell>
              </TableRow>
            )}
            {[
              ...(state.member_type === 'member'
                ? ['first_name', 'second_name', 'third_name', 'last_name']
                : []),
              'email',
              'type',
            ].map((field) => (
              <TableRow
                key={field}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ width: '20%' }}>
                  {t(`${translationPath}${field.replace('_', '-')}`)}
                </TableCell>
                <TableCell sx={{ width: '80%' }}>{state?.[field] || '-'}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ width: '20%' }}>
                {t(`${translationPath}joined-at`)}
              </TableCell>
              <TableCell sx={{ width: '80%' }}>
                {moment(state?.joined_at)?.format(GlobalDateFormat) || '-'}
              </TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ width: '20%' }}>
                {t(`${translationPath}is-active`)}
              </TableCell>
              <TableCell sx={{ width: '80%' }}>
                <SwitchComponent
                  label={t(
                    `${translationPath}${state.is_active ? 'active' : 'inactive'}`,
                  )}
                  isChecked={state.is_active}
                  labelPlacement="end"
                  isFlexStart
                  onChange={(e, value) => {
                    if (canEdit) toggleStatusHandler(value);
                    else return;
                  }}
                  isDisabled={!canEdit}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="profile-access-branches-section">
        <div className="d-flex-v-center">
          <div className="fw-bold py-4">{t(`${translationPath}access`)}</div>
          {canEdit && !isAddBranchOn && (
            <ButtonBase
              className="btns-icon theme-transparent mx-3"
              onClick={() => setIsAddBranchOn(true)}
            >
              <span className="fas fa-plus" />
            </ButtonBase>
          )}
          {canEdit && isAddBranchOn && (
            <div>
              <ButtonBase
                className="btns-icon theme-transparent mx-3"
                onClick={grantBranchAccessHandler}
                disabled={!grantBranchAccess}
              >
                <span className="fas fa-check" />
              </ButtonBase>
              <ButtonBase
                className="btns-icon theme-transparent mx-3"
                onClick={() => setIsAddBranchOn(false)}
              >
                <span className="fas fa-times" />
              </ButtonBase>
            </div>
          )}
        </div>
        <Table
          sx={{ border: 1, borderColor: 'rgba(224, 224, 224, 1)', borderRadius: 1 }}
          aria-label="provider profile access data table"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '20%' }}>
                {t(`${translationPath}branch`)}
              </TableCell>
              <TableCell sx={{ width: '80%' }}>
                {t(`${translationPath}permissions`)}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state?.access?.map((row) => (
              <TableRow
                key={row.branch_uuid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ width: '20%' }}>
                  {row.branch_name?.[i18next.language] || row.branch_name?.en || '-'}
                </TableCell>
                <TableCell
                  sx={{
                    width: '80%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  {row.permissions
                    ?.map(
                      (permission) =>
                        permission.name?.[i18next.language]
                        || permission.name?.en
                        || '-',
                    )
                    .join(', ')}
                  {canEdit && (
                    <ButtonBase
                      className="btns-icon theme-transparent mx-3"
                      onClick={() => {
                        setIsOpenConfirmDialog(true);
                        setrevokeBranchAccess(row.branch_uuid);
                      }}
                      disabled={state.access.length <= 1}
                    >
                      <span className="fas fa-times" />
                    </ButtonBase>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {isAddBranchOn && (
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ width: '20%' }}>
                  <SharedAPIAutocompleteControl
                    title="branch"
                    isQuarterWidth
                    searchKey="search"
                    stateKey="branch_uuid"
                    placeholder="select-branch"
                    idRef="branchAutocompleteRef"
                    getDataAPI={GetAllProviderBranches}
                    editValue={grantBranchAccess}
                    getOptionLabel={(option) =>
                      (option.name
                        && (option.name[i18next.language]
                          || option.name.en
                          || 'N/A'))
                      || 'N/A'
                    }
                    extraProps={{
                      member_uuid: activeItem.uuid,
                    }}
                    onValueChanged={(newValue) =>
                      setGrantBranchAccess(newValue.value)
                    }
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    getDisabledOptions={(option) =>
                      state?.access?.find(
                        (item) => item?.branch_uuid === option?.uuid,
                      )
                    } // enable later to disable already selected options
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="profile-access-jobs-section">
        <div className="fw-bold py-4">{t(`${translationPath}assigned-jobs`)}</div>
        <Table
          sx={{ border: 1, borderColor: 'rgba(224, 224, 224, 1)', borderRadius: 1 }}
          aria-label="provider profile access data table"
        >
          <TableBody>
            {state?.access?.map((row) => (
              <TableRow
                key={row.branch_uuid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ width: '20%' }}>
                  {row.branch_name?.[i18next.language] || row.branch_name?.en || '-'}
                </TableCell>
                <TableCell sx={{ width: '80%' }}>
                  {row.jobs?.map((job) => (
                    <Chip
                      sx={{
                        borderRadius: 0,
                        marginLeft: '0.25rem',
                        marginRight: '0.25rem',
                      }}
                      key={job.uuid}
                      variant="outlined"
                      label={job.title || 'Job title'}
                      icon={<AccountBoxOutlinedIcon />}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {isOpenConfirmDialog && (
        <ConfirmDeleteDialog
          isConfirmOnly
          onSave={revokeAccessBranchHandler}
          saveType="button"
          isOpenChanged={() => {
            setIsOpenConfirmDialog(false);
          }}
          descriptionMessage="revoke-access-branch-confirm-description"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenConfirmDialog}
        />
      )}
    </div>
  );
};

ProviderProfileTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  setIsSubmitted: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  removeLanguageHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
    member_type: PropTypes.string,
    user_uuid: PropTypes.string,
  }),
  setReload: PropTypes.func,
};

ProviderProfileTab.defaultProps = {
  activeItem: undefined,
};
