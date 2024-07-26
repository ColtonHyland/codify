import axios from "axios";
import { ExecuteCode } from "../types";

export const executeCode = async (params: ExecuteCode): Promise<any> => {
  try {
    const response = await axios.post('http://localhost:8000/api/code/execute', {
      code: params.code,
      language: params.language,
      test_cases: params.test_cases
    });
    return response.data;
  } catch (error) {
    console.error("Error executing code", error);
    throw error;
  }
};
