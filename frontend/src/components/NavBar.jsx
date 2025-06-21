import { AppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useContext } from "react";
import { data, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";

const NavBar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedIn, backendUrl } =
    useContext(AppContext);
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.error("Logout failed:", error);
    }
  };
  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to send verification email.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="top-0 w-full">
      <div className="h-20 flex justify-between mx-4 sm:mx-12 items-center mb-4 sm:mb-12">
        <img
          src="/logo.png"
          alt="ManimAI"
          className=" h-12 dark:invert cursor-pointer"
          onClick={() => navigate("/")}
        />
        {/* Desktop */}
        <MainNav />

        {/* Mobile  */}
        <MobileNav />
      </div>
    </nav>
  );
};

export default NavBar;
