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
      <Typography variant="body2" gutterBottom>
        <pre>{input}</pre>
      </Typography>

      <Typography variant="subtitle1" gutterBottom>Output:</Typography>
      <Typography variant="body2" gutterBottom>
        <pre>{output}</pre>
      </Typography>
    </Box>
  );
};
