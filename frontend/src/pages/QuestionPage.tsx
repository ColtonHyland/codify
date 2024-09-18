import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
// Removed ArrowBackIcon import
import QuestionField from "../components/question/questionfield/QuestionField";
import MyEditor from "../components/editor/Editor";
import { useQuestionContext } from "../contexts/QuestionContext";
import { Question } from "../types";
import { executeJavaScriptCode } from "../services/codeExecute";
import BackButton from "../components/utils/BackButton";
const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchQuestionById, userProgress } = useQuestionContext();
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
            setQuestion(fetchedQuestion);
            setLanguage(fetchedQuestion.language);

            // Load saved user progress or the initial design from fetchedQuestion
            const progress = userProgress[id];
            if (progress && progress.code_progress) {
              setCode(progress.code_progress); // Load saved progress
            } else {
              setCode(fetchedQuestion.design); // Load initial design if no progress
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

  // Print the fetched question design
  useEffect(() => {
    console.log("Fetched question design:", question?.design);
  }, [question]);

  const handleSubmit = async () => {
    if (question) {
      try {
        const parsedTests = JSON.parse(question.tests || "[]").map(
          (test: any) => ({
            input: test.input,
            expected_output: test.output,
          })
        );

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
    if (question && question.design) {
      setCode(question.design); // Reset code to the initial design
      console.log("Resetting code to initial design:", question.design);
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

  return (
    <>
      <BackButton to="/questions" />
      <Container
        sx={{
          height: "calc(100vh - 64px)",
          overflow: "hidden",
        }}
      >
        <Grid
          container
          spacing={3}
          alignItems="stretch"
          sx={{ height: "100%" }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            {!question ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "%100",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <QuestionField
                jsonText={JSON.stringify(question)}
                passedTests={passedTests}
                failedTests={failedTests}
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Grid
              container
              spacing={2}
              justifyContent="center"
              sx={{ marginBottom: 1, marginTop: 0 }}
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{
                    color: "white",
                    backgroundColor: "green",
                    border: "2px solid green",
                    "&:hover": {
                      backgroundColor: "black",
                    },
                  }}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<ReplayIcon />}
                  sx={{
                    color: "green",
                    backgroundColor: "white",
                    border: "2px solid green",
                    "&:hover": {
                      backgroundColor: "red",
                      color: "white",
                      border: "2px solid green",
                    },
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
            <Paper
              variant="outlined"
              sx={{
                padding: 2,
                border: "2px solid green",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {!code ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "%100",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <MyEditor language={language} code={code} setCode={setCode} />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default QuestionPage;
