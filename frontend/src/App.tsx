import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QuestionProvider } from "./contexts/QuestionContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import QuestionsPage from "./pages/QuestionsPage";
import QuestionPage from "./pages/QuestionPage";
import { GenerateQuestionPage } from "./pages/GenerateQuestionPage";
import TestPage from "./pages/TestPage";
import ProtectedRoute from "./utils/ProtectedRoute";

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Primary green
      light: '#81c784', // Lighter shade of green
      dark: '#388e3c', // Darker shade of green
    },
    secondary: {
      main: '#66bb6a', // Secondary green
      light: '#a5d6a7', // Lighter secondary green
      dark: '#2e7d32', // Darker secondary green
    },
  },
});

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <QuestionProvider>
          <LanguageProvider>
            <ThemeProvider theme={theme}>
              <Navbar />
              <Routes>
                <Route path="/login" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/" element={<Home />} />
                <Route 
                  path="/questions" 
                  element={
                    <ProtectedRoute element={<QuestionsPage />} />
                  } 
                />
                <Route 
                  path="/questions/:id" 
                  element={
                    <ProtectedRoute element={<QuestionPage />} />
                  } 
                />
                <Route 
                  path="/questions/new" 
                  element={
                    <ProtectedRoute element={<GenerateQuestionPage />} />
                  } 
                />
              </Routes>
            </ThemeProvider>
          </LanguageProvider>
        </QuestionProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
