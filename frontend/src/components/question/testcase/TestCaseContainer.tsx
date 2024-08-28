import React from 'react';
import { TestCase } from './TestCase';

interface TestCaseContainerProps {
  testCases: { input: string; output: string }[];
}

const TestCaseContainer: React.FC<TestCaseContainerProps> = ({ testCases }) => {
  return (
    <div>
      {testCases.map((testCase, index) => (
        <TestCase key={index} input={testCase.input} output={testCase.output} />
      ))}
    </div>
  );
};