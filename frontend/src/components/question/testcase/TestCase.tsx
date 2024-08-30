import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface TestCaseProps {
  input: string;
  output: string;
  description: string;
}

export const TestCase: React.FC<TestCaseProps> = ({ input, output, description }) => {
  return (
    <Box p={2} border={1} borderColor="grey.300" borderRadius={2} mb={2}>
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
  );
};
