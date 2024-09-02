import React, { useEffect } from 'react';
import { useQuestionContext } from '../contexts/QuestionContext';
import QuestionTable from '../components/question/QuestionTable';
import { Container, Typography } from '@mui/material';

const QuestionsPage: React.FC = () => {
  const { questions, fetchQuestions } = useQuestionContext();

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <Container>
      {/* <Typography variant="h4" gutterBottom>
        Questions
      </Typography> */}
      <QuestionTable questions={questions} />
    </Container>
  );
};

export default QuestionsPage;
