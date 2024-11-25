import { UploaderTypesEnum } from '../Shared/UploderTypes.Enum';

export const EvaluationFilesTypesEnum = {
  PDF: {
    key: '2',
    value: 'pdf',
    accept: UploaderTypesEnum.PDF.accept,
    type: 'pdf',
    mediaType: UploaderTypesEnum.Docs.key,
  },
  Doc: {
    key: '3',
    value: 'doc',
    accept: UploaderTypesEnum.Doc.accept,
    type: 'docs',
    mediaType: UploaderTypesEnum.Docs.key,
  },
  Excel: {
    key: '4',
    value: 'excel',
    accept: UploaderTypesEnum.Excel.accept,
    type: 'xlsx',
    mediaType: UploaderTypesEnum.Docs.key,
  },
  Text: {
    key: '6',
    value: 'txt',
    accept: UploaderTypesEnum.Text.accept,
    type: 'txt',
    mediaType: UploaderTypesEnum.Docs.key,
  },
  Images: {
    key: '7',
    value: 'images',
    accept: UploaderTypesEnum.Image.accept,
    type: 'image',
    mediaType: UploaderTypesEnum.Image.key,
  },
  PDFDocExcelTXT: {
    key: '8',
    value: 'pdf ,doc ,excel or txt',
    accept: UploaderTypesEnum.PDFDocExcelTXT.accept,
    type: 'docs',
    mediaType: UploaderTypesEnum.Docs.key,
  },
  PDFDoc: {
    key: '9',
    value: 'pdf or doc',
    accept: UploaderTypesEnum.PDFDoc.accept,
    type: 'docs',
    mediaType: UploaderTypesEnum.Docs.key,
  },
};
