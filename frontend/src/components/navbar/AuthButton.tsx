import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

const AuthButtons: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box sx={{ color: "white", display: "flex", alignItems: "center" }}>
      {user && (
        <>
          <AccountBoxIcon sx={{ marginRight: 1 }} />
          <Typography color="inherit" variant="h6" sx={{ marginRight: 2 }}>
            {user.username}
          </Typography>
        </>
      )}
      {user ? (
        <Button color="inherit" onClick={handleLogout} >
          <LogoutIcon sx={{ marginLeft: 1 }} />
          Logout
        </Button>
      ) : (
        <Button color="inherit" component={Link} to="/login">
          <LoginIcon sx={{ marginLeft: 1 }} />
          Login
        </Button>
      )}
    </Box>
  );
};

export default AuthButtons;
