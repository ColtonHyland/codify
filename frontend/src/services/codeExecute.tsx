import axios from "axios";
import { ExecuteJavaScriptCode } from "../types";

export const executeJavaScriptCode = async (params: ExecuteJavaScriptCode): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const { code, test_cases } = params;

    console.log("Executing JavaScript code with parameters", { code, test_cases });

    const response = await axios.post(
      "http://localhost:8000/api/code/execute/js/",
      {
        code,
        test_cases,
      },
      {
        headers: { Authorization: `Token ${token}` },
      }
    );

    console.log("Execution response:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      // The error is an instance of Error, so it has the 'message' and 'stack' properties.
      console.error("Error executing code", {
        message: error.message,
        stack: error.stack,
        response: (error as any).response ? (error as any).response.data : "No response data",
      });
    } else {
      // Handle unexpected error types
      console.error("Unexpected error", error);
    }
    throw error;
  }
};