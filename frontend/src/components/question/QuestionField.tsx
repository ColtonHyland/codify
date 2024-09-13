import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Container,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { faJs } from "@fortawesome/free-brands-svg-icons";
import { ErrorData, Question } from "../../types";
import TestCaseContainer from "./testcase/TestCaseContainer";

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
  const [showTips, setShowTips] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const handleToggleTips = () => {
    setShowTips(!showTips);
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
    setTabIndex(newIndex);
  };

  let jsonData: ParsedData;
  try {
    jsonData = JSON.parse(jsonText) as Question;
  } catch (e) {
    jsonData = { error: "Failed to decode JSON from the OpenAI response." };
  }

  const difficultyColour = (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "green";

      case "Medium":
        return "orange";

      case "Hard":
        return "red";

      default:
        return "black";
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          borderBottom: "2px solid #ddd",
          width: "50%", // Limits the width to 50% of the container for the tabs
          margin: "0 auto",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          TabIndicatorProps={{
            sx: {
              backgroundColor: "green", // Change the color of the indicator line
            },
          }}
          sx={{
            "& .MuiTab-root": {
              color: "black", // Default tab color
            },
            "& .Mui-selected": {
              color: "green", // Color for selected tab
            },
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-between", // Ensures tabs are separated within their half width
            },
            width: "100%", // Make tabs take full width of the 50% container
          }}
        >
          <Tab label="Description" />
          <Tab label="Test Cases" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <Paper
          variant="outlined"
          sx={{
            padding: 2,
            maxHeight: "500px", // Limit the height
            overflowY: "auto", // Add scrolling if content exceeds the height
          }}
        >
          {"error" in jsonData ? (
            <Typography color="error">{jsonData.error}</Typography>
          ) : (
            <Box sx={{ padding: 2 }}>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Box display="flex" flexDirection="row">
                  <Typography variant="body1">
                    <strong>No.</strong> {(jsonData as Question).id || "N/A"}
                  </Typography>
                  <Typography variant="h5">
                    {(jsonData as Question).title}
                  </Typography>
                </Box>

                <div>
                  <FontAwesomeIcon
                    icon={faJs}
                    style={{ color: "orange" }}
                    size="2x"
                  />
                </div>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: difficultyColour(
                    (jsonData as Question).difficulty || "N/A"
                  ),
                  fontWeight: "bold",
                  border: "2px solid black",
                  padding: "2px 4px",
                  borderRadius: "10px",
                  display: "inline-block",
                }}
              >
                {(jsonData as Question).difficulty || "N/A"}
              </Typography>

              <Box display="flex" flexDirection="row">
                <BookmarkBorderIcon style={{ color: "green" }} />

                <Box display="flex" flexDirection="row" gap={1}>
                  {(jsonData as Question).categories?.map((category, index) => (
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
                {(jsonData as Question).description || "No description"}
              </Typography>

              <Typography variant="body2">
                {(jsonData as Question).explanation}
              </Typography>
              <Typography variant="body2" paragraph sx={{ fontWeight: "bold" }}>
                {(jsonData as Question).task}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Example
              </Typography>
              <Box>
                <ListItemText
                  primary={`Input: ${(jsonData as Question).example_input}`}
                  secondary={
                    <>
                      <Typography component="span">
                        <strong>Output:</strong>{" "}
                        {(jsonData as Question).example_output}
                      </Typography>
                      <br />
                      <Typography component="span">
                        <strong>Explanation:</strong>{" "}
                        {(jsonData as Question).explanation_answer}
                      </Typography>
                    </>
                  }
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                Constraints
              </Typography>
              <List>
                {JSON.parse((jsonData as Question).input_constraints).map(
                  (constraint: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={constraint} />
                    </ListItem>
                  )
                )}
              </List>

              <Button
                variant="contained"
                onClick={handleToggleTips}
                sx={{
                  color: "white",
                  backgroundColor: "green",
                  "&:hover": {
                    backgroundColor: "black",
                  },
                }}
              >
                Toggle Hints
              </Button>

              {showTips && (
                <>
                  <List>
                    {JSON.parse((jsonData as Question).hints).map(
                      (hint: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemText primary={hint} />
                        </ListItem>
                      )
                    )}
                  </List>
                </>
              )}

              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                {(jsonData as Question).notes}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {tabIndex === 1 && (
        <Paper variant="outlined" sx={{ padding: 2 }}>
          <TestCaseContainer
            tests={(jsonData as Question).tests || ""}
            passedTests={passedTests}
            failedTests={failedTests}
          />
        </Paper>
      )}
    </Box>
  );
};

export default QuestionField;
