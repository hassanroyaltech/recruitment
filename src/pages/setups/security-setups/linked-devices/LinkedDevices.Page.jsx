import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { ButtonBase, Grid } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import styled from 'styled-components';
import { showError } from '../../../../helpers';
import {
  DeleteVerifiedDevices,
  GetVerifiedDevices,
} from '../../../../services/SetupsLinkedDevices.Services';
import { ConfirmDeleteDialog } from '../../shared';
import moment from 'moment/moment';

const GridRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const parentTranslationPath = 'SetupsPage';
const translationPath = 'SecurityPages.';
const LinkedDevicesPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [linkedDevicesData, setLinkedDevicesData] = useState();
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [reLoad, setReLoad] = useState({});
  const [activeItem, setActiveItem] = useState(null);

  const getVerifiedDevice = useCallback(async () => {
    setIsLoading(true);
    const response = await GetVerifiedDevices();
    setIsLoading(false);
    if (response && response.status === 200)
      setLinkedDevicesData(response.data.body);
    else showError(t('Shared:failed-to-get-saved-data'));
  }, [t]);

  useEffect(() => {
    getVerifiedDevice();
  }, [getVerifiedDevice, reLoad]);

  return (
    <div className="linked-devices-wrapper page-wrapper">
      <span className="header-text-x2 d-flex mb-1">
        {t(`${translationPath}linked-devices`)}
      </span>
      <div className="description-text mt-3">
        <div>
          <p>
            {t(`${translationPath}linked-devices-description`)}
            {'. '}
            {t(`${translationPath}browser-description`)}
          </p>
        </div>
      </div>
      {linkedDevicesData?.map((item, index) => (
        <div className="d-flex-h-center" key={`${item.uuid}-device`} value={item}>
          {!isLoading && (
            <Card className="card-contents-wrapper card h-100 w-50 mt-5">
              <CardHeader>
                <div className="d-flex-v-start-h-end">
                  <ButtonBase
                    className="ml-3"
                    onClick={() => {
                      setActiveItem(item.uuid);
                      setIsOpenDeleteDialog(true);
                    }}
                  >
                    <span className="fas fa-trash fa-xs text-danger fa-1x" />
                  </ButtonBase>
                </div>
                <Grid>
                  <GridRow className="d-flex-h-center p-2">
                    <Avatar style={{ backgroundColor: '#070c75' }}>
                      <i className="fas fa-laptop" />
                    </Avatar>
                    <p className="text-bold-700 ml-2">{item?.os}</p>
                  </GridRow>
                  <GridRow className="d-flex-h-center">
                    <p className="bd-highlight text-xs">{item?.device_brand}</p>
                  </GridRow>
                  <GridRow className="d-flex-h-center">
                    <p className="bd-highlight text-xs">{item?.device_model}</p>
                  </GridRow>
                  <GridRow className="d-flex-h-center">
                    <span className="text-bold-500">
                      {t(`${translationPath}verified-at`)} {': '}
                    </span>
                    <span className="text-bold-500 ">
                      {moment(Date.parse(item?.verified_at)).format('DD MMM YYYY')}
                    </span>
                  </GridRow>
                </Grid>
              </CardHeader>
              <CardBody>
                <p className="text-bold-700">
                  {t(`${translationPath}browser-apps-services`)}
                </p>
                <p className="bd-highlight text-sm">{item?.browser}</p>
                <p className="text-sm">{item?.device}</p>
              </CardBody>
            </Card>
          )}
        </div>
      ))}
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          onSave={() => {
            setReLoad((prev) => ({ ...prev }));
            setActiveItem(null);
          }}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
          }}
          deleteApi={DeleteVerifiedDevices}
          successMessage="device-deleted-successfully"
          descriptionMessage="device-delete-description"
          apiProps={{
            uuid: activeItem,
          }}
          apiDeleteKey="uuid"
          isOpen={isOpenDeleteDialog}
          errorMessage="device-delete-failed"
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

export default LinkedDevicesPage;
