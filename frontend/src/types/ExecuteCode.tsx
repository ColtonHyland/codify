// export interface ExecuteJavaScriptCode {
//   code: string;
//   test_cases: { input: string; output: string }[];
// }

export interface ExecuteJavaScriptCode {
  code: string;
  test_cases: {
    input: { [key: string]: number[] };
    expected_output: number[];
  }[];
}