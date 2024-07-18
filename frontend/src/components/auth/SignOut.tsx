import React from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCSRFToken } from "../../utils/csrf";

const SignOut: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const csrfToken = await getCSRFToken();
      await axios.post(
        "http://localhost:8000/accounts/logout/",
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );
      navigate("/login");
    } catch (error) {
      console.error("Failed to sign out");
    }
  };

  return (
    <Button onClick={handleSignOut} variant="contained" color="secondary">
      Sign Out
    </Button>
  );
};

export default SignOut;
