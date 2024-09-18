import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faJs } from "@fortawesome/free-brands-svg-icons";
import DifficultyDisplay from "./DifficultyDisplay";
import { Question } from "../../../types";

interface QuestionContentProps {
  jsonData: Question;
}

const QuestionContent: React.FC<QuestionContentProps> = ({ jsonData }) => {
  const [showTips, setShowTips] = useState(false);

  const handleToggleTips = () => {
    setShowTips(!showTips);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        padding: 2,
        overflowY: "auto",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        border: "2px solid green",
      }}
    >
      <Box sx={{ padding: 2 }}>
        {/* Title and ID */}
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box display="flex" flexDirection="row">
            <Typography
              variant="body1"
              sx={{ fontWeight: "500", marginRight: 2 }}
            >
              <strong>No.</strong> {jsonData.id || "N/A"}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {jsonData.title}
            </Typography>
          </Box>
          <FontAwesomeIcon icon={faJs} style={{ color: "orange" }} size="2x" />
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ padding: "8px 0" }}
        >
          <Box display="flex" flexDirection="row" alignItems="center">
            <BookmarkBorderIcon style={{ color: "green" }} />
            <Box display="flex" flexDirection="row" gap={1}>
              {jsonData.categories?.map((category, index) => (
                <Button
                  key={index}
                  variant="contained"
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "2px 8px",
                    fontSize: "0.75rem",
                    minWidth: "auto",
                    "&:hover": { backgroundColor: "black" },
                  }}
                >
                  {category}
                </Button>
              ))}
            </Box>
          </Box>
          <DifficultyDisplay difficulty={jsonData.difficulty || "N/A"} />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" paragraph>
          {jsonData.description || "No description"}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Example
        </Typography>
        <Box>
          <Typography variant="body1">
            <strong>Input:</strong> {jsonData.example_input}
          </Typography>
          <Typography variant="body2" sx={{ marginTop: "8px" }}>
            <strong>Output:</strong> {jsonData.example_output}
          </Typography>
          <Typography variant="body2" sx={{ marginTop: "8px" }}>
            <strong>Explanation:</strong> {jsonData.explanation_answer}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Constraints
        </Typography>
        <List>
          {JSON.parse(jsonData.input_constraints).map(
            (constraint: string, index: number) => (
              <ListItem key={index}>
                <Typography variant="body2">{constraint}</Typography>
              </ListItem>
            )
          )}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            onClick={handleToggleTips}
            sx={{
              color: "white",
              backgroundColor: "green",
              "&:hover": { backgroundColor: "black" },
            }}
          >
            Toggle Hints
          </Button>
        </Box>

        {showTips && (
          <List>
            {JSON.parse(jsonData.hints).map((hint: string, index: number) => (
              <ListItem key={index}>
                <Typography variant="body2">{hint}</Typography>
              </ListItem>
            ))}
          </List>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          {jsonData.notes}
        </Typography>
      </Box>
    </Paper>
  );
};

export default QuestionContent;
