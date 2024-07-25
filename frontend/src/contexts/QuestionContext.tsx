import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface Question {
  id: number;
  problem_id: string;
  title: string;
  difficulty: string;
  categories: string[];
  description: string;
  design: string;
  design_solution: string;
  task: string;
  example_input: string;
  example_output: string;
  explanation: string;
  explanation_answer: string;
  input_constraints: string;
  tests: string;
  hints: string;
  tags: string;
  notes: string;
}

interface QuestionContextType {
  questions: Question[];
  fetchQuestions: () => void;
  fetchQuestionById: (id: number) => Promise<Question | null>;
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

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/questions/list_questions/"
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchQuestionById = async (id: number): Promise<Question | null> => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/questions/get_question/${id}/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching question:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <QuestionContext.Provider
      value={{ questions, fetchQuestions, fetchQuestionById }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
