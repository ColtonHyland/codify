import React from 'react';

interface ButtonProps {
  onApiResponse: (data: any) => void;
}

export const APIButton: React.FC<ButtonProps> = ({ onApiResponse }) => {
  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/questions/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categories: ['SQL', 'Aggregation'],
          difficulty: 'Easy'
        })
      });
      const data = await response.json();
      onApiResponse(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <button onClick={handleClick}>Generate Question</button>
  );
};
