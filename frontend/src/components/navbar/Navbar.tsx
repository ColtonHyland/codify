import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import whiteFavicon from "../../assets/images/favicon_white_cleaned.png";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        fontFamily:
          "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "green" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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

          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/questions"
              sx={{
                fontSize: "1rem",
                padding: "6px 12px",
                border: "2px solid white",
                borderRadius: "12px",     
                '&:hover': {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }
              }}
            >
              <ImportContactsOutlinedIcon sx={{ marginRight: 1 }} />
              Practice
            </Button>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {user && (
              <>
                <AccountBoxIcon sx={{ marginRight: 1 }} />
                <Typography
                  color="inherit"
                  variant="h6"
                  sx={{ marginRight: 2 }}
                >
                  {user.username}
                </Typography>
              </>
            )}

            {user ? (
              <Button color="inherit" onClick={handleLogout}>
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
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
