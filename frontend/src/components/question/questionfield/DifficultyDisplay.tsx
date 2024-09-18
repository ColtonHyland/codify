import React from "react";
import { Typography, Box } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";

interface DifficultyDisplayProps {
  difficulty: string;
}

const DifficultyDisplay: React.FC<DifficultyDisplayProps> = ({ difficulty }) => {
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
    <Box display="flex" flexDirection="row" alignItems="center">
      <SpeedIcon style={{ color: difficultyColour(difficulty) }} />
      <Typography
        variant="body1"
        sx={{
          color: difficultyColour(difficulty),
          fontWeight: "bold",
          border: "1px solid #E0E0E0",
          padding: "2px 8px",
          borderRadius: "10px",
          display: "inline-block",
        }}
      >
        {difficulty || "N/A"}
      </Typography>
    </Box>
  );
};

export default DifficultyDisplay;
