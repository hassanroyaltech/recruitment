import { GlobalInputDelay, isHTML } from './Middleware.Helper';

let fontFaces = [];
export const ReadFontFaces = () => {
  if (fontFaces.length) return;
  const stylesheets = document.styleSheets;
  const localeFonts = [];
  for (const stylesheet of stylesheets)
    try {
      // Access the rules of the stylesheet
      const rules = stylesheet.cssRules || stylesheet.rules;
      const fontFaceRules = Array.from(rules)
        .filter((rule) => rule.type === CSSRule.FONT_FACE_RULE)
        .map((item) => item?.cssText);
      if (fontFaceRules.length > 0) localeFonts.push(...fontFaceRules);
    } catch (error) {
      console.error('Error reading stylesheet:', error);
    }
  fontFaces = localeFonts;
};
export const GetGlobalFontFaces = () => fontFaces;
export const GlobalEditorInitialSetting = ({
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
}) => ({
  key: process.env.REACT_APP_FROALA_EDITOR_KEY,
  iframeStyle: bodyStyles,
  useClasses: false,
  dragInline: true,
  toolbarButtons: {
    moreText: {
      buttonsVisible: 2,
      buttons: [
        !hideFonts && 'fontFamily',
        'fontSize',
        'paragraphFormat',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'textColor',
        'backgroundColor',
        'inlineClass',
        'inlineStyle',
        'clearFormatting',
      ],
    },

    moreParagraph: {
      buttonsVisible: 0,
      buttons: [
        'alignLeft',
        'alignCenter',
        'alignRight',
        'alignJustify',
        'formatOL',
        'formatUL',
        'paragraphStyle',
        'lineHeight',
        'outdent',
        'indent',
        'quote',
      ],
    },
    moreRich: {
      buttons: ['insertLink', 'insertTable', 'insertImage'],
      buttonsVisible: 0,
    },

    moreMisc: {
      buttons: ['html'],

      align: 'right',

      buttonsVisible: 2,
    },
  },
  iframe: true,
  attribution: false,
  placeholderText:
    (parentTranslationPath
      && placeholder
      && t(`${translationPath}${placeholder}`))
    || placeholder
    || null,
  width: width || '100%',
  tabIndex,
  fontFamily: fontFormats || getFontFormats,
  fontFamilySelection: true,
  fontSizeSelection: true,
  fontSizeDefaultSelection: '11',
  fontSize: [
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '22',
    '24',
    '26',
    '28',
    '30',
    '32',
    '34',
    '36',
    '48',
    '60',
    '72',
    '96',
  ],
  linkList: [],
  fontSizeUnit: 'pt',
  listAdvancedTypes: true,
  charCounterCount: true,
  height,
  htmlRemoveTags: [],
  htmlUntouched: true,
  // htmlDoNotWrapTags:[],
  events: {
    'image.beforeUpload': function (files) {
      const localeEditor = this;
      if (files.length) {
        // Create a File Reader.
        const reader = new FileReader();
        // Set the reader to insert images when they are loaded.
        reader.onload = function (e) {
          const result = e.target.result;
          localeEditor.image.insert(result, null, null, localeEditor.image.get());
        };
        // Read image as base64.
        reader.readAsDataURL(files[0]);
      }
      localeEditor.popups.hideAll();
      // Stop default upload chain.
      return false;
    },
    blur: function () {
      let innerHTML = this.html.get();
      if (this.codeView.isActive()) {
        innerHTML = this.codeView.get();
        this.html.set(innerHTML);
        this.codeView.toggle();
      }
      this.undo.saveStep();
      if (!isBlurred) setIsBlurred(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        onEditorDelayedChange(innerHTML);
      }
      if (onBlurChange) onBlurChange(innerHTML);
    },
    'codeView.update': function () {
      const innerHTML = this.codeView.get();
      if (onEditorChange) onEditorChange(innerHTML);
      if (onEditorDelayedChange) {
        if (timerRef.current) clearTimeout(timerRef.current);
        // reduce the cpu usage if the users type fast
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          onEditorDelayedChange(innerHTML);
        }, GlobalInputDelay);
      }
    },
    contentChanged: function () {
      const localContent = this.html.get();
      if (onEditorChange || onEditorDelayedChange) setLocalValue(localContent);
      if (
        editorValue
        && !isHTML(editorValue)
        && !intValueIsNormalStringRef.current
      ) {
        intValueIsNormalStringRef.current = true;
        return;
      }
      if (onEditorChange) onEditorChange(localContent);
      if (onEditorDelayedChange) {
        if (timerRef.current) clearTimeout(timerRef.current);
        // reduce the cpu usage if the users type fast
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          onEditorDelayedChange(localContent);
        }, GlobalInputDelay);
      }
    },
  },
});

export const ExtractTextFromHTML = (htmlContent = "") => {
  // Create a new DOM parser
  const parser = new DOMParser();

  // Wrap the HTML content with a div to parse it properly
  const wrappedHtmlContent = `<div>${htmlContent}</div>`;

  // Parse the wrapped HTML content
  const doc = parser.parseFromString(wrappedHtmlContent, 'text/html');

  // Remove all style tags
  const styleElements = doc.querySelectorAll('style');
  styleElements.forEach(style => style.remove());

  // Extract text content from the parsed document
  const text = doc.body.textContent || "";

  return text.trim();
}
