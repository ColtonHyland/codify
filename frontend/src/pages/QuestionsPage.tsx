import React, { useEffect, useState } from 'react';
import { useQuestionContext } from '../contexts/QuestionContext';
import QuestionTable from '../components/question/QuestionTable';
import { Container, Typography, CircularProgress } from '@mui/material';
import BackButton from "../components/utils/BackButton";

const QuestionsPage: React.FC = () => {
  const { questions } = useQuestionContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (questions.length > 0) {
      setLoading(false); 
    }
  }, [questions]);

  return (
    <>
      <BackButton to='/'/>
      <Container>
        {loading ? (
          <CircularProgress />
        ) : (
          <QuestionTable questions={questions} />
        )}
      </Container>
    </>
  );
};

export default QuestionsPage;
