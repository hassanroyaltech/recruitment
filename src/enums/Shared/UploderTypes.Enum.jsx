export const UploaderTypesEnum = {
  Image: {
    key: 'image',
    keyNumber: 1,
    accept: 'image/*',
    value: 'image',
  },
  Video: {
    key: 'video',
    keyNumber: 2,
    accept: 'video/*',
    value: 'video',
  },
  Docs: {
    key: 'docs',
    keyNumber: 3,
    accept:
      '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,application/vnd.ms-powerpoint,application/msword,.word,.ppt, .pptx,application/pdf,.xlsx,text/plain',
    value: 'document',
  },
  DocsOnlyDB: {
    key: 'docs',
    keyNumber: 3,
    accept:
      '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    value: 'document',
  },
  Audio: {
    key: 'audio',
    keyNumber: 4,
    accept: 'audio/*',
    value: 'audio',
  },
  SCV: {
    key: 'scv',
    keyNumber: 5,
  },
  CV: {
    key: 'cv',
    keyNumber: 6,
  },
  Json: {
    key: 'json',
    keyNumber: 7,
    accept: 'application/json',
    value: 'json',
  },
  Sovren: {
    key: 'sovren',
    keyNumber: 8,
  },
  CSV: {
    key: 'csv',
    keyNumber: 9,
    accept: '.csv',
    value: 'csv',
  },
  Hireability: {
    key: 'hireability',
    keyNumber: 10,
  },
  parser: {
    key: 'parser',
    keyNumber: 11,
  },
  PDF: {
    key: 'PDF',
    accept: 'application/pdf',
  },
  Doc: {
    key: 'Doc',
    accept: '.doc,.docx',
  },
  Excel: {
    key: 'Excel',
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  },
  Text: {
    key: 'Text',
    accept: 'text/plain',
  },
  PDFDocExcelTXT: {
    key: 'PDFDocExcelTXT',
    accept:
      'application/pdf,.doc,.docx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,text/plain',
  },
  PDFDoc: {
    key: 'PDFDoc',
    accept: 'application/pdf,.doc,.docx',
  },
};
