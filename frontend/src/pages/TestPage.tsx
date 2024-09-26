import React from "react";
import { executeJavaScriptCode } from "../services/codeExecute";

const TestPage: React.FC = () => {
  const handleTestExecution = async () => {
    const hardcodedTestData = {
      title: "sum-arrays",
      description:
        "Write a function, sumArrays, that takes in two arrays of numbers. The function should return a new array where each element is the sum of the elements at the corresponding position in the input arrays. If the arrays are of different lengths, the function should treat missing elements as 0.",
      starter_code:
        "const sumArrays = (arr1, arr2) => {\n    // TODO: Implement the function\n};\n\nmodule.exports = {\n    sumArrays,\n};",
      solution: [
        {
          type: "iterative",
          code: `const sumArrays = (arr1, arr2) => {
            const maxLength = Math.max(arr1.length, arr2.length);
            const result = [];
            
            for (let i = 0; i < maxLength; i++) {
              const val1 = arr1[i] || 0;
              const val2 = arr2[i] || 0;
              result.push(val1 + val2);
            }
            
            return result;
          };`,
          complexity: {
            time: "O(n)",
            space: "O(n)",
          },
        },
      ],
      tests: [
        {
          input: `
            const arr1 = [1, 2, 3];
            const arr2 = [4, 5, 6];
          `,
          expected_output: [5, 7, 9],  // Directly use an array
        },
        {
          input: `
            const arr1 = [1, 2];
            const arr2 = [3, 4, 5];
          `,
          expected_output: [4, 6, 5],  // Directly use an array
        },
        {
          input: `
            const arr1 = [0, 0, 0];
            const arr2 = [0, 0, 0];
          `,
          expected_output: [0, 0, 0],  // Directly use an array
        },
        {
          input: `
            const arr1 = [9, 8, 7];
            const arr2 = [1, 2, 3];
          `,
          expected_output: [10, 10, 10],  // Directly use an array
        },
        {
          input: `
            const arr1 = [1];
            const arr2 = [9, 9, 9, 9];
          `,
          expected_output: [10, 9, 9, 9],  // Directly use an array
        },
      ],
    };

    try {
      const response = await executeJavaScriptCode({
        code: hardcodedTestData.solution[0].code,
        test_cases: hardcodedTestData.tests.map((test) => ({
          input: test.input,
          expected_output: test.expected_output,  // Now passing arrays directly
        })),
      });
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
