/**
 * ----------------------------------------------------------------------------------
 * @title NewRecordsCard.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the chart that shows the Engagement flow of
 * EVA SSESS & REC During the last 6 months.
 * ----------------------------------------------------------------------------------
 */
// React Components
import React, { useEffect, useState } from 'react';
// Reactstrap Components
import { Card, CardBody, Row, Col } from 'reactstrap';
// Chart Component
import { Bar } from 'react-chartjs-2';
// API
import { commonAPI } from '../../api/common';
// Loader Component
import Loader from '../../components/Elevatus/Loader';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { showError } from '../../helpers';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
);

const translationPath = '';
const parentTranslationPath = 'Overview';

/**
 * NewRecordsCard Main Component
 */
export default function NewRecordsCard() {
  const { t } = useTranslation(parentTranslationPath);
  // States to handle data from API response
  const [loading, setLoading] = useState(true);
  const tokenReducer = useSelector((state) => state?.tokenReducer);
  const [months, setMonths] = useState();
  const [dataEvaSsess, setDataEvaSsess] = useState();
  const [dataEvaRec, setDataEvaRec] = useState();

  // Chart Data
  const barChartData = {
    labels: months,
    datasets: [
      {
        label: 'EVA-SSESS',
        type: 'line',
        data: dataEvaSsess,
        fill: false,
        // backgroundColor: '#354F8A',
        // borderColor: '#354F8A',
        // hoverBackgroundColor: '#354F8A',
        // hoverBorderColor: '#354F8A',
        backgroundColor: '#68529F',
        borderColor: '#68529F',
        hoverBackgroundColor: '#68529F',
        hoverBorderColor: '#68529F',
        tension: 0.4,
      },
      {
        type: 'line',
        label: 'EVA-REC',
        data: dataEvaRec,
        fill: false,
        // backgroundColor: '#1068FF',
        // borderColor: '#1068FF',
        // hoverBackgroundColor: '#1068FF',
        // hoverBorderColor: '#1068FF',
        backgroundColor: '#8ECCAA',
        borderColor: '#8ECCAA',
        hoverBackgroundColor: '#8ECCAA',
        hoverBorderColor: '#8ECCAA',
        tension: 0.4,
      },
    ],
  };

  // Chart Configuration
  const barChartOptions = {
    // responsive: true,
    aspectRatio: 1.5,
    maintainAspectRatio: true,
    tooltips: {
      mode: 'label',
    },
    elements: {
      line: {
        fill: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        grid: {
          display: false,
        },
        labels: {
          show: true,
        },
      },
    },
  };

  /**
   * Effect to Get Chart Data From API
   */
  useEffect(() => {
    if (
      tokenReducer
      && tokenReducer.token
      && JSON.parse(localStorage.getItem('user'))?.results
    )
      commonAPI
        .getChartStatistics()
        .then((response) => {
          const months = [];
          const EVASSESS = [];
          const EVAREC = [];
          response.data.results.assessment.map((element) => {
            months.push(element.month_name);
            EVASSESS.push(element.total);
          });
          setMonths(months.reverse());
          setDataEvaSsess(EVASSESS.reverse());
          response.data.results.ats.map((element) => {
            EVAREC.push(element.total);
          });
          setDataEvaRec(EVAREC.reverse());
          setLoading(false);
        })
        .catch((error) => {
          // showError(t('Shared:failed-to-get-saved-data'), error);
        });
  }, [t, tokenReducer]);

  /**
   * @returns {JSX Element}
   */

  return (
    <Card className="new-records-card mb-4">
      {loading ? (
        <CardBody className="text-center">
          <Row>
            <Col xl="12">
              <Loader width="730px" height="49vh" speed={1} color="primary" />
            </Col>
          </Row>
        </CardBody>
      ) : (
        <CardBody>
          <Row className="h-100">
            <Col xs="12" md="8" className="new-records-chart-wrapper">
              <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4">
                <Bar width={200} data={barChartData} options={barChartOptions} />
              </div>
            </Col>
            <Col xs="12" md="4" className="new-records-text-wrapper">
              <h5 className="title">{t(`${translationPath}new-records`)}</h5>
              <p className="description font-14 font-weight-400">
                {t(`${translationPath}records-description`)}{' '}
                <span className="font-weight-bold">
                  6{t(`${translationPath}months`)}
                </span>
              </p>
              {/* <Link className="link" to="#"> */}
              {/*  View Long-Term chart&nbsp;&nbsp; */}
              {/*  <i className="fas fa-arrow-right" /> */}
              {/* </Link> */}
            </Col>
          </Row>
        </CardBody>
      )}
    </Card>
  );
}
