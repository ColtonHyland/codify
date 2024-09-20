import React, { useState } from "react";
import { GenerateButton } from "../components/question/GenerateButton";
import { DropdownSelector } from "../components/question/DropdownSelector";
import { Container, Box } from "@mui/material";

export const GenerateQuestionPage: React.FC = () => {
  const [responseData, setResponseData] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string>("Easy"); // Set initial difficulty
  const [category, setCategory] = useState<string>("SQL");

  const handleApiResponse = (data: any) => {
    setResponseData(JSON.stringify(data, null, 2)); // Format JSON with 2-space indentation
  };

  const handleDifficultyChange = (difficulty: string) => {
    console.log("Difficulty changed to:", difficulty); // Log when difficulty changes
    setDifficulty(difficulty);
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  return (
    <Container maxWidth="md" sx={{ padding: "20px" }}>
      <Box mb={2}>
        <DropdownSelector
          onDifficultyChange={handleDifficultyChange} // Update the difficulty state
          onCategoryChange={handleCategoryChange}
        />
      </Box>
      <Box mb={2}>
        <GenerateButton
          onApiResponse={handleApiResponse}
          difficulty={difficulty} // Pass the selected difficulty to the GenerateButton
          category={category}
        />
      </Box>
    </Container>
  );
};
