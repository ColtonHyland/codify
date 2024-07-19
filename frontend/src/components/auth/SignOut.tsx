import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const SignOut: React.FC = () => {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <Button onClick={handleSignOut} variant="contained" color="secondary">
      Sign Out
    </Button>
  );
};

export default SignOut;
