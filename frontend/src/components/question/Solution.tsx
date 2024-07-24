import React, { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";

interface SolutionProps {
  solution: string;
}

export const Solution: React.FC<SolutionProps> = ({ solution }) => {
  const [showSolution, setShowSolution] = useState(false);

  const handleToggleSolution = () => {
    setShowSolution(!showSolution);
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleToggleSolution}
      >
        {showSolution ? "Hide Solution" : "Show Solution"}
      </Button>
      {showSolution && (
        <Paper variant="outlined" sx={{ padding: 2, marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Solution Template
          </Typography>
          <pre>{solution}</pre>
        </Paper>
      )}
    </Box>
  );
};
