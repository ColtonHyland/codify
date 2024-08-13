import React from "react";
import { executeJavaScriptCode } from "../services/codeExecute";

const TestPage: React.FC = () => {
  const handleTestExecution = async () => {
    const code = `
    function addLists(head1, head2) {
      let result = [];
      for(let i = 0; i < head1.length; i++) {
        result.push(head1[i] + head2[i]);
      }
      return result;
    }
    `;

    const test_cases = [
      {
        input: { head1: [1, 2, 3], head2: [4, 5, 6] },
        expected_output: [5, 7, 9]
      },
      {
        input: { head1: [10, 20, 30], head2: [5, 15, 25] },
        expected_output: [15, 35, 55]
      }
    ];

    try {
      const response = await executeJavaScriptCode({ code, test_cases });
      console.log("Test Execution Result:", response);
      alert(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error("Error executing test code:", error);
      alert("Failed to execute test code. Check the console for more details.");
    }
  };

  return (
    <div>
      <h1>Test Code Execution</h1>
      <button onClick={handleTestExecution}>Run Test</button>
    </div>
  );
};

export default TestPage;