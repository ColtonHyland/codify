import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Grid,
} from '@mui/material';

interface TextFieldProps {
  jsonText: string;
}

const formatJson = (data: any) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>{data.title}</Typography>
      <Typography variant="body1"><strong>Problem ID:</strong> {data.problemId}</Typography>
      <Typography variant="body1"><strong>Difficulty:</strong> {data.difficulty}</Typography>
      <Typography variant="body1"><strong>Categories:</strong> {data.categories.join(', ')}</Typography>
      <Typography variant="body1" paragraph><strong>Description:</strong> {data.problemDescription}</Typography>

      <Typography variant="h6" gutterBottom>Context</Typography>
      <Typography variant="body1"><strong>Code Schema:</strong></Typography>
      <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
        <pre>{data.context.codeSchema}</pre>
      </Paper>
      <Typography variant="body1">{data.context.additionalInstructions}</Typography>

      <Typography variant="h6" gutterBottom>Task</Typography>
      <Typography variant="body1" paragraph>{data.task}</Typography>

      <Typography variant="h6" gutterBottom>Examples</Typography>
      <List>
        {data.examples.map((example: any, index: number) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Input: ${example.input}`}
              secondary={
                <>
                  <Typography component="span"><strong>Output:</strong> {example.output}</Typography><br />
                  <Typography component="span"><strong>Explanation:</strong> {example.explanation}</Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom>Constraints</Typography>
      <List>
        {data.constraints.map((constraint: string, index: number) => (
          <ListItem key={index}>
            <ListItemText primary={constraint} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom>Tags</Typography>
      <Typography variant="body1" paragraph>{data.tags.join(', ')}</Typography>

      <Typography variant="h6" gutterBottom>Test Cases</Typography>
      <List>
        {data.testCases.map((testCase: any, index: number) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Input: ${testCase.input}`}
              secondary={`Output: ${testCase.output}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom>Hints</Typography>
      <List>
        {data.hints.map((hint: string, index: number) => (
          <ListItem key={index}>
            <ListItemText primary={hint} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom>Solution Template</Typography>
      <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
        <pre>{data.solutionTemplate}</pre>
      </Paper>

      <Typography variant="h6" gutterBottom>Notes</Typography>
      <Typography variant="body1">{data.notes}</Typography>
    </Box>
  );
};

export const TextField: React.FC<TextFieldProps> = ({ jsonText }) => {
  let jsonData;
  try {
    jsonData = JSON.parse(jsonText);
  } catch (e) {
    jsonData = { error: "Failed to decode JSON from the OpenAI response." };
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h2" gutterBottom>Generated Question</Typography>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        {jsonData.error ? (
          <Typography color="error">{jsonData.error}</Typography>
        ) : (
          formatJson(jsonData)
        )}
      </Paper>
    </Box>
  );
};
