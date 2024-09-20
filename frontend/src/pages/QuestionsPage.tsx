import React, { useEffect, useState } from "react";
import { useQuestionContext } from "../contexts/QuestionContext";
import QuestionTable from "../components/question/QuestionTable";
import { Button, Container, Typography, CircularProgress } from "@mui/material";
import BackButton from "../components/utils/BackButton";

const QuestionsPage: React.FC = () => {
  const { questions } = useQuestionContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (questions.length > 0) {
      setLoading(false);
    }
  }, [questions]);

  // if (error) {
  //   return (
  //     <Container>
  //       <Typography variant="h6" color="error">
  //         {error}
  //       </Typography>
  //       <Button variant="outlined" onClick={() => window.location.reload()}>
  //         Try Again
  //       </Button>
  //     </Container>
  //   );
  // }

  return (
    <>
      <BackButton to="/" />
      <Container
        sx={{ height: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}
      >
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
