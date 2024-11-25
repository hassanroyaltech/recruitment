import * as React from 'react';
import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import moment from 'moment';
import Popover from './Popover';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

const ListCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(3),
  width: 'auto',
  transition: theme.transitions.create(['background', 'opacity'], {
    duration: 250,
  }),
  '&:hover': {
    background: theme.palette.dark.$a4,
    '.MuiIconButton-root': {
      transition: theme.transitions.create(['opacity'], {
        duration: 350,
      }),
      visibility: 'visible',
      opacity: 1,
    },
  },
  '> .MuiSvgIcon-root': {
    fontSize: 28,
    margin: theme.spacing(0, 3),
  },
  '.MuiIconButton-root': {
    marginLeft: 'auto /* @noflip */',
    alignSelf: 'center',
    visibility: 'hidden',
    opacity: 0,
  },
}));

// eslint-disable-next-line react/display-name
export default React.memo(
  ({ item, itemIndex, leftIcon, popoverIcon, popoverBody, disabled }) => {
    const { t } = useTranslation('Shared');

    const downloadFileHandler = useCallback(() => {
      if (item && item.status === 'done') {
        const a = document.createElement('a');
        a.setAttribute('target', '_blank');
        a.href = item.url;
        a.download = 'download';
        a.click();
      }
    }, [item]);

    return (
      <ListCard>
        <Icon component={leftIcon} />
        <Box onClick={downloadFileHandler}>
          <Typography weight="medium" lh="controls" varint="body14">
            {(item.file && (item.file.name || item.file.title))
              || item.title
              || `${t('file')} #${itemIndex + 1}`}
          </Typography>
          {item.created && (
            <Typography variant="body12" color="dark.$60">
              Created at {moment(item.created).format('l hh:mm')}
            </Typography>
          )}
          {item.status === 'uploading' && (
            <Typography variant="body12" color="dark.$60">
              <CircularProgress color="inherit" size={20} />
            </Typography>
          )}
          {item.status === 'failed' && (
            <Typography variant="body12" color="dark.$60">
              Failed To Upload
            </Typography>
          )}
        </Box>
        {!disabled && (
          <Popover id={item.created}>
            <IconButton>
              <Icon component={popoverIcon} />
            </IconButton>
            {popoverBody}
          </Popover>
        )}
      </ListCard>
    );
  },
);
ListCard.displayName = 'ListCard';
