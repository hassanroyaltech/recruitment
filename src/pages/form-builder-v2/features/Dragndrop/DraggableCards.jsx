import React, { useMemo } from 'react';
import { Grid, Icon, Typography } from '@mui/material';
import DraggableCard from './DraggableCard';
import DraggableWrapper from './DraggableWrapper';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

// @ items [k,v]
// @ model - is a model of a button: section or field (affect styles)
export default function DraggableCards({
  parentTranslationPath,
  fromScorecard,
  isDesicionExist,
  items,
  ...props
}) {
  const { t } = useTranslation(parentTranslationPath);
  const cardTitleHandler = useMemo(
    () => (title) => {
      if (typeof title === 'string')
        if (parentTranslationPath) return t(title);
        else return title;
      else return title?.[i18next.language] || title?.en || title;
    },
    [parentTranslationPath, t],
  );
  return (
    <Grid container {...props}>
      {items.map(([k, { cardTitle, model, type, icon }]) => (
        <DraggableWrapper
          element={Grid}
          xs
          item
          key={`DraggableWrapperKey${k}`}
          id={k}
          model={model}
          type={type}
          sx={{
            marginBottom: '6px',
            ...(type === 'decision'
              && isDesicionExist
              && fromScorecard && {
              pointerEvents: 'none',
            }),
            '&:nth-of-type(odd)': {
              marginRight: '6px',
            },
          }}
        >
          <DraggableCard
            disableRipple
            model={model}
            startIcon={
              props.icon ? (
                <Icon component={props.icon} />
              ) : (
                <Icon component={icon} />
              )
            }
          >
            <Typography align="left" variant="body2" className="mx-2">
              {cardTitleHandler(cardTitle)}
            </Typography>
          </DraggableCard>
        </DraggableWrapper>
      ))}
    </Grid>
  );
}
