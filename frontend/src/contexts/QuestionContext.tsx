import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from "react";
import axios from "axios";
import { Question } from "../types";

interface QuestionContextType {
  questions: Question[];
  userProgress: { [key: string]: any };
  fetchQuestions: () => void;
  fetchQuestionById: (id: number) => Promise<Question | null>;
  generateQuestion: (
    difficulty: string,
    categories: string[],
    onApiResponse: (data: any) => void
  ) => void;
  updateProgress: (
    questionId: string,
    code: string,
    passedTests: string[],
    failedTests: string[]
  ) => Promise<void>;
}

const QuestionContext = createContext<QuestionContextType | undefined>(
  undefined
);

export const useQuestionContext = (): QuestionContextType => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error(
      "useQuestionContext must be used within a QuestionProvider"
    );
  }
  return context;
};

interface QuestionProviderProps {
  children: ReactNode;
}

export const QuestionProvider: React.FC<QuestionProviderProps> = ({
  children,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userProgress, setUserProgress] = useState<{ [key: string]: any }>({});
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsFetching(true);
      const token = localStorage.getItem("token");

      // Fetch questions
      const questionsResponse = await axios.get(
        "http://localhost:8000/api/questions/list_questions/",
        { headers: { Authorization: `Token ${token}` } }
      );
      setQuestions(questionsResponse.data);

      // Fetch user progress
      const progressResponse = await axios.get(
        "http://localhost:8000/api/user-progress/",
        { headers: { Authorization: `Token ${token}` } }
      );

      const progressData = progressResponse.data.reduce(
        (acc: { [key: string]: any }, progress: any) => {
          acc[progress.question] = progress;
          return acc;
        },
        {}
      );
      setUserProgress(progressData);
    } catch (error) {
      console.error("Error fetching questions or user progress:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const fetchQuestionById = async (id: number): Promise<Question | null> => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/questions/get_question/${id}/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      console.log("Fetched question response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching question:", error);
      return null;
    }
  };

  const generateQuestion = async (
    difficulty: string,
    categories: string[],
    onApiResponse: (data: any) => void
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/questions/generate/",
        { categories, difficulty },
        { headers: { Authorization: `Token ${token}` } }
      );
      const data = response.data;
      onApiResponse(data);
      fetchQuestions();
    } catch (error) {
      console.error("Error generating question:", error);
    }
  };

  const updateProgress = async (
    questionId: string,
    code: string,
    passedTests: string[],
    failedTests: string[]
  ) => {
    console.log("updateProgress called with:", { questionId, code, passedTests, failedTests });

    try {
      const token = localStorage.getItem("token");
      console.log("Sending data to update_progress:", {
        question_id: questionId,
        code,
        passed_tests: passedTests,
        failed_tests: failedTests,
      });

      const response = await axios.post(
        "http://localhost:8000/api/user-progress/update_progress/",

        {
          question_id: questionId,
          code,
          passed_tests: passedTests,
          failed_tests: failedTests,
        },
        { headers: { Authorization: `Token ${token}` } }
      );

      if (response.status === 200) {
        console.log("Progress successfully saved");
      } else {
        console.error("Failed to save progress:", response.statusText);
      }
    } catch (error: unknown) {
      // Use a type guard to check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        // Log detailed Axios error information
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error headers:", error.response?.headers);
      } else {
        // Handle generic errors
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return (
    <QuestionContext.Provider
      value={{
        questions,
        userProgress,
        fetchQuestions,
        fetchQuestionById,
        generateQuestion,
        updateProgress,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
