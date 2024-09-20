import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Question } from "../../types";
import { useQuestionContext } from "../../contexts/QuestionContext";

export interface QuestionTableProps {
  questions: Question[];
}

const QuestionTable: React.FC<QuestionTableProps> = ({ questions }) => {
  const navigate = useNavigate();
  const { userProgress } = useQuestionContext();

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

  const rows = useMemo(
    () =>
      questions.map((question, index) => (
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
            {userProgress[question.id]?.status || "Not Attempted"}
          </TableCell>
        </TableRow>
      )),
    [questions, userProgress]
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        margin: "20px auto",
        border: "2px solid green",
        borderRadius: "10px",
        maxWidth: "90%",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e0ffe0" }}>
            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
              No.
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
              Title
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
              Categories
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
              Difficulty
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
              Progress
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuestionTable;
