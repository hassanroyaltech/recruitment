import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Grid, ButtonBase } from '@mui/material';

import TablesComponent from '../../../../../components/Tables/Tables.Component';
import Skeleton from '@mui/material/Skeleton';

import { OnboardingAccordion } from '../../../shared';
import { RedirectToCandidateButton } from './../../../shared/components';

export const SharedResponsesTab = ({
  parentTranslationPath,
  onScrollHandler,
  bodyRef,
  onChangeAccordion,
  filtersComponent,
  extractName,
  isLoading,
  tableData,
  filter,
  expandedAccordions,
  // tableColumns
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const [tableColumns] = useState([
    {
      id: 1,
      input: 'question',
      label: t('question'),
      isHidden: false,
      cellClasses: 'w-30',
      component: (row) => (
        <span className={'responses-question'}>{row.question}</span>
      ),
    },
    {
      id: 2,
      input: 'reply',
      label: t('reply'),
      isHidden: false,
      cellClasses: 'w-30',
      component: (row) => (
        <span
          className={'responses-reply'}
          dangerouslySetInnerHTML={{
            __html: row.reply || '',
          }}
        />
      ),
    },
    {
      id: 3,
      input: 'content_section',
      label: t('content-section'),
      isHidden: false,
      component: (row) => (
        <span className={'table-tag py-1 px-2'}>{row.content_section}</span>
      ),
    },
    {
      id: 4,
      input: 'flow',
      label: t('flow'),
      isHidden: false,
      component: (row) =>
        row.flow ? <span className={'table-tag py-1 px-2'}>{row.flow}</span> : '',
    },
    {
      id: 5,
      input: 'space',
      label: t('space'),
      isHidden: false,
      component: (row) =>
        row.space ? <span className={'table-tag py-1 px-2'}>{row.space}</span> : '',
    },
  ]);

  return (
    <div className="  px-1 ">
      {filtersComponent()}
      <Grid
        container
        spacing={2}
        className="onboarding-scrollable-page-contents-wrapper p-2"
        ref={bodyRef}
        style={{ marginInlineStart: '-16px' }}
      >
        <Grid item md={12} className=" p-0" sx={{ maxWidth: '100%' }}>
          {tableData?.results.map((item, index) => (
            <OnboardingAccordion
              actionComponent={
                item.redirect_link ? (
                  <RedirectToCandidateButton redirectLink={item.redirect_link} />
                ) : (
                  false
                )
              }
              key={`${item.uuid}-${index}`}
              withAvatar={true}
              member={{ name: item?.member || extractName(item), url: item.url }}
              expanded={expandedAccordions.includes(index)}
              onChange={() => onChangeAccordion(index)}
              withExtraButton={true}
              onExtraButtonClick={() => null}
              bodyComponent={
                <div className="d-flex mx-2 ">
                  <div className="responses-table ">
                    <TablesComponent
                      // tableOptions={{ tableSize: 'small' }}
                      // isWithCheckAll
                      isWithoutBoxWrapper
                      themeClasses={'theme-transparent'}
                      pageSize={item?.responses?.length || 0}
                      totalItems={item?.responses?.length || 0}
                      data={item?.responses}
                      headerData={tableColumns}
                      pageIndex={0}
                      // isLoading={isApprovalsLoading}
                      // onActionClicked={onActionClicked}
                      // totalItems={approvals.totalCount}
                      // onPageSizeChanged={onPageSizeChanged}
                      // onPageIndexChanged={onPageIndexChanged}

                      // withCustomButton
                    />
                  </div>
                </div>
              }
            />
          ))}
        </Grid>
        {isLoading
          && Array.from(new Array(4)).map((item, index) => (
            <Grid item md={12} key={`${item}${index}`}>
              <Skeleton
                variant="rectangular"
                sx={{ height: '30px', width: '100%' }}
              />
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

SharedResponsesTab.propTypes = {
  // visaRequests: PropTypes.instanceOf(Array),
  // onCallLocationChanged: PropTypes.func.isRequired,
  // isLoading
  // onIsOpenDialogsChanged: PropTypes.func.isRequired,
  // getFullNameForRequestedFrom: PropTypes.func.isRequired,
  onChangeAccordion: PropTypes.func.isRequired,
  extractName: PropTypes.func.isRequired,
  onScrollHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  filtersComponent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,

  members: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
  }),
  expandedAccordions: PropTypes.instanceOf(Array),
  bodyRef: PropTypes.instanceOf(Object),
  tableData: PropTypes.instanceOf(Object),
  filter: PropTypes.instanceOf(Object),
};

SharedResponsesTab.defaultProps = {};
