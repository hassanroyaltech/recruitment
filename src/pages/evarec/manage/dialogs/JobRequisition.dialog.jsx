// React and reactstrap
import React, { useMemo } from 'react';
import { DialogComponent } from '../../../../components';
import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip } from '@mui/material';
import Helpers from '../../../../utils/Helpers';
import i18next from 'i18next';
import './JobRequisitions.Style.scss';
import { DownloadLinkHelper } from '../../../../helpers';
import ButtonBase from '@mui/material/ButtonBase';

const JobRequisitionDialog = ({
  isOpen,
  onCloseClicked,
  onCancelClicked,
  parentTranslationPath,
  requisitionDetails,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const extraInfoFields = useMemo(
    () => [
      {
        name: 'serial-number',
        extractDataFunc: (row) => row?.serial_no || '-',
      },
      {
        name: 'reason-for-recruitment',
        extractDataFunc: (row) => (row?.reason ? t(row.reason) : '-'),
      },
      {
        name: 'hierarchy-org',
        extractDataFunc: (row) =>
          row?.hierarchy?.[i18next.language] || row?.hierarchy?.en || '-',
      },
      {
        name: 'job-type',
        extractDataFunc: (row) =>
          row?.job_type?.[i18next.language] || row?.job_type?.en || '-',
      },
      {
        name: 'location',
        extractDataFunc: (row) => row?.location || '-',
      },
      {
        name: 'nationality',
        extractDataFunc: (row) => row?.nationality || '-',
      },
      {
        name: 'qualifications',
        extractDataFunc: (row) => row?.qualifications || '-',
      },
      {
        name: 'years-of-experience',
        extractDataFunc: (row) => row?.years_of_experience || '-',
      },
      {
        name: 'no-of-openings',
        extractDataFunc: (row) => row?.no_of_openings || '-',
      },
      {
        name: 'requested-joining-date',
        extractDataFunc: (row) => row?.joining_date || '-',
      },
      {
        name: 'project',
        extractDataFunc: (row) => row?.project || '-',
      },
      {
        name: 'skills',
        extractDataFunc: (row) => (row?.skills || []).join(', ') || '-',
      },
      {
        name: 'description',
        extractDataFunc: (row) =>
          row?.translations?.description?.[i18next.language]
          || row?.description
          || '-',
        isHTML: true,
      },
      {
        name: 'requirements',
        extractDataFunc: (row) =>
          row?.translations?.requirements?.[i18next.language]
          || row?.requirements
          || '-',
        isHTML: true,
      },
      {
        name: 'salary-range',
        extractDataFunc: (row) =>
          row.salary_range?.from || row.salary_range?.to
            ? `${row.salary_range?.from} - ${row.salary_range?.to}`
            : '-',
      },
      {
        name: 'job-description-attachment',
        getAttachments: (row) => row.job_description_attachment,
      },
    ],
    [t],
  );

  /**
   * Return JSX
   */
  return (
    <>
      {isOpen && (
        <DialogComponent
          maxWidth="sm"
          titleText={t('approved-requisition-details')}
          dialogContent={
            <div className="d-flex flex-wrap">
              <div className="d-flex my-1 ">
                <p className="field-title text-muted">
                  {t('position-information-justification')}
                </p>
                <p className={'field-value fz-12px'}>
                  {requisitionDetails?.comment || '-'}
                </p>
              </div>
              <div className="d-flex my-1 ">
                <p className="field-title text-muted">{t('attachments')}</p>
                <p className={'field-value fz-12px'}>
                  <div className="attachments-list-wrapper">
                    {requisitionDetails?.attachment?.length > 0
                      ? requisitionDetails?.attachment.map((item, index) => (
                        <div
                          key={`${index + 1}-atachments`}
                          className="d-flex-v-center "
                        >
                          <p className={'fz-12px'}>{item?.original?.name}</p>
                          <div className="px-2">
                            <a
                              rel="noreferrer"
                              target="_blank"
                              href={item?.original?.url}
                            >
                              <Tooltip title="View">
                                <span>
                                  <IconButton>
                                    <i className="fas fa-eye is-dark font-14" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </a>
                            <Tooltip title="Download">
                              <a
                                download
                                rel="noreferrer"
                                href={`${Helpers.DOWNLOAD}?file=${item?.original?.path}`}
                              >
                                <IconButton onClick={() => {}}>
                                  <i className="fas fa-download is-dark font-14" />
                                </IconButton>
                              </a>
                            </Tooltip>
                          </div>
                        </div>
                      ))
                      : '-'}
                  </div>
                </p>
              </div>
              {requisitionDetails?.extra_info
                ? extraInfoFields.map((item, idx) => (
                  <div key={`${idx}-${item.name}`} className="my-1 d-flex">
                    <p className="field-title text-muted">{t(item.name)}</p>
                    {item?.isHTML ? (
                      <div className="value-paragraph field-value fz-12px">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: item?.extractDataFunc(
                              requisitionDetails.extra_info,
                            ),
                          }}
                        ></p>
                      </div>
                    ) : (
                      <p className={'field-value fz-12px'}>
                        {item.getAttachments
                            && item.getAttachments(requisitionDetails.extra_info)
                            && item
                              .getAttachments(requisitionDetails.extra_info)
                              .map((element) => (
                                <div
                                  className="d-flex c-black"
                                  key={
                                    element.id
                                    || element.original?.uuid
                                    || element.uuid
                                  }
                                >
                                  <a
                                    href={
                                      element.link
                                      || element.original?.url
                                      || element.url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {element.name || element.original?.name}
                                  </a>
                                  <div className="px-2 d-inline-flex">
                                    <a
                                      rel="noreferrer"
                                      target="_blank"
                                      href={element.original?.url || element.url}
                                    >
                                      <Tooltip title="View">
                                        <span>
                                          <ButtonBase className="btns-icon theme-transparent">
                                            <i className="fas fa-eye  font-14" />
                                          </ButtonBase>
                                        </span>
                                      </Tooltip>
                                    </a>
                                    <Tooltip title="Download">
                                      <a
                                        download
                                        rel="noreferrer"
                                        href={`${DownloadLinkHelper}?file=${
                                          element.original?.path || element.url
                                        }`}
                                      >
                                        <ButtonBase
                                          className="btns-icon theme-transparent"
                                          onClick={() => {}}
                                        >
                                          <i className="fas fa-download is-dark font-14" />
                                        </ButtonBase>
                                      </a>
                                    </Tooltip>
                                  </div>
                                </div>
                              ))}
                        {(item.extractDataFunc
                            && !item.getAttachments
                            && item.extractDataFunc(requisitionDetails.extra_info))
                            || '-'}
                      </p>
                    )}
                  </div>
                ))
                : null}
            </div>
          }
          wrapperClasses="requisition-details-dialog"
          isOpen={isOpen}
          saveType="Edit"
          onCloseClicked={() => onCloseClicked()}
          onCancelClicked={() => onCancelClicked()}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </>
  );
};
export default JobRequisitionDialog;
