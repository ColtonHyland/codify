// components/QuestionField/QuestionTabs.tsx

import React from "react";
import { Tabs, Tab, styled } from "@mui/material";

interface QuestionTabsProps {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const CustomTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.text.primary,
  "&.Mui-selected": {
    color: theme.palette.common.white,
  },
}));

const QuestionTabs: React.FC<QuestionTabsProps> = ({ value, handleChange }) => (
  <Tabs value={value} onChange={handleChange}>
    <CustomTab label="Question" />
    <CustomTab label="Solution" />
    <CustomTab label="Hints" />
    <CustomTab label="Submission Results" />
  </Tabs>
);

export default QuestionTabs;
