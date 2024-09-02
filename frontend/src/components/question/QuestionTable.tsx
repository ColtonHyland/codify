import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Question } from '../../types';
import { useQuestionContext } from '../../contexts/QuestionContext';

export interface QuestionTableProps {
  questions: Question[];
}

const QuestionTable: React.FC<QuestionTableProps> = ({ questions }) => {
  const navigate = useNavigate();
  const { userProgress } = useQuestionContext();

  const handleRowClick = (id: string) => {
    navigate(`/questions/${id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Categories</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Progress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id} onClick={() => handleRowClick(question.id)}>
              <TableCell>{question.id}</TableCell>
              <TableCell>{question.title}</TableCell>
              <TableCell>{question.categories.join(', ')}</TableCell>
              <TableCell>{question.difficulty}</TableCell>
              <TableCell>
                {userProgress[question.id]?.status || 'Not Attempted'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuestionTable;
