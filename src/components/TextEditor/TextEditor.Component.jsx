// noinspection RequiredAttributes
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { GetGlobalFontFaces, GlobalEditorInitialSetting } from '../../helpers';
import FroalaEditor from 'froala-editor';

import './TextEditor.Style.scss';
import { EvaBrandFontsEnum } from '../../enums';
import { useEventListener } from '../../hooks';
import { ResizeIcon } from '../../assets/icons';

// component to control or change textEditor from single location
export const TextEditorComponent = memo(
  ({
    wrapperClasses,
    labelClasses,
    isDisabled,
    labelValue,
    idRef,
    editorValue,
    // toolbar,
    height,
    width,
    isSubmitted,
    helperText,
    onEditorChange,
    onBlurChange,
    onEditorDelayedChange,
    parentTranslationPath,
    translationPath,
    // plugins,
    // isWithoutInsert,
    // menubar,
    onInit,
    tabIndex,
    isRequired,
    placeholder,
    // rightToolbarExtend,
    fontFormats,
    contentStyle,
    // imageTitle,
    // automaticUploads,
    // imageAdvTab,
    // imageCaption,
    // filePickerTypes,
    // branding,
    // leftToolbarExtend,
    hideFonts,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [localValue, setLocalValue] = useState(editorValue);
    const [isBlurred, setIsBlurred] = useState(false);
    // const [intValueIsNormalString, setIntValueIsNormalString] = useState(false);
    const timerRef = useRef(null);
    const editorRef = useRef(null);
    // const froalaEditorRef = useRef(null);
    const isMountedRef = useRef(null);
    const resizeElementRef = useRef(null);
    // const resizeObservableRef = useRef();
    const editorContainerRef = useRef(null);
    const [editorState, setEditorState] = useState(null);
    const isResizingRef = useRef(false);
    const intValueIsNormalStringRef = useRef(false);

    // const resizeIframe = useCallback(() => {
    //   if (!editorRef.current) return;

    // Get the height of the content
    // Set the iframe height
    // editorRef.current.iframe_document.height = contentHeight + 'px!important';
    // setTimeout(() => {
    // const contentHeight =
    // const contentHeight = Math.max(
    //   editorRef.current.iframe_document.documentElement.offsetHeight,
    //   editorRef.current.iframe_document.body.offsetHeight,
    // );
    // editorContainerRef.current.style.height = `${newHeight}px`;
    // const wrapperElement = document.querySelector(
    //   `#text-editor-wrapper${idRef} .fr-wrapper`,
    // );
    // wrapperElement.style.height = newEditorHeight + 'px';
    // editorRef.current.opts.height = newEditorHeight;
    // editorRef.current.iframe_document.defaultView.frameElement.style.setProperty(
    //   'height',
    //   contentHeight + 'px',
    //   'important',
    // );
    // });
    // editorRef.current.iframe_document.contentHeight = contentHeight + 'px!important';
    // editorRef.current.iframe_document.clientHeight = contentHeight + 'px!important';
    // iframe.style.height = contentHeight + 'px!important';
    // }, []);

    const getFontFormats = useMemo(() => {
      let temp = {};
      Object.values(EvaBrandFontsEnum).forEach((fontItem) => {
        temp[fontItem.key] = t(`EvaBrand:${fontItem.value}`);
      });
      return temp;
    }, [t]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this is to update the local value if parent value is updated &
     * not same as local with attention for delay if active or not
     */
    useEffect(() => {
      if (localValue !== editorValue && !timerRef.current) {
        setLocalValue(editorValue);
        if (editorRef.current) {
          editorRef.current.html.set(editorValue);
          editorRef.current.undo.saveStep();
        }
      }
    }, [editorValue, localValue]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this is to prevent any memory leak if the user destroy
     * the component before setTimeout finished
     * @note destroy is happening when tap or route or refresh happening
     */
    useEffect(
      () => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        // if (resizeObservableRef.current) resizeObservableRef.current.disconnect();
      },
      [],
    );
    const onInitHandler = useCallback(() => {
      const editorElement = document.getElementById(idRef);
      if (
        !!editorElement
        && !editorRef.current
        && !editorState
        && !isMountedRef.current
      ) {
        isMountedRef.current = true;
        const styles = window.getComputedStyle(editorContainerRef.current);
        const bodyStyles = `body{
         font-family: ${styles['font-family']};
         color: ${styles['color']};
         font-size: ${styles['font-size']};
         margin-inline: 1rem;
         padding: 0;
        }
        `;
        const editorLocale = new FroalaEditor(
          editorElement,
          GlobalEditorInitialSetting({
            bodyStyles,
            hideFonts,
            parentTranslationPath,
            placeholder,
            translationPath,
            tabIndex,
            fontFormats,
            getFontFormats,
            t,
            width,
            height,
            isBlurred,
            setIsBlurred,
            timerRef,
            onEditorDelayedChange,
            onBlurChange,
            onEditorChange,
            setLocalValue,
            editorValue,
            intValueIsNormalStringRef,
          }),
          function () {
            // Call the method inside the initialized event.
            editorRef.current = editorLocale;
            // resizeIframe();

            // Monitor changes within the iframe
            // resizeObservableRef.current = new MutationObserver(resizeIframe);
            // resizeObservableRef.current.observe(
            //   editorRef.current?.iframe_document?.body,
            //   {
            //     childList: true,
            //     subtree: true,
            //   },
            // );
            if (isDisabled) editorLocale.edit.off();
            if (editorValue) {
              editorLocale.html.set(editorValue);
              setLocalValue(editorValue);
              editorLocale.undo.saveStep();
            } else editorLocale.html.set('');
            const iframeDocument = editorLocale.iframe_document;
            let fontsHelper = GetGlobalFontFaces().join(' ');
            // const links = document.head.querySelectorAll(
            //   'link[rel="stylesheet"][href$=".chunk.css"], link[rel="stylesheet"][href*="main"][href*=".css"]',
            // );
            // if (links && links.length > 0) {
            //   links.forEach((link) => {
            //     iframeDocument.head.appendChild(link.cloneNode(true));
            //   });
            //   return;
            // }
            // const arrStyleSheets = document.head.querySelectorAll(
            //   'style:not([data-s], .vjs-styles-defaults)',
            // );

            // for (const property in arrStyleSheets)
            //   if (arrStyleSheets[property].cloneNode) {
            //     fontsHelper += extractFontFaceFromStyleElement(
            //       arrStyleSheets[property],
            //     ).join(' ');
            //   }
            // iframeDocument.head.appendChild(
            //   arrStyleSheets[property].cloneNode(true),
            // );
            // const fontLink= document.createElement("Link")
            // fontLink.rel = "stylesheet"
            // fontLink.type="text/css"

            const styleElement = document.createElement('style');
            styleElement.textContent = `${fontsHelper} .container{
            max-width: 100%; padding:0 } body {color: initial !important;} html {overflow: auto !important;}
            ${contentStyle || ''}`;
            iframeDocument.head.appendChild(styleElement);
            setEditorState(editorLocale);
            if (onInit) onInit(editorLocale);
            // froalaEditorRef.current.placeholder.refresh();
          },
        );
      }
    }, [
      contentStyle,
      editorState,
      editorValue,
      fontFormats,
      getFontFormats,
      height,
      hideFonts,
      idRef,
      isBlurred,
      isDisabled,
      onBlurChange,
      onEditorChange,
      onEditorDelayedChange,
      onInit,
      parentTranslationPath,
      placeholder,
      t,
      tabIndex,
      translationPath,
      width,
    ]);
    useEffect(() => {
      if (!isMountedRef.current) onInitHandler();
    }, [onInitHandler]);

    // destroy editor
    useEffect(
      () => () => {
        if (editorRef.current) {
          editorRef.current.destroy();
          editorRef.current = null;
          setEditorState(null);
          isMountedRef.current = false;
        }
      },
      [],
    );

    // handle is disabled changes after initialization
    useEffect(() => {
      if (editorRef.current && editorState)
        if (isDisabled) editorRef.current.edit.off();
        else editorRef.current.edit.on();
    }, [isDisabled, editorState]);

    // handle place-holder changes after initialization
    useEffect(() => {
      if (editorRef.current && editorState)
        if (placeholder) {
          editorRef.current.opts.placeholderText
            = (parentTranslationPath
              && placeholder
              && t(`${translationPath}${placeholder}`))
            || placeholder
            || null;

          if (!editorValue) {
            editorRef.current.html.set('');
            editorRef.current.placeholder.refresh();
          }
        }
    }, [
      isDisabled,
      editorState,
      placeholder,
      parentTranslationPath,
      t,
      translationPath,
      editorValue,
    ]);

    // handle content style changes after initialization
    useEffect(() => {
      if (editorRef.current && editorState && contentStyle) {
        const iframeDocument = editorRef.current.iframe_document;
        const styleElement = document.createElement('style');
        styleElement.textContent = `${contentStyle || ''}`;
        iframeDocument.head.appendChild(styleElement);
      }
    }, [contentStyle, editorState]);

    // resizing by drag work around
    const handleMouseMove = (e) => {
      if (isResizingRef.current) {
        const newHeight
          = e.clientY - editorContainerRef.current.getBoundingClientRect().top;
        const newEditorHeight
          = newHeight
          - document.querySelector(`#text-editor-wrapper${idRef} .fr-toolbar.fr-top`)
            .clientHeight
          - document.querySelector(`#text-editor-wrapper${idRef} .fr-second-toolbar`)
            .clientHeight
          - 2;
        editorContainerRef.current.style.height = `${newHeight}px`;
        const wrapperElement = document.querySelector(
          `#text-editor-wrapper${idRef} .fr-wrapper`,
        );
        wrapperElement.style.height = newEditorHeight + 'px';
        editorRef.current.opts.height = newEditorHeight;
      }
    };
    const resizeStart = () => {
      isResizingRef.current = true;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', () => {
        isResizingRef.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
      });
    };
    useEventListener('mousedown', resizeStart, resizeElementRef.current);

    // noinspection LongLine,SpellCheckingInspection
    return (
      <div
        className={`text-editor-component-wrapper${
          (wrapperClasses && ` ${wrapperClasses}`) || ''
        }`}
      >
        {labelValue && (
          <div className="labels-wrapper">
            {labelValue && (
              <label
                htmlFor={idRef}
                className={`label-wrapper ${labelClasses}${
                  isDisabled ? ' disabled' : ''
                }`}
              >
                <span>{t(`${translationPath}${labelValue}`)}</span>
                {isRequired && <span className="required">*</span>}
              </label>
            )}
          </div>
        )}
        <div
          className="text-editor-wrapper position-relative"
          id={`text-editor-wrapper${idRef}`}
          ref={editorContainerRef}
          style={{ visibility: !editorState ? 'hidden' : 'visible' }}
        >
          <textarea id={idRef}></textarea>
          <div
            id={`resizable-handle${idRef}`}
            ref={resizeElementRef}
            className="resize-element"
          >
            <ResizeIcon />
          </div>
        </div>
        {helperText && (isSubmitted || isBlurred) && (
          <div className="error-wrapper">
            <span>{helperText}</span>
          </div>
        )}
      </div>
    );
  },
);

