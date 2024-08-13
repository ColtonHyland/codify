import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QuestionProvider } from "./contexts/QuestionContext";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import QuestionsPage from "./pages/QuestionsPage";
import QuestionPage from "./pages/QuestionPage";
import { GenerateQuestionPage } from "./pages/GenerateQuestionPage";
import TestPage from "./pages/TestPage";
import ProtectedRoute from "./utils/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <QuestionProvider>
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
        </QuestionProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
