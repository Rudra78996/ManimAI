import React, { useContext } from "react";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
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
