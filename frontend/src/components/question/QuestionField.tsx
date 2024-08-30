import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, List, ListItem, ListItemText } from "@mui/material";
import { ErrorData, Question } from '../../types';
import TestCaseContainer from './testcase/TestCaseContainer';

interface QuestionFieldProps {
  jsonText: string;
}

type ParsedData = Question | ErrorData;

const formatJson = (data: Question, handleToggleTips: () => void, showTips: boolean) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {data.title}
      </Typography>
      <Typography variant="body1">
        <strong>Problem ID:</strong> {data.id || "N/A"}
      </Typography>
      <Typography variant="body1">
        <strong>Difficulty:</strong> {data.difficulty || "N/A"}
      </Typography>
      <Typography variant="body1">
        <strong>Categories:</strong> {data.categories?.join(", ") || "N/A"}
      </Typography>
      <Typography variant="body1">
        <strong>Language:</strong> {data.language || "N/A"}
      </Typography>  {/* Added Language */}
      <Typography variant="body1" paragraph>
        <strong>Description:</strong> {data.description || "N/A"}
      </Typography>

  
      <Typography variant="body1">{data.explanation || "N/A"}</Typography>

      <Typography variant="h6" gutterBottom>
        Task
      </Typography>
      <Typography variant="body1" paragraph>
        {data.task || "N/A"}
      </Typography>

      <Typography variant="h6" gutterBottom>
        Examples
      </Typography>
      <List>
        <ListItem>
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
        </ListItem>
      </List>

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

      <Typography variant="h6" gutterBottom>
        Tags
      </Typography>
      <Typography variant="body1" paragraph>
        {Array.isArray(data.tags) ? data.tags.join(", ") : "N/A"}
      </Typography>

      <TestCaseContainer tests={data.tests} index={0} />


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
      <Typography variant="h6" gutterBottom>
        Notes
      </Typography>
      <Typography variant="body1">{data.notes || "N/A"}</Typography>
    </Box>
  );
};

export const QuestionField: React.FC<QuestionFieldProps> = ({ jsonText }) => {
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

  // useEffect(() => {
  //   console.log(jsonData);
  // }, [jsonData]);

  return (
    <Box sx={{ padding: 2 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        {"error" in jsonData ? (
          <Typography color="error">{jsonData.error}</Typography>
        ) : (
          formatJson(jsonData as Question, handleToggleTips, showTips)
        )}
      </Paper>
    </Box>
  );
};