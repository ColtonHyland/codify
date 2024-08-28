import React from "react";

interface TestCaseProps {
  input: string;
  output: string;
}

export const TestCase: React.FC<TestCaseProps> = ({ input, output }) => {
  return (
    <div>
      <div>
        <span>Input:</span>
        <pre>{input}</pre>
      </div>
      <div>
        <span>Output:</span>
        <pre>{output}</pre>
      </div>
    </div>
  );
};
