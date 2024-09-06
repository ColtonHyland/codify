import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface TestCaseProps {
  input: string;
  output: string;
  testNumber: number;
  status: number; // 0 = not run, 1 = passed, -1 = failed
}

export const TestCase: React.FC<TestCaseProps> = ({
  input,
  output,
  testNumber,
  status,
}) => {
  let IconComponent;

  switch (status) {
    case 1:
      IconComponent = CheckCircleOutlineIcon;
      break;
    case -1:
      IconComponent = NotInterestedIcon;
      break;
    default:
      IconComponent = RadioButtonUncheckedIcon;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={1}
      border={1}
      borderColor="grey.300"
      borderRadius={2}
      mb={1}
      sx={{ width: "100%" }}
    >
      <IconComponent sx={{ mr: 1, fontSize: "1.5rem" }} />

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
