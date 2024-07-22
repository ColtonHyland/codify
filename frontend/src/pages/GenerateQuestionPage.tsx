import React, { useState } from 'react';
import { APIButton } from './APIButton';
import { JSONTextField } from './JSONTextField';
import { DropdownSelector } from './DropdownSelector';

export const GenerateQuestionPage: React.FC = () => {
  const [responseData, setResponseData] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string>('Easy');
  const [category, setCategory] = useState<string>('SQL');

  const handleApiResponse = (data: any) => {
    setResponseData(JSON.stringify(data, null, 2)); // Format JSON with 2-space indentation
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Generate Question</h1>
      <DropdownSelector 
        onDifficultyChange={setDifficulty} 
        onCategoryChange={setCategory} 
      />
      <APIButton 
        onApiResponse={handleApiResponse} 
        difficulty={difficulty} 
        category={category} 
      />
      {responseData && <JSONTextField jsonText={responseData} />}
    </div>
  );
};