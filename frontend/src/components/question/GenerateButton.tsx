import React from "react";
import { Button } from "@mui/material";
import { useQuestionContext } from '../../contexts/QuestionContext';

interface ButtonProps {
  onApiResponse: (data: any) => void;
  difficulty: string;
  category: string;
}

export const GenerateButton: React.FC<ButtonProps> = ({
  onApiResponse,
  difficulty,
  category,
}) => {
  const { generateQuestion } = useQuestionContext();

  const handleClick = () => {
    console.log("Generating question with difficulty:", difficulty); // Log the difficulty
    generateQuestion(difficulty, [category], onApiResponse);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Generate Question
    </Button>
  );
};
