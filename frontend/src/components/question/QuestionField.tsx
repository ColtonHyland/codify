import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faJs } from "@fortawesome/free-brands-svg-icons";
import { ErrorData, Question } from "../../types";
import TestCaseContainer from "./testcase/TestCaseContainer";

interface QuestionFieldProps {
  jsonText: string;
  passedTests: string[];
  failedTests: string[];
}

type ParsedData = Question | ErrorData;

const formatJson = (
  data: Question,
  handleToggleTips: () => void,
  showTips: boolean,
  passedTests: string[],
  failedTests: string[]
) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h5">{data.title}</Typography>
        <div>
          <FontAwesomeIcon icon={faJs} style={{ color: "orange" }} size="2x" />
        </div>
      </Box>
      <Typography variant="body1">
        <strong>Problem #</strong> {data.id || "N/A"}
      </Typography>
      <Typography variant="body1">
        <strong>Difficulty:</strong> {data.difficulty || "N/A"}
      </Typography>
      <Box display="flex" flexDirection="row">
        <Typography variant="body1">
          <strong>Categories:</strong>
        </Typography>

        <Box display="flex" flexDirection="row" gap={1}>
          {data.categories?.map((category, index) => (
            <Button
              key={index}
              variant="contained"
              sx={{
                backgroundColor: "green",
                color: "white",
                padding: "2px 8px",
                fontSize: "0.75rem",
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              {category}
            </Button>
          ))}
        </Box>
      </Box>
      <Typography variant="body2" paragraph>
        {data.description || "No description"}
      </Typography>

      <Typography variant="body2">{data.explanation}</Typography>
      <Typography variant="body2" paragraph sx={{ fontWeight: "bold" }}>
        {data.task}
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Example
      </Typography>
      <Box>
        <ListItemText
          primary={`Input: ${data.example_input}`}
          secondary={
            <>
              <Typography component="span">
                <strong>Output:</strong> {data.example_output}
              </Typography>
              <br />
              <Typography component="span">
                <strong>Explanation:</strong> {data.explanation_answer}
              </Typography>
            </>
          }
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        Constraints
      </Typography>
      <List>
        {JSON.parse(data.input_constraints).map(
          (constraint: string, index: number) => (
            <ListItem key={index}>
              <ListItemText primary={constraint} />
            </ListItem>
          )
        ) || "N/A"}
      </List>

      {/* <Typography variant="h6" gutterBottom>
        Tags
      </Typography>
      <Typography variant="body1" paragraph>
        {Array.isArray(data.tags) ? data.tags.join(", ") : "N/A"}
      </Typography> */}

      <TestCaseContainer
        tests={data.tests}
        passedTests={passedTests}
        failedTests={failedTests}
      />

      <Button variant="contained" color="primary" onClick={handleToggleTips}>
        Toggle Hints
      </Button>
      {showTips && (
        <>
          <Typography variant="h6" gutterBottom>
            Hints
          </Typography>
          <List>
            {JSON.parse(data.hints).map((hint: string, index: number) => (
              <ListItem key={index}>
                <ListItemText primary={hint} />
              </ListItem>
            )) || "N/A"}
          </List>
        </>
      )}
      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
        {data.notes}
      </Typography>
    </Box>
  );
};

export const QuestionField: React.FC<QuestionFieldProps> = ({
  jsonText,
  passedTests,
  failedTests,
}) => {
  const [showTips, setShowTips] = useState(false);

  const handleToggleTips = () => {
    setShowTips(!showTips);
  };

  let jsonData: ParsedData;
  try {
    jsonData = JSON.parse(jsonText) as Question;
  } catch (e) {
    jsonData = { error: "Failed to decode JSON from the OpenAI response." };
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        {"error" in jsonData ? (
          <Typography color="error">{jsonData.error}</Typography>
        ) : (
          formatJson(
            jsonData as Question,
            handleToggleTips,
            showTips,
            passedTests,
            failedTests
          )
        )}
      </Paper>
    </Box>
  );
};