TextEditorComponent.displayName = 'TextEditorComponent';

TextEditorComponent.propTypes = {
  wrapperClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  isDisabled: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  helperText: PropTypes.string,
  labelValue: PropTypes.string,
  placeholder: PropTypes.string,
  tabIndex: PropTypes.number,
  editorValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  toolbar: PropTypes.string,
  onEditorChange: PropTypes.func,
  onBlurChange: PropTypes.func,
  onInit: PropTypes.func,
  onEditorDelayedChange: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  idRef: PropTypes.string,
  rightToolbarExtend: PropTypes.string,
  leftToolbarExtend: PropTypes.string,
  fontFormats: PropTypes.string,
  contentStyle: PropTypes.string,
  imageTitle: PropTypes.bool,
  automaticUploads: PropTypes.bool,
  imageAdvTab: PropTypes.bool,
  imageCaption: PropTypes.bool,
  hideFonts: PropTypes.bool,
  branding: PropTypes.bool,
  filePickerTypes: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  plugins: PropTypes.instanceOf(Array),
  menubar: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isWithoutInsert: PropTypes.bool,
  isRequired: PropTypes.bool,
};

TextEditorComponent.defaultProps = {
  wrapperClasses: undefined,
  labelClasses: undefined,
  isDisabled: false,
  labelValue: undefined,
  editorValue: undefined,
  helperText: undefined,
  toolbar: undefined,
  onEditorChange: undefined,
  onEditorDelayedChange: undefined,
  onBlurChange: undefined,
  isSubmitted: undefined,
  height: 250,
  width: '100%',
  idRef: 'TextEditorComponentRef',
  parentTranslationPath: undefined,
  translationPath: undefined,
  plugins: undefined,
  tabIndex: undefined,
  placeholder: undefined,
  isWithoutInsert: false,
  menubar: undefined,
  onInit: undefined,
  imageTitle: true,
  automaticUploads: true,
  imageAdvTab: true,
  imageCaption: true,
  branding: false,
  isRequired: false,
  filePickerTypes: 'image',
  rightToolbarExtend: '',
  leftToolbarExtend: '',
};
