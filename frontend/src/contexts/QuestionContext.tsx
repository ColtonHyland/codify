import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { Question } from "../types"; 

interface QuestionContextType {
  questions: Question[];
  fetchQuestions: () => void;
  fetchQuestionById: (id: number) => Promise<Question | null>;
  generateQuestion: (
    difficulty: string,
    categories: string[],
    onApiResponse: (data: any) => void
  ) => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

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
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/api/questions/list_questions/",
        { headers: { Authorization: `Token ${token}` } }
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
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

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <QuestionContext.Provider
      value={{ questions, fetchQuestions, fetchQuestionById, generateQuestion }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
