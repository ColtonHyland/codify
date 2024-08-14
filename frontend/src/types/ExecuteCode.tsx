// export interface ExecuteJavaScriptCode {
//   code: string;
//   test_cases: { input: string; output: string }[];
// }

export interface ExecuteJavaScriptCode {
  code: string;
  test_cases: {
    input: string;
    expected_output: number[];
  }[];
}