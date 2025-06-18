import React, { useContext } from "react";
import { Button } from "./ui/button";
import { AppContext } from "@/context/AppContext";

const Header = () => {
  const { userData } = useContext(AppContext);
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 mt-24 bg-white rounded-lg shadow-lg w-full max-w-xl">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        Hey {userData ? userData.name : "Developer"}!
      </h1>
      <h2 className="text-xl mb-6 text-gray-600">Welcome to our App</h2>
      <Button className="px-6 py-2 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded shadow">
        Get Started
      </Button>
    </div>
  );
};

export default Header;
