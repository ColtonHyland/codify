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
          } else if (failedTests.includes(`Test ${idx + 1}`) || failedTests.includes("Error")) {
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

        {/* Optionally render a generic failed test case for errors
        {failedTests.includes("Error") && (
          <ListItem>
            <TestCase
              input={"N/A"}
              output={"N/A"}
              description={"Test failed due to an error during execution."}
              status={-1}
            />
          </ListItem>
        )} */}
      </List>
    </>
  );
};

export default TestCaseContainer;
