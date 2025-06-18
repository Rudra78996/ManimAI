import axios from "axios";
import React, { use, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
const EmailVerify = () => {
  const { backendUrl, isLoggedIn, userData, setUserData, getUserData } =
    React.useContext(AppContext);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const inputRef = React.useRef([]);
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && e.target.value.length === 0) {
      inputRef.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text");
    const pasteArray = pastedData.split("").slice(0, 6);
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
        if (index < inputRef.current.length - 1) {
          inputRef.current[index + 1].focus();
        }
      }
    });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const otp = inputRef.current.map((input) => input.value).join("");
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred while submitting the form.");
    }
  };
   useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedIn, userData, navigate]);
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center h-screen space-y-4"
      >
        <h1>Email Verify OTP</h1>
        <p>Enter the 6 digit code sent to your email id</p>
        <div onPaste={handlePaste} className="flex space-x-2">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                required
                className="w-10 h-10 text-center text-2xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
