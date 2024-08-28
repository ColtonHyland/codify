import React from 'react';
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
    <div>
      {parsedTests.map((testCase, index) => (
        <TestCase key={index} input={testCase.input} output={testCase.output} />
      ))}
    </div>
  );
};

export default TestCaseContainer;
