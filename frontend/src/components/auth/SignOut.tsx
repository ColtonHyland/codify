import React from 'react';
import { Button } from '@mui/material';

const SignOut: React.FC = () => {
  const handleSignOut = () => {
    // Handle sign-out logic here
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOut;
