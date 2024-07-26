export interface ExecuteCode {
  code: string;
  language: string;
  test_cases: { input: string; output: string }[];
}