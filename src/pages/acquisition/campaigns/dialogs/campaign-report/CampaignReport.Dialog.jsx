import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { GlobalDateFormat, showError } from '../../../../../helpers';
import { DialogComponent, LoaderComponent } from '../../../../../components';
import { GetCampaignReportV2 } from '../../../../../services';
import { CampaignTypes } from '../../../../../enums';
import './CampaignReport.Style.scss';
import TablesComponent from '../../../../../components/Tables/Tables.Component';

export const CampaignReportDialog = ({
  activeItem,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [report, setReport] = useState({ channels_report: [], target_audience: [] });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle reports init
   * @return <void>
   */
  const getDataInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetCampaignReportV2({ campaign_uuid: activeItem.uuid });
    setIsLoading(false);
    if (response && response.status === 200) setReport(response.data.results);
    else
      showError(
        (response && response.data && response.data.message)
          || t(`${translationPath}failed-to-get-saved-data`),
      );
  }, [activeItem.uuid, t, translationPath]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get current status enum
   */
  const getCampaignType = useMemo(
    () => (key) => Object.values(CampaignTypes).find((item) => item.key === key),
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get current status enum
   */
  // const getChannelType = useMemo(
  //   () => (key) => Object.values(ChannelTypesEnums).find((item) => item.key === key),
  //   [],
  // );

  /**
   * @param link
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open external link
   */
  // const onExternalLinkClicked = useCallback(
  //   (link) => (event) => {
  //     event.preventDefault();
  //     window.open(link, '_blank');
  //   },
  //   [],
  // );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this is to get reports on init
   */
  useEffect(() => {
    if (activeItem) getDataInit();
  }, [activeItem, getDataInit]);

  return (
    <DialogComponent
      maxWidth="lg"
      isFixedHeight
      dialogTitle={
        <div className="campaign-manage-title-dialog-wrapper">
          <div className="title-contents-wrapper">
            <div className="campaign-title-icon-wrapper">
              <span className="fas fa-bullhorn fa-lg" />
            </div>
            <div className="title-contents-items-wrapper">
              <div className="title-header-wrapper">
                <span className="px-2 c-black-light">
                  <span>{t(`${translationPath}campaign`)}</span>
                  <span>:</span>
                  <span className="px-1">
                    {(activeItem && activeItem.title) || 'N/A'}
                  </span>
                </span>
              </div>
              <div className="title-body-wrapper">
                <div className="title-body-item-wrapper">
                  <span>
                    <span>{t(`${translationPath}created-by`)}</span>
                    <span>:</span>
                    <span className="px-1">
                      {(report
                        && report.owner
                        && report.owner.name
                        && (report.owner.name[i18next.language]
                          || report.owner.name.en))
                        || 'N/A'}
                    </span>
                  </span>
                </div>
                <div className="title-body-item-wrapper">
                  <span>
                    <span>{t(`${translationPath}total-cost`)}</span>
                    <span>:</span>
                    <span className="px-1">
                      {(report && `${report.cost}`) ?? 'N/A'}
                    </span>
                  </span>
                </div>
                <div className="title-body-item-wrapper">
                  <span>
                    <span>{t(`${translationPath}job`)}</span>
                    <span>:</span>
                    <span className="px-1">
                      {(activeItem && activeItem.job_title) || 'N/A'}
                    </span>
                  </span>
                  <span className="px-2">
                    {activeItem.status && getCampaignType(activeItem.status) && (
                      <span className={getCampaignType(activeItem.status).color}>
                        <span className="fas fa-wave-square" />
                        <span className="px-1">
                          {t(`${getCampaignType(activeItem.status).value}`)}
                        </span>
                      </span>
                    )}
                  </span>
                  <span>
                    <span className="far fa-clock c-green-primary px-2" />
                    <span>{t(`${translationPath}created`)}</span>
                    <span>:</span>
                    <span className="px-1">
                      {(activeItem
                        && activeItem.created_at
                        && moment(activeItem.created_at)
                          .locale(i18next.language)
                          .format(GlobalDateFormat))
                        || 'N/A'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      dialogContent={
        <div className="campaign-report-content-dialog-wrapper">
          {/*<LoaderComponent*/}
          {/*  isLoading={isLoading}*/}
          {/*  isSkeleton*/}
          {/*  wrapperClasses="report-target-audience-wrapper"*/}
          {/*  skeletonItems={[*/}
          {/*    {*/}
          {/*      variant: 'rectangular',*/}
          {/*      className: 'target-audience-content c-secondary mx-2',*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*  numberOfRepeat={5}*/}
          {/*/>*/}
          <LoaderComponent
            isLoading={isLoading}
            isSkeleton
            wrapperClasses="table-loader-wrapper"
            skeletonItems={[
              { variant: 'rectangular', className: 'table-loader-row' },
            ]}
            numberOfRepeat={5}
          />
          {!isLoading && report && report.target_audience && (
            <div className="report-target-audience-wrapper">
              <span className="header-text mb-2 py-1">
                <span>{t(`${translationPath}target-audience`)}</span>
                <span>:</span>
              </span>
              {report.target_audience.map((item, index) => (
                <div
                  className="target-audience-item-wrapper"
                  key={`targetAudienceKey${index + 1}`}
                >
                  <div className="target-audience-content">
                    <span>{item}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && (
            <TablesComponent
              headerData={[
                {
                  id: 1,
                  label: 'channel',
                  input: 'title',
                },
                {
                  id: 2,
                  label: 'status',
                  input: 'status',
                  // eslint-disable-next-line react/prop-types,react/display-name
                  component: ({ status }) => (
                    <span className="px-2">
                      {status && getCampaignType(status) && (
                        <span className={getCampaignType(status).color}>
                          <span className="fas fa-wave-square" />
                          <span className="px-1">
                            {t(`${getCampaignType(status).value}`)}
                          </span>
                        </span>
                      )}
                    </span>
                  ),
                },
                {
                  id: 3,
                  label: 'time-to-process',
                  component: (row) => (
                    <span>
                      {row?.time_to_process?.period >= 0
                        ? `${row?.time_to_process?.period} ${row?.time_to_process?.range} `
                        : ''}
                    </span>
                  ),
                },
                {
                  id: 4,
                  label: 'time-to-setup',
                  component: (row) => (
                    <span>
                      {row?.time_to_setup?.period >= 0
                        ? `${row?.time_to_setup?.period} ${row?.time_to_setup?.range} `
                        : ''}
                    </span>
                  ),
                },
                {
                  id: 5,
                  label: 'duration',
                  component: (row) => (
                    <span>
                      {row?.duration?.period >= 0
                        ? `${row?.duration?.period} ${row?.duration?.range} `
                        : ''}
                    </span>
                  ),
                },
              ]}
              data={(report && report.channels_report) || []}
              pageIndex={0}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              totalItems={
                (report
                  && report.channels_report
                  && report.channels_report.length)
                || 0
              }
            />
          )}
        </div>
      }
      wrapperClasses="campaign-report-dialog-wrapper"
      isOpen={isOpen}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

CampaignReportDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
    status: PropTypes.number,
    campaign_channels: PropTypes.instanceOf(Array),
    campaign_contracts: PropTypes.instanceOf(Array),
    cost: PropTypes.number,
    title: PropTypes.string,
    job_title: PropTypes.string,
    vendor_type: PropTypes.oneOf([1, 2]),
    created_at: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};

CampaignReportDialog.defaultProps = {
  isOpenChanged: undefined,
  translationPath: 'CampaignReportDialog.',
  activeItem: undefined,
};
