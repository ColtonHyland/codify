import React from "react";
import { FormControl, InputLabel, MenuItem, Select, Box, SelectChangeEvent } from "@mui/material";

interface DropdownSelectorProps {
  onDifficultyChange: (difficulty: string) => void;
  onCategoryChange: (category: string) => void;
}

export const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  onDifficultyChange,
  onCategoryChange,
}) => {
  // Handle difficulty change event and ensure correct type
  const handleDifficultyChange = (e: SelectChangeEvent) => {
    const selectedDifficulty = e.target.value as string;
    onDifficultyChange(selectedDifficulty);
  };

  return (
    <Box display="flex" justifyContent="start">
      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel>Difficulty</InputLabel>
        <Select
          defaultValue="Easy"
          label="Difficulty"
          onChange={handleDifficultyChange} // Use the handler with SelectChangeEvent
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select>
      </FormControl>
      {/* Category dropdown could be added below if needed */}
    </Box>
  );
};
