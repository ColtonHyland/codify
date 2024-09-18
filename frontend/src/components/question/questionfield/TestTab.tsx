import React from "react";
import { Paper } from "@mui/material";
import TestCaseContainer from "../testcase/TestCaseContainer";
import { Question } from "../../../types";

interface TestTabProps {
  jsonData: Question;
  passedTests: string[];
  failedTests: string[];
}

const TestTab: React.FC<TestTabProps> = ({ jsonData, passedTests, failedTests }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        padding: 2,
        border: "2px solid green",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <TestCaseContainer
        tests={jsonData.tests || ""}
        passedTests={passedTests}
        failedTests={failedTests}
      />
    </Paper>
  );
};

export default TestTab;
