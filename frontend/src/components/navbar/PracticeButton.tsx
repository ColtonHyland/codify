import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";

const PracticeButton: React.FC = () => (
  <Button
    color="inherit"
    component={Link}
    to="/questions"
    sx={{
      fontSize: "1rem",
      padding: "6px 12px",
      border: "2px solid white",
      borderRadius: "12px",
      "&:hover": {
        backgroundColor: "black",
      },
    }}
  >
    <ImportContactsOutlinedIcon sx={{ marginRight: 1 }} />
    Practice
  </Button>
);

export default PracticeButton;
