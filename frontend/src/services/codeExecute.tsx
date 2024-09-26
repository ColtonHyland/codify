import axios from "axios";
import { ExecuteJavaScriptCode } from "../types";

export const executeJavaScriptCode = async (
  params: ExecuteJavaScriptCode
): Promise<any> => {
  try {
    const { code, test_cases } = params;
    console.log("Executing JavaScript code with parameters:", {
      code,
      test_cases,
    }); // Log parameters

    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:8000/api/code/execute/js/",
      { code, test_cases },
      { headers: { Authorization: `Token ${token}` } }
    );

    console.log("Response from code execution API:", response.data); // Log full response
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error executing code", {
        message: error.message,
        stack: error.stack,
        response: (error as any).response
          ? (error as any).response.data
          : "No response data",
      });
    } else {
      console.error("Unexpected error", error);
    }
    throw error;
  }
};
