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
  Divider,
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
    <Box sx={{ marginTop: 2, flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden", }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          borderBottom: "2px solid #ddd",
          width: "50%",
          margin: "0 auto",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          TabIndicatorProps={{
            sx: {
              backgroundColor: "green",
            },
          }}
          sx={{
            "& .MuiTab-root": {
              color: "green",
              fontWeight: "bold",
            },
            "& .Mui-selected": {
              color: "white",
              backgroundColor: "green",
              borderRadius: "10px 10px 0 0",
            },
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-between",
            },
            width: "100%",
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
          overflowY: "auto",
          border: "2px solid green",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",

        }}
      >
          {"error" in jsonData ? (
            <Typography color="error">{jsonData.error}</Typography>
          ) : (
            <Box sx={{ padding: 2 }}>
              {/* Title and ID */}
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Box display="flex" flexDirection="row">
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "500",
                      fontFamily: "Roboto, sans-serif",
                      marginRight: 2,
                    }}
                  >
                    <strong>No.</strong> {(jsonData as Question).id || "N/A"}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "Roboto, sans-serif",
                    }}
                  >
                    {(jsonData as Question).title}
                  </Typography>
                </Box>
                <FontAwesomeIcon
                  icon={faJs}
                  style={{ color: "orange" }}
                  size="2x"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Categories and Difficulty */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ padding: "8px 0" }}
              >
                <Box display="flex" flexDirection="row" alignItems="center">
                  <BookmarkBorderIcon style={{ color: "green" }} />
                  <Box display="flex" flexDirection="row" gap={1}>
                    {(jsonData as Question).categories?.map(
                      (category, index) => (
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
                      )
                    )}
                  </Box>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: difficultyColour(
                      (jsonData as Question).difficulty || "N/A"
                    ),
                    fontWeight: "bold",
                    border: "1px solid #E0E0E0",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    display: "inline-block",
                  }}
                >
                  {(jsonData as Question).difficulty || "N/A"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Description */}
              <Typography
                variant="body2"
                paragraph
                sx={{ fontFamily: "Roboto, sans-serif", marginBottom: "16px" }}
              >
                {(jsonData as Question).description || "No description"}
              </Typography>

              {/* Task */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  fontFamily: "Roboto, sans-serif",
                  marginBottom: "16px",
                }}
              >
                {(jsonData as Question).task}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Example Section */}
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  marginBottom: "16px", // Adds appropriate spacing below the heading
                  fontFamily: "Roboto, sans-serif", // Consistent font for headings
                }}
              >
                Example
              </Typography>

              <Box sx={{ marginBottom: "16px" }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "500", // Medium weight for input text
                    fontFamily: "Roboto, sans-serif",
                  }}
                >
                  <strong>Input:</strong> {(jsonData as Question).example_input}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "400", // Regular weight for output text
                    fontFamily: "Roboto, sans-serif",
                    marginTop: "8px", // Adds space between Input and Output
                  }}
                >
                  <strong>Output:</strong>{" "}
                  {(jsonData as Question).example_output}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "400", // Regular weight for explanation text
                    fontFamily: "Roboto, sans-serif",
                    marginTop: "8px", // Adds space between Output and Explanation
                  }}
                >
                  <strong>Explanation:</strong>{" "}
                  {(jsonData as Question).explanation_answer}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Constraints */}
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  fontFamily: "Roboto, sans-serif",
                  marginBottom: "16px",
                }}
              >
                Constraints
              </Typography>
              <List>
                {JSON.parse((jsonData as Question).input_constraints).map(
                  (constraint: string, index: number) => (
                    <ListItem key={index}>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {constraint}
                      </Typography>
                    </ListItem>
                  )
                )}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Hints Section */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
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
              </Box>

              {showTips && (
                <>
                  <List>
                    {JSON.parse((jsonData as Question).hints).map(
                      (hint: string, index: number) => (
                        <ListItem key={index}>
                          <Typography
                            variant="body2"
                            sx={{ fontFamily: "Roboto, sans-serif" }}
                          >
                            {hint}
                          </Typography>
                        </ListItem>
                      )
                    )}
                  </List>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", fontFamily: "Roboto, sans-serif" }}
              >
                {(jsonData as Question).notes}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

{tabIndex === 1 && (
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
