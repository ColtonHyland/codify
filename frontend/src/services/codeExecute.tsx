import axios from "axios";
import { ExecuteCode } from "../types";

export const executeCode = async (params: ExecuteCode): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const hardCodedTest = {
      code: `def merge(nums1, m, nums2, n):
    ptr1 = m - 1
    ptr2 = n - 1
    ptr = m + n - 1
    while ptr1 >= 0 and ptr2 >= 0:
        if nums1[ptr1] > nums2[ptr2]:
            nums1[ptr] = nums1[ptr1]
            ptr1 -= 1
        else:
            nums1[ptr] = nums2[ptr2]
            ptr2 -= 1
        ptr -= 1
    if ptr2 >= 0:
        nums1[:ptr2 + 1] = nums2[:ptr2 + 1]
    return nums1`,
      language: "python",
      tests: [
        {
          input: "[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3",
          expected_output: "[1, 2, 2, 3, 5, 6]"
        },
        {
          input: "[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3",
          expected_output: "[1, 2, 3, 4, 5, 6]"
        }
      ]
    };
    console.log("Executing code with hard coded test cases", hardCodedTest);
    const response = await axios.post('http://localhost:8000/api/code/execute/', {
      hardCodedTest,
      // code: params.code,
      // language: params.language,
      // test_cases: params.test_cases
    }, {
      headers: { Authorization: `Token ${token}` }
    });
    console.log("Execution response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error executing code", error);
    throw error;
  }
};