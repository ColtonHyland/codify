import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper, Grid, Button } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import QuestionField from "../components/question/QuestionField";
import MyEditor from "../components/editor/Editor";
import { useQuestionContext } from "../contexts/QuestionContext";
import { Question } from "../types";
import { executeJavaScriptCode } from "../services/codeExecute";

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchQuestionById, userProgress } = useQuestionContext();
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [initialCode, setInitialCode] = useState("");
  const [language, setLanguage] = useState("language");
  const [passedTests, setPassedTests] = useState<string[]>([]);
  const [failedTests, setFailedTests] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (id) {
        try {
          const fetchedQuestion = await fetchQuestionById(parseInt(id, 10));
          if (fetchedQuestion) {
            setQuestion(fetchedQuestion);
            setLanguage(fetchedQuestion.language);
  
            // Ensure that progress is loaded correctly
            const progress = userProgress[id];
            if (progress && progress.code_progress) {
              setCode(progress.code_progress); // Load saved progress
            } else {
              setCode(fetchedQuestion.design); // Load initial design if no progress
              setInitialCode(fetchedQuestion.design);
            }
          } else {
            setError("Question not found");
          }
        } catch (e) {
          setError("An error occurred while fetching the question");
        }
      }
    };
  
    fetchQuestion();
  }, [id, userProgress, fetchQuestionById]);

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
  
        // If there's an error in the response, treat it as a failed test
        if (data.error) {
          setFailedTests([...data.failed_tests, "Error"]);
        } else {
          setFailedTests(data.failed_tests || []);
        }
  
        setPassedTests(data.passed_tests || []);
      } catch (error) {
        console.error("Error executing code", error);
        setFailedTests([...failedTests, "Execution Error"]);
      }
    }
  };
  
  const handleReset = () => {
    setCode(initialCode);
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
          <Grid container spacing={2}>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
                startIcon={<ReplayIcon />}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default QuestionPage;
