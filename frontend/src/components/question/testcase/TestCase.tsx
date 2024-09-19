import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CircularProgress from "@mui/material/CircularProgress";
import { red, green } from "@mui/material/colors";

interface TestCaseProps {
  input: string;
  output: string;
  testNumber: number;
  status: number;  // 0 = not run, 1 = passed, -1 = failed
  loading: boolean;
}

export const TestCase: React.FC<TestCaseProps> = ({
  input,
  output,
  testNumber,
  status,
  loading,
}) => {
  let IconComponent;
  let borderColor;
  let iconColor;

  if (loading) {
    IconComponent = CircularProgress;
    borderColor = "grey.300";
    iconColor = "inherit"; 
  } else {
    switch (status) {
      case 1:
        IconComponent = CheckCircleOutlineIcon;
        borderColor = green[500];
        iconColor = green[500];
        break;
      case -1:
        IconComponent = NotInterestedIcon;
        borderColor = red[500];
        iconColor = red[500];
        break;
      default:
        IconComponent = RadioButtonUncheckedIcon;
        borderColor = "grey.300";
        iconColor = "inherit";
    }
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={1}
      border={1}
      borderColor={borderColor}
      borderRadius={2}
      mb={1}
      sx={{ width: "100%" }}
    >
      <IconComponent sx={{ mr: 1, fontSize: "1.5rem", color: iconColor }} />

      <Typography variant="body1" sx={{ flexGrow: 1 }}>
        Test #{testNumber}
      </Typography>

      <Typography
        variant="subtitle2"
        sx={{ mx: 1, fontFamily: "monospace", fontSize: "0.875rem" }}
      >
        {input} {'=>'}
      </Typography>

      <Typography
        variant="subtitle2"
        sx={{ mx: 1, fontFamily: "monospace", fontSize: "0.875rem" }}
      >
        {output}
      </Typography>
    </Box>
  );
};
