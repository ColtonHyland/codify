import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Box,
  Typography,
} from "@mui/material";
import { Question } from "../../types";
import { useQuestionContext } from "../../contexts/QuestionContext";
import { visuallyHidden } from "@mui/utils";

export interface QuestionTableProps {
  questions: Question[];
}

type Order = 'asc' | 'desc';

const QuestionTable: React.FC<QuestionTableProps> = ({ questions }) => {
  const navigate = useNavigate();
  const { userProgress } = useQuestionContext();

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Question>('id');

  const handleRequestSort = (property: keyof Question) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => {
      if (orderBy === 'difficulty') {
        // Custom difficulty sorting (Easy -> Medium -> Hard)
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        const aDifficulty = difficultyOrder[a.difficulty] || 0;
        const bDifficulty = difficultyOrder[b.difficulty] || 0;
        return order === 'asc' ? aDifficulty - bDifficulty : bDifficulty - aDifficulty;
      }
      const aValue = a[orderBy] as string | number;
      const bValue = b[orderBy] as string | number;
      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [questions, order, orderBy]);

  const handleRowClick = (id: string) => {
    navigate(`/questions/${id}`);
  };

  const difficultyColour = (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "green";
      case "Medium":
        return "orange";
      case "Hard":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        height: '100%',
        overflowY: 'auto',
        margin: "20px auto",
        border: "2px solid green",
        borderRadius: "10px",
        maxWidth: "90%",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        flexGrow: 1,
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e0ffe0" }}>
            {/* Column: ID */}
            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
              <TableSortLabel
                active={orderBy === 'id'}
                direction={orderBy === 'id' ? order : 'asc'}
                onClick={() => handleRequestSort('id')}
              >
                No.
                {orderBy === 'id' ? (
                  <span style={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
            
            {/* Column: Title */}
            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
              <TableSortLabel
                active={orderBy === 'title'}
                direction={orderBy === 'title' ? order : 'asc'}
                onClick={() => handleRequestSort('title')}
              >
                Title
                {orderBy === 'title' ? (
                  <span style={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>

            {/* Column: Categories (no sorting) */}
            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
              Categories
            </TableCell>

            {/* Column: Difficulty */}
            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
              <TableSortLabel
                active={orderBy === 'difficulty'}
                direction={orderBy === 'difficulty' ? order : 'asc'}
                onClick={() => handleRequestSort('difficulty')}
              >
                Difficulty
                {orderBy === 'difficulty' ? (
                  <span style={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>

            {/* Column: Progress (no sorting) */}
            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
              Progress
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {questions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ height: '100%' }}>
                <Box
                  sx={{
                    height: '100%', // Adjust based on table height
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body1" gutterBottom>
                    No questions yet.
                  </Typography>
                  <Typography variant="h5">
                    <Link to="/questions/new" style={{ textDecoration: 'none', color: 'green' }}>
                      Generate some!
                    </Link>
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            sortedQuestions.map((question, index) => (
              <TableRow
                key={question.id}
                onClick={() => handleRowClick(question.id)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: index % 2 === 0 ? "white" : "#f0fff0",
                  "&:hover": {
                    backgroundColor: "#e0f7e0",
                  },
                }}
              >
                <TableCell>{question.id}</TableCell>
                <TableCell>{question.title}</TableCell>
                <TableCell>{question.categories.join(", ")}</TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: difficultyColour(question.difficulty) }}
                >
                  {question.difficulty}
                </TableCell>
                <TableCell>
                  {userProgress[question.id]?.status}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuestionTable;
