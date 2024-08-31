import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import whiteFavicon from '../../assets/images/favicon_white_cleaned.png';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "green" }}>
      <Toolbar sx={{ fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'" }}>
        <Button
          color="inherit"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            fontSize: "2rem",
            padding: "6px 12px",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src={whiteFavicon} alt="Logo" style={{height: '48px' }} />
          odify
        </Button>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%", fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'" }}
        >
          {user && (
            <Typography variant="h6" component="div" sx={{ marginRight: 2 }}>
              {user.username}
            </Typography>
          )}
          <Button color="inherit" component={Link} to="/questions">
            Practice
          </Button>
          {user ? (
            <>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
