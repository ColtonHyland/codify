import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QuestionTable, { Question } from '../components/question/QuestionTable';
import { Container, Typography } from '@mui/material';

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/questions/list_questions/');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Questions
      </Typography>
      <QuestionTable questions={questions} />
    </Container>
  );
};

export default QuestionsPage;
