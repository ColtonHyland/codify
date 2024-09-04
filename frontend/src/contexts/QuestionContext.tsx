import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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
  ) => Promise<void>; // Add the updateProgress method to the interface
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

  const fetchQuestions = async () => {
    try {
      if (!isFetching) {
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
      }
    } catch (error) {
      console.error("Error fetching questions or user progress:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchQuestionById = async (id: number): Promise<Question | null> => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/questions/get_question/${id}/`,
        { headers: { Authorization: `Token ${token}` } }
      );
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
    try {
      const response = await axios.post('/api/user-progress/update_progress/', {
        question_id: questionId,
        code,
        passed_tests: passedTests,
        failed_tests: failedTests,
      });

      // Fetch the updated progress after submission
      fetchQuestions(); // Optionally, fetch the updated progress to update UI
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <QuestionContext.Provider
      value={{
        questions,
        userProgress,
        fetchQuestions,
        fetchQuestionById,
        generateQuestion,
        updateProgress, // Include updateProgress here
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
