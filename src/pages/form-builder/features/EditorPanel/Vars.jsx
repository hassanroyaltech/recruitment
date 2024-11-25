import React, { useCallback, useState, useEffect } from 'react';
import { Box, Typography, Button, Card } from '@mui/material';
import { InfoIcon } from '../../icons';
import { GetFormBuilderVars } from 'services';
import { showError, showSuccess } from 'helpers';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';

const parentTranslationPath = 'FormBuilderPage';
const translationPath = '';

export default function Panel() {
  const { t } = useTranslation(parentTranslationPath);
  const [isHintOpen, setIsHintOpen] = useState(true);
  const [vars, setVars] = useState([]);

  const getVarsHandler = useCallback(async () => {
    const response = await GetFormBuilderVars({ is_flow: false });
    if (response?.status === 200) setVars(response?.data?.results);
    else {
      showError('Failed to get variables!');
      setVars([]);
    }
  }, []);

  useEffect(() => {
    getVarsHandler();
  }, [getVarsHandler]);

  return (
    <Box
      sx={{
        p: 5,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="caption" color="dark.$80">
        {t(`${translationPath}list-of-variables`)}
      </Typography>
      <Box
        sx={{
          display: isHintOpen ? 'flex' : 'none',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          mt: 4,
          p: '12px 16px 15px 14px',
          border: (theme) => `1px solid ${theme.palette.dark.$8}`,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flex: '0 100%' }}>
          <InfoIcon sx={{ mr: 4 }} />
          <Typography variant="body13" lh="rich" color="dark.$60">
            {t(`${translationPath}variables-description`)}
          </Typography>
        </Box>
        <Button
          onClick={() => setIsHintOpen((hint) => !hint)}
          variant="ghost"
          sx={{ fontSize: 13, color: 'dark.$80' }}
        >
          {t(`${translationPath}ok-close`)}
        </Button>
      </Box>
      {vars?.length > 0 && (
        <div className="my-3">
          {vars?.map((item) => (
            <div key={item?.key}>
              <div className="copy-to-clipboard my-2">
                <CopyToClipboard
                  text={item?.key}
                  onCopy={(e, o) => {
                    if (o) showSuccess('Variable copied successfully!');
                  }}
                >
                  <Card className="d-flex flex-row align-items-center justify-content-between mb-2 p-2">
                    <div className="flex-grow-1 d-flex flex-row overflow-hidden">
                      <div className="text-gray">{item?.title}</div>
                      <div
                        className="ml-2-reversed text-black w-100"
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.key}
                      </div>
                    </div>
                    <div
                      className="text-gray mx-3 btn-clip"
                      data-clipboard-demo=""
                      data-clipboard-target="#foo"
                    >
                      <i className="far fa-clone" style={{ cursor: 'pointer' }} />
                    </div>
                  </Card>
                </CopyToClipboard>
              </div>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}
