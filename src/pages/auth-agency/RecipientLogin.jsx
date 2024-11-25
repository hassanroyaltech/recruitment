import * as React from 'react';
import { Box, Grid, Typography, TextField } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../hooks';

const parentTranslationPath = 'FormBuilderPage';
const translationPath = '';
export default function RecipientLogin({ isLoading, validateLink, queryData }) {
  const [email, setEmail] = React.useState('');
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}recipient-login`));

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        validateLink(email);
      }}
    >
      <Grid container direction="column" alignItems="center" className="px-3">
        <img
          width="107"
          className="mb-3"
          src={queryData.branch_logo}
          alt="branch logo"
        />
        <Typography
          weight="medium"
          color="dark.$80"
          variant="h4"
          lh="rich"
          sx={{ textAlign: 'center' }}
        >
          {queryData.position_title
            ? `You are invited by ${queryData.branch_name} to sign a document related to ${queryData.position_title} position`
            : `You are invited by ${queryData.branch_name} to sign a document related to ${queryData.job_title} position`}
        </Typography>
        <Typography
          color="dark.$60"
          variant="h6"
          weight="regular"
          sx={{ textAlign: 'center' }}
        >
          Enter your email below to verify and get started
        </Typography>
        <Box
          display="flex"
          flex="1"
          flexDirection="column"
          alignItems="center"
          className="w-100"
        >
          <TextField
            value={email}
            onChange={(e) => {
              setEmail(e?.target?.value);
            }}
            placeholder="Enter email"
            sx={{
              bgColor: 'dark.$a4',
              maxWidth: 344,
              width: '100%',
              mt: 7,
              mb: 3,
            }}
          />
          <ButtonBase
            className="btns theme-solid w-100 mih-40px mx-0"
            sx={{
              maxWidth: 344,
            }}
            type="submit"
            disabled={isLoading}
          >
            <span>{t(`${translationPath}sign-in`)}</span>
          </ButtonBase>
        </Box>
      </Grid>
    </form>
  );
}
