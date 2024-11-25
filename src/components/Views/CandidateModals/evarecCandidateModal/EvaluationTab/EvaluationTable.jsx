import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import Slider from 'react-slider';
import urls from 'api/urls';
import LetterAvatar from 'components/Elevatus/LetterAvatar';
import { useOverlayedAvatarStyles } from 'utils/constants/colorMaps';
import { addEvaluation } from 'shared/APIs/VideoAssessment/Evaluations';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import i18next from 'i18next';
import { showError } from '../../../../../helpers';
import ButtonBase from '@mui/material/ButtonBase';

const ScaleOptions = [1, 2, 3, 4, 5];
const PercentageOptions = [20, 40, 60, 80, 100];

/**
 * Evaluation Table that is present in the Candidate Modals.
 * @param evaluation
 * @param evaluation_data
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const translationPath = 'EvaluationTableComponent.';
const EvaluationTable = ({
  evaluation,
  evaluation_data,
  evaluationsLoaded,
  onIsLoadingChanged,
  parentTranslationPath,
  ...props
}) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  const classes = useOverlayedAvatarStyles();
  const [show, setShow] = useState(false);
  const [data, setData] = useState(evaluation?.data || []);
  const user = JSON.parse(localStorage.getItem('user'))?.results;

  /**
   * handler to expand rows
   * @param row
   */
  const handleExpandRow = (row) => {
    if (data?.length && row.recruiters?.length) {
      const tempData = data.filter((r) => !r.isSubRow);
      const rowIndex = tempData.findIndex((r) => r.uuid === row.uuid);
      if (rowIndex !== -1) {
        tempData.forEach(
          (r, i) => (r.isExpanded = rowIndex === i ? !r.isExpanded : false),
        );
        if (tempData[rowIndex].isExpanded)
          row.recruiters.forEach((recruiter) =>
            tempData.splice(rowIndex + 1, 0, {
              ...recruiter,
              isSubRow: true,
              recruiters: [recruiter],
            }),
          );
      }
      setData(tempData);
    }
  };
  const options
    = evaluation_data.score_type === 1 ? ScaleOptions : PercentageOptions;

  /**
   * handler to change evaluation score
   * @param value
   * @param label_uuid
   * @param row
   */
  const handleChangeEvaluation = (value, label_uuid, row) => {
    if (onIsLoadingChanged) onIsLoadingChanged();
    row.score = value;

    let params = null;
    const url
      = props.type === 'prep_assessment'
        ? urls.evassess.CANDIDATE_EVALUATION_WRITE
        : urls.evarec.ats.CANDIDATE_EVALUATION_WRITE;

    if (props.type === 'prep_assessment')
      params = {
        label_uuid,
        score: value,
        candidate_uuid: props.candidate?.candidate?.information?.uuid,
      };
    else
      params = {
        label_uuid,
        score: value,
        candidate_uuid: props.candidateUuid,
      };

    addEvaluation(url, params)
      .then((res) => {
        // row.score = res.data.results.score_label;
        row.recruiters = res.data.results.recruiters;
        // evaluation.score = res.data.results.score_group;
        props.getEvaluations();
        if (onIsLoadingChanged) onIsLoadingChanged();
      })
      .catch((err) => {
        if (onIsLoadingChanged) onIsLoadingChanged();
        showError(t('Shared:failed-to-update'), err);
      });
  };
  useEffect(() => {
    setData(evaluation?.data);
  }, [evaluation]);
  /**
   * Table columns definition
   */
  const tableColumns = [
    {
      dataField: 'title',
      style: { width: '40%' },
      text: (
        <ButtonBase
          className="position-relative font-weight-bold h6 mb-0 text-gray"
          onClick={() => {
            setShow(!show);
          }}
          style={{ textTransform: 'none', width: '300px' }}
        >
          {evaluation.title}
          <div
            className="position-absolute"
            style={{ left: -32, top: 0, cursor: 'pointer' }}
          >
            <i className={show ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} />
          </div>
        </ButtonBase>
      ),
      sort: false,
    },
    {
      dataField: 'recruiters',
      text: t(`${translationPath}team`),
      sort: false,
      style: { width: '15%' },
      formatter: (cellContent, row) =>
        row.isSubRow ? (
          <div className={classes.root}>
            <LetterAvatar
              name={`${row?.first_name[i18next.language] || row?.first_name?.en} ${
                row?.last_name[i18next.language] || row?.last_name?.en
              }`}
            />
            <div className="ml-3-reversed font-weight-bold">
              {[row?.first_name, row?.last_name].join(' ')}
            </div>
          </div>
        ) : (
          <div className={classes.root}>
            <LetterAvatar
              name={`${
                user?.user?.first_name[i18next.language]
                || user?.user?.first_name?.en
              } ${
                user?.user?.last_name[i18next.language] || user?.user?.last_name?.en
              }`}
            />
          </div>
        ),
    },
    {
      dataField: 'score',
      style: { width: '35%' },
      text: (
        <div
          className="d-flex flex-row align-items-center justify-content-between font-12 text-gray font-weight-normal"
          style={{ width: 'calc(100% - 40px)' }}
          dir="ltr"
        >
          {options
            .filter((item) => item !== 0)
            .map((item, index) => (
              <div key={index}>
                {item} {evaluation_data.score_type === 2 && '%'}
              </div>
            ))}
        </div>
      ),
      sort: false,
      editable: false,
      formatter: (cellContent, row) => (
        <div className="d-flex flex-row">
          <div
            className="flex-grow-1"
            role="button"
            tabIndex={-1}
            onKeyPress={() => {}}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Slider
              className="styled-slider"
              defaultValue={row.score || 0}
              min={options[0]}
              // disabled={evaluationsLoaded || loading}
              max={options[options.length - 1]}
              trackClassName={classnames(
                'react-slider-track',
                `score-${
                  row?.score
                    ? evaluation_data.score_type === 1
                      ? `${Math.round(row.score)}`
                      : `${Math.round(row.score / 20)}`
                    : ''
                }`,
              )}
              step={evaluation_data.score_type === 1 ? 1 : 20}
              thumbClassName="react-slider-thumb"
              onAfterChange={(e) => {
                handleChangeEvaluation(e, row.uuid, row);
              }}
            />
          </div>
          <ButtonBase
            className={classnames(
              'dropdown-icon-btn text-center',
              row.recruiters.length < 2 && 'disabled',
            )}
            onClick={() => {
              if (!row.isSubRow && row.recruiters.length > 1) handleExpandRow(row);
            }}
          >
            {!row.isSubRow && (
              <i
                className={classnames(
                  row.isExpanded ? 'fa fa-chevron-up' : 'fa fa-chevron-down',
                  row.recruiters.length < 2 && 'disabled',
                )}
              />
            )}
          </ButtonBase>
        </div>
      ),
    },
    {
      dataField: 'score',
      text: t(`${translationPath}score`),
      sort: false,
      editable: false,
      style: { width: '10%', textAlign: 'right' },
    },
  ];
  //   [evaluation.title, show, expanded, data]
  // );

  /**
   * Row css classes (based on state)
   * @param row
   * @returns {string}
   */
  const rowClasses = (row) => {
    if (row.isSubRow) return 'expanding-bar';
    if (row.isExpanded) return 'parent-expand-bar';
  };

  /**
   * Expanded row definition
   */
  const expandRow = {
    parentClassName: () => 'parent-expand-bar',
    className: () => 'expanding-bar',
    renderer: (row) => (
      <tr className="sub-evaluation">
        <td style={{ width: '10%' }} />
        <td style={{ width: '15%' }}>
          {row?.recruiters?.map((recruiter, index) => (
            <div className="d-flex flex-row align-items-center" key={index}>
              <div
                className="ml-3-reversed font-weight-bold"
                style={{ width: '35%' }}
              >
                <div className={classes.root}>
                  <LetterAvatar
                    name={`${recruiter?.first_name} ${recruiter?.last_name}`}
                    style={{ marginTop: '-15px' }}
                  />
                  <div className="ml-3-reversed font-weight-bold">
                    {[recruiter?.first_name, recruiter?.last_name].join(' ')}
                  </div>
                </div>
              </div>
              <td style={{ width: '35%' }}>
                <div className="d-flex flex-row">
                  <div className="flex-grow-1">
                    <Slider
                      className="styled-slider"
                      value={recruiter.score || 0}
                      trackClassName="react-slider-track"
                      thumbClassName="react-slider-thumb"
                      min={0}
                      max={options[options.length - 1]}
                      disabled
                    />
                  </div>
                  <div className="dropdown-icon-btn text-center" />
                </div>
              </td>
              <td style={{ width: '10%', textAlign: 'right' }}>{recruiter.score}</td>
            </div>
          ))}
        </td>
      </tr>
    ),
  };

  /**
   * @returns {JSX.Element}
   */
  return (
    <div className="d-flex flex-column">
      <div className="w-100 evaluation-table">
        <ToolkitProvider
          data={show ? data : []}
          keyField="id"
          columns={tableColumns}
          search
        >
          {(tableProps) => (
            <>
              <div className="table-responsive list-template-table">
                <BootstrapTable
                  {...tableProps.baseProps}
                  bootstrap4
                  striped
                  bordered={false}
                  keyField="uuid"
                  expandRow={expandRow}
                  rowClasses={rowClasses}
                />
              </div>
            </>
          )}
        </ToolkitProvider>
      </div>
      <div style={{ marginTop: -20 }}>
        {show && (
          <div className="p-3 w-100 evaluation-score text-primary font-weight-bold h6 bg-white d-flex justify-content-between">
            <div>{evaluation.title}</div>
            <div>
              {evaluation.score}
              {evaluationsLoaded && (
                <span className="px-2">
                  <CircularProgress color="inherit" size={20} />
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default EvaluationTable;
