export const FormDownloadEnum = {
  pdf: {
    key: 'pdf',
    value: 'Download PDF',
    success: 'PDF file downloaded successfully!',
    path: `${process.env.REACT_APP_DOMIN_PHP_API}/api/form/${process.env.REACT_APP_VERSION_API}/sender/download/pdf`,
    responseType: 'file',
  },
  word: {
    key: 'word_file',
    value: 'Download Word',
    success: 'Word file downloaded successfully!',
    path: `${process.env.REACT_APP_DOMIN_PHP_API}/api/builder/${process.env.REACT_APP_VERSION_API_V2}/form/sender/download/word`,
    offerPath: `${process.env.REACT_APP_DOMIN_PHP_API}/api/form/${process.env.REACT_APP_VERSION_API}/sender/download/offer/word`,
    responseType: 'URL',
  },
};
