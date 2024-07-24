import React from "react";
import { FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";

interface DropdownSelectorProps {
  onDifficultyChange: (difficulty: string) => void;
  onCategoryChange: (category: string) => void;
}

export const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  onDifficultyChange,
  onCategoryChange,
}) => {
  return (
    <Box display="flex" justifyContent="start">
      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel>Difficulty</InputLabel>
        <Select
          defaultValue="Easy"
          label="Difficulty"
          onChange={(e) => onDifficultyChange(e.target.value as string)}
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel>Category</InputLabel>
        <Select
          defaultValue="SQL"
          label="Category"
          onChange={(e) => onCategoryChange(e.target.value as string)}
        >
          <MenuItem value="Python">Python</MenuItem>
          <MenuItem value="JavaScript">JavaScript</MenuItem>
          <MenuItem value="TypeScript">TypeScript</MenuItem>
          <MenuItem value="SQL">SQL</MenuItem>
          <MenuItem value="C++">C++</MenuItem>
          <MenuItem value="Java">Java</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
