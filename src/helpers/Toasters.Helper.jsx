import React from 'react';
import { toast } from 'react-toastify';
import { GlobalTranslate } from '../helpers';
import { ButtonBase } from '@mui/material';
import i18next from 'i18next';

export const GetToasterInstance = () => toast;

const displayMessageShape = ({
  message,
  actionHandler,
  actionHandlerText = 'undo',
  parentTranslationPath = 'Shared',
  customComponentForMessageWrapping,
}) =>
  (customComponentForMessageWrapping
    && customComponentForMessageWrapping(message))
  || (actionHandler && (
    <div className="toaster-undo-wrapper">
      <span className="px-2">{message}</span>
      <ButtonBase
        className="btns theme-transparent miw-50px mx-2"
        onClick={actionHandler}
      >
        {GlobalTranslate.t(`${parentTranslationPath}:${actionHandlerText}`)}
      </ButtonBase>
    </div>
  ))
  || message;
export const showSuccess = (
  message,
  {
    position = toast.POSITION.TOP_CENTER,
    type = toast.TYPE.SUCCESS,
    onClose,
    actionHandler,
    actionHandlerText,
    parentTranslationPath,
    customComponentForMessageWrapping,
    autoClose = 5000,
    closeButton = true,
    pauseOnHover = true,
    hideProgressBar = false,
    draggable = true,
    rtl = i18next.dir() === 'rtl',
    toastId,
    theme,
    bodyStyle,
    style,
  } = {},
) =>
  toast(
    displayMessageShape({
      message,
      actionHandler,
      actionHandlerText,
      parentTranslationPath,
      customComponentForMessageWrapping,
    }),
    {
      position,
      type,
      autoClose,
      closeButton,
      onClose,
      hideProgressBar,
      pauseOnHover,
      draggable,
      rtl,
      theme,
      toastId: toastId || message,
      bodyStyle,
      style,
    },
  );

export const showError = (
  message,
  errors = undefined,
  {
    position = toast.POSITION.TOP_CENTER,
    type = toast.TYPE.ERROR,
    onUndo,
    customComponentForMessageWrapping,
    autoClose = 5000,
    closeButton = true,
    pauseOnHover = true,
    hideProgressBar = false,
    draggable = true,
    rtl = i18next.dir() === 'rtl',
    toastId,
    theme,
    bodyStyle,
    style,
  } = {},
) => {
  const localData = errors?.response?.data || errors?.data || errors;
  const localErrors = localData?.errors || localData?.reason;
  // if (!errors) return;
  const alternativeMessage
    = localData?.status
    || localData?.message
    || (localData?.detail
      && ((typeof localData.detail === 'object'
        && localData.detail.error === 'string'
        && localData.detail.error)
        || (typeof localData.detail === 'string' && localData.detail)))
    || '';
  const localCodeStatusCondition
    = localData
    && localData.identifiers
    && (localData.identifiers.statusCode === 400
      || localData.identifiers.statusCode === 401
      || localData.identifiers.statusCode === 402
      || localData.identifiers.statusCode === 403);
  const localErrorsCondition
    = localErrors
    && !localCodeStatusCondition
    && ((typeof localErrors === 'object' && !Array.isArray(localErrors))
      || (Array.isArray(localErrors) && localErrors.length > 0));
  const toDisplayMessages
    = (localErrorsCondition && (
      <ul className="mb-0">
        {(Array.isArray(localErrors)
          && localErrors.map((item, index) => (
            <li key={`errorKey${index + 1}`}>
              <span>{item.error}</span>
            </li>
          )))
          || Object.entries(localErrors).map(
            (items, index) =>
              (Array.isArray(items[1])
                && items[1].map((item, subIndex) => (
                  <li key={`${items[0]}${index + 1}-${subIndex + 1}`}>{item}</li>
                )))
              || (items[1]
                && (Object.hasOwn(items[1], 'value')
                  || (Object.hasOwn(items[1], 'key')
                    && !Object.hasOwn(items[1], 'message'))) && (
                <li key={`${items[0]}${index + 1}`}>
                  {items[1].key && <span>{items[1].key}: </span>}
                  {items[1].value && <span>{items[1].value}</span>}
                </li>
              ))
              || (items[1] && Object.hasOwn(items[1], 'message') && (
                <li key={`${items[0]}${index + 1}`}>
                  {items[1].key && <span>{items[1].key}: </span>}
                  {items[1].message && <span>{items[1].message}</span>}
                </li>
              ))
              || (items[0] === 'error' && (
                <li key={`${items[0]}${index + 1}`}>
                  {(typeof items[1] === 'object' && (
                    <span>{items[1].error}</span>
                  )) || <span>{items[1]}</span>}
                </li>
              )) || <li key={`${items[0]}${index + 1}`}>{items[1]}</li>,
          )}
      </ul>
    ))
    || alternativeMessage
    || message;
  if (toDisplayMessages)
    toast(
      displayMessageShape({
        message: toDisplayMessages,
        onUndo,
        customComponentForMessageWrapping,
      }),
      {
        position,
        type,
        autoClose,
        closeButton,
        hideProgressBar,
        pauseOnHover,
        draggable,
        rtl,
        theme,
        toastId: toastId || message,
        bodyStyle,
        style,
      },
    );
};

// function showWarn(message, configuration = { autoClose: 3000 }) {
//   toast.warn(message, configuration);
// }
//
// function showInfo(message, configuration = { autoClose: 3000 }) {
//   toast.info(message, configuration);
// }
