import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Paper } from '@mui/material';
import { QuestionField } from '../components/question/QuestionField';

interface Question {
  id: number;
  problem_id: string;
  title: string;
  difficulty: string;
  categories: string[];
  description: string;
  design: string;
  design_solution: string;
  task: string;
  example_input: string;
  example_output: string;
  explanation: string;
  explanation_answer: string;
  input_constraints: string;
  tests: string;
  hints: string;
  tags: string;
  notes: string;
}

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`/api/questions/get_question/${id}/`);
        setQuestion(response.data);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, [id]);

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
