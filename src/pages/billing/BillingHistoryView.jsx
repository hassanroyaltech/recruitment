import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  TextField,
  IconButton,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import './Styles/BillingHistoryView.Styles.scss';
import Skeleton from '@mui/material/Skeleton';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { administrationAPI } from '../../api/administration';
import inactiveDownload from '../../assets/icons/icon_download_inactive.svg';
import activeDownload from '../../assets/icons/icon_download.svg';
import noSubscriptionsImg from '../../assets/images/shared/noSubscribtions.svg';

const translationPath = '';
const parentTranslationPath = 'Billing';

export const BillingHistoryView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getHistoryData = useCallback(
    (searchValue) => {
      setHistoryLoading(true);
      administrationAPI
        .GetAllFilteredTransactions(
          page + 1,
          rowsPerPage,
          orderBy ? 0 : 1,
          searchValue,
        )
        .then((response) => {
          setHistoryData(response?.data?.results?.data);
          setTotalCount(response?.data?.results?.total);
          setHistoryLoading(false);
        });
    },
    [page, orderBy, rowsPerPage],
  );

  useEffect(() => {
    getHistoryData('');
  }, [getHistoryData]);

  return (
    <div className="billing-history-view-wrapper">
      <div className="billing-history-view-content">
        <div className="billing-history-title">
          {t(`${translationPath}billing-history`)}
        </div>
        <div className="billing-history-filter-wrapper">
          <div className="search-field-wrapper">
            <TextField
              fullWidth
              variant="outlined"
              label={t(`${translationPath}search`)}
              placeholder={t(`${translationPath}invoice-number`)}
              onChange={(e) => {
                setTransactionId(e.target.value);
                if (e.target.value === '') getHistoryData('');
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => getHistoryData(transactionId)}
                    >
                      <i className="fas fa-search" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {/* <div className="sort-field-wrapper"> */}
          {/*  <FormControl variant="outlined"> */}
          {/*    <TextField */}
          {/*      select */}
          {/*      fullWidth */}
          {/*      variant="outlined" */}
          {/*      value={orderBy} */}
          {/*      InputProps={{ */}
          {/*        startAdornment: ( */}
          {/*          <InputAdornment position="start"> */}
          {/*            <span className="input-stage">{t(`${translationPath}sort-by`)}</span> */}
          {/*            <div className="vertical-divider" /> */}
          {/*          </InputAdornment> */}
          {/*        ), */}
          {/*        endAdornment: ( */}
          {/*          <InputAdornment position="end"> */}
          {/*            <div className="vertical-divider" /> */}
          {/*            <IconButton size="small"> */}
          {/*              <i className="fas fa-sort-amount-down" /> */}
          {/*            </IconButton> */}
          {/*          </InputAdornment> */}
          {/*        ), */}
          {/*      }} */}
          {/*    > */}
          {/*      <MenuItem value={0} onClick={() => setOrderBy(false)}> */}
          {/*        {t(`${translationPath}descending`)} */}
          {/*      </MenuItem> */}
          {/*      <MenuItem value={1} onClick={() => setOrderBy(true)}> */}
          {/*        {t(`${translationPath}ascending`)} */}
          {/*      </MenuItem> */}
          {/*    </TextField> */}
          {/*  </FormControl> */}
          {/* </div> */}
        </div>
        {!historyData || historyData.length === 0 ? (
          <div className="history-image">
            <img alt="no-plans" src={noSubscriptionsImg} />
          </div>
        ) : (
          <>
            <div className="billing-history-table-wrapper">
              <div className="table-rows-wrapper table-row">
                <div className="table-row is-header">
                  <div className="table-column is-ref">
                    {t(`${translationPath}invoice`)}
                  </div>
                  <div className="table-column">
                    {t(`${translationPath}description`)}
                  </div>
                  <div className="table-column">
                    {t(`${translationPath}payment-method`)}
                  </div>
                  <div className="table-column is-date">
                    <Button onClick={() => setOrderBy((item) => !item)}>
                      {t(`${translationPath}date`)}
                      <i className={`fa fa-arrow-${orderBy ? 'up' : 'down'} px-2`} />
                    </Button>
                  </div>
                  <div className="table-column is-price">
                    {t(`${translationPath}amount`)}
                  </div>
                  {/* <div className="table-column is-status"> */}
                  {/*  {t(`${translationPath}status`)} */}
                  {/* </div> */}
                  <div className="table-column is-download">
                    {t(`${translationPath}download`)}
                  </div>
                </div>
                {!historyLoading ? (
                  historyData
                  && historyData.length > 0
                  && historyData.map((item, index) => (
                    <div key={`${index + 1}-history-row`} className="table-row">
                      <div className="table-column is-ref">{item.ref_number}</div>
                      <div className="table-column">
                        {`${item.product || ''} ${item.source_title} ${
                          item.source_type
                            ? item.source_type === 2
                              ? `/ ${t(`${translationPath}yearly`)}`
                              : `/ ${t(`${translationPath}monthly`)}`
                            : ''
                        }`}
                      </div>
                      <div className="table-column">{`**** **** **** ${item.last_digit}`}</div>
                      <div className="table-column is-date">
                        {moment(item.created_at).format('MMM DD, YYYY')}
                      </div>
                      <div className="table-column is-price">{`${item.pid} $`}</div>
                      {/* <div */}
                      {/*  className={`table-column is-status ${ */}
                      {/*    item.status === 1 ? 'is-successful' : 'is-failed' */}
                      {/*  }`} */}
                      {/* > */}
                      {/*  {item.status === 1 ? `${t(`${translationPath}successful`)}` : `${t(`${translationPath}failed`)}`} */}
                      {/* </div> */}
                      <div className="table-column is-download">
                        {item.invoice_path ? (
                          <a
                            download
                            href={`${item.invoice_path}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src={activeDownload} alt="active-download" />
                          </a>
                        ) : (
                          <img src={inactiveDownload} alt="inactive-download" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="history-table-loader">
                    <Skeleton variant="rectangular" />
                    <Skeleton variant="rectangular" />
                    <Skeleton variant="rectangular" />
                    <Skeleton variant="rectangular" />
                    <Skeleton variant="rectangular" />
                  </div>
                )}
              </div>
            </div>
            <div className="table-pagination">
              <TablePagination
                page={page}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                onChangePage={handleChangePage}
                rowsPerPageOptions={[5, 10, 20, 30]}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                labelRowsPerPage={t(`${translationPath}rows-per-page`)}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} ${t(`${translationPath}of`)} ${
                    count !== -1
                      ? count
                      : `${t(`${translationPath}more-than`)} ${to}`
                  }`
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BillingHistoryView;
