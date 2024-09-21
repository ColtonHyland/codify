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
import QuestionField from "../components/question/questionfield/QuestionField";
import MyEditor from "../components/editor/Editor";
import { useQuestionContext } from "../contexts/QuestionContext";
import { Question } from "../types";
import { executeJavaScriptCode } from "../services/codeExecute";
import BackButton from "../components/utils/BackButton";
const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchQuestionById, userProgress, updateProgress } = useQuestionContext();
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("language");
  const [passedTests, setPassedTests] = useState<string[]>([]);
  const [failedTests, setFailedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (id) {
        try {
          const fetchedQuestion = await fetchQuestionById(parseInt(id, 10));
          if (fetchedQuestion) {
            setQuestion(fetchedQuestion);
            setLanguage(fetchedQuestion.language);

            const progress = userProgress[id];
            console.log("Current question progress:", progress?.status || "Not Attempted");
            if (progress) {
              setCode(progress.code_progress || fetchedQuestion.design);
              setPassedTests(progress.passed_tests || []);
              setFailedTests(progress.failed_tests || []);
            } else {
              setCode(fetchedQuestion.design);
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

  useEffect(() => {
    console.log("Fetched question design:", question?.design);
    console.log("Fetched question test results:", userProgress[question?.id || ""]);
  }, [question]);

  const handleSubmit = async () => {
    setTabIndex(1);
    setFailedTests([]);
    setPassedTests([]);
    setLoading(true);

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

        setLoading(false);

        const allTestsPassed = data.failed_tests.length === 0;
        if (allTestsPassed) {
          console.log("All test cases passed!");
          updateProgress(question.id, code, data.passed_tests, []); // Mark as 'Completed'
        } else {
          setFailedTests(data.failed_tests || []);
          updateProgress(question.id, code, data.passed_tests, data.failed_tests); // Mark as 'In Progress'
        }

        setPassedTests(data.passed_tests || []);
      } catch (error) {
        console.error("Error executing code", error);
        setFailedTests([...failedTests, "Execution Error"]);
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    if (question && question.design) {
      setCode(question.design);
      setPassedTests([]);
      setFailedTests([]);
      updateProgress(question.id, question.design, [], []);
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
          height: "calc(100vh - 80px)",
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
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <QuestionField
                jsonText={JSON.stringify(question)}
                passedTests={passedTests}
                failedTests={failedTests}
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
                loading={loading}
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
                    height: "100%",
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