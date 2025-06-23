import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import Chat from "./pages/Chat";
import ProtectedRoute from "./pages/ProtectedRoute";
import SignInPage from "./pages/SignIn"; 

const App = () => {
  return (
    <div>
      <Routes>
       <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
