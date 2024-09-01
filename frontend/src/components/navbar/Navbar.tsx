import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import whiteFavicon from '../../assets/images/favicon_white_cleaned.png';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';


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
        {user && (
        <Button color="inherit" component={Link} to="/questions"
        sx={{
          flexGrow: 1,
          fontSize: "1rem",
          padding: "12px 24px",
        }}>
            Practice
        </Button>
        )}

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%", fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'" }}
        >
          {user && (
            <Typography color="inherit" variant="subtitle1" sx={{ marginRight: 2 }}>
              Ready to code, {user.username}?
            </Typography>
          )}
          
          {user ? (
            <>
              <Button color="inherit" onClick={handleLogout}>
              <LogoutIcon sx={{ marginLeft: 1 }}/>
                Logout
                
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              <LoginIcon sx={{ marginLeft: 1 }}/>
              Login
              
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
