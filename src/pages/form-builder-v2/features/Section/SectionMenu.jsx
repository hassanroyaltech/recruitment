import * as React from 'react';
import _ from 'lodash';
import {
  alpha,
  styled,
  Icon,
  Box,
  CardMedia,
  TextField,
  Button,
  Switch,
  Divider,
  Popover,
  FormGroup,
  Typography,
  ButtonGroup,
  FormControlLabel,
  Tooltip,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Checkbox from '../../components/Checkbox';
import {
  DraggableCardIcon,
  TrashIcon,
  CheckIcon,
  UploadCloudIcon,
  RefreshIcon,
  CornerDownIcon,
} from '../../../form-builder/icons';
import FileUploader from '../../components/FileUploader';
import { SimpleSortable } from '../Dragndrop/SimpleSortable';
import { showError } from '../../../../helpers';
import { UploadFile } from '../../../../services';
import { FormsRolesEnum, UploaderTypesEnum } from '../../../../enums';
import { useTranslation } from 'react-i18next';
import { RadiosComponent } from 'components';
import { textModificationList } from 'pages/form-builder/data/iconButtonLists';
import { toBase64 } from '../../../form-builder/utils/helpers/toBase64';

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ style, theme }) => ({
  padding: theme.spacing(0),
  ...style,
}));

const Menu = styled((props) => (
  <Popover
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
  // TODO shadows from theme
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 8,
    minWidth: 398,
    boxShadow: '0px 4px 13px 0px #090B2114, 0px 0px 2px 0px #10111E33',
    '& .MuiInputBase-root': {
      ...theme.typography.body13controls,
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        color: theme.palette.text.secondary,
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
  '.MuiFormControlLabel-root': {
    '.MuiSwitch-root': {
      marginRight: 10,
    },
  },
}));

// TODO DRY
const InputOptionBox = styled(Box)`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  & > .MuiTypography-root {
    flex: 0 112px;
    margin-right: 8px;
    margin-top: 10px;
  }
  & > .MuiBox-root {
    flex: 1;
  }
`;

