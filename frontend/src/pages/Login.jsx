import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext.jsx";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData, isLoggedIn } =
    useContext(AppContext);
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          await getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          await getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="mb-6 text-gray-500 text-center">
          {state === "Sign Up"
            ? "Create Your Account"
            : "Login to your Account"}
        </p>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          {state === "Sign Up" && (
            <div>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full Name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email id"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {state === "Login" && (
            <p
              className="text-sm text-blue-600 hover:underline cursor-pointer text-right"
              onClick={() => navigate("/reset-password")}
            >
              Forgot password?
            </p>
          )}
          <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow">
            {state}
          </Button>
        </form>
        {state === "Sign Up" ? (
          <p className="mt-6 text-center text-gray-600">
            Already Have an Account?{" "}
            <Button
              type="button"
              variant="link"
              className="text-blue-600 hover:underline p-0 h-auto min-w-0"
              onClick={() => setState("Login")}
            >
              Login Here
            </Button>
          </p>
        ) : (
          <p className="mt-6 text-center text-gray-600">
            Don't Have an Account?{" "}
            <Button
              type="button"
              variant="link"
              className="text-blue-600 hover:underline p-0 h-auto min-w-0"
              onClick={() => setState("Sign Up")}
            >
              Signup
            </Button>
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
