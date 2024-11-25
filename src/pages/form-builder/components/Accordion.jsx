import * as React from 'react';
import PT from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  styled,
} from '@mui/material';
import { ChevronDownIcon } from '../icons';

const CustomAccordion = styled((props) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  boxShadow: theme.shadow.divider.bottom,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const CustomAccordionSummary = styled((props) => (
  <AccordionSummary expandIcon={<ChevronDownIcon />} {...props} />
))(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(4),
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
  },
}));

const CustomAccordionDetails = styled(AccordionDetails)(() => ({
  padding: 0,
  display: 'flex',
  flexWrap: 'wrap',
  '& .MuiBox-root': {
    width: '100%',
  },
}));

function CustomizedAccordions({ children, items, expandedPanel, ...props }) {
  // NOTE uncomment if "open one at time" logic is necessary
  // const [expanded, setExpanded] = useState(extendedPanel || 'panel0');
  // const handleChange = (panel) => (event, newExpanded) => {
  //   setExpanded(panel);
  // };
  //expanded={expanded === `panel${i}`}
  //onChange={handleChange(`panel${i}`)}
  return (
    <>
      {items.map((item, i) => (
        <CustomAccordion key={item.header} {...props}>
          <CustomAccordionSummary
            aria-controls={`panel${i + 1}d-content`}
            id={`panel${i + 1}d-header`}
          >
            <Typography variant="caption">
              {item.header ? item.header : item}
            </Typography>
          </CustomAccordionSummary>
          <CustomAccordionDetails>
            {item.body ? item.body : children}
          </CustomAccordionDetails>
        </CustomAccordion>
      ))}
    </>
  );
}

CustomizedAccordions.propTypes = {
  children: PT.element,
  items: PT.arrayOf(
    PT.exact({
      header: PT.string,
      body: PT.element,
    }),
  ).isRequired,
  expandedPanel: PT.string,
};

CustomizedAccordions.defaultProps = {
  children: null,
  expandedPanel: 'panel0',
};

export default CustomizedAccordions;
