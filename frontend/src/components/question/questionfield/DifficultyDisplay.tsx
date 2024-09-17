import React from "react";
import { Box, Typography } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";

interface DifficultyDisplayProps {
  difficulty: string;
}

const DifficultyDisplay: React.FC<DifficultyDisplayProps> = ({ difficulty }) => (
  <Box display="flex" alignItems="center" mb={1}>
    <SpeedIcon />
    <Typography variant="body2" ml={0.5}>
      {difficulty}
    </Typography>
  </Box>
);

export default DifficultyDisplay;
