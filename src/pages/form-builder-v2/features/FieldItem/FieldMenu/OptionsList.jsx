import React, { memo } from 'react';
import { Box, Switch, Input, IconButton } from '@mui/material';
import { DndIcon, CrossIcon } from '../../../../form-builder/icons';
import { SimpleSortable } from '../../Dragndrop/SimpleSortable';

//Consider using React.memo to avoid unnecessary re-renders.
const Content = memo(
  ({
    option,
    handleSwitchChange,
    handleTitleChange,
    handleCodeChange,
    handleRemoveOption,
    options,
    listeners,
    disabled,
  }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
      <IconButton disableRipple sx={{ cursor: 'grab' }} {...listeners}>
        <DndIcon sx={{ fontSize: 14 }} />
      </IconButton>
      <Switch
        onChange={() =>
          handleSwitchChange(
            options.findIndex((x) => x.id === option.id),
            option.isVisible,
          )
        }
        checked={option.isVisible}
        disabled={disabled}
      />
      <Input
        value={option.title}
        onChange={(e) =>
          handleTitleChange(
            e,
            options.findIndex((x) => x.id === option.id),
          )
        }
        sx={{ mx: 2.5, flex: 1 }}
        disabled={disabled}
      />
      <Input
        value={option.code}
        onChange={(e) =>
          handleCodeChange(
            e,
            options.findIndex((x) => x.id === option.id),
          )
        }
        sx={{ flex: '0 98px' }}
        disabled={disabled}
      />
      <IconButton
        onClick={() =>
          handleRemoveOption(options.findIndex((x) => x.id === option.id))
        }
        sx={{ ml: 2.5 }}
        variant="rounded"
        color="error"
        disabled={disabled}
      >
        <CrossIcon />
      </IconButton>
    </Box>
  ),
);

Content.displayName = 'ContentComponent';

export default function OptionsList({
  inputType,
  language,
  setLanguage,
  langSaveTo,
  anotherLang,
  disabled,
}) {
  const handleSwitchChange = (idx, isVisible) =>
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        options: langs?.[langSaveTo]?.options?.map((opt, i) =>
          i === idx ? { ...opt, isVisible: !isVisible } : opt,
        ),
      },
      ...(anotherLang && {
        [anotherLang]: {
          ...langs[anotherLang],
          options: langs?.[anotherLang]?.options?.map((opt, i) =>
            i === idx
              ? {
                ...opt,
                isVisible: !isVisible,
              }
              : opt,
          ),
        },
      }),
    }));

  const handleTitleChange = (e, idx) =>
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        options: langs?.[langSaveTo]?.options?.map((opt, i) =>
          i === idx ? { ...opt, title: e.target.value } : opt,
        ),
      },
    }));

  const handleCodeChange = (e, idx) =>
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        options: langs?.[langSaveTo]?.options?.map((opt, i) =>
          i === idx ? { ...opt, code: e.target.value } : opt,
        ),
      },
      ...(anotherLang && {
        [anotherLang]: {
          ...langs[anotherLang],
          options: langs?.[anotherLang]?.options?.map((opt, i) =>
            i === idx
              ? {
                ...opt,
                code: e.target.value,
              }
              : opt,
          ),
        },
      }),
    }));

  const handleRemoveOption = (idx) => {
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        options: langs?.[langSaveTo]?.options?.filter((x, i) => i !== idx),
      },
      ...(anotherLang && {
        [anotherLang]: {
          ...langs[anotherLang],
          options: langs?.[anotherLang]?.options?.filter((x, i) => i !== idx),
        },
      }),
    }));
    // to make sure conditional value not selected the removed one
    setLanguage((langs) => {
      const localLanguages = { ...langs };
      if (!localLanguages[langSaveTo].isConditionalHiddenValue) return langs;

      const isNotExist = !localLanguages[langSaveTo].options.some((item) =>
        inputType !== 'checkbox'
          ? item.id === localLanguages[langSaveTo].isConditionalHiddenValue
          : localLanguages[langSaveTo].isConditionalHiddenValue.includes(item.id),
      );
      if (isNotExist) {
        localLanguages[langSaveTo].isConditionalHiddenValue = null;
        if (anotherLang) localLanguages[anotherLang].isConditionalHiddenValue = null;
        return localLanguages;
      }
      return langs;
    });
  };

  const getOtherLanguageTr = (newOrder, otherOptions) =>
    newOrder.map((item) => otherOptions.find((other) => other.id === item.id));

  // fixedItemHeight is optional
  // Can be used to improve performance if the rendered items are of known size.
  // Setting it causes the component to skip item measurements.
  // more in API https://virtuoso.dev/virtuoso-api-reference/
  return (
    <SimpleSortable
      data={language[langSaveTo]?.options || []}
      setDataOrder={(newOrder) => {
        setLanguage((langs) => ({
          ...langs,
          [langSaveTo]: {
            ...langs[langSaveTo],
            options: newOrder,
          },
          ...(anotherLang && {
            [anotherLang]: {
              ...langs[anotherLang],
              options: getOtherLanguageTr(newOrder, langs?.[anotherLang]?.options),
            },
          }),
        }));
      }}
      element={(option) => (
        <Content
          option={option}
          handleSwitchChange={handleSwitchChange}
          handleCodeChange={handleCodeChange}
          handleTitleChange={handleTitleChange}
          handleRemoveOption={handleRemoveOption}
          options={language[langSaveTo]?.options || []}
          listeners={option.listeners}
          disabled={disabled}
        />
      )}
    />
    // <Virtuoso
    //   style={{ height: "344px" }}
    //   data={language[langSaveTo].options}
    //   fixedItemHeight={40}
    //   itemContent={(index, option) =>
    //     <Content
    //       index={index}
    //       option={option}
    //       handleSwitchChange={handleSwitchChange}
    //       handleCodeChange={handleCodeChange}
    //       handleTitleChange={handleTitleChange}
    //       handleRemoveOption={handleRemoveOption}
    //     />
    //   }
    // />
  );
}
