import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'assets/scss/elevatus/_overview.scss';
import { Row, Col, Container } from 'reactstrap';
import { Helmet } from 'react-helmet';
import TimelineHeader from '../../components/Elevatus/TimelineHeader';
import BarLoader from '../../components/Elevatus/BarLoader';
import { Can } from '../../utils/functions/permissions';
import { commonAPI } from '../../api/common';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import moment from 'moment';
import OverviewCalendar from './OverviewCalendar';
import SelfServicesLinksCard from './SelfServicesLinksCard';
import NewRecordsCard from './NewRecordsCard';
import OverviewStatCard from './OverviewStatCard';

const translationPath = '';
const parentTranslationPath = 'Overview';

export const Overview = () => {
  const isMountedRef = useRef(true);
  const { t } = useTranslation(parentTranslationPath);
  const tokenReducer = useSelector((state) => state?.tokenReducer);
  const [state, setState] = useState({
    user: JSON.parse(localStorage.getItem('user'))?.results,
    statistic: [],
    ads: [],
    loading: true,
  });
  const [calendarKey, setCalendarKey] = useState(
    `calendar-key-initial-${Math.random()}`,
  );
  const [currentDate, setCurrentDate] = useState(null);
  const [datePagination, setDatePagination] = useState({ from: null, to: null });
  /**
   * Get Statistics Function
   * @note get OverviewStatistics Cards Data, then invoke getAdsData API
   * to get Ads Data
   */
  const getStatistic = useCallback(async () => {
    commonAPI
      .getOverviewStatistics(datePagination.from, datePagination.to)
      .then((response) => {
        if (response && response.status === 200) {
          window?.ChurnZero?.push([
            'setAttribute',
            'account',
            {
              'Total active video assessments':
                response?.data?.results?.assessment?.active,
              'Total EVA-REC candidates':
                response?.data?.results?.candidate?.total_ats_candidates,
              'Total EVA-SESS candidates':
                response?.data?.results?.candidate?.total_assessment_candidates,
              'Total interviews': response?.data?.results?.interview?.total,
              'Total Active jobs': response?.data?.results?.jobs?.active,
            },
          ]);

          if (isMountedRef.current)
            setState((items) => ({
              ...items,
              statistic: response.data.results,
            }));
          if (isMountedRef.current)
            commonAPI
              .getAdsData()
              .then((res) => {
                if (isMountedRef.current)
                  setState((items) => ({
                    ...items,
                    ads: res.data.results,
                    loading: false,
                  }));
              })
              .catch((error) => {
                // showError(t('Shared:failed-to-get-saved-data'), error);
              });
        }
        if (response)
          setState((prevState) => ({
            ...prevState,
            type: 'error',
            message: response.data.message,
            errors: response.data.errors,
            loading: false,
          }));
      })
      .catch((error) => {
        // showError(t('Shared:failed-to-get-saved-data'), error);
      });
  }, [t, datePagination]);

  //   const Data = await Axios.get(urls.overview.statistics, {
  //     header: {
  //       Accept: 'application/json',
  //     },
  //     headers: generateHeaders(),
  //   });
  //   if (Data.data.statusCode === 200) {
  //     if (Data.data.results) {
  //       if (isMountedRef.current) {
  //         setState((items)=>({
  //           ...items,
  //           statistic: Data.data.results,
  //           loading: false,
  //         }));
  //       }
  //     }
  //   } else {
  //     setState((prevState) => ({
  //       ...prevState,
  //       type: 'error',
  //       message: Data.response.data.message,
  //       errors: Data.response.data.errors,
  //       loading: false,
  //     }));
  //   }
  useEffect(() => {
    if (
      tokenReducer
      && tokenReducer.token
      && JSON.parse(localStorage.getItem('user'))?.results
    )
      getStatistic();
  }, [tokenReducer, getStatistic, datePagination]);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  useEffect(() => {
    if (currentDate) {
      const current = currentDate.split(' ');
      const date = new Date();
      const year = +current[1];
      const month = new Date(Date.parse(`${current[0]} 1, ${year}`)).getMonth();
      date.setFullYear(14, 0, 1);
      const firstDay = moment(new Date(year, month, 1)).format('YYYY-MM-DD');
      const lastDay = moment(new Date(year, month + 1, 0)).format('YYYY-MM-DD');

      setDatePagination({ from: firstDay, to: lastDay });
    }
  }, [currentDate]);

  const rerenderCalendarHandler = () => {
    setCurrentDate(null);
    setCalendarKey(`calendar-key-update-${Math.random()}`);
  };
  return (
    <>
      <Helmet>
        <title>{t(`${translationPath}overview`)}</title>
      </Helmet>
      <TimelineHeader name="Overview" />
      <div className="content">
        <Container fluid className=" mt--6 w-75">
          {state.loading ? (
            <BarLoader />
          ) : (
            <>
              <Row>
                <SelfServicesLinksCard />
              </Row>
              <Row>
                <Col sm="12" xl="8">
                  <NewRecordsCard />
                </Col>
                <Col sm="12" xl="4">
                  <div className="mb-4">
                    <OverviewStatCard
                      title={t(
                        `${translationPath}total-number-of-EVA-SSESS-applicants`,
                      )}
                      number={
                        state?.statistic?.candidate?.total_assessment_candidates
                      }
                      icon={
                        <div className="icon icon-shape bg-brand-purple text-white rounded-circle shadow">
                          <i className="fas fa-video" />
                        </div>
                      }
                      stats={[
                        {
                          title: t(`${translationPath}active-assessments`),
                          number: state?.statistic?.assessment?.active,
                        },
                        {
                          title: t(`${translationPath}new-applicants`),
                          number:
                            state?.statistic?.candidate?.new_assessment_candidates,
                        },
                      ]}
                    />
                  </div>
                  <div className="mb-4">
                    <OverviewStatCard
                      title={t(
                        `${translationPath}total-number-of-EVA-REC-applicants`,
                      )}
                      number={state?.statistic?.candidate?.total_ats_candidates}
                      icon={
                        <div className="icon icon-shape bg-brand-green text-white rounded-circle shadow">
                          <i className="fas fa-briefcase" />
                        </div>
                      }
                      stats={[
                        {
                          title: t(`${translationPath}active-applications`),
                          number: state?.statistic?.jobs?.active,
                        },
                        {
                          title: t(`${translationPath}new-applicants`),
                          number: state?.statistic?.candidate?.new_ats_candidates,
                        },
                      ]}
                    />
                  </div>
                  <div>
                    <OverviewStatCard
                      title={t(`${translationPath}total-number-of-meetings`)}
                      number={state?.statistic?.interview?.total}
                      icon={
                        <div className="icon icon-shape bg-brand-light-blue text-white rounded-circle shadow">
                          <i className="far fa-comments" />
                        </div>
                      }
                      stats={[
                        {
                          title: t(`${translationPath}upcoming-meetings`),
                          number: state?.statistic?.interview?.upcoming,
                        },
                        {
                          title: t(`${translationPath}new-meetings`),
                          number: state?.statistic?.interview?.new,
                        },
                      ]}
                      darkMode
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col sm="12" lg="8" key={calendarKey}>
                  {Can('view', 'schedule-interview') && (
                    <OverviewCalendar
                      setCurrentDate={setCurrentDate}
                      loading={state.loading}
                      color="primary"
                      rerenderCalendarHandler={rerenderCalendarHandler}
                    />
                  )}
                </Col>
                {/* <Col sm="12" lg="4">
                  <SelfServicesLinksCard />
                </Col> */}
              </Row>
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default Overview;