export default function SectionMenu({
  children,
  containerId,
  primaryLang,
  currentSection,
  setDataSectionItems,
  setDataSectionContainers,
}) {
  const { t } = useTranslation('Shared');
  const [localItemsOrder, setLocalItemsOrder] = React.useState([]);
  const [sectionHeight, setSectionHeight] = React.useState(currentSection.height);
  const [logoDescription, setLogoDescription] = React.useState(
    currentSection.logoDescription,
  );
  const [logoName, setLogoName] = React.useState(currentSection.logoName);
  const [isTitleVisibleOnTheFinalDocument, setIsTitleVisibleOnTheFinalDocument]
    = React.useState(currentSection.isTitleVisibleOnTheFinalDocument);
  const [isSectionVisibleOnTheFinalDoc, setIsSectionVisibleOnTheFinalDoc]
    = React.useState(currentSection.isSectionVisibleOnTheFinalDoc);
  const [sectionTitleFontSize, setSectionTitleFontSize] = React.useState(
    currentSection.sectionTitleFontSize,
  );
  const [sectionTitleDecoration, setSectionTitleDecoration] = React.useState(
    currentSection.sectionTitleDecoration,
  );
  const [titleValue, setTitleValue] = React.useState(currentSection.title);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [logoSize, setLogoSize] = React.useState(currentSection?.logoSize || 100);
  const [logoAlign, setLogoAlign] = React.useState(currentSection?.logoAlign);
  const isOpen = Boolean(anchorEl);
  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRemove = () => {
    handleClose();
    setDataSectionContainers((arr) => arr.filter((x) => x !== containerId));
    setDataSectionItems((obj) => _.omit(obj, [containerId]));
  };
  const handleNameChange = (e) => {
    setTitleValue(e.target.value);
  };
  const handleSwitchChange = (e) => {
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.map((item) => ({
          ...item,
          isRequired: item.id === e.target.id ? false : item.isRequired,
          isVisible: item.id === e.target.id ? e.target.checked : item.isVisible,
        })),
      },
    }));
  };
  const handleSave = () => {
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: localItemsOrder,
        title: titleValue === '' ? 'Untitled section' : titleValue,
        isTitleVisibleOnTheFinalDocument,
        isSectionVisibleOnTheFinalDoc,
        height: sectionHeight,
        logoName,
        logoDescription,
        logoSize,
        logoAlign,
        sectionTitleFontSize,
        sectionTitleDecoration,
      },
    }));
    handleClose();
  };
  const handleBackgroundImage = React.useCallback(
    async (file) => {
      if (file) {
        const bgImage = await toBase64(file);
        setDataSectionItems((data) => ({
          ...data,
          [containerId]: {
            ...data[containerId],
            bgImage,
            bgUuid: null,
          },
        }));
        const res = await UploadFile({
          from_feature: 'media--formbuilder',
          for_account: false,
          file: file,
          type: UploaderTypesEnum.Image.key,
        });
        if (res && res.status === 201)
          setDataSectionItems((data) => ({
            ...data,
            [containerId]: {
              ...data[containerId],
              bgImage: res.data.results.original.url,
              bgUuid: res.data.results.original.uuid,
            },
          }));
        else {
          setDataSectionItems((data) => ({
            ...data,
            [containerId]: {
              ...data[containerId],
              bgImage: null,
              bgUuid: null,
            },
          }));
          showError(t('failed-to-upload-file'), res);
        }
      } else
        setDataSectionItems((data) => ({
          ...data,
          [containerId]: {
            ...data[containerId],
            bgImage: '',
            bgUuid: null,
          },
        }));
    },
    [containerId, setDataSectionItems, t],
  );

  const handleLogoImage = React.useCallback(
    async (file) => {
      if (file) {
        const logoImage = await toBase64(file);
        setDataSectionItems((data) => ({
          ...data,
          [containerId]: {
            ...data[containerId],
            logoImage,
            logoUuid: null,
          },
        }));
        const res = await UploadFile({
          from_feature: 'media--formbuilder',
          for_account: false,
          file: file,
          type: UploaderTypesEnum.Image.key,
        });
        if (res && res.status === 201)
          setDataSectionItems((data) => ({
            ...data,
            [containerId]: {
              ...data[containerId],
              logoImage: res.data.results.original.url,
              logoUuid: res.data.results.original.uuid,
            },
          }));
        else {
          setDataSectionItems((data) => ({
            ...data,
            [containerId]: {
              ...data[containerId],
              logoImage: null,
              logoUuid: null,
            },
          }));
          showError(t('failed-to-upload-file'), res);
        }
      } else
        setDataSectionItems((data) => ({
          ...data,
          [containerId]: {
            ...data[containerId],
            logoImage: '',
            logoUuid: null,
          },
        }));
    },
    [containerId, setDataSectionItems, t],
  );
  const handleSectionHeightChange = ({ target: { value } }) =>
    setSectionHeight(value);

  const handleLogoNameChange = ({ target: { value } }) => setLogoName(value);

  const handleLogoDescriptionChange = ({ target: { value } }) =>
    setLogoDescription(value);

  const handleIsSectionTitleVisibleOnFinalDocument = ({ target: { checked } }) =>
    setIsTitleVisibleOnTheFinalDocument(checked);

  const sectionVisibilityFinalDocHandler = ({ target: { checked } }) =>
    setIsSectionVisibleOnTheFinalDoc(checked);

  const handleLogoSizeChange = ({ target: { value } }) => setLogoSize(value);

  const handleLogoAlignChange = ({ target: { value } }) => setLogoAlign(value);

  React.useEffect(() => {
    setLocalItemsOrder(currentSection.items);
    setIsSectionVisibleOnTheFinalDoc(currentSection.isSectionVisibleOnTheFinalDoc);
  }, [currentSection]);

  return (
    <Box>
      {React.cloneElement(children, {
        id: 'settings-card-button',
        'aria-label': 'section-settings',
        'aria-controls': isOpen ? 'settings-card-menu' : undefined,
        'aria-haspopup': true,
        'aria-expanded': isOpen ? 'true' : undefined,
        className: isOpen ? '' : 'hidden-button',
        variant: 'contained',
        onClick: handleOpen,
      })}
      <Menu
        id="customized-menu"
        className="form-section-settings-popover-wrapper"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            px: 6,
            pt: 5,
          }}
        >
          {!['bg', 'logo', 'pageBreak'].includes(currentSection.subModel) && (
            <>
              <InputOptionBox>
                <Tooltip
                  title={
                    currentSection.items.filter(
                      (item) => item.fillBy === FormsRolesEnum.Recipient.key,
                    ).length
                      ? 'Make sure all fields inside this section are not intended to be filled by recipient in order to control this option'
                      : ''
                  }
                >
                  <InputOptionBox>
                    <Typography variant="caption">
                      Visible on final document
                    </Typography>
                    <Switch
                      checked={isSectionVisibleOnTheFinalDoc}
                      onChange={sectionVisibilityFinalDocHandler}
                      sx={{ alignSelf: 'center', mr: 2.5 }}
                      inputProps={{ 'aria-label': 'controlled-card-item-switch' }}
                      disabled={
                        currentSection.items.filter(
                          (item) => item.fillBy === FormsRolesEnum.Recipient.key,
                        )?.length > 0
                      }
                    />
                  </InputOptionBox>
                </Tooltip>
              </InputOptionBox>

              <Box
                sx={{
                  border: 1,
                  padding: 2,
                  borderRadius: 1,
                  borderColor: '#ccc',
                  borderStyle: 'dashed',
                  marginBottom: 3,
                }}
              >
                <InputOptionBox>
                  <Typography variant="caption">Section name</Typography>
                  <Box>
                    <TextField
                      onChange={handleNameChange}
                      value={titleValue}
                      sx={{ py: '2px' }}
                    />
                  </Box>
                </InputOptionBox>
                <InputOptionBox>
                  <Typography variant="caption"> </Typography>
                  <Box display="flex" sx={{ mt: '9px' }}>
                    <Checkbox
                      checked={isTitleVisibleOnTheFinalDocument}
                      onChange={handleIsSectionTitleVisibleOnFinalDocument}
                    />
                    <Typography
                      lh="double"
                      sx={{ ml: '9px', fontSize: '12px', color: 'dark.$40' }}
                    >
                      Display title on the final document
                    </Typography>
                  </Box>
                </InputOptionBox>
                <InputOptionBox>
                  <Typography variant="caption" align="center">
                    Section title font size
                  </Typography>
                  <Box>
                    <Select
                      fullWidth
                      variant="standard"
                      id="modal-input-type-select"
                      IconComponent={CornerDownIcon}
                      value={sectionTitleFontSize}
                      onChange={(e) => setSectionTitleFontSize(e.target.value)}
                    >
                      {_.range(8, 48, 1).map((x) => (
                        <MenuItem key={x} value={x}>
                          {x}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </InputOptionBox>
                <InputOptionBox>
                  <Typography variant="caption" align="center">
                    Section title style
                  </Typography>
                  <Box>
                    <CustomToggleButtonGroup
                      value={sectionTitleDecoration}
                      onChange={(e, value) => setSectionTitleDecoration(value)}
                    >
                      {textModificationList.map(({ icon, value }, i) => (
                        <ToggleButton model="icon" key={i} value={value}>
                          <Icon component={icon} />
                        </ToggleButton>
                      ))}
                    </CustomToggleButtonGroup>
                  </Box>
                </InputOptionBox>
              </Box>

              <Divider sx={{ my: 2, mx: -6 }} />

              <Typography variant="h6">Fields</Typography>
              <Box sx={{ mb: 2 }}>
                {!currentSection.items.length && (
                  <Typography sx={{ mt: 4, color: 'dark.$40' }}>
                    Add fields to control them
                  </Typography>
                )}
                <SimpleSortable
                  data={localItemsOrder || []}
                  setDataOrder={(newOrder) => {
                    setLocalItemsOrder(newOrder);
                  }}
                  element={({ id, isVisible, languages, activeId, listeners }) => (
                    <FormGroup
                      id={id}
                      sx={{
                        py: 3,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            id={id}
                            checked={isVisible}
                            onChange={handleSwitchChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        }
                        sx={{ color: !isVisible ? 'dark.$60' : 'dark.main', m: 0 }}
                        label={languages[primaryLang].title}
                      />
                      <DraggableCardIcon
                        {...listeners}
                        sx={{ ml: 'auto', cursor: activeId ? 'grabbing' : 'grab' }}
                      />
                    </FormGroup>
                  )}
                />
              </Box>
            </>
          )}
          {['logo'].includes(currentSection.subModel) && (
            <>
              <InputOptionBox>
                <Typography variant="caption">Uplodad logo</Typography>
                <Box>
                  <FileUploader
                    id={`logo-${Date.now()}`}
                    cb={handleLogoImage}
                    files={[
                      currentSection.logoImage
                        ? [{ logoImage: currentSection.logoImage }]
                        : null,
                    ]}
                    matchFileType={['image/png', 'image/jpeg', 'image/jpg']}
                  >
                    <Box display="flex" flexDirection="column" flex="1">
                      {currentSection.logoImage ? (
                        <CardMedia
                          component="img"
                          src={currentSection.logoImage}
                          sx={{ height: 70, width: 70 }}
                        />
                      ) : (
                        <Typography>No logo image</Typography>
                      )}
                      <Button
                        sx={{ mt: 2, pointerEvents: 'none' }}
                        variant="border"
                        size="m"
                        startIcon={
                          <Icon
                            component={
                              currentSection.logoImage
                                ? RefreshIcon
                                : UploadCloudIcon
                            }
                          />
                        }
                      >
                        <Typography
                          color="dark.main"
                          variant="body13"
                          weight="medium"
                        >
                          {currentSection.logoImage ? 'Replace' : 'Upload image'}
                        </Typography>
                      </Button>
                    </Box>
                  </FileUploader>
                </Box>
              </InputOptionBox>
              {currentSection.logoImage && (
                <Button
                  sx={{ my: 2 }}
                  variant="border"
                  size="m"
                  onClick={() => handleLogoImage()}
                >
                  <Typography color="dark.main" variant="body13" weight="medium">
                    Clear
                  </Typography>
                </Button>
              )}
              <Divider sx={{ my: 2, mx: -6 }} />
            </>
          )}
          {['bg', 'logo'].includes(currentSection.subModel) && (
            <>
              <InputOptionBox>
                <Typography variant="caption">Background image</Typography>
                <Box>
                  <FileUploader
                    id={`bg-${Date.now()}`}
                    cb={handleBackgroundImage}
                    files={
                      currentSection.bgImage
                        ? [{ logoImage: currentSection.bgImage }]
                        : null
                    }
                    matchFileType={['image/png', 'image/jpeg', 'image/jpg']}
                  >
                    <Box display="flex" flexDirection="column" flex="1">
                      {currentSection.bgImage ? (
                        <CardMedia
                          component="img"
                          src={currentSection.bgImage}
                          sx={{ height: 52, width: 248 }}
                        />
                      ) : (
                        <Typography>No background image</Typography>
                      )}
                      <Button
                        sx={{ mt: 2, pointerEvents: 'none' }}
                        variant="border"
                        size="m"
                        startIcon={
                          <Icon
                            component={
                              currentSection.bgImage ? RefreshIcon : UploadCloudIcon
                            }
                          />
                        }
                      >
                        <Typography
                          color="dark.main"
                          variant="body13"
                          weight="medium"
                        >
                          {currentSection.bgImage ? 'Replace' : 'Upload image'}
                        </Typography>
                      </Button>
                    </Box>
                  </FileUploader>
                </Box>
              </InputOptionBox>
              {currentSection.bgImage && (
                <Button
                  sx={{ my: 2 }}
                  variant="border"
                  size="m"
                  onClick={() => handleBackgroundImage()}
                >
                  <Typography color="dark.main" variant="body13" weight="medium">
                    Clear
                  </Typography>
                </Button>
              )}
              <InputOptionBox>
                <Typography variant="caption">Section height</Typography>
                <Box>
                  <TextField
                    onChange={handleSectionHeightChange}
                    value={sectionHeight}
                    sx={{ py: '2px' }}
                  />
                </Box>
              </InputOptionBox>
            </>
          )}
          {['pageBreak'].includes(currentSection.subModel) && (
            <>
              <InputOptionBox>
                <Tooltip
                  title={
                    currentSection.items.filter(
                      (item) => item.fillBy === FormsRolesEnum.Recipient.key,
                    ).length
                      ? 'Make sure all fields inside this section are not intended to be filled by recipient in order to control this option'
                      : ''
                  }
                >
                  <InputOptionBox>
                    <Typography variant="caption">
                      Visible on final document
                    </Typography>
                    <Switch
                      checked={isSectionVisibleOnTheFinalDoc}
                      onChange={sectionVisibilityFinalDocHandler}
                      sx={{ alignSelf: 'center', mr: 2.5 }}
                      inputProps={{ 'aria-label': 'controlled-card-item-switch' }}
                      disabled={
                        currentSection.items.filter(
                          (item) => item.fillBy === FormsRolesEnum.Recipient.key,
                        )?.length > 0
                      }
                    />
                  </InputOptionBox>
                </Tooltip>
              </InputOptionBox>

              <Box
                sx={{
                  border: 1,
                  padding: 2,
                  borderRadius: 1,
                  borderColor: '#ccc',
                  borderStyle: 'dashed',
                  marginBottom: 3,
                }}
              >
                <InputOptionBox>
                  <Typography variant="caption">Section name</Typography>
                  <Box>
                    <TextField
                      onChange={handleNameChange}
                      value={titleValue}
                      sx={{ py: '2px' }}
                      disabled
                    />
                  </Box>
                </InputOptionBox>
                <InputOptionBox>
                  <Typography variant="caption"> </Typography>
                  <Box display="flex" sx={{ mt: '9px' }}>
                    <Checkbox
                      checked={isTitleVisibleOnTheFinalDocument}
                      onChange={handleIsSectionTitleVisibleOnFinalDocument}
                    />
                    <Typography
                      lh="double"
                      sx={{ ml: '9px', fontSize: '12px', color: 'dark.$40' }}
                    >
                      Display title on the final document
                    </Typography>
                  </Box>
                </InputOptionBox>
              </Box>
            </>
          )}
          {['logo'].includes(currentSection.subModel) && (
            <>
              <Divider sx={{ my: 2, mx: -6 }} />
              <InputOptionBox>
                <Typography variant="caption">Displayed name</Typography>
                <Box>
                  <TextField
                    onChange={handleLogoNameChange}
                    value={logoName}
                    sx={{ py: '2px' }}
                    multiline
                  />
                </Box>
              </InputOptionBox>
              <InputOptionBox>
                <Typography variant="caption">Description</Typography>
                <Box>
                  <TextField
                    onChange={handleLogoDescriptionChange}
                    value={logoDescription}
                    sx={{ py: '2px' }}
                  />
                </Box>
              </InputOptionBox>
              <InputOptionBox>
                <Typography variant="caption">Logo size</Typography>
                <Box>
                  <TextField
                    onChange={handleLogoSizeChange}
                    value={logoSize}
                    sx={{ py: '2px' }}
                    type="number"
                  />
                </Box>
              </InputOptionBox>
              <InputOptionBox>
                <Typography variant="caption">Logo alignement</Typography>
                <Box>
                  <RadiosComponent
                    idRef="showSecondaryLogoRef"
                    labelInput="value"
                    valueInput="key"
                    value={logoAlign}
                    data={[
                      {
                        key: 'left',
                        value: 'Left',
                      },
                      {
                        key: 'center',
                        value: 'Center',
                      },
                      {
                        key: 'right',
                        value: 'Right',
                      },
                    ]}
                    onSelectedRadioChanged={handleLogoAlignChange}
                  />
                </Box>
              </InputOptionBox>
            </>
          )}
        </Box>
        <ButtonGroup disableElevation variant="modal">
          <Button onClick={handleRemove}>
            <TrashIcon />
            <Typography>Remove</Typography>
          </Button>
          <Button onClick={handleSave}>
            <CheckIcon />
            <Typography>Save</Typography>
          </Button>
        </ButtonGroup>
      </Menu>
    </Box>
  );
}
