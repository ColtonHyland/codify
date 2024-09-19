import React from "react";
import { List, ListItem } from "@mui/material";
import { TestCase } from "./TestCase";

interface TestCaseType {
  input: string;
  output: string;
}

interface TestCaseContainerProps {
  tests: string;
  passedTests: string[];
  failedTests: string[];
}

const TestCaseContainer: React.FC<TestCaseContainerProps> = ({ tests, passedTests, failedTests }) => {
  const parsedTests: TestCaseType[] = JSON.parse(tests);

  return (
    <List>
      {parsedTests.map((testCase, idx) => {
        let status = 0;
        if (passedTests.includes(`Test ${idx + 1}`)) {
          status = 1;
        } else if (failedTests.includes(`Test ${idx + 1}`) || failedTests.includes("Error")) {
          status = -1;
        }

        return (
          <ListItem key={idx}>
            <TestCase
              input={testCase.input}
              output={testCase.output}
              testNumber={idx + 1}
              status={status}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default TestCaseContainer;
