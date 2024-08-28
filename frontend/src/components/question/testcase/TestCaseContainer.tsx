import React from 'react';
import { List, ListItem, Typography } from '@mui/material';
import { TestCase } from './TestCase';

interface TestCaseType {
  label: string;
  input: string;
  output: string;
  description: string;
}

interface TestCaseContainerProps {
  tests: string;
  index: number;
}

const TestCaseContainer: React.FC<TestCaseContainerProps> = ({ tests, index }) => {
  const parsedTests: TestCaseType[] = JSON.parse(tests);

  return (
    <>
      <Typography variant="h6" gutterBottom> 
        Test Cases
      </Typography>
      <List>
        {parsedTests.map((testCase, idx) => (
          <ListItem key={idx}>
            <TestCase input={testCase.input} output={testCase.output} description={testCase.description} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TestCaseContainer;
