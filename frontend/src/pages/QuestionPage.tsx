import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper, Grid, Button } from "@mui/material";
import { QuestionField } from "../components/question/QuestionField";
import Editor from "../components/editor/Editor";
import { useQuestionContext } from "../contexts/QuestionContext";
import { Question, languageMap } from "../types";
import { executeCode } from "../services/codeExecute";

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchQuestionById } = useQuestionContext();
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [language, setLanguage] = useState("plaintext");

  useEffect(() => {
    const fetchQuestion = async () => {
      if (id) {
        try {
          const fetchedQuestion = await fetchQuestionById(parseInt(id, 10));
          if (fetchedQuestion) {
            console.log("Fetched question:", fetchedQuestion);
            setQuestion({
              ...fetchedQuestion,
              id: fetchedQuestion.id.toString(),
            });
            setLanguage(
              languageMap[fetchedQuestion.categories[0]] || "plaintext"
            );
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
  
        // Format the inputs for Python code
        const formattedTests = parsedTests.map((test: any) => ({
          ...test,
          input: test.input.replace(/->/g, ',').replace(/\s+/g, '').split(',').join(',\n') // Ensure proper formatting for multi-line inputs
        }));
  
        const data = await executeCode({
          code,
          language,
          test_cases: formattedTests,
        });
  
        console.log("Submission result:", data);
        setResult(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error("Error executing code", error);
        setResult("Error executing code");
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
          <QuestionField jsonText={JSON.stringify(question)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
            <Editor language={language} code={code} setCode={setCode} />
          </Paper>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Paper variant="outlined" sx={{ padding: 2, marginTop: 2 }}>
            <Typography variant="h6">Result</Typography>
            <pre>{result}</pre>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default QuestionPage;
