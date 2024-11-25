import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Grid } from '@mui/material';
import theme from '../form-builder/styles/theme';
import RecipientLogin from './RecipientLogin';
import { GetMultipleMedias, ValidateOfferLinkKey } from 'services';
import { showError } from 'helpers';
import { useDispatch } from 'react-redux';
import { updateCandidateUser } from 'stores/actions/candidateActions';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

const AuthAgency = () => {
  const { t } = useTranslation('Shared');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const [queryData, setQueryData] = useState({
    key: '',
    branch_name: '',
    job_title: '',
    position_title: '',
    branch_logo: '',
  });

  const getImagesAndFiles = useCallback(
    async (sections, primaryLang, candidateData) => {
      const imagesAndFiles = Object.entries(sections).reduce(
        (total, [key, value]) => {
          value.items
            .filter((item) => ['attachment'].includes(item.type))
            .map((item) => {
              if (item.languages?.[primaryLang]?.value?.length > 0)
                total.push({
                  sectionKey: key,
                  itemId: item.id,
                  isArray: true,
                  isFullObject: true,
                  imageKey: 'value',
                  saveIn: 'files',
                  id: item.languages?.[primaryLang]?.value,
                  value: [],
                });
              return undefined;
            });
          if (value.logo_uuid)
            total.push({
              sectionKey: key,
              isArray: false,
              isFullObject: false,
              imageKey: 'logo_uuid',
              saveIn: 'logo_image',
              id: value.logo_uuid,
              value: null,
            });
          if (value.bg_uuid)
            total.push({
              sectionKey: key,
              isArray: false,
              isFullObject: false,
              imageKey: 'bg_uuid',
              saveIn: 'bg_image',
              id: value.bg_uuid,
              value: null,
            });
          return total;
        },
        [],
      );
      if (
        imagesAndFiles.length === 0
        || imagesAndFiles.reduce((total, item) => {
          if (item.isArray) total.push(...item.id);
          else total.push(item.id);
          return total;
        }, []).length === 0
      )
        return [];
      const response = await GetMultipleMedias(
        {
          uuids: imagesAndFiles.reduce((total, item) => {
            if (item.isArray) total.push(...item.id);
            else total.push(item.id);
            return total;
          }, []),
        },
        candidateData?.token
          ? {
            customHeaders: true,
            'Accept-Company': candidateData?.company?.uuid,
            'recipient-token': candidateData?.token,
            'Accept-Account': candidateData?.account?.uuid,
            Authorization: null,
          }
          : null,
      );
      if (
        response
        && response.status === 200
        && response.data.results.data.length > 0
      ) {
        const {
          data: {
            results: { data },
          },
        } = response;
        imagesAndFiles.map((item) => {
          if (!item.isArray) {
            const itemIndex = data.findIndex(
              (element) => element.original.uuid === item.id,
            );
            if (itemIndex !== -1)
              if (item.isFullObject) item.value = data[itemIndex].original;
              else item.value = data[itemIndex].original.url;
          } else {
            const filteredData = data
              .filter((element) => item.id.includes(element.original.uuid))
              .map((element) => element.original);
            if (item.isFullObject) item.value.push(...filteredData);
            else item.value.push(...filteredData.map((element) => element.uuid));
          }
          return undefined;
        });
        return imagesAndFiles;
      }
      return [];
    },
    [],
  );

  const ValidateOfferLinkKeyHandler = useCallback(
    async (email) => {
      setIsLoading(true);
      const response = await ValidateOfferLinkKey({
        key: queryData.key,
        email: email,
      });
      if (
        response
        && (response.status === 200 || response.status === 201)
        && response.data
      ) {
        const { results } = response.data;
        if (results.form_data && !results.form_data.tags)
          results.form_data.tags = [];
        results.form_data.sender = {
          avatar: '',
          name: `${
            results.sentUser.first_name
            && (results.sentUser.first_name[i18next.language]
              || results.sentUser.first_name.en)
          }${
            (results.sentUser.last_name
              && ` ${
                results.sentUser.last_name[i18next.language]
                || results.sentUser.last_name.en
              }`)
            || ''
          }`,
        };
        results.form_data.recipient = {
          avatar: '',
          name: results.candidate.name,
        };
        const imagesAndFiles = await getImagesAndFiles(
          results.form_data.sections,
          results.form_data.primary_lang,
          {
            company: results?.company,
            token: results?.token,
            account: results?.account,
            Authorization: null,
          },
        );
        if (imagesAndFiles.length > 0)
          imagesAndFiles.map((item) => {
            if (item.imageKey !== 'value')
              results.form_data.sections[item.sectionKey][item.saveIn] = item.value;
            else {
              const itemIndex = results.form_data.sections[
                item.sectionKey
              ].items.findIndex((element) => element.id === item.itemId);
              if (itemIndex !== -1)
                results.form_data.sections[item.sectionKey].items[
                  itemIndex
                ].languages[results.form_data.primary_lang][item.saveIn]
                  = item.value;
            }
            return undefined;
          });

        sessionStorage.setItem('candidate_user_data', JSON.stringify(results));
        dispatch(updateCandidateUser(results));
        history.push(`/form-builder/flow?editorRole=recipient`);
      } else showError(t('Shared:failed-to-get-saved-data'), response);
      setIsLoading(false);
    },
    [t, dispatch, getImagesAndFiles, history, queryData.key],
  );

  useEffect(() => {
    const key = new URLSearchParams(location.search).get('key');
    let extra = new URLSearchParams(location.search).get('extra');
    if (extra) extra = JSON.parse(window.atob(extra));

    if (key)
      setQueryData({
        ...extra,
        key,
      });
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          alignItem: 'center',
          justifyContent: 'center',
          overflowY: 'auto',
          minHeight: '100vh',
          height: '100vh',
          padding: '1rem 0 4.5rem',
          bgColor: 'light.$3',
        }}
      >
        <Grid
          container
          sx={{
            marginTop: 'auto',
            marginBottom: 'auto',
            maxWidth: '600px',
          }}
        >
          <RecipientLogin
            validateLink={ValidateOfferLinkKeyHandler}
            queryData={queryData}
            isLoading={isLoading}
          />
        </Grid>
      </Box>
    </ThemeProvider>
  );
};
export default AuthAgency;
