export interface ExecuteJavaScriptCode {
  code: string;
  test_cases: { input: string; output: string }[];
}