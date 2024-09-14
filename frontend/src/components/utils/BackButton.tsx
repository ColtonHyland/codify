import React from "react";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface BackButtonProps {
  to?: string;
  sx?: object;
}

const BackButton: React.FC<BackButtonProps> = ({ to = "/questions", sx = {} }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <IconButton
      onClick={handleBack}
      sx={{
        color: "green",
        position: "absolute",
        top: 90,
        left: 30,
        ...sx, // Allow overriding styles via props
      }}
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackButton;
