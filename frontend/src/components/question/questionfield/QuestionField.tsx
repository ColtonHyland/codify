import React, { useState } from "react";
import { Box, Tabs, Tab as MuiTab, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import { tabClasses } from "@mui/material/Tab";
import { ErrorData, Question } from "../../../types";
import QuestionContent from "./QuestionContent";
import TestTab from "./TestTab";

const StyledTab = styled(MuiTab)(({ theme }) => ({
  fontFamily: "'IBM Plex Sans', sans-serif",
  color: "green",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: "bold",
  backgroundColor: "transparent",
  padding: "12px",
  margin: "0 6px",
  border: "none",
  borderRadius: "7px 7px 0 0",
  display: "flex",
  justifyContent: "center",

  [`&.${tabClasses.selected}`]: {
    color: "white",
    backgroundColor: "green",
  },
}));

interface QuestionFieldProps {
  jsonText: string;
  passedTests: string[];
  failedTests: string[];
  tabIndex: number;
  setTabIndex: (index: number) => void;
  loading: boolean;
}

type ParsedData = Question | ErrorData;

const QuestionField: React.FC<QuestionFieldProps> = ({
  jsonText,
  passedTests,
  failedTests,
  tabIndex,
  setTabIndex,
  loading,
}) => {
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
    <Box
      sx={{
        marginTop: 2,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ borderBottom: "2px solid #ddd", width: "100%", margin: "0 auto" }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          TabIndicatorProps={{ sx: { backgroundColor: "green" } }}
          sx={{ "& .MuiTabs-flexContainer": { justifyContent: "center" } }}
        >
          <StyledTab label="Description" />
          <StyledTab label="Test Cases" />
        </Tabs>
      </Box>

      {tabIndex === 0 && "error" in jsonData ? (
        <Box color="error">{jsonData.error}</Box>
      ) : (
        tabIndex === 0 && <QuestionContent jsonData={jsonData as Question} />
      )}

      {tabIndex === 1 && loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : (
        tabIndex === 1 && (
          <TestTab
            jsonData={jsonData as Question}
            passedTests={passedTests}
            failedTests={failedTests}
          />
        )
      )}
    </Box>
  );
};

export default QuestionField;
