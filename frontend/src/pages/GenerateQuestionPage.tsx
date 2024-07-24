import React, { useState } from 'react';
import { GenerateButton } from '../components/question/GenerateButton';
import { QuestionField } from '../components/question/QuestionField';
import { DropdownSelector } from '../components/question/DropdownSelector';
import { Solution } from '../components/question/Solution';
import { Container, Typography, Box } from '@mui/material';

export const GenerateQuestionPage: React.FC = () => {
  const [responseData, setResponseData] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string>('Easy');
  const [category, setCategory] = useState<string>('SQL');

  const handleApiResponse = (data: any) => {
    setResponseData(JSON.stringify(data, null, 2)); // Format JSON with 2-space indentation
  };

  let solution = '';
  let formattedData = responseData ? JSON.parse(responseData) : null;
  if (formattedData && !formattedData.error) {
    solution = formattedData.solutionTemplate;
    delete formattedData.solutionTemplate;
  }

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
      {responseData && <QuestionField jsonText={responseData} />}
      {solution && <Solution solution={solution} />}
    </Container>
  );
};
