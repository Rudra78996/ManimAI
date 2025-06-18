import { AppContext } from "@/context/AppContext";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [otp, setOtp] = React.useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = React.useState(false);
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const navigator = useNavigate();

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (er) {
      toast.error(er.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpValue = inputRef.current.map((input) => input.value).join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setOtp(otpValue);
    setIsOtpSubmitted(true);
  };
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );
      if (data.success) {
        toast.success(data.message);
        navigator("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {!isEmailSent && (
          <form onSubmit={onSubmitEmail} className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600">
                Enter your registered email address
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
                        transition duration-200 ease-in-out transform hover:scale-[1.02]
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {" "}
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </form>
        )}

        {!isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitOtp} className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Enter OTP
              </h1>
              <p className="text-gray-600 mb-6">
                Enter the 6-digit code sent to your email
              </p>
            </div>
            <div
              onPaste={handlePaste}
              className="flex justify-center space-x-3 mb-6"
            >
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    required
                    className="w-12 h-12 text-center text-2xl font-semibold border border-gray-300 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200"
                    ref={(e) => (inputRef.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
                      transition duration-200 ease-in-out transform hover:scale-[1.02]
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Verify OTP
            </button>
          </form>
        )}

        {isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitNewPassword} className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Set New Password
              </h1>
              <p className="text-gray-600">Enter your new password</p>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
                        transition duration-200 ease-in-out transform hover:scale-[1.02]
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Reset Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
