import React from "react";
import { FormControl, Select, MenuItem, Box } from "@mui/material";
import { FaJs, FaPython, FaDatabase } from "react-icons/fa";
import CPlusPlusIcon from "../../assets/icons/CPlusPlusIcon";
import { useLanguage } from "../../contexts/LanguageContext";

const LanguageSelector: React.FC = () => {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  return (
    <FormControl
      variant="outlined"
      sx={{
        minWidth: 150,
        marginRight: 2,
        "& .MuiOutlinedInput-root": {
          color: "green",
          backgroundColor: "white",
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
          borderRadius: "8px",
          "& .MuiPaper-root": {
            backgroundColor: "green",
            borderRadius: "8px",
          },
        }}
      >
        <MenuItem value="JavaScript" sx={{ backgroundColor: "white", color: "green" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FaJs style={{ marginRight: 8 }} />
            JavaScript
          </Box>
        </MenuItem>
        <MenuItem value="Python" sx={{ backgroundColor: "white", color: "green", textDecoration: "line-through" }} disabled>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FaPython style={{ marginRight: 8 }} />
            Python
          </Box>
        </MenuItem>
        <MenuItem value="MySQL" sx={{ backgroundColor: "white", color: "green", textDecoration: "line-through" }} disabled>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FaDatabase style={{ marginRight: 8 }} />
            MySQL
          </Box>
        </MenuItem>
        <MenuItem value="C++" sx={{ backgroundColor: "white", color: "green", textDecoration: "line-through" }} disabled>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CPlusPlusIcon />
            C++
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
