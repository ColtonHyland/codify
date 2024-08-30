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
  passedTests: string[];
  failedTests: string[];
}

const TestCaseContainer: React.FC<TestCaseContainerProps> = ({ tests, passedTests, failedTests }) => {
  const parsedTests: TestCaseType[] = JSON.parse(tests);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Test Cases
      </Typography>
      <List>
        {parsedTests.map((testCase, idx) => {
          let status = 0; // Not run by default
          if (passedTests.includes(`Test ${idx + 1}`)) {
            status = 1; // Passed
          } else if (failedTests.includes(`Test ${idx + 1}`)) {
            status = -1; // Failed
          }

          return (
            <ListItem key={idx}>
              <TestCase
                input={testCase.input}
                output={testCase.output}
                description={testCase.description}
                status={status}
              />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default TestCaseContainer;
