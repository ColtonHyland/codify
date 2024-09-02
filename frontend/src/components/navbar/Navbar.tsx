import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import whiteFavicon from "../../assets/images/favicon_white_cleaned.png";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import { FaJs, FaPython, FaDatabase, FaCuttlefish } from "react-icons/fa";
import CPlusPlusIcon from "../../assets/icons/CPlusPlusIcon";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 150,
                  marginRight: 2,
                  "& .MuiOutlinedInput-root": {
                    color: "green",
                    backgroundColor: "white", // Sets the selected area background color to green
                    "& fieldset": {
                      borderColor: "green",
                      borderRadius: "8px",
                    },
                    "&:hover fieldset": {
                      borderColor: "green",
                      borderRadius: "8px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "green",
                      borderRadius: "8px",
                    },
                  },
                  "& .MuiSvgIcon-root": {
                    color: "green",
                  },
                }}
              >
                <Select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{
                    color: "white",
                    backgroundColor: "green",
                    borderRadius: "8px",// Ensures the dropdown list also has a green background
                    "& .MuiPaper-root": {
                      backgroundColor: "green",
                      borderRadius: "8px", // Ensures the dropdown menu has a green background
                    },
                  }}
                >
                  <MenuItem
  value="JavaScript"
  sx={{ backgroundColor: "white", color: "green" }}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
    }}
  >
    <FaJs style={{ marginRight: 8 }} />
    JavaScript
  </Box>
</MenuItem>
<MenuItem
  value="Python"
  sx={{ backgroundColor: "white", color: "green", textDecoration: "line-through" }}
  disabled
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
    }}
  >
    <FaPython style={{ marginRight: 8 }} />
    Python
  </Box>
</MenuItem>
<MenuItem
  value="MySQL"
  sx={{ backgroundColor: "white", color: "green", textDecoration: "line-through" }}
  disabled
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
    }}
  >
    <FaDatabase style={{ marginRight: 8 }} />
    MySQL
  </Box>
</MenuItem>
<MenuItem
  value="C++"
  sx={{ backgroundColor: "white", color: "green", textDecoration: "line-through" }}
  disabled
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
    }}
  >
    <CPlusPlusIcon />
    C++
  </Box>
</MenuItem>
                </Select>
              </FormControl>
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
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <ImportContactsOutlinedIcon sx={{ marginRight: 1 }} />
                Practice
              </Button>
            </Box>
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
