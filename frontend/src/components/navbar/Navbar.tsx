import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import LogoButton from "./LogoButton";
import LanguageSelector from "./LanguageSelector";
import PracticeButton from "./PracticeButton";
import AuthButtons from "./AuthButton";

const Navbar: React.FC = () => (
  <Box
    sx={{
      flexGrow: 1,
      fontFamily:
        "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'",
    }}
  >
    <AppBar position="static" sx={{ backgroundColor: "green" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <LogoButton />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LanguageSelector />
          <PracticeButton />
        </Box>
        <AuthButtons />
      </Toolbar>
    </AppBar>
  </Box>
);

export default Navbar;
