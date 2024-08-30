import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface TestCaseProps {
  input: string;
  output: string;
  description: string;
  status: number; // 0 = not run, 1 = passed, -1 = failed
}

export const TestCase: React.FC<TestCaseProps> = ({ input, output, description, status }) => {
  let IconComponent;

  switch (status) {
    case 1:
      IconComponent = CheckCircleOutlineIcon;
      break;
    case -1:
      IconComponent = NotInterestedIcon;
      break;
    default:
      IconComponent = RadioButtonUncheckedIcon;
  }

  return (
    <Box display="flex" alignItems="center" p={2} border={1} borderColor="grey.300" borderRadius={2} mb={2}>
      <IconComponent style={{ marginRight: '10px' }} />
      <Box>
        <Typography variant="h6" gutterBottom>Description:</Typography>
        <Typography variant="body1" gutterBottom>{description}</Typography>
        
        <Typography variant="subtitle1" gutterBottom>Input:</Typography>
        <Box component="pre" sx={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875rem' }}>
          {input}
        </Box>

        <Typography variant="subtitle1" gutterBottom>Output:</Typography>
        <Box component="pre" sx={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875rem' }}>
          {output}
        </Box>
      </Box>
    </Box>
  );
};
