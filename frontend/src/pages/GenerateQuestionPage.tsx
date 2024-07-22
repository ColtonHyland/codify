import React, { useState } from 'react';
import { GenerateButton } from '../components/question/GenerateButton';
import { TextField } from '../components/question/TextField';
import { DropdownSelector } from '../components/question/DropdownSelector';
import { Container, Typography, Box } from '@mui/material';

export const GenerateQuestionPage: React.FC = () => {
  const [responseData, setResponseData] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string>('Easy');
  const [category, setCategory] = useState<string>('SQL');

  const handleApiResponse = (data: any) => {
    setResponseData(JSON.stringify(data, null, 2)); // Format JSON with 2-space indentation
  };

  return (
    <Container maxWidth="md" sx={{ padding: '20px' }}>
      <Box mb={2}>
        <DropdownSelector 
          onDifficultyChange={setDifficulty} 
          onCategoryChange={setCategory} 
        />
      </Box>
      <Box mb={2}>
        <GenerateButton 
          onApiResponse={handleApiResponse} 
          difficulty={difficulty} 
          category={category} 
        />
      </Box>
      {responseData && <TextField jsonText={responseData} />}
    </Container>
  );
};
