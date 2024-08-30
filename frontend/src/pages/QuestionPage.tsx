import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper, Grid, Button } from "@mui/material";
import { QuestionField } from "../components/question/QuestionField";
import MyEditor from "../components/editor/Editor";
import { useQuestionContext } from "../contexts/QuestionContext";
import { Question } from "../types";
import { executeJavaScriptCode } from "../services/codeExecute";

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchQuestionById } = useQuestionContext();
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("language");
  const [passedTests, setPassedTests] = useState<string[]>([]);
  const [failedTests, setFailedTests] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (id) {
        try {
          const fetchedQuestion = await fetchQuestionById(parseInt(id, 10));
          if (fetchedQuestion) {
            setQuestion({
              ...fetchedQuestion,
              id: fetchedQuestion.id.toString(),
            });
            setLanguage(fetchedQuestion.language);
            setCode(fetchedQuestion.design);
          } else {
            setError("Question not found");
          }
        } catch (e) {
          setError("An error occurred while fetching the question");
        }
      }
    };

    fetchQuestion();
  }, [id]);

  const handleSubmit = async () => {
    if (question) {
      try {
        const parsedTests = JSON.parse(question.tests || "[]").map((test: any) => ({
          input: test.input,
          expected_output: test.output,
        }));

        let data;
        if (language === "javascript") {
          data = await executeJavaScriptCode({
            code,
            test_cases: parsedTests,
          });
        } else {
          console.error(`Execution for ${language} is not yet implemented.`);
          return;
        }

        console.log("Submission result:", data);
        setPassedTests(data.passed_tests || []);
        setFailedTests(data.failed_tests || []);
      } catch (error) {
        console.error("Error executing code", error);
      }
    }
  };

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!question) {
    return (
      <Container>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <QuestionField
            jsonText={JSON.stringify(question)}
            passedTests={passedTests}
            failedTests={failedTests}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
            <MyEditor language={language} code={code} setCode={setCode} />
          </Paper>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default QuestionPage;
