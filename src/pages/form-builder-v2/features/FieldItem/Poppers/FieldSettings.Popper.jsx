import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  IconButton,
  MenuItem,
  FormControl,
  Select,
  Popper,
  Divider,
} from '@mui/material';
import FieldMenu from '../FieldMenu';
import {
  CopyIcon,
  TrashIcon,
  CornerDownIcon,
  SettingsIcon,
} from '../../../../form-builder/icons';
import Fade from '../../../components/Fade';
import IconButtonGroup from '../../../components/IconsButtonGroup';
import { alignList, textModificationList } from '../../../data/iconButtonLists';
import fields from 'pages/form-builder/data/inputFields';
import { generateUUIDV4 } from '../../../../../helpers';
import {
  DefaultFormsTypesEnum,
  FormsAssignTypesEnum,
  FormsAssistRoleTypesEnum,
  FormsAssistTypesEnum,
  FormsFieldsTypesEnum,
  FormsMembersTypesEnum,
  FormsRolesEnum,
  NavigationSourcesEnum,
  // FormsStatusesEnum,
} from '../../../../../enums';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import RoleTypesPopover from '../../../popovers/role-types/RoleTypes.Popover';
import { AvatarsComponent } from '../../../../../components';

function FieldSettingsPopper({
  type,
  open,
  cardId,
  anchorEl,
  fillBy,
  styleType,
  containerId,
  fieldsItems,
  templateData,
  dataSectionItems,
  formsRolesTypes,
  setDataSectionItems,
  getFilteredRoleTypes,
  parentTranslationPath,
  translationPath,
  blocksItems,
}) {
  const [roleSelect, setRoleSelect] = React.useState(fillBy);

  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    filledBy: null,
    members: null,
  });
  const onRoleTypeChangeHandler = (newValue) => {
    setRoleSelect(newValue.fillBy);
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        ...(newValue.fillBy === FormsRolesEnum.Recipient.key && {
          isSectionVisibleOnTheFinalDoc: true,
        }),
        items: data[containerId].items.map((x) =>
          x.id === cardId
            ? {
              ...x,
              ...newValue,
              ...(newValue.fillBy === FormsRolesEnum.Recipient.key && {
                isVisibleFinalDoc: true,
              }),
            }
            : x,
        ),
      },
    }));
  };
  const handleCopy = () =>
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.reduce(
          (acc, item) => [
            ...acc,
            ...(item.id !== cardId
              ? [item]
              : [item, { ...item, id: generateUUIDV4() }]),
          ],
          [],
        ),
      },
    }));
  const handleTypographyChange = (e) => {
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.map((x) =>
          x.id === cardId
            ? {
              ...x,
              style: fields[e?.target?.value?.toLowerCase()]?.style,
            }
            : x,
        ),
      },
    }));
  };
  const handleAlignment = (textAlign) =>
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.map((x) =>
          x.id === cardId ? { ...x, style: { ...styleType, textAlign } } : x,
        ),
      },
    }));
  const handleTextStyle = (textDecoration) =>
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.map((x) =>
          x.id === cardId ? { ...x, style: { ...styleType, textDecoration } } : x,
        ),
      },
    }));

  /**
   * @param currentRole - current role item key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the role enum item by key
   */
  const getSelectedRoleEnumItem = useMemo(
    () => (currentRole) =>
      formsRolesTypes.find((item) => item.key === currentRole) || {},
    [formsRolesTypes],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the current field item JSON
   */
  const getCurrentFieldItem = useMemo(
    () => () =>
      dataSectionItems[containerId].items.find((item) => item.id === cardId) || {},
    [cardId, containerId, dataSectionItems],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the page popovers part 2
   */
  const onPopoverAttachedWithChanged = useCallback((key, newValue) => {
    setPopoverAttachedWith((items) => ({ ...items, [key]: newValue }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the page popovers part 1
   */
  const popoverToggleHandler = useCallback(
    (popoverKey, event = null) => {
      onPopoverAttachedWithChanged(
        popoverKey,
        (event && event.currentTarget) || null,
      );
    },
    [onPopoverAttachedWithChanged],
  );

  const handleRemove = () => {
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.filter((x) => x.id !== cardId),
      },
    }));
  };

  useEffect(() => {
    setRoleSelect(fillBy);
  }, [fillBy]);

  return (
    <Popper
      id={cardId}
      open={Boolean(anchorEl && open)}
      onClick={(e) => e.stopPropagation()}
      anchorEl={anchorEl}
      transition
      placement="top-start"
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Box
            sx={{
              p: 2,
              mb: 2,
              bgcolor: 'light.main',
              boxShadow: 1,
              borderRadius: 2,
              display: 'flex',
              maxHeight: '48px',
            }}
          >
            {!['texteditor'].includes(type) && (
              <Box display="flex" alignItems="center">
                {['inline'].includes(type) ? (
                  <FormControl fullWidth>
                    <Select
                      id="popper-select"
                      value={styleType?.type || ''}
                      variant="standard"
                      disableUnderline
                      sx={{ border: 'none' }}
                      IconComponent={CornerDownIcon}
                      onChange={handleTypographyChange}
                    >
                      {Object.values(fieldsItems)
                        .filter((f) => f.type === 'inline')
                        .map((f) => (
                          <MenuItem key={f.title} value={f.style.type}>
                            {f.style.type}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                ) : (
                  <>
                    <ButtonBase
                      className={`btns theme-transparent${
                        (popoverAttachedWith.filledBy && ' is-active') || ''
                      }`}
                      onClick={(e) => {
                        popoverToggleHandler('filledBy', e);
                      }}
                      disabled={
                        templateData.editorRole !== FormsRolesEnum.Creator.key
                      }
                    >
                      <span className="d-inline-flex-center ff-default lh-100">
                        <span className="fz-30px c-accent-secondary-lighter">
                          &bull;
                        </span>
                      </span>
                      <span className="px-2">
                        {getSelectedRoleEnumItem(roleSelect).value}
                      </span>
                      <span
                        className={`fas fa-chevron-${
                          (popoverAttachedWith.filledBy && 'up') || 'down'
                        }`}
                      />
                    </ButtonBase>
                    {(getSelectedRoleEnumItem(roleSelect).isWithAssignToAssist
                      || getSelectedRoleEnumItem(roleSelect).isWithAssignToView) && (
                      <>
                        <div className="separator-v" />
                        <AvatarsComponent
                          translationPath={translationPath}
                          parentTranslationPath={parentTranslationPath}
                          idRef={`assignedMembersAvatarsRef${containerId}${cardId}${type}`}
                          avatarImageAlt="assigned-member"
                          endBtnTitle="assign"
                          avatars={getCurrentFieldItem().assign}
                          disabled={
                            templateData.editorRole !== FormsRolesEnum.Creator.key
                          }
                          onEndBtnClicked={(e) => {
                            popoverToggleHandler('filledBy', e);
                          }}
                          onGroupClicked={(e) => {
                            popoverToggleHandler('filledBy', e);
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </Box>
            )}
            {['inline'].includes(type) && (
              <>
                <Divider orientation="vertical" flexItem sx={{ mx: '9px' }} />
                <IconButtonGroup
                  border="none"
                  isExclusive
                  setValue={handleAlignment}
                  list={alignList}
                  value={styleType?.textAlign}
                />
                <Divider orientation="vertical" flexItem sx={{ mx: '9px' }} />
                <IconButtonGroup
                  border="none"
                  setValue={handleTextStyle}
                  list={textModificationList}
                  value={styleType?.textDecoration}
                />
              </>
            )}
            {!['texteditor'].includes(type) && (
              <Divider orientation="vertical" flexItem sx={{ mx: '9px' }} />
            )}
            <Box display="flex">
              <IconButton onClick={handleCopy}>
                <CopyIcon />
              </IconButton>
              {!['inline', 'texteditor'].includes(type) && (
                <FieldMenu
                  cardId={cardId}
                  fillBy={fillBy}
                  containerId={containerId}
                  fieldsItems={fieldsItems}
                  templateData={templateData}
                  setDataSectionItems={setDataSectionItems}
                  dataSectionItems={dataSectionItems}
                  blocksItems={blocksItems}
                  // handleRoleChange={onRoleTypeChangeHandler}
                >
                  <IconButton>
                    <SettingsIcon />
                  </IconButton>
                </FieldMenu>
              )}
              {['inline'].includes(type) && (
                <Divider orientation="vertical" flexItem sx={{ mx: '9px' }} />
              )}
              <IconButton onClick={handleRemove}>
                <TrashIcon />
              </IconButton>
            </Box>
          </Box>
          {popoverAttachedWith.filledBy && (
            <RoleTypesPopover
              idRef={`${containerId}${cardId}${type}`}
              popoverAttachedWith={popoverAttachedWith}
              handleClose={() => {
                popoverToggleHandler('filledBy', null);
              }}
              getFilteredRoleTypes={getFilteredRoleTypes}
              editValue={getCurrentFieldItem()}
              popoverToggleHandler={popoverToggleHandler}
              onSave={onRoleTypeChangeHandler}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
        </Fade>
      )}
    </Popper>
  );
}
FieldSettingsPopper.propTypes = {
  type: PropTypes.oneOf(Object.values(FormsFieldsTypesEnum).map((item) => item.key))
    .isRequired,
  open: PropTypes.bool.isRequired,
  cardId: PropTypes.string.isRequired,
  anchorEl: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
    PropTypes.object,
  ]),
  fillBy: PropTypes.oneOf(Object.values(FormsRolesEnum).map((item) => item.key))
    .isRequired,
  styleType: PropTypes.instanceOf(Object),
  containerId: PropTypes.string.isRequired,
  fieldsItems: PropTypes.instanceOf(Object).isRequired,
  templateData: PropTypes.shape({
    isWithRecipient: PropTypes.bool,
    isWithDelay: PropTypes.bool,
    delayDuration: PropTypes.number,
    assign: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(FormsAssignTypesEnum).map((item) => item.key),
        ),
        uuid: PropTypes.string,
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      }),
    ),
    invitedMember: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(FormsMembersTypesEnum).map((item) => item.key),
        ),
        uuid: PropTypes.string,
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      }),
    ),
    assignToAssist: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(FormsAssistTypesEnum).map((item) => item.key),
        ),
        uuid: PropTypes.string,
        role: PropTypes.oneOf(
          Object.values(FormsAssistRoleTypesEnum).map((item) => item.key),
        ),
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      }),
    ),
    categories: PropTypes.instanceOf(Array),
    createdAt: PropTypes.string,
    description: PropTypes.string,
    editorRole: PropTypes.oneOf(
      Object.values(FormsRolesEnum).map((item) => item.key),
    ),
    isGrid: PropTypes.bool,
    // isNotShareable: PropTypes.bool,
    labelsLayout: PropTypes.oneOf(['row', 'column']),
    languages: PropTypes.instanceOf(Object),
    layout: PropTypes.oneOf(['row', 'column']),
    name: PropTypes.string,
    positionLevel: PropTypes.instanceOf(Array),
    primaryLang: PropTypes.string,
    secondaryLang: PropTypes.string,
    recipient: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
    }),
    sender: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
    }),
    source: PropTypes.oneOf(
      Object.values(NavigationSourcesEnum).map((item) => item.key),
    ),
    // formStatus: PropTypes.oneOf(
    //   Object.values(FormsStatusesEnum).map((item) => item.key)
    // ),
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    code: PropTypes.oneOf(
      Object.values(DefaultFormsTypesEnum).map((item) => item.key),
    ),
    updatedAt: PropTypes.string,
    uuid: PropTypes.string,
    formUUID: PropTypes.string,
  }).isRequired,
  dataSectionItems: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      isTitleVisibleOnTheFinalDocument: PropTypes.bool,
      isSectionVisibleOnTheFinalDoc: PropTypes.bool,
      sectionTitleDecoration: PropTypes.string,
      sectionTitleFontSize: PropTypes.number,
      isStepper: PropTypes.bool,
      order: PropTypes.number,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          type: PropTypes.oneOf(
            Object.values(FormsFieldsTypesEnum).map((item) => item.key),
          ),
          fillBy: PropTypes.oneOf(
            Object.values(FormsRolesEnum).map((item) => item.key),
          ),
          assign: PropTypes.arrayOf(
            PropTypes.shape({
              type: PropTypes.number,
              uuid: PropTypes.string,
            }),
          ),
          code: PropTypes.string,
          isVisible: PropTypes.bool,
          isRequired: PropTypes.bool,
          isVisibleFinalDoc: PropTypes.bool,
          cardTitle: PropTypes.string,
          description: PropTypes.string,
          icon: PropTypes.instanceOf(Object),
          currency: PropTypes.string,
          charMin: PropTypes.number,
          charMax: PropTypes.number,
          languages: PropTypes.objectOf(
            PropTypes.shape({
              value: PropTypes.oneOfType([
                PropTypes.instanceOf(Array),
                PropTypes.instanceOf(Object),
                PropTypes.string,
                PropTypes.number,
              ]),
              placeholder: PropTypes.string,
              title: PropTypes.string,
              isConditionalHidden: PropTypes.bool,
              isConditionalHiddenValue: PropTypes.bool,
              labelDecorations: PropTypes.string,
              labelFontSize: PropTypes.number,
              hideLabel: PropTypes.bool,
              options: PropTypes.arrayOf(
                PropTypes.shape({
                  id: PropTypes.string,
                  title: PropTypes.string,
                  isVisible: PropTypes.bool,
                  description: PropTypes.string,
                  code: PropTypes.string,
                }),
              ),
            }),
          ),
        }),
      ),
    }),
  ).isRequired,
  formsRolesTypes: PropTypes.instanceOf(Object).isRequired,
  setDataSectionItems: PropTypes.func.isRequired,
  getFilteredRoleTypes: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
export default React.memo(FieldSettingsPopper);
