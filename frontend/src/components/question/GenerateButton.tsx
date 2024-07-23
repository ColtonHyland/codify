import React from "react";
import { Button } from "@mui/material";

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
  const handleClick = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch(
        "http://localhost:8000/api/questions/generate/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
          },
          body: JSON.stringify({
            categories: [category],
            difficulty: difficulty,
          }),
        }
      );
      const data = await response.json();
      console.log(data); 
      onApiResponse(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Generate Question
    </Button>
  );
};
