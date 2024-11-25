import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Box, Typography, CardMedia, Avatar } from '@mui/material';
import { toBase64 } from '../../utils/helpers/toBase64';
import { IsBase64, showError } from '../../../../helpers';
import { useTranslation } from 'react-i18next';

const SubModelSection = ({ currentSection, setIsGlobalLoading }) => {
  const { t } = useTranslation('Shared');
  const stateRef = useRef({
    logoImage: '',
    bgImage: '',
    logoImageOriginal: '',
    bgImageOriginal: '',
  });
  const [state, setState] = React.useState(stateRef.current);

  const getBase64 = useCallback(
    async (url, key) => {
      if (
        IsBase64(stateRef.current[key])
        && url === stateRef.current[`${key}Original`]
      )
        return;
      if (IsBase64(url)) {
        setState((item) => (item[key] === url ? item : { ...item, [key]: url }));
        return;
      }
      if (setIsGlobalLoading)
        setIsGlobalLoading((items) => {
          items.push('getImage');
          return [...items];
        });
      fetch(url)
        .then((response) => response.blob())
        .then(async (myBlob) => {
          const objectURL = await toBase64(myBlob);
          setState((item) => ({
            ...item,
            [key]: objectURL,
            [`${key}Original`]: url,
          }));
          if (setIsGlobalLoading)
            setIsGlobalLoading((items) => {
              items.pop();
              return [...items];
            });
        })
        .catch((error) => {
          if (setIsGlobalLoading)
            setIsGlobalLoading((items) => {
              items.pop();
              return [...items];
            });
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  useEffect(() => {
    if (currentSection.bgImage) getBase64(currentSection.bgImage, 'bgImage');
  }, [currentSection.bgImage, getBase64]);

  useEffect(() => {
    if (currentSection.logoImage) getBase64(currentSection.logoImage, 'logoImage');
  }, [currentSection.logoImage, getBase64]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return (
    <>
      {(state.bgImage || currentSection.bgImage)
        && currentSection.subModel === 'bg' && (
        <Box display="flex" flex="1">
          <CardMedia
            component="img"
            src={state.bgImage}
            data-form-image={currentSection.bgImage}
            sx={{ height: `${currentSection.height}px` }}
          />
        </Box>
      )}
      {currentSection?.subModel === 'pageBreak' && (
        <Box display="flex" flex="1" className="page-break" />
      )}
      {currentSection.subModel === 'logo' && (
        <Box sx={{ position: 'relative', flex: 1 }}>
          {(state.bgImage || currentSection.bgImage) && (
            <CardMedia
              component="img"
              src={state.bgImage}
              data-form-image={currentSection.bgImage}
              sx={{ height: `${currentSection.height}px` }}
            />
          )}
          {state.logoImage && (
            <Box
              display="flex"
              sx={
                currentSection.bgImage && {
                  width: '100%',
                  position: 'absolute',
                  bottom: 16,
                }
              }
            >
              <Box
                display="flex"
                sx={{
                  py: 4,
                  pl: 5,
                  width: '100%',
                  justifyContent: currentSection.logoAlign,
                  ...(currentSection.logoAlign === 'right' && {
                    flexDirection: 'row-reverse',
                  }),
                }}
                src={state.logoImage}
                data-form-image={currentSection.logoImage}
              >
                <Avatar
                  alt={currentSection.logoName}
                  src={state.logoImage}
                  sx={{
                    width: `${currentSection.logoSize}px!important`,
                    height: `${currentSection.logoSize}px!important`,
                    mr: 5,
                  }}
                />
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  sx={{ marginRight: 2, marginLeft: 2 }}
                >
                  <Typography
                    variant="h2"
                    color={currentSection.bgImage ? 'light.main' : 'dark.main'}
                    sx={{
                      whiteSpace: 'break-spaces',
                    }}
                  >
                    {currentSection.logoName}
                  </Typography>
                  <Typography
                    variant="body13"
                    color={currentSection.bgImage ? 'light.main' : 'dark.main'}
                  >
                    {currentSection.logoDescription}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default memo(SubModelSection);
