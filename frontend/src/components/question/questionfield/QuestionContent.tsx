import React from "react";
import { Box, Typography } from "@mui/material";
import DifficultyDisplay from "./DifficultyDisplay";
import { Question } from "../../../types";

interface QuestionContentProps {
  tabValue: number;
  question: Question;
  passedTests: string[];
  failedTests: string[];
}

const QuestionContent: React.FC<QuestionContentProps> = ({
  tabValue,
  question,
  passedTests,
  failedTests,
}) => {
  return (
    <Box flexGrow={1} overflow="auto" p={2}>
      {tabValue === 0 && (
        <Box>
          <DifficultyDisplay difficulty={question.difficulty} />
          <Typography variant="h6">{question.title}</Typography>
          <Typography variant="body1">{question.description}</Typography>
        </Box>
      )}
      {tabValue === 1 && (
        <Typography variant="body1">{""}</Typography>
      )}
      {tabValue === 2 && (
        <Typography variant="body1">{question.hints}</Typography>
      )}
      {tabValue === 3 && (
        <Box>
          <Typography variant="h6">Submission Results</Typography>
          {passedTests.map((test, index) => (
            <Typography key={index} color="green">
              Passed: {test}
            </Typography>
          ))}
          {failedTests.map((test, index) => (
            <Typography key={index} color="red">
              Failed: {test}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default QuestionContent;
