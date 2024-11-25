import * as React from 'react';
import { styled, Box, Typography, TextField, Button, Icon } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ArrowRightIcon, EyeIcon } from '../../form-builder/icons';
import { useEffect } from 'react';
import { TemplateRolesEnum } from '../../../enums';

const NotePanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${theme.palette.dark.$a8}`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  marginBottom: theme.spacing(6),
  '.MuiBox-root': {
    minWidth: 32,
    minHeight: 32,
    display: 'flex',
    borderRadius: theme.spacing(3),
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.dark.$a6,
    marginRight: theme.spacing(3),
  },
}));

const ModalInputItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(5),
  '.MuiTypography-root': {
    alignSelf: 'center',
    flex: '0 100px',
    marginRight: theme.spacing(6),
    '&:last-of-type': {
      alignSelf: 'flex-start',
      paddingTop: theme.spacing(2),
    },
  },
  '.MuiTextField-root': {
    flex: 1,
  },
}));
// type_uuid - is the selected type that this template for ex: form type uuid
export default function CreateTemplateModal({ handleClose, typeId }) {
  const [templateObj, setTemplateObj] = React.useState({
    name: '',
    description: '',
    typeId,
    categories: [],
    positionLevels: [],
    pipelineTypes: [],
    allowedLanguages: [],
  });
  const history = useHistory();

  const handleTemplateName = ({ target: { value } }) =>
    setTemplateObj((obj) => ({ ...obj, name: value }));

  const handleTemplateDescription = ({ target: { value } }) =>
    setTemplateObj((obj) => ({ ...obj, description: value }));

  const handleContinue = () =>
    history.push(
      `/form-builder/edit?template_type_uuid=${typeId}&editorRole=${TemplateRolesEnum.Creator.key}`,
      templateObj,
    );

  useEffect(() => {
    setTemplateObj((items) => ({ ...items, typeId }));
  }, [typeId]);

  return (
    <Box display="flex" flexDirection="column">
      <NotePanel>
        <Box>
          <Icon component={EyeIcon} sx={{ fontSize: 16 }} />
        </Box>
        <Typography color="light">
          Specify wich type of users/candidates this template will be available for.
          Learn more about templates and labels.
        </Typography>
      </NotePanel>

      <ModalInputItem>
        <Typography>Template name</Typography>
        <TextField
          onChange={handleTemplateName}
          placeholder="e.g. Offer for non-residents"
          bg="a4"
          size="m"
        />
      </ModalInputItem>
      <ModalInputItem>
        <Typography>Description</Typography>
        <TextField
          onChange={handleTemplateDescription}
          multiline
          rows={3}
          placeholder="Leave some notes for your team..."
          bg="a4"
          size="m"
        />
      </ModalInputItem>

      <Box display="flex" justifyContent="flex-end">
        <Button size="m" variant="ghost" onClick={handleClose}>
          Discard
        </Button>
        <Button
          size="m"
          variant="ghost"
          onClick={handleContinue}
          endIcon={
            <ArrowRightIcon
              htmlColor="#333"
              sx={{ color: (theme) => theme.palette.dark.main }}
            />
          }
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
