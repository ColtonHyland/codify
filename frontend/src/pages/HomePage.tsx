import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import MemoryIcon from '@mui/icons-material/Memory';
import BugReportIcon from '@mui/icons-material/BugReport';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import TerminalIcon from '@mui/icons-material/Terminal';
import LaptopIcon from '@mui/icons-material/Laptop';
import CloudIcon from '@mui/icons-material/Cloud';
import BuildIcon from '@mui/icons-material/Build';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const icons = [
    <CodeIcon key="code" />,
    <MemoryIcon key="memory" />,
    <BugReportIcon key="bug" />,
    <DeveloperModeIcon key="devMode" />,
    <TerminalIcon key="terminal" />,
    <LaptopIcon key="laptop" />,
    <CloudIcon key="cloud" />,
    <BuildIcon key="build" />,
  ];

  return (
    <>
      <Container
        sx={{
          height: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
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
    </Container>
    <div className="matrix">
        {Array.from({ length: 100 }).map((_, index) => (
          <Box
            key={index}
            className="icon"
            sx={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
            }}
          >
            {icons[index % icons.length]}
          </Box>
        ))}
      </div>
    </>
  );
};

export default Home;
