import React from "react";
import { executeJavaScriptCode } from "../services/codeExecute";
import { ExecuteJavaScriptCode } from "../types";

const TestPage: React.FC = () => {
  const handleTestExecution = async () => {
    const hardcodedTestData = {
      title: "add-lists",
      description:
        "Write a function, addLists, that takes in the head of two linked lists, each representing a number. The nodes of the linked lists contain digits as values. The nodes in the input lists are reversed; this means that the least significant digit of the number is the head. The function should return the head of a new linked list representing the sum of the input lists. The output list should have its digits reversed as well. You must do this by traversing through the linked lists once. Say we wanted to compute 621 + 354 normally. The sum is 975: 621 + 354 ----- 975 Then, the reversed linked list format of this problem would appear as: 1 -> 2 -> 6 + 4 -> 5 -> 3 -------------- 5 -> 7 -> 9",
      starter_code:
        "const addLists = (head1, head2, carry = 0) => {\n    //todo\n};\n\nmodule.exports = {\n    addLists,\n};",
      solution: [
        {
          type: "iterative",
          code: `class Node {
            constructor(val) {
              this.val = val;
              this.next = null;
            }
          }
          
          const addLists = (head1, head2) => {
            const dummyHead = new Node(null);
            let tail = dummyHead;
            let carry = 0;
            let current1 = head1;
            let current2 = head2;
            
            while (current1 !== null || current2 !== null || carry !== 0) {
              const val1 = current1 === null ? 0 : current1.val;
              const val2 = current2 === null ? 0 : current2.val;
              const sum = val1 + val2 + carry;
              carry = sum > 9 ? 1 : 0;
              
              const digit = sum % 10;
              tail.next = new Node(digit);
              tail = tail.next;
              
              if (current1 !== null) current1 = current1.next;
              if (current2 !== null) current2 = current2.next;
            }
            
            return dummyHead.next;
          };`,
          complexity: {
            time: "O(max(n, m))",
            space: "O(max(n, m))",
          },
        },
        {
          type: "recursive",
          code: `class Node {
            constructor(val) {
              this.val = val;
              this.next = null;
            }
          }
          
          const addLists = (head1, head2, carry = 0) => {
            if (head1 === null && head2 === null && carry === 0) return null;
            const val1 = head1 === null ? 0 : head1.val;
            const val2 = head2 === null ? 0 : head2.val;
            const sum = val1 + val2 + carry;
            const nextCarry = sum > 9 ? 1 : 0;
            const digit = sum % 10;
            const next1 = head1 === null ? null : head1.next;
            const next2 = head2 === null ? null : head2.next;
            const head = new Node(digit);
            head.next = addLists(next1, next2, nextCarry);
            return head;
          };`,
        },
      ],
      tests: [
        {
          input: {
            head1:
              "const a1 = new Node(1); const a2 = new Node(2); const a3 = new Node(6); a1.next = a2; a2.next = a3;",
            head2:
              "const b1 = new Node(4); const b2 = new Node(5); const b3 = new Node(3); b1.next = b2; b2.next = b3;",
          },
          expected_output:
            "const n1 = new Node(5); const n2 = new Node(7); const n3 = new Node(9); n1.next = n2; n2.next = n3; return n1;",
        },
        {
          input: {
            head1:
              "const a1 = new Node(1); const a2 = new Node(4); const a3 = new Node(5); const a4 = new Node(7); a1.next = a2; a2.next = a3; a3.next = a4;",
            head2: "const b1 = new Node(2); const b2 = new Node(3); b1.next = b2;",
          },
          expected_output:
            "const n1 = new Node(3); const n2 = new Node(7); const n3 = new Node(5); const n4 = new Node(7); n1.next = n2; n2.next = n3; n3.next = n4; return n1;",
        },
        {
          input: {
            head1: "const a1 = new Node(9); const a2 = new Node(3); a1.next = a2;",
            head2: "const b1 = new Node(7); const b2 = new Node(4); b1.next = b2;",
          },
          expected_output:
            "const n1 = new Node(6); const n2 = new Node(8); return n1;",
        },
        {
          input: {
            head1: "const a1 = new Node(9); const a2 = new Node(8); a1.next = a2;",
            head2: "const b1 = new Node(7); const b2 = new Node(4); b1.next = b2;",
          },
          expected_output:
            "const n1 = new Node(6); const n2 = new Node(3); const n3 = new Node(1); n1.next = n2; n2.next = n3; return n1;",
        },
        {
          input: {
            head1:
              "const a1 = new Node(9); const a2 = new Node(9); const a3 = new Node(9); a1.next = a2; a2.next = a3;",
            head2: "const b1 = new Node(6);",
          },
          expected_output:
            "const n1 = new Node(5); const n2 = new Node(0); const n3 = new Node(0); const n4 = new Node(1); n1.next = n2; n2.next = n3; n3.next = n4; return n1;",
        },
      ],
    };

    try {
      const response = await executeJavaScriptCode({
        code: hardcodedTestData.solution[0].code,
        test_cases: hardcodedTestData.tests.map((test) => ({
          input: `head1: ${test.input.head1}, head2: ${test.input.head2}`,
          expected_output: test.expected_output,
        })),
      });
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