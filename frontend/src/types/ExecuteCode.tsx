export interface ExecuteJavaScriptCode {
  code: string;
  test_cases: {
    input: string;
    expected_output: string | number | object | Array<any>;  // Flexible expected_output type
  }[];
}