// src/pages/QuestionPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper } from '@mui/material';
import { QuestionField } from '../components/question/QuestionField';
import { useQuestionContext } from '../contexts/QuestionContext';
import { Question } from '../types';

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchQuestionById } = useQuestionContext();
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (id) {
        const fetchedQuestion = await fetchQuestionById(parseInt(id, 10));
        if (fetchedQuestion) {
          setQuestion({
            ...fetchedQuestion,
            id: fetchedQuestion.id.toString()
          });
        }
      }
    };

    fetchQuestion();
  }, [id, fetchQuestionById]);

  if (!question) {
    return (
      <Container>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {question.title}
      </Typography>
      <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
        <QuestionField jsonText={JSON.stringify(question)} />
      </Paper>
    </Container>
  );
};

export default QuestionPage;
