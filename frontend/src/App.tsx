import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import QuestionsPage from "./pages/QuestionsPage";
import QuestionPage from "./pages/QuestionPage";
import { GenerateQuestionPage } from "./pages/GenerateQuestionPage";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/questions/:id" element={<QuestionPage />} />
          <Route path="/questions/new" element={<GenerateQuestionPage />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
