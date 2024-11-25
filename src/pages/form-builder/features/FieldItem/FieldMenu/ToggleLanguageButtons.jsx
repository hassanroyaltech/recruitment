import * as React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

// eslint-disable-next-line react/display-name
export default React.memo(({ langSaveTo, setLangSaveTo, templateData }) => {
  const handleChange = (e, newLang) => {
    if (newLang) setLangSaveTo(newLang);
  };
  return (
    <ToggleButtonGroup
      fullWidth
      value={langSaveTo}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton value={templateData.primaryLang}>
        {templateData.primaryLang.toUpperCase()}
      </ToggleButton>
      <ToggleButton value={templateData.secondaryLang}>
        {templateData.secondaryLang.toUpperCase()}
      </ToggleButton>
    </ToggleButtonGroup>
  );
});
