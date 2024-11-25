import React, { memo } from 'react';
import memoize from 'memoize-one';
import { FixedSizeList as List, areEqual } from 'react-window';
import { Box, Switch, Input, IconButton } from '@mui/material';
import { DndIcon, CrossIcon } from '../../../icons';
//Consider using React.memo to avoid unnecessary re-renders.
const Row = memo(({ data, index, style }) => {
  //Data passed to List as "itemData" is available as props.data
  const {
    options,
    handleSwitchChange,
    handleTitleChange,
    handleCodeChange,
    handleRemoveOption,
  } = data;
  const option = options[index];
  return (
    <div style={style}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
        <IconButton disableRipple sx={{ cursor: 'grab' }}>
          <DndIcon sx={{ fontSize: 14 }} />
        </IconButton>
        <Switch
          onChange={() => handleSwitchChange(index, option.isVisible)}
          checked={option.isVisible}
        />
        <Input
          value={option.title}
          onChange={(e) => handleTitleChange(e, index)}
          sx={{ mx: 2.5, flex: 1 }}
        />
        <Input
          value={option.code}
          onChange={(e) => handleCodeChange(e, index)}
          sx={{ flex: '0 98px' }}
        />
        <IconButton
          onClick={() => handleRemoveOption(index)}
          sx={{ ml: 2.5 }}
          variant="rounded"
          color="error"
        >
          <CrossIcon />
        </IconButton>
      </Box>
    </div>
  );
}, areEqual);
// This helper function memoizes incoming props,
// To avoid causing unnecessary re-renders pure Row components.
// This is only needed since we are passing multiple props with a wrapper object.
// If we were only passing a single, stable value (e.g. items),
// We could just pass the value directly.
const createItemData = memoize(
  (
    options,
    handleSwitchChange,
    handleTitleChange,
    handleCodeChange,
    handleRemoveOption,
  ) => ({
    options,
    handleSwitchChange,
    handleTitleChange,
    handleCodeChange,
    handleRemoveOption,
  }),
);

export default function OptionsList({ options, setOptions }) {
  const handleSwitchChange = (idx, isVisible) =>
    setOptions((opts) =>
      opts.map((opt, i) => (i === idx ? { ...opt, isVisible: !isVisible } : opt)),
    );
  const handleTitleChange = (e, idx) =>
    setOptions((opts) =>
      opts.map((opt, i) => (i === idx ? { ...opt, title: e.target.value } : opt)),
    );
  const handleCodeChange = (e, idx) =>
    setOptions((opts) =>
      opts.map((opt, i) => (i === idx ? { ...opt, code: e.target.value } : opt)),
    );
  const handleRemoveOption = (idx) =>
    setOptions((opts) => opts.filter((x, i) => i !== idx));

  // // Bundle additional data to list optinos using the "itemData" prop.
  // It will be accessible to item renderers as props.data.
  const itemData = createItemData(
    options,
    handleSwitchChange,
    handleTitleChange,
    handleCodeChange,
    handleRemoveOption,
  );
  return (
    <List
      height={344}
      useIsScrolling
      itemCount={options.length}
      itemData={itemData}
      itemSize={40}
      width="auto"
    >
      {Row}
    </List>
  );
}
