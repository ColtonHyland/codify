import React from "react";
import { Button } from "@mui/material";
import { useQuestionContext } from '../../contexts/QuestionContext';

interface ButtonProps {
  onApiResponse: (data: any) => void;
  difficulty: string;
  category: string;
  onGenerate: () => void;
}

export const GenerateButton: React.FC<ButtonProps> = ({
  onApiResponse,
  difficulty,
  category,
  onGenerate
}) => {
  const { generateQuestion } = useQuestionContext();

  const handleClick = () => {
    onGenerate();
    generateQuestion(difficulty, [category], onApiResponse);
  };

  return (
    <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClick}
                  size="large"
                  sx={{
                    color: "white",
                    backgroundColor: "green",
                    border: "2px solid green",
                    "&:hover": {
                      backgroundColor: "black",
                    },
                  }}
                >
      Generate Question
    </Button>
  );
};
