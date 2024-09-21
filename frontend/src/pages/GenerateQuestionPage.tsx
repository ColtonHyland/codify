import React, { useState } from "react";
import { GenerateButton } from "../components/question/GenerateButton";
import { DropdownSelector } from "../components/question/DropdownSelector";
import {
  Container,
  Box,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";
import BackButton from "../components/utils/BackButton";
import { useNavigate } from "react-router-dom";

export const GenerateQuestionPage: React.FC = () => {
  const [responseData, setResponseData] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [category, setCategory] = useState<string>("SQL");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleApiResponse = (data: any) => {
    setResponseData(JSON.stringify(data, null, 2)); // Format JSON with 2-space indentation
    navigate("/questions/");
  };

  const handleGenerate = () => {
    setIsLoading(true);
  };

  const handleDifficultyChange = (difficulty: string) => {
    setDifficulty(difficulty);
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  return (
    <>
      <BackButton to="/" />
      <Container
        sx={{
          height: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "250px",
            minWidth: "480px",
            margin: "20px auto",
            border: "2px solid green",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!isLoading ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Select a difficulty and generate a question!
                </Typography>
                <Box
                  mt={2}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  sx={{ width: "100%" }}
                >
                  <DropdownSelector
                    onDifficultyChange={handleDifficultyChange}
                    onCategoryChange={handleCategoryChange}
                  />
                  <GenerateButton
                    onApiResponse={handleApiResponse}
                    difficulty={difficulty}
                    category={category}
                    onGenerate={handleGenerate}
                  />
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Please wait...
                </Typography>
                <CircularProgress color="success" size="40px" />
              </>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};
