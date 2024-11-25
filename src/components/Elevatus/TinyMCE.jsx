import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Annotations } from '../../pages/recruiter-preference/components/Annotations';
import { GlobalInputDelay } from '../../helpers';
import { Row, Col } from 'reactstrap';
import { TextEditorComponent } from '../TextEditor/TextEditor.Component';

const translationPath = 'Components.';
const parentTranslationPath = 'RecruiterPreferences';
// const fontsParentTranslationPath = 'EvaBrand';
const TinyMCE = React.memo(
  ({
    value,
    onChange,
    bodyLabel,
    annotationLabel,
    id,
    variables,
    children,
    setIsReload,
    isForEmailTemplate,
    // language,
  }) => {
    const [localValue, setLocalValue] = useState(value);
    const timerRef = useRef(null);
    const editorRef = useRef(null);

    // const [fonts, setFonts] = useState([]);
    const { t } = useTranslation([
      parentTranslationPath,
      // fontsParentTranslationPath
    ]);
    // const [isLoading,setIsLoading]=useState(true)
    const addAnnotation = (annotation) => {
      // if (!window.tinymce || !annotation) return;
      // window.tinymce.get(id).insertContent(annotation);
      if (!editorRef.current || !annotation) return;
      {
        editorRef.current.html.insert(annotation, true);
        editorRef.current.undo.saveStep();
      }
    };
    useEffect(() => {
      if (!timerRef.current && value !== localValue) {
        setLocalValue(value);
        if (setIsReload) setIsReload(false);
      }
    }, [localValue, value, setIsReload]);
    useEffect(
      () => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      },
      [],
    );
    // const getFonts = useCallback(async ()=>{
    //   setIsLoading(true)
    //   const fontsArray = Object.values(EvaBrandFontsEnum)
    //     .filter(
    //       (item) =>
    //         item.supportedLanguages.includes(
    //           (language && language.code) || 'en'
    //         ) && item.filePath
    //     )
    //     .map((item) => ({
    //       ...item,
    //       value: t(`${fontsParentTranslationPath}:${item.value}`),
    //     }));
    //   const fontsRes = await Promise.allSettled(
    //     fontsArray.map((item) => import(`assets/fonts/${item.filePath}`))
    //   );
    //   if (fontsRes && fontsRes.length > 0) {
    //     fontsRes.forEach((resItem, index) => {
    //       if (resItem.status === 'fulfilled')
    //         fontsArray[index].dynamicURl = resItem.value.default || '';
    //     });
    //     setFonts(fontsArray.filter((item) => item.dynamicURl));
    //   }
    //   setIsLoading(false)
    //
    // },[language, t ])
    // useEffect(() => {
    //   getFonts();
    // }, [getFonts]);
    const fontFormats = useMemo(
      () => ({
        'andale mono,times': 'Andale Mono',
        'arial,helvetica,sans-serif': 'Arial',
        'arial black,avant garde': 'Arial Black',
        'book antiqua,palatino': 'Book Antiqua',
        'comic sans ms,sans-serif': 'Comic Sans MS',
        'courier new,courier': 'Courier New',
        'georgia,palatino': 'Georgia',
        'impact,chicago': 'Impact',
        symbol: 'Symbol',
        'tahoma,arial,helvetica,sans-serif': 'Tahoma',
        'terminal,monaco': 'Terminal',
        'times new roman,times': ' Times New Roman',
        'trebuchet ms,geneva': 'Trebuchet MS',
        'verdana,geneva': 'Verdana',
        webdings: 'Webdings',
        'wingdings,zapf dingbats': 'Wingdings',
      }),
      [],
    );
    return (
      <>
        {variables && (
          <Row>
            {children && ((isForEmailTemplate && children[0]) || children)}
            <Col md="6">
              <Annotations
                addAnnotation={addAnnotation}
                annotationLabel={annotationLabel}
                variables={variables}
                index={id || ''}
              />
            </Col>
            {(children && isForEmailTemplate && children[1]) || null}
          </Row>
        )}

        <label className="form-control-label" htmlFor={id}>
          {bodyLabel || t(`${translationPath}email-body`) + '*'}
        </label>
        {/*{!isLoading  ?*/}
        <TextEditorComponent
          idRef={id}
          editorValue={localValue || ''}
          onEditorChange={(content) => {
            setLocalValue(content);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              timerRef.current = null;
              if (onChange) onChange(content);
            }, GlobalInputDelay);
          }}
          onInit={(current) => (editorRef.current = current)}
          fontFormats={fontFormats}
        />
        {/*<Editor*/}
        {/*  className="form-control-alternative"*/}
        {/*  id={id}*/}
        {/*  value={localValue || ''}*/}
        {/*  init={{*/}
        {/*    height: 500,*/}
        {/*    plugins: [*/}
        {/*      'advlist autolink lists link image preview anchor',*/}
        {/*      'searchreplace code',*/}
        {/*      'insertdatetime media paste code wordcount',*/}
        {/*    ],*/}
        {/*    toolbar:*/}
        {/*      'formatselect | bold italic backcolor | \*/}
        {/*                   alignleft aligncenter alignright alignjustify | \*/}
        {/*                   bullist numlist outdent indent | removeformat',*/}
        {/*    ...(fontFormats && fontFormats),*/}
        {/*    //  Remove Branding*/}
        {/*    init_instance_callback(editor) {*/}
        {/*      const freeTiny = document.querySelector('.tox .tox-notification--in');*/}
        {/*      if (freeTiny) freeTiny.style.display = 'none';*/}
        {/*    },*/}
        {/*    branding: false,*/}
        {/*  }}*/}
        {/*  onEditorChange={(content, editor) => {*/}
        {/*    setLocalValue(content);*/}
        {/*    if (timerRef.current) clearTimeout(timerRef.current);*/}
        {/*    timerRef.current = setTimeout(() => {*/}
        {/*      timerRef.current = null;*/}
        {/*      if (onChange) onChange(content);*/}
        {/*    }, GlobalInputDelay);*/}
        {/*  }}*/}
        {/*/>*/}
        {/*: ''}*/}
      </>
    );
  },
);
TinyMCE.displayName = 'TinyMCE';
export default TinyMCE;
