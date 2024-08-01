import axios from "axios";
import { ExecuteCode } from "../types";

export const executeCode = async (params: ExecuteCode): Promise<any> => {
  try {
    console.log("Executing code with params:", params);
    const token = localStorage.getItem("token");
    const response = await axios.post('http://localhost:8000/api/code/execute/', {
      code: params.code,
      language: params.language,
      test_cases: params.test_cases
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