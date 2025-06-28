import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import Chat from "./pages/Chat";
import ProtectedRoute from "./pages/ProtectedRoute";
import SignInPage from "./pages/SignIn"; 
import Media from "./pages/Media";

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
        <Route 
          path="/media"
          element={
            <ProtectedRoute>
              <Media />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
