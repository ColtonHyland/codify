import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { ErrorData, Question } from "../../../types";
import QuestionContent from "./QuestionContent";
import TestTab from "./TestTab";

interface QuestionFieldProps {
  jsonText: string;
  passedTests: string[];
  failedTests: string[];
}

type ParsedData = Question | ErrorData;

const QuestionField: React.FC<QuestionFieldProps> = ({
  jsonText,
  passedTests,
  failedTests,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
    setTabIndex(newIndex);
  };

  let jsonData: ParsedData;
  try {
    jsonData = JSON.parse(jsonText) as Question;
  } catch (e) {
    jsonData = { error: "Failed to decode JSON from the OpenAI response." };
  }

  return (
    <Box sx={{ marginTop: 2, flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ borderBottom: "2px solid #ddd", width: "50%", margin: "0 auto" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          TabIndicatorProps={{ sx: { backgroundColor: "green" } }}
          sx={{
            "& .MuiTab-root": { color: "black", fontWeight: "bold" },
            "& .Mui-selected": { color: "white", backgroundColor: "green", borderRadius: "10px 10px 0 0" },
            "& .MuiTabs-flexContainer": { justifyContent: "space-between" },
            width: "100%",
          }}
        >
          <Tab label="Description" />
          <Tab label="Test Cases" />
        </Tabs>
      </Box>

      {tabIndex === 0 && "error" in jsonData ? (
        <Box color="error">{jsonData.error}</Box>
      ) : (
        tabIndex === 0 && <QuestionContent jsonData={jsonData as Question} />
      )}

      {tabIndex === 1 && (
        <TestTab
          jsonData={jsonData as Question}
          passedTests={passedTests}
          failedTests={failedTests}
        />
      )}
    </Box>
  );
};

export default QuestionField;
