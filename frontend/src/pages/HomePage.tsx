import React from "react";
import { Button, Container, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CodeIcon from "@mui/icons-material/Code";
import MemoryIcon from "@mui/icons-material/Memory";
import BugReportIcon from "@mui/icons-material/BugReport";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import TerminalIcon from "@mui/icons-material/Terminal";
import LaptopIcon from "@mui/icons-material/Laptop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faBug,
  faLaptopCode,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const iconSize = 30;

  const muiIcons = [
    <CodeIcon style={{ fontSize: iconSize }} />,
    <MemoryIcon style={{ fontSize: iconSize }} />,
    <BugReportIcon style={{ fontSize: iconSize }} />,
    <DeveloperModeIcon style={{ fontSize: iconSize }} />,
    <TerminalIcon style={{ fontSize: iconSize }} />,
    <LaptopIcon style={{ fontSize: iconSize }} />,
  ];

  const awesomeIcons = [
    <FontAwesomeIcon icon={faCode} style={{ fontSize: 20, transform: 'translateY(5px)' }} />,
    <FontAwesomeIcon icon={faBug} style={{ fontSize: 20, transform: 'translateY(5px)' }} />,
    <FontAwesomeIcon icon={faLaptopCode} style={{ fontSize: 20, transform: 'translateY(5px)' }} />,
    <FontAwesomeIcon icon={faDatabase} style={{ fontSize: 20, transform: 'translateY(5px)' }} />,
  ];

  const allIcons = [...muiIcons, ...awesomeIcons];

  const renderIconRows = (numRows: number) => {
    return Array.from({ length: numRows }).map((_, rowIndex) => (
      <div key={rowIndex} className="row">
        {Array.from({ length: 100 }).map((_, iconIndex) => (
          <div key={iconIndex} className="icon">
            {allIcons[iconIndex % allIcons.length]}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <>
      <div className="matrix">{renderIconRows(45)}</div>

      {/* Main MUI content */}
      <Container
        sx={{
          height: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1, // Ensure content is on top of background
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: '20px',
            border: '2px solid green',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'green' }}
          >
            Ready to level up your coding skills?
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'grey.700', marginBottom: '20px' }}
          >
            Practice coding challenges or generate a new one to start!
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                color: 'white',
                backgroundColor: 'green',
                border: '2px solid green',
                '&:hover': {
                  backgroundColor: 'black',
                },
              }}
              onClick={() => navigate('/questions')}
            >
              Start Practicing
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: 'green',
                backgroundColor: 'white',
                border: '2px solid green',
                '&:hover': {
                  backgroundColor: 'green',
                  color: 'white',
                },
              }}
              onClick={() => navigate('/questions/new')}
            >
              Generate a Question
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Home;
