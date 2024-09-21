import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default Home;
