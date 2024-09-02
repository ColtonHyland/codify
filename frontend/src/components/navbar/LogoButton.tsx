import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import whiteFavicon from "../../assets/images/favicon_white_cleaned.png";

const LogoButton: React.FC = () => (
  <Button
    color="inherit"
    component={Link}
    to="/"
    sx={{
      display: "flex",
      alignItems: "center",
      fontSize: "2rem",
      padding: "6px 12px",
      textTransform: "none",
      fontWeight: "bold",
    }}
  >
    <img src={whiteFavicon} alt="Logo" style={{ height: "48px" }} />
    odify
  </Button>
);

export default LogoButton;
