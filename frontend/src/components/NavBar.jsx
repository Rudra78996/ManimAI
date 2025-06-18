import { AppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useContext } from "react";
import { data, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NavBar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedIn, backendUrl} = useContext(AppContext);
  const logout = async () => {
    try{
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl+"/api/auth/logout");
      data.success&&setIsLoggedIn(false);
      data.success&&setUserData(false);
      navigate("/");
    }catch (error) {
      toast.error(error.message);
      console.error("Logout failed:", error);
    }
  }
  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp");
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to send verification email.");
      }
    } catch (error) {
      toast.error(error.message);    
    }
  }
  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 z-30">
      <div
        className="text-2xl font-extrabold tracking-tight cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        ManimAI
      </div>
      <div>
        {userData ? (
          <div className="relative group flex items-center">
            <div
              tabIndex={0}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-lg font-semibold cursor-pointer select-none outline-none focus:ring-2 focus:ring-blue-400"
            >
              {userData.name[0].toUpperCase()}
            </div>
            <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-lg min-w-[160px] z-20 hidden group-hover:block group-focus-within:block">
              <ul className="py-2">
                {!userData.isAccountVerified && (
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition" onClick={sendVerificationOtp}>
                    Verify Email
                  </li>
                )}
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                  onClick={logout}
                >
                  Log out
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition font-medium shadow"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
